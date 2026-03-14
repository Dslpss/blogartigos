'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Zap, ArrowRight, Sparkles } from 'lucide-react';

const AboutClient = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-32 relative">
          <div className="absolute top-0 right-0 -z-10 opacity-10 animate-float">
            <Target className="w-64 h-64 text-accent" />
          </div>
          
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="w-12 h-[2px] bg-accent" />
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs">Nosso Manifesto</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-10 leading-[0.9] tracking-tighter text-primary">
              Elevando o <span className="text-accent italic underline decoration-black underline-offset-8">Padrão</span> da Informação.
            </h1>
            
            <p className="text-xl text-secondary mb-12 max-w-2xl leading-relaxed">
              O Comunica Brasil nasceu da necessidade de um jornalismo que não apenas informa, mas decodifica a complexidade técnica e econômica que define o nosso tempo.
            </p>
          </div>
        </section>

        {/* Bento Grid Features/Stats */}
        <section className="mb-32">
          <div className="bento-grid">
            {/* Mission Item */}
            <div className="col-span-1 md:col-span-2 bento-item p-10 bg-primary text-white flex flex-col justify-end min-h-[400px]">
              <div className="absolute top-8 right-8">
                <Sparkles className="w-12 h-12 text-accent/40" />
              </div>
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">Nossa Missão</h2>
              <p className="text-white/60 text-lg leading-relaxed italic font-serif">
                "Fornecer transparência técnica e clareza analítica em um mundo saturado de ruído informativo."
              </p>
            </div>

            {/* Core Values Bento Column */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bento-item p-6 bg-surface flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black uppercase text-primary">Rigor Técinco</h3>
                <p className="text-sm text-secondary/70">Análises baseadas em dados puros e protocolos verificáveis.</p>
              </div>

              <div className="bento-item p-6 bg-surface flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black uppercase text-primary">Agilidade</h3>
                <p className="text-sm text-secondary/70">Resposta rápida aos fluxos de informação globais.</p>
              </div>

              <div className="bento-item p-6 bg-surface flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black uppercase text-primary">Comunidade</h3>
                <p className="text-sm text-secondary/70">Engajamento com os principais líderes de pensamento do país.</p>
              </div>

              <div className="bento-item p-6 bg-accent text-white flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-black">100%</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Independente</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto mb-40">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-8">Por que o Comunica Brasil?</h2>
            <p className="text-secondary/80 leading-relaxed mb-6">
              Em um cenário digital fragmentado, a precisão torna-se a moeda mais valiosa. Nós não competimos pela atenção efêmera; competimos pela construção de um repertório sólido para nossos leitores.
            </p>
            <p className="text-secondary/80 leading-relaxed mb-6">
              Nossa equipe é composta por analistas, engenheiros e jornalistas que compartilham uma única visão: a informação deve ser tratada como um protocolo — estruturada, segura e imensamente útil.
            </p>
            <div className="flex items-center gap-4 mt-12 p-8 bg-surface rounded-2xl border border-border">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-black text-2xl italic">CB</div>
              <div>
                <p className="font-black text-primary uppercase">Equipe Comunica Brasil</p>
                <p className="text-sm text-secondary font-medium italic">Protocolo de Excelência desde 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-10 md:p-20 bg-primary rounded-[2rem] md:rounded-[3rem] text-white relative overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10 tracking-tighter uppercase">Quer fazer parte da rede?</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto italic font-serif">Estamos sempre em busca de novos talentos técnicos e analíticos.</p>
            <button className="btn-premium flex items-center gap-3 mx-auto">
              Ver Vagas Abertas <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AboutClient;
