'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning';
}

export const CustomAlert = ({ isOpen, onClose, title, message, type = 'info' }: AlertProps) => {
  const icons = {
    info: <Info className="text-accent" size={24} />,
    success: <CheckCircle2 className="text-green-500" size={24} />,
    warning: <AlertCircle className="text-amber-500" size={24} />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-primary/20 backdrop-blur-sm cursor-pointer"
          />

          {/* Alert Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md"
          >
            <div className="glass-header !relative !top-0 !mx-0 overflow-hidden shadow-2xl border-white/40">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shadow-sm border border-white/20">
                      {icons[type]}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-primary italic underline decoration-accent underline-offset-4 decoration-2">
                        {title}
                      </h4>
                      <p className="text-[10px] font-mono text-secondary uppercase tracking-tight mt-0.5">
                        Broadcast System Meta_Data
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-primary/5 rounded-full transition-colors text-secondary"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-semibold leading-relaxed text-primary/80 bg-white/30 p-4 rounded-xl border border-white/20 italic">
                    "{message}"
                  </p>
                  
                  <button 
                    onClick={onClose}
                    className="btn-premium w-full py-3 text-[10px] font-black tracking-[0.2em] uppercase !rounded-xl"
                  >
                    Entendido
                  </button>
                </div>
              </div>

              {/* Decorative Pulse */}
              <div className="absolute top-0 right-0 p-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
