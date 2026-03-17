'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {  Instagram, 
  Twitter, 
  Linkedin, 
  Github, 
  Menu, 
  X, 
  ArrowUpRight,
  Zap,
  Shield,
  Search
} from 'lucide-react';
import { CustomAlert } from '@/components/ui/Alert';
import SearchModal from './SearchModal';
import { useAuth } from '@/lib/auth-context';

interface NavbarProps {
  blogName?: string;
  logoUrl?: string;
  newsletterUrl?: string;
}

const Navbar = ({ blogName, logoUrl, newsletterUrl }: NavbarProps) => {
  const { isAdmin, isEditor, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const displayBlogName = blogName || "ComunicaBrasil";
  const nameParts = displayBlogName.match(/[A-Z][a-z]+/g) || [displayBlogName];
  const firstPart = nameParts[0] || displayBlogName;
  const secondPart = displayBlogName.replace(firstPart, "");
  const initials = displayBlogName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubscribe = () => {
    if (newsletterUrl) {
      window.open(newsletterUrl, '_blank');
    } else {
      setIsAlertOpen(true);
    }
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Artigos', href: '/news' },
    { name: 'Sobre Nós', href: '/about' },
  ];

  return (
    <nav className={`glass-header transition-all duration-500 ${scrolled ? 'shadow-premium' : ''}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group relative">
          {/* Logo Link */}
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <div className="h-10 transition-transform duration-500 group-hover:scale-105">
                <img 
                  src={logoUrl} 
                  alt={blogName || "Logo"} 
                  className="h-full w-auto object-contain max-w-[200px]" 
                />
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center font-black text-xl italic transition-transform group-hover:scale-110 shadow-glow relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {initials}
              </div>
                <span className="text-xl font-black uppercase tracking-tighter" style={{ color: 'var(--color-text-primary)' }}>
                  {firstPart}<span className="text-accent underline decoration-primary underline-offset-4" style={{ textDecorationColor: 'var(--color-primary)' }}>{secondPart}</span>
                </span>
              </>
            )}
          </Link>

          {/* Admin Access Point - Only for staff. Code is physically absent for guest DOM. */}
          {mounted && !loading && (isAdmin || isEditor) ? (
            <Link 
              href="/admin/dashboard" 
              className="absolute -top-2 -right-6 opacity-0 group-hover:opacity-10 hover:opacity-100 transition-opacity p-2"
              title="Acesso Administrativo"
            >
               <Shield className="w-3 h-3 text-primary" />
            </Link>
          ) : null}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-sm font-semibold uppercase tracking-widest transition-colors relative group"
              style={{ color: 'var(--color-text-primary)', opacity: scrolled ? 1 : 0.6 }}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-highlight transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-surface rounded-xl transition-colors group relative"
            title="Pesquisar (Cmd+K)"
          >
            <Search className="w-5 h-5 group-hover:text-accent transition-colors" style={{ color: scrolled ? 'var(--color-text-primary)' : 'var(--color-text-primary)' }} />
            <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAlertOpen(true)}
            className="hidden md:flex bg-primary text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:shadow-glow transition-all items-center gap-2 border border-white/10"
          >
            <Zap className="w-3 h-3 fill-current" />
            Inscrever-se
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[110%] left-0 right-0 bg-white shadow-premium rounded-2xl p-6 md:hidden border border-border"
          >
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold hover:text-accent transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-[1px] bg-border my-2" />
              <div className="flex gap-4">
                <Twitter className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity pointer" />
                <Github className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity pointer" />
                <Linkedin className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity pointer" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CustomAlert 
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="Newsletter"
        message={`O recurso de Newsletter está em desenvolvimento direto no laboratório do ${displayBlogName}. Em breve você receberá nossos artigos exclusivos em sua caixa de entrada.`}
        type="info"
      />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
