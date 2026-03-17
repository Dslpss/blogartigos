'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { Poll } from '@/lib/db';
import { Vote, ChevronRight, FileText } from 'lucide-react';

const PollHighlight = () => {
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "polls"),
      where("isActive", "==", true),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setPoll({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Poll);
      } else {
        setPoll(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const scrollToPoll = () => {
    // 1. Dispatch event to expand the floating widget
    window.dispatchEvent(new CustomEvent('open-poll'));

    // 2. Wait for expansion and then scroll
    setTimeout(() => {
      const element = document.getElementById('active-poll-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  if (!poll) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 mb-8 max-w-4xl mx-auto sm:mx-0"
    >
      <button
        onClick={scrollToPoll}
        className="group relative w-full flex flex-col sm:flex-row items-center gap-5 py-5 px-7 bg-surface/80 backdrop-blur-2xl border border-border rounded-[2rem] transition-all duration-700 hover:bg-white hover:border-primary/30 hover:shadow-premium text-center sm:text-left outline-none overflow-hidden"
      >
        {/* Animated Shimmer Line */}
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              left: ['-150%', '250%']
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-primary/10 to-transparent -skew-x-12"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 w-full sm:w-auto z-10">
          {/* Refined Integrated Badge */}
          <motion.div 
            animate={{ 
              scale: [1, 1.03, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden"
          >
            <FileText className="w-7 h-7 text-white" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-40" />
            
            {/* Subtle light effect */}
            <motion.div 
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-white"
            />
          </motion.div>

          <div className="flex flex-col items-center sm:items-start min-w-0">
            {/* Live Indicator */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 w-full">
              <div className="relative flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Enquete Oficial
              </span>
              <span className="text-[9px] font-bold text-slate-400 ml-1 tracking-tighter">• PARTICIPE</span>
            </div>

            {/* Main Title */}
            <h4 className="text-xl font-black text-slate-800 tracking-tighter leading-tight group-hover:text-primary transition-colors duration-500 truncate w-full">
              {poll.title}
            </h4>
            
            {/* Description & Counter */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 w-full">
              {poll.description && (
                <p className="text-xs text-slate-500 font-medium line-clamp-1 italic">
                  {poll.description}
                </p>
              )}
              {/* Counter Badge */}
              {(poll.showCounter && poll.submissionsCount > 0) && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-[9px] font-black text-primary uppercase whitespace-nowrap">
                    {poll.submissionsCount.toLocaleString()} participações
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Group */}
        <div className="hidden sm:flex ml-auto items-center gap-4 pl-6 border-l border-border self-stretch z-10">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Votar agora</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Clique e Participe</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:shadow-glow transition-all duration-500 border border-primary/10 group-hover:scale-105">
            <ChevronRight className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-500" />
          </div>
        </div>

        {/* Mobile View Indicator */}
        <div className="flex sm:hidden items-center justify-center w-full mt-4 z-10">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Clique para Votar</span>
            <ChevronRight className="w-3 h-3 text-primary" />
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default PollHighlight;
