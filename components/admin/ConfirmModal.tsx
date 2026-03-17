'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false
}: ConfirmModalProps) => {
  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    info: 'bg-accent hover:bg-accent/90 shadow-accent/20'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl p-8 space-y-6"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            >
              <X size={16} className="text-primary" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-accent/10 text-accent'}`}>
                <AlertCircle size={28} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-primary">
                  {title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed px-4">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-4 rounded-2xl bg-secondary/10 hover:bg-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest transition-all"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${variantStyles[variant]} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
