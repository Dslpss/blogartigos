'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, Maximize2 } from 'lucide-react';
import Link from 'next/link';

interface SliderProps {
  slides: {
    id: string;
    title: string;
    description: string;
    category: string;
    slug: string;
  }[];
}

const NewsSlider: React.FC<SliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[70vh] rounded-[3rem] overflow-hidden bg-primary shadow-premium group">
      {/* Background with Ambient Glow */}
      <div className="absolute inset-0">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-highlight/10 via-primary to-primary" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 p-12 md:p-24 flex flex-col justify-center"
        >
          <div className="max-w-3xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="px-4 py-1 bg-accent text-[10px] font-black uppercase text-white rounded-full tracking-widest shadow-glow">
                {slides[current].category}
              </span>
              <div className="h-[1px] w-12 bg-white/20" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-7xl font-black leading-[0.95] mb-10 text-white tracking-tighter uppercase"
            >
              {slides[current].title}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 mb-12 max-w-xl italic font-serif"
            >
              {slides[current].description}
            </motion.p>
            
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="flex items-center gap-6"
            >
              <Link 
                href={`/news/${slides[current].slug}`}
                className="btn-premium flex items-center gap-3 !bg-white !text-primary hover:!bg-highlight hover:!text-primary"
              >
                Ler Relatório <Play className="w-4 h-4 fill-current" />
              </Link>
              <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest">
                <Maximize2 className="w-4 h-4" /> Expandir Visual
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 right-12 z-20 flex gap-4">
        <button 
          onClick={prev}
          className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-95 group/nav"
        >
          <ArrowLeft className="w-6 h-6 group-hover/nav:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={next}
          className="w-16 h-16 rounded-full border border-accent bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all active:scale-95 group/nav shadow-glow"
        >
          <ArrowRight className="w-6 h-6 group-hover/nav:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute left-12 bottom-12 z-20 flex gap-1">
        {slides.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1 rounded-full transition-all duration-500 ${current === idx ? 'w-12 bg-highlight shadow-glow' : 'w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;
