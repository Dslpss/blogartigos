'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Início', href: '/' },
    { name: 'Artigos', href: '/articles' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contact' },
  ];

  return (
    <nav className={`glass-header transition-all duration-500 ${scrolled ? 'shadow-premium' : ''}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:bg-accent">
            <span className="text-white font-black text-xl italic underline decoration-accent underline-offset-4">C</span>
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-primary">
            Comunica<span className="text-accent underline decoration-primary underline-offset-4">Brasil</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-sm font-semibold uppercase tracking-widest text-primary/60 hover:text-accent transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <button className="btn-premium flex items-center gap-2">
            Inscrever-se <ArrowUpRight className="w-4 h-4" />
          </button>
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
                  className="text-lg font-bold text-primary hover:text-accent transition-colors"
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
    </nav>
  );
};

export default Navbar;
