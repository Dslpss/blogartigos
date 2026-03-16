import { Metadata } from "next";
import { getArticleBySlug, getArticles, BlogPost } from "@/lib/db";
import { calculateReadingTime } from "@/lib/utils";
import { Clock, User, ArrowLeft, Share2, Heart, MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from 'react';
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  const title = article ? article.title : slug.replace(/-/g, ' ');
  
  return {
    title: `${title} | Comunica Brasil`,
    description: article?.excerpt || `Leia mais sobre ${title} no Comunica Brasil.`,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles();
  const recommended = allArticles
    .filter(a => a.slug !== slug)
    .slice(0, 3);

  const readingTime = calculateReadingTime(article.content);

  return (
    <article className="min-h-screen pt-48 pb-24 px-6 max-w-[1200px] mx-auto">
      <header className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-accent font-black uppercase tracking-[0.5em] text-[10px] bg-accent/5 py-2 px-6 border border-accent/10 backdrop-blur-md">
            {article.category}
          </span>
          <div className="h-[1px] w-12 bg-accent/30" />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black leading-[0.85] uppercase tracking-tighter mb-12 italic" style={{ color: 'var(--color-text-primary)' }}>
          {article.title}
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-primary/5 py-8 gap-6" style={{ color: 'var(--color-text-primary)' }}>
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-mono text-sm font-black text-accent">
              {article.author?.substring(0, 2).toUpperCase() || 'CB'}
            </div>
            <div className="flex flex-col">
              <span className="font-black uppercase tracking-widest text-xs">Por {article.author || 'Equipe Comunica Brasil'}</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="opacity-40 font-mono text-[10px] uppercase tracking-widest">Protocolo: {article.date}</span>
                <div className="w-1 h-1 rounded-full bg-accent/20" />
                <div className="flex items-center gap-1.5 opacity-40 font-mono text-[10px] uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  <span>{readingTime} min de leitura</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <time className="font-mono text-xs opacity-40 uppercase tracking-[0.3em] hidden md:block">{article.date}</time>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors text-[10px] font-black uppercase tracking-widest rounded-full">
              <Share2 className="w-3.5 h-3.5" />
              Compartilhar
            </button>
          </div>
        </div>
      </header>

      {article.imageUrl && (
        <div className="aspect-[21/9] bg-primary/5 overflow-hidden mb-20 relative group">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute inset-8 border border-white/10" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 prose prose-2xl prose-invert-none max-w-none font-serif leading-relaxed space-y-12" style={{ 
          color: 'var(--color-text-primary)',
          '--tw-prose-body': 'var(--color-text-primary)',
          '--tw-prose-headings': 'var(--color-text-primary)'
        } as any}>
          {article.excerpt && (
            <p className="text-3xl md:text-4xl font-sans font-black leading-tight italic border-l-8 border-accent pl-10 mb-16">
              {article.excerpt}
            </p>
          )}
          <div className="whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>
        </div>
        
        <aside className="lg:col-span-4 space-y-12">
          {/* Interaction Section */}
          <div className="glass-panel p-8 bg-surface border-border/40 rounded-3xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-6 text-center">Interação</h4>
            <div className="flex items-center justify-around">
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-accent group-hover:text-accent transition-all shadow-sm">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Curtir</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-accent group-hover:text-accent transition-all shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Comentar</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-accent group-hover:text-accent transition-all shadow-sm">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Dividir</span>
              </button>
            </div>
          </div>

          {/* Technical Context */}
          <div className="glass-panel p-10 bg-white shadow-sm border-primary/5 rounded-3xl">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-6">CONTEXTO_TÉCNICO</h4>
            <div className="space-y-4 opacity-60 font-mono text-[10px] leading-relaxed uppercase">
              <p>Status: {article.status || 'Transmissão_Ativa'}</p>
              <p>Fonte: {article.source || 'CB_Analytics_Hub'}</p>
              <p>Região: {article.region || 'LATAM_BRASIL'}</p>
              <p>Categoria: {article.category}</p>
            </div>
          </div>

          {/* Recommended Articles */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary/40 px-4">Relacionados</h4>
            <div className="space-y-4">
              {recommended.map((rec) => (
                <Link 
                  key={rec.id} 
                  href={`/news/${rec.slug}`}
                  className="block group p-4 hover:bg-surface rounded-2xl border border-transparent hover:border-border/50 transition-all bg-white shadow-sm"
                >
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent/60 block mb-2">{rec.category}</span>
                  <h5 className="text-sm font-black text-primary group-hover:text-highlight transition-colors mb-2 line-clamp-2">{rec.title}</h5>
                  <div className="flex items-center justify-between text-[9px] font-bold text-secondary/40">
                    <span>{rec.date}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
