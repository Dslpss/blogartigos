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
    const element = document.getElementById('active-poll-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

        {/* Status Dot */}
        <div className="flex items-center gap-3 pr-4 border-r border-white/5">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-highlight" />
            <div className="absolute inset-0 rounded-full bg-highlight animate-ping opacity-75" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-highlight/80 whitespace-nowrap">
            cliquei aqui e participe da nossa enquete
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col text-left">
          <h4 className="text-base font-bold text-white tracking-tight leading-none group-hover:text-highlight transition-colors duration-500">
            {poll.title}
          </h4>
          {poll.description && (
            <p className="text-xs text-white/40 mt-1.5 font-medium line-clamp-1 italic tracking-wide">
              {poll.description}
            </p>
          )}
        </div>

        {/* Counter Info */}
        {(poll.showCounter && poll.submissionsCount > 0) && (
          <div className="sm:ml-4 pl-4 border-l border-white/5 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full border border-[#020617] bg-white/10 backdrop-blur-sm shadow-sm flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-white/50 whitespace-nowrap">
              <span className="text-white">+{poll.submissionsCount.toLocaleString()}</span> assinaturas
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2 pl-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1de9b6] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
            Assinar agora
          </span>
          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-highlight group-hover:translate-x-1 transition-all duration-500" />
        </div>
      </button>
    </motion.div>
  );
};

export default PollHighlight;
