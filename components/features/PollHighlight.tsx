'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { Poll } from '@/lib/db';
import { Vote, ChevronRight } from 'lucide-react';

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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 mb-8"
    >
      <button
        onClick={scrollToPoll}
        className="group relative flex flex-col sm:flex-row items-center gap-4 py-3 px-6 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-2xl transition-all duration-700 hover:bg-white/[0.05] hover:border-highlight/20 hover:shadow-[0_20px_50px_-12px_rgba(29,233,182,0.15)]"
      >
        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <motion.div 
            animate={{ 
              left: ['-100%', '200%']
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 4,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          />
        </div>

        {/* Status & Action Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Dot */}
          <div className="flex items-center gap-2 pr-3 border-r border-black/5">
            <div className="relative flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-highlight" />
              <div className="absolute inset-0 rounded-full bg-highlight animate-ping opacity-75" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-highlight whitespace-nowrap hidden lg:block">
              AO VIVO
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col text-left">
            <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-tight group-hover:text-highlight transition-colors duration-500">
              Enquete: {poll.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              {poll.description && (
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1 italic tracking-wide">
                  {poll.description}
                </p>
              )}
              {/* Counter Info */}
              {(poll.showCounter && poll.submissionsCount > 0) && (
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-300 whitespace-nowrap">
                  • <span className="text-slate-500">{poll.submissionsCount.toLocaleString()}</span> assinaturas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="ml-auto flex items-center gap-3 pl-3 border-l border-black/5 self-stretch">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1de9b6] group-hover:scale-105 transition-transform duration-500">
            Assinar agora
          </span>
          <div className="w-7 h-7 rounded-full bg-highlight/5 flex items-center justify-center group-hover:bg-highlight/10 transition-all duration-500">
            <ChevronRight className="w-3.5 h-3.5 text-highlight group-hover:translate-x-0.5 transition-transform duration-500" />
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default PollHighlight;
