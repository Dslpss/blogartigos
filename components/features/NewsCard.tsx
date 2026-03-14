'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Clock, Tag } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  imageUrl?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, excerpt, category, date, slug, imageUrl }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white border border-border rounded-2xl p-6 transition-all duration-500 hover:shadow-premium hover:border-accent/20 group h-full flex flex-col"
    >
      {imageUrl && (
        <div className="w-full h-48 mb-6 rounded-xl overflow-hidden border border-border group-hover:border-accent/30 transition-all">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-surface text-[9px] font-black uppercase text-accent tracking-[0.2em] rounded-full border border-border group-hover:border-accent/30 transition-colors">
          {category}
        </span>
        <div className="flex items-center gap-1 text-[9px] font-bold text-secondary opacity-40">
          <Clock className="w-3 h-3" />
          <span>{date}</span>
        </div>
      </div>

      <h3 className="text-xl font-black text-primary mb-4 leading-tight group-hover:text-accent transition-colors line-clamp-2">
        {title}
      </h3>

      <p className="text-sm text-secondary/70 mb-6 line-clamp-3 font-medium leading-relaxed">
        {excerpt}
      </p>

      <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
        <Link 
          href={`/news/${slug}`}
          className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent flex items-center gap-2 group/btn"
        >
          Ver Análise <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </Link>
        <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          <Tag className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
