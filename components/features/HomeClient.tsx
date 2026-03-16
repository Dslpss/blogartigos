'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield, Globe, ArrowUpRight } from 'lucide-react';
import NewsCard from './NewsCard';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  imageUrl?: string;
  featured?: boolean;
}

interface HomeClientProps {
  articles: Article[];
  blogName?: string;
}

const HomeClient: React.FC<HomeClientProps> = ({ articles, blogName = "Comunica Brasil" }) => {
  const featuredArticles = articles.slice(0, 6);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Modern Hero Section */}
        <section className="mb-32 relative overflow-hidden">
          {/* 3D Grid Background */}
          <div className="absolute inset-0 -z-20 [perspective:1000px]">
            <div className="absolute inset-0 [transform:rotateX(75deg)_translateY(-100px)]">
              <div className="absolute inset-0 bg-grid-pattern opacity-5 [background-size:30px_30px]" />
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute top-0 right-0 -z-10 opacity-10 animate-float-slow">
            <Sparkles className="w-64 h-64 text-accent" />
          </div>
          <div className="absolute bottom-0 left-0 -z-10 opacity-10 animate-float-reverse">
            <Sparkles className="w-48 h-48 text-highlight" />
          </div>
          
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full bg-highlight/10 border border-highlight/20 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-highlight animate-ping" />
              <span className="text-highlight font-black uppercase tracking-[0.4em] text-[10px]">Propósito & Protocolo</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-10 leading-[0.9] tracking-tighter" style={{ color: 'var(--color-text-primary)' }}>
              {blogName.includes(' ') ? blogName.split(' ')[0] : blogName} <br />
              <span className="text-accent underline decoration-black underline-offset-8" style={{ textDecorationColor: 'var(--color-primary)' }}>
                {blogName.includes(' ') ? blogName.split(' ').slice(1).join(' ') : ''}
              </span>
            </h1>
            
            <p className="text-xl mb-12 max-w-xl leading-relaxed opacity-70" style={{ color: 'var(--color-text-primary)' }}>
              Exploramos o cruzamento entre tecnologia de ponta, economia digital e o futuro da sociedade brasileira através de análises rigorosas.
            </p>
            
            <div className="flex flex-wrap gap-8 items-center">
              <Link href="/news">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-premium group flex items-center gap-3 shadow-glow !bg-highlight !text-white px-10 py-4 text-sm"
                >
                  Começar Leitura 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <Link href="/about">
                <motion.button 
                  whileHover={{ backgroundColor: "rgba(0, 74, 153, 0.05)", y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full border-2 border-primary/20 font-black text-primary transition-all uppercase tracking-widest text-[10px] flex items-center gap-2"
                >
                  Ver Protocolos <ArrowUpRight className="w-4 h-4 opacity-40" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        {/* Bento Grid Featured Content */}
        <section className="mb-32">
          <div className="flex items-end justify-between mb-12 border-b border-border pb-8">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Fluxo de Análise</h2>
              <p className="mt-2 italic font-serif opacity-60" style={{ color: 'var(--color-text-secondary)' }}>Insights selecionados por inteligência e curadoria humana.</p>
            </div>
            <Link href="/articles" className="text-accent font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-1 transition-transform">
              Ver Arquivo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bento-grid">
            {/* Main Bento Item (Large) */}
            {featuredArticles[0] && (
              <motion.div 
                whileHover={{ y: -5 }}
                className="col-span-1 md:col-span-2 lg:row-span-2 bento-item group p-8 flex flex-col justify-end bg-primary overflow-hidden border-white/5 active:scale-[0.98] transition-transform"
              >
                {featuredArticles[0].imageUrl && (
                  <div className="absolute inset-0 z-0">
                    <img src={featuredArticles[0].imageUrl} alt="" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
                  </div>
                )}
                {!featuredArticles[0].imageUrl && (
                  <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                  </div>
                )}
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-accent text-[10px] font-black uppercase text-white rounded-full mb-6 inline-block">Destaque Principal</span>
                  <h3 className="text-4xl font-black text-white mb-6 leading-tight group-hover:text-accent transition-colors">
                    {featuredArticles[0].title}
                  </h3>
                  <p className="text-white/60 mb-8 line-clamp-3">
                    {featuredArticles[0].excerpt}
                  </p>
                  <Link 
                    href={`/news/${featuredArticles[0].slug || featuredArticles[0].id}`}
                    className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs border-b border-white/20 pb-1 hover:border-highlight hover:text-highlight transition-all"
                  >
                    Explorar Tese <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Medium Bento Items */}
            {featuredArticles.slice(1, 3).map((article) => (
              <motion.div 
                key={article.id} 
                whileHover={{ y: -5 }}
                className="col-span-1 md:col-span-1 lg:col-span-2 bento-item group p-6 flex flex-col justify-between overflow-hidden border-primary/5 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                {article.imageUrl && (
                  <div className="absolute inset-0 z-0">
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white/80 to-transparent" />
                  </div>
                )}
                <div className="relative z-10">
                   <span className="text-[10px] font-black uppercase text-accent/60 tracking-widest block mb-4 italic">{article.category}</span>
                   <h3 className="text-2xl font-black leading-tight group-hover:text-accent transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                    {article.title}
                  </h3>
                </div>
                <Link 
                  href={`/news/${article.slug || article.id}`}
                  className="relative z-10 self-end p-2 rounded-full border border-border group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}

            {/* Small Statistics/Visual Bento Items */}
            <div className="col-span-1 bento-item bg-highlight-subtle p-6 flex flex-col items-center justify-center text-center border-highlight/10">
              <Zap className="w-10 h-10 mb-4 animate-pulse" style={{ color: 'var(--color-primary)' }} />
              <div className="text-3xl font-black" style={{ color: 'var(--color-text-primary)' }}>2.4k+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60" style={{ color: 'var(--color-text-primary)' }}>Pontos de Dados</div>
            </div>

            <div className="col-span-1 bento-item group p-8 flex flex-col justify-center bg-white border-dashed border-2 border-border hover:border-highlight/30 hover:bg-highlight-subtle">
              <h4 className="text-sm font-black uppercase mb-4" style={{ color: 'var(--color-text-primary)' }}>Seja um Editor</h4>
              <p className="text-xs text-secondary mb-4 italic font-medium">Contribua com suas análises técnicas para nossa rede.</p>
              <ArrowUpRight className="w-6 h-6 text-highlight group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>

            {/* Final Row items */}
            {featuredArticles.slice(3, 5).map((article) => (
              <motion.div 
                key={article.id} 
                whileHover={{ y: -5 }}
                className="col-span-1 bento-item group p-6 bg-surface flex flex-col gap-4 overflow-hidden border-primary/5 active:scale-[0.98] transition-transform"
              >
                {article.imageUrl && (
                  <div className="absolute inset-0 z-0">
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="relative z-10 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                   {article.category === 'TECNOLOGIA' ? <Globe className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <h3 className="relative z-10 text-base font-bold leading-tight group-hover:text-accent transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                  {article.title}
                </h3>
                <Link href={`/news/${article.slug || article.id}`} className="relative z-10 text-[9px] font-black uppercase tracking-widest text-highlight mt-auto hover:underline">
                  Ver Mais
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomeClient;
