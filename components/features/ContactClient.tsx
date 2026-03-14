"use client";

import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin } from "lucide-react";

export default function ContactClient() {
  return (
    <main className="min-h-screen px-4 py-32 max-w-5xl mx-auto">
      <header className="mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4 block"
        >
          Contato
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter"
        >
          Vamos conversar.
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xl opacity-70 mb-12 font-serif italic">
            Tem uma pauta, denúncia ou sugestão de artigo? Nossa equipe técnica está pronta para ouvir.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-1">E-mail</h4>
                <p className="text-lg">contato@comunicabrasil.com.br</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Telefone / WhatsApp</h4>
                <p className="text-lg">+55 (71) 99999-9999</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Endereço</h4>
                <p className="text-lg opacity-70">Av. Tancredo Neves, Salvador, Bahia</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-border p-8 bg-primary text-white"
        >
          <form className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-white/50">Nome Completo</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors font-sans"
                placeholder="Ex: João Silva"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-white/50">E-mail</label>
              <input 
                type="email" 
                className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors font-sans"
                placeholder="joao@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-white/50">Mensagem</label>
              <textarea 
                rows={4}
                className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors font-sans resize-none"
                placeholder="Como podemos ajudar?"
              />
            </div>

            <button type="submit" className="premium-button w-full flex items-center justify-center gap-3 text-white">
              Enviar Mensagem <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
