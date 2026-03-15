'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Clock, Tag, User } from 'lucide-react';
import { calculateReadingTime } from '@/lib/utils';

interface NewsCardProps {
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  imageUrl?: string;
  image?: string; // Fallback for old/static code
  author?: string;
  content?: string;
  readingTime?: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ id, title, excerpt, category, date, slug, imageUrl, image, author, content, readingTime }) => {
  const finalImage = imageUrl || image;
  const finalReadingTime = readingTime || (content ? calculateReadingTime(content) : 3);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group rounded-2xl border border-border/50 overflow-hidden hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 flex flex-col h-full bg-white"
      style={{ 
        backgroundColor: 'var(--color-card-bg, #ffffff)',
        borderRadius: 'var(--radius-xl, 1.5rem)'
      }}
    >
      {finalImage && (
        <div 
          className="w-full h-48 mb-6 overflow-hidden border border-border group-hover:border-accent/30 transition-all"
          style={{ borderRadius: 'calc(var(--radius-factor, 1rem) * 0.8)' }}
        >
          <img src={finalImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-6 pt-0 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-[10px] font-black uppercase text-highlight tracking-[0.2em] rounded-full border border-border group-hover:border-highlight/30 transition-colors" style={{ backgroundColor: 'var(--color-surface)' }}>
            {category}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-secondary opacity-40">
              <Clock className="w-3 h-3" />
              <span>{finalReadingTime} min</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border/20" />
            <div className="flex items-center gap-1 text-[10px] font-bold text-secondary opacity-40">
              <span>{date}</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-highlight transition-colors line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>

        <p className="text-sm mb-6 line-clamp-3 font-medium leading-relaxed opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          {excerpt}
        </p>

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Link 
              href={`/news/${slug || id}`}
              className="text-xs font-black uppercase tracking-widest text-primary hover:text-highlight flex items-center gap-2 group/btn"
            >
              Ver Análise <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
            </Link>
            {author && (
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-30">
                <User className="w-2.5 h-2.5 text-accent" />
                <span>Por {author}</span>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-highlight/5 flex items-center justify-center text-highlight opacity-0 group-hover:opacity-100 transition-opacity">
            <Tag className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
