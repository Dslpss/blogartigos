'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github, 
  ArrowUpRight, 
  ShieldCheck, 
  Globe, 
  Zap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  blogName?: string;
}

const Footer: React.FC<FooterProps> = ({ blogName = 'Comunica Brasil' }) => {
  const currentYear = new Date().getFullYear();
  const initials = blogName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <footer 
      className="relative mt-20 md:mt-40 overflow-hidden text-white border-t border-white/5"
      style={{ backgroundColor: 'var(--color-footer-bg, var(--color-primary))' }}
    >
      {/* Premium Visual Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-highlight/10 blur-[120px] rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full translate-y-1/2" />

        {/* Animated Scanline Effect */}
        <motion.div 
          animate={{ 
            top: ["-100%", "200%"],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-highlight/30 to-transparent"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-8 mb-12 md:mb-20">
          
          {/* Column 1: Identity */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white text-primary rounded-lg flex items-center justify-center font-black text-xl italic transition-transform group-hover:scale-110 shadow-glow">
                {initials}
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">{blogName}</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs italic font-serif" style={{ color: 'var(--color-footer-text, rgba(255, 255, 255, 0.6))' }}>
              "Decodificando a complexidade técnica e econômica através de protocolos de informação rigorosos."
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 p-2 px-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md relative group/status overflow-hidden">
                <div className="absolute inset-0 bg-highlight/10 translate-x-[-100%] group-hover/status:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse relative z-10" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Sistemas Ativos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Navegação */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8" style={{ color: 'var(--color-footer-highlight, #00ccff)' }}>Navegação</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: 'Dashboard Home', href: '/' },
                { name: 'Arquivo de Artigos', href: '/news' },
                { name: 'Manifesto Institucional', href: '/about' },
                { name: 'Laboratório (Beta)', href: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="hover:text-white flex items-center gap-2 group transition-colors text-sm font-medium"
                    style={{ color: 'var(--color-footer-text, rgba(255, 255, 255, 0.6))' }}
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" style={{ color: 'var(--color-footer-highlight)' }} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Protocolos */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8" style={{ color: 'var(--color-footer-highlight, #00ccff)' }}>Protocolos de Análise</h4>
            <ul className="flex flex-col gap-4">
              {[
                'Economia Digital',
                'IA & Automação',
                'Geopolítica Tech',
                'Sociedade 5.0',
                'Sustentabilidade'
              ].map((item) => (
                <li key={item}>
                  <Link 
                    href="/news" 
                    className="hover:text-white flex items-center gap-2 group transition-colors text-sm font-medium"
                    style={{ color: 'var(--color-footer-text, rgba(255, 255, 255, 0.6))' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Conexão */}
          <div className="col-span-2 lg:col-span-1 flex flex-col mt-8 lg:mt-0 items-center lg:items-start text-center lg:text-left">
            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-6 md:mb-8" style={{ color: 'var(--color-footer-highlight, #00ccff)' }}>Conexão</h4>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href} 
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:shadow-glow transition-all duration-300 group/social overflow-hidden relative"
                  style={{ '--hover-bg': 'var(--color-footer-highlight)' } as any}
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/social:opacity-100 transition-opacity" />
                  <social.icon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors relative z-10" />
                </motion.a>
              ))}
            </div>
            <div className="p-4 md:p-5 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-footer-highlight)' }} />
                <span className="text-[10px] font-black uppercase tracking-widest">Segurança de Dados</span>
              </div>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--color-footer-text, rgba(255, 255, 255, 0.4))' }}>
                Protocolo SSL de 256 bits ativo. Toda a comunicação é criptografada.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6 text-[10px] font-black uppercase tracking-widest text-center md:text-left" style={{ color: 'var(--color-footer-text, rgba(255, 255, 255, 0.3))' }}>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
            <span>© {currentYear} {blogName}</span>
            <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
            <span>Todos os Direitos Reservados</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <Link href="#" className="hover:text-white transition-colors">Termos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
            <div className="flex items-center gap-2 text-highlight/50 w-full md:w-auto justify-center mt-2 md:mt-0">
              <Zap className="w-3 h-3 fill-current" />
              <span>Plataforma Premium</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
