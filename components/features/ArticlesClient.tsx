'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Search, Filter } from 'lucide-react';
import NewsCard from './NewsCard';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  imageUrl?: string;
}

interface ArticlesClientProps {
  articles: Article[];
}

const ArticlesClient: React.FC<ArticlesClientProps> = ({ articles }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-[2px] bg-accent" />
              <span className="text-accent font-black uppercase tracking-widest text-[10px]">Arquivo de Insights</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-primary tracking-tighter uppercase leading-none">
              Protocolos de <br /> <span className="text-accent italic underline decoration-primary underline-offset-8">Conhecimento.</span>
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mt-10 p-2 bg-surface rounded-2xl border border-border">
              <div className="flex-1 flex items-center gap-4 px-4 py-2 bg-white rounded-xl shadow-sm border border-border focus-within:border-accent/40 transition-all">
                <Search className="w-5 h-5 opacity-30" />
                <input 
                  type="text" 
                  placeholder="Pesquisar por artigos..." 
                  className="bg-transparent border-none outline-none w-full text-sm font-medium"
                />
              </div>
              <div className="flex items-center gap-4 px-4 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                {['Todos', 'Tecnologia', 'Economia', 'Sociedade', 'Ciência'].map(cat => (
                  <button key={cat} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-white transition-colors text-secondary hover:text-accent">
                    {cat}
                  </button>
                ))}
                <button className="p-3 bg-white rounded-xl border border-border hover:text-accent text-secondary transition-all">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <NewsCard {...article} />
            </motion.div>
          ))}
        </div>

        {/* Surprise/Interactive Footer */}
        <div className="mt-32 p-12 bg-surface rounded-[2.5rem] border border-border text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <h2 className="text-3xl font-black text-primary mb-6 relative z-10">Não encontrou o que procurava?</h2>
          <p className="text-secondary max-w-lg mx-auto mb-10 italic font-medium opacity-70">
            Nossa biblioteca é atualizada em tempo real via fluxos de dados globais. Tente usar palavras-chave mais específicas.
          </p>
          <button className="btn-premium">Solicitar Análise</button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesClient;
