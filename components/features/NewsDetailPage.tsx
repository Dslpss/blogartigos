'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Share2, MessageSquare, Twitter, Facebook, Copy } from 'lucide-react';
import Link from 'next/link';

interface ArticleData {
  title: string;
  category: string;
  date: string;
  content: string;
  slug: string;
}

const NewsDetailPage = ({ article }: { article: ArticleData }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-surface/30">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link 
            href="/news"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent mb-12 hover:-translate-x-1 transition-transform group"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o Arquivo
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-accent text-[10px] font-black uppercase text-white rounded-full">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-secondary opacity-60 uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              <span>Postado em {article.date}</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter leading-[0.95] mb-8">
            {article.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center font-black text-primary italic">
                CB
              </div>
              <div>
                <p className="text-xs font-black uppercase text-primary">Conselho Editorial</p>
                <p className="text-[10px] text-secondary font-medium">Análise Verificada</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-surface rounded-full transition-colors text-secondary hover:text-primary border border-transparent hover:border-border"><Twitter className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-surface rounded-full transition-colors text-secondary hover:text-primary border border-transparent hover:border-border"><Facebook className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-surface rounded-full transition-colors text-secondary hover:text-primary border border-transparent hover:border-border"><Copy className="w-4 h-4" /></button>
            </div>
          </div>
        </motion.div>

        {/* Content Body */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="prose prose-xl max-w-none 
             prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
             prose-p:leading-[1.8] prose-p:text-lg md:prose-p:text-xl
             prose-strong:font-black
             prose-a:text-accent prose-a:no-underline hover:prose-a:underline
             prose-img:rounded-3xl prose-img:shadow-2xl
             selection:bg-accent/10 selection:text-accent
             mb-20"
           style={{ 
             color: 'var(--color-text-primary)',
             '--tw-prose-body': 'var(--color-text-primary)',
             '--tw-prose-headings': 'var(--color-text-primary)',
             '--tw-prose-bold': 'var(--color-text-primary)',
             '--tw-prose-links': 'var(--color-accent)'
           } as any}
        >
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </motion.div>

        {/* Footer Stats & Interaction */}
        <div className="mt-20 p-10 bg-surface rounded-[2rem] border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="text-center">
              <div className="text-2xl font-black text-primary">12.4k</div>
              <div className="text-[10px] font-black uppercase text-accent tracking-widest mt-1">Leituras</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-2xl font-black text-primary">15 min</div>
              <div className="text-[10px] font-black uppercase text-accent tracking-widest mt-1">Tempo de Estudo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">Elite</div>
              <div className="text-[10px] font-black uppercase text-accent tracking-widest mt-1">Nível de Rigor</div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border">
            <div className="flex items-center gap-4">
              <Share2 className="w-5 h-5 text-accent" />
              <span className="text-sm font-black uppercase text-primary">Compartilhar Protocolo</span>
            </div>
            <button className="btn-premium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Abrir Debate Técnico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
