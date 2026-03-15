'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, ArrowRight, Loader2 } from 'lucide-react';
import { BlogPost, searchArticles } from '@/lib/db';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) { /* Trigger from parent or handle globally */ }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsLoading(true);
      try {
        const found = await searchArticles(searchTerm);
        setResults(found);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden border border-border"
          >
            <div className="p-6 border-b border-border flex items-center gap-4">
              <Search className="w-6 h-6 text-primary/40" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Pesquisar por título, categoria ou conteúdo..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-primary placeholder:text-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-surface rounded-lg border border-border text-[10px] font-black opacity-40">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-surface rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-primary/40" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-primary/40">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <span className="text-sm font-black uppercase tracking-widest">Sincronizando protocolos...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Resultados Encontrados</h4>
                  {results.map((article) => (
                    <Link 
                      key={article.id} 
                      href={`/news/${article.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-4 hover:bg-surface rounded-2xl transition-all group border border-transparent hover:border-border/50"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">{article.category}</span>
                        <h3 className="text-lg font-black text-primary leading-tight">{article.title}</h3>
                      </div>
                      <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              ) : searchTerm.trim().length >= 2 ? (
                <div className="py-12 text-center text-primary/40">
                  <p className="text-sm font-bold">Nenhum artigo encontrado para "{searchTerm}"</p>
                </div>
              ) : (
                <div className="py-12 text-center text-primary/20">
                  <p className="text-sm font-bold">Digite pelo menos 2 caracteres para buscar</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-surface border-t border-border flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary/30">
              <div className="flex gap-4">
                <span>Esc para fechar</span>
                <span>Enter para selecionar</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Powered by</span>
                <span className="text-accent">CB_Search</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
