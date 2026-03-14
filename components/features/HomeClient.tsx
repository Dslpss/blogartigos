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
  image?: string;
  featured?: boolean;
}

interface HomeClientProps {
  articles: Article[];
}

const HomeClient: React.FC<HomeClientProps> = ({ articles }) => {
  const featuredArticles = articles.slice(0, 6);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Modern Hero Section */}
        <section className="mb-32 relative">
          <div className="absolute top-0 right-0 -z-10 opacity-10 animate-float">
            <Sparkles className="w-64 h-64 text-accent" />
          </div>
          
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="w-12 h-[2px] bg-accent" />
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs">A Nova Era da Informação</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-10 leading-[0.9] tracking-tighter text-primary">
              Descodificando a <span className="text-accent underline decoration-black underline-offset-8">Realidade</span> com Precisão.
            </h1>
            
            <p className="text-xl text-secondary mb-12 max-w-xl leading-relaxed">
              Explramos o cruzamento entre tecnologia de ponta, economia digital e o futuro da sociedade brasileira através de análises rigorosas.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <button className="btn-premium flex items-center gap-2 shadow-glow">
                Começar Leitura <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-3 rounded-full border border-border font-medium hover:bg-surface transition-all active:scale-95">
                Ver Protocolos
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Featured Content */}
        <section className="mb-32">
          <div className="flex items-end justify-between mb-12 border-b border-border pb-8">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-primary">Fluxo de Análise</h2>
              <p className="text-secondary mt-2 italic font-serif opacity-60">Insights selecionados por inteligência e curadoria humana.</p>
            </div>
            <Link href="/articles" className="text-accent font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-1 transition-transform">
              Ver Arquivo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bento-grid">
            {/* Main Bento Item (Large) */}
            {featuredArticles[0] && (
              <div className="col-span-1 md:col-span-2 lg:row-span-2 bento-item group p-8 flex flex-col justify-end bg-primary overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-accent text-[10px] font-black uppercase text-white rounded-full mb-6 inline-block">Destaque Principal</span>
                  <h3 className="text-4xl font-black text-white mb-6 leading-tight group-hover:text-accent transition-colors">
                    {featuredArticles[0].title}
                  </h3>
                  <p className="text-white/60 mb-8 line-clamp-3">
                    {featuredArticles[0].excerpt}
                  </p>
                  <Link 
                    href={`/news/${featuredArticles[0].slug}`}
                    className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs border-b border-white/20 pb-1 hover:border-accent hover:text-accent transition-all"
                  >
                    Explorar Tese <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Medium Bento Items */}
            {featuredArticles.slice(1, 3).map((article, idx) => (
              <div key={article.id} className="col-span-1 md:col-span-1 lg:col-span-2 bento-item group p-6 flex flex-col justify-between bg-surface">
                <div>
                   <span className="text-[10px] font-black uppercase text-accent/60 tracking-widest block mb-4 italic">{article.category}</span>
                   <h3 className="text-2xl font-black text-primary leading-tight group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                </div>
                <Link 
                  href={`/news/${article.slug}`}
                  className="self-end p-2 rounded-full border border-border group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}

            {/* Small Statistics/Visual Bento Items */}
            <div className="col-span-1 bento-item bg-accent/5 p-6 flex flex-col items-center justify-center text-center border-accent/10">
              <Zap className="w-10 h-10 text-accent mb-4 animate-pulse" />
              <div className="text-3xl font-black text-primary">2.4k+</div>
              <div className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">Pontos de Dados</div>
            </div>

            <div className="col-span-1 bento-item group p-8 flex flex-col justify-center bg-white border-dashed border-2 border-border hover:border-accent/30 hover:bg-accent/5">
              <h4 className="text-sm font-black uppercase text-primary mb-4 opacity-40">Seja um Editor</h4>
              <p className="text-xs text-secondary mb-4 italic">Contribua com suas análises técnicas para nossa rede.</p>
              <ArrowUpRight className="w-6 h-6 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>

            {/* Final Row items */}
            {featuredArticles.slice(3, 5).map((article) => (
              <div key={article.id} className="col-span-1 bento-item group p-6 bg-surface flex flex-col gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                   {article.category === 'TECNOLOGIA' ? <Globe className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <h3 className="text-base font-bold text-primary leading-tight group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <Link href={`/news/${article.slug}`} className="text-[9px] font-black uppercase tracking-widest text-accent mt-auto hover:underline">
                  Ver Mais
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Surprise Element: Interactive Data/Logo Wall or something */}
        <section className="mt-40 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-20 bg-primary rounded-[3rem] text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 tracking-tighter">Pronto para o Próximo Ciclo?</h2>
            <p className="text-white/60 mb-12 max-w-xl mx-auto italic font-serif">Acompanhe diariamente as atualizações do protocolo Comunica Brasil.</p>
            <div className="flex justify-center gap-4 relative z-10">
              <button className="px-10 py-4 bg-accent text-white font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform shadow-glow">
                Submeter Feedback
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default HomeClient;
