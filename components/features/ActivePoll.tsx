'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { Poll, submitPollResponse } from '@/lib/db';
import { Sparkles, CheckCircle2, X, MessageSquare, ChevronUp } from 'lucide-react';

const ActivePoll = () => {
  // helper to convert hex color to rgba with alpha fallback
  const hexToRgba = (hex: string, alpha = 0.06) => {
    if (!hex) return `rgba(21,128,61,${alpha})`;
    const sanitized = hex.replace('#', '');
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // Normalize alpha: support 0-1 or 0-100 percentage values
    let a = typeof alpha === 'number' ? alpha : 0.06;
    if (a > 1) a = a / 100; // treat >1 as percentage
    a = Math.max(0, Math.min(1, a));
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Vote, 2: Details, 3: Success
  const [selection, setSelection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "polls"),
      where("isActive", "==", true),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setPoll({ id: doc.id, ...doc.data() } as Poll);
      } else {
        setPoll(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to active poll:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOpenPoll = () => {
      setIsExpanded(true);
    };

    window.addEventListener('open-poll', handleOpenPoll);
    return () => window.removeEventListener('open-poll', handleOpenPoll);
  }, []);

  const handleSelect = (option: string) => {
    setSelection(option);
    setStep(2);
  };

  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poll?.id) return;

    setSubmitting(true);
    try {
      await submitPollResponse(poll.id, formData, selection || undefined);
      setSubmitted(true);
      setStep(3);
    } catch (err) {
      alert('Erro ao enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !poll) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto"
          >
            <section 
              id="active-poll-section" 
              className="relative overflow-hidden rounded-[2rem] border border-border shadow-[0_12px_30px_rgba(2,6,23,0.06)] w-[85vw] max-w-[340px] max-h-[85vh] overflow-y-auto backdrop-blur-xl"
              style={{ backgroundColor: poll?.outerCardColor ? hexToRgba(poll.outerCardColor, poll.outerCardAlpha ?? 0.8) : undefined }}
            >
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 z-20 p-2.5 rounded-full transition-all bg-black/5 hover:bg-black/10 text-black group"
              >
                <X size={18} />
              </button>

              <div className="absolute inset-0 bg-transparent -z-10" />
              
              <div className="p-6 md:p-8 relative z-10 space-y-6">
                {/* Content Header */}
                <div className="space-y-4">
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-3xl"
                    style={{ backgroundColor: poll?.highlightColor ? hexToRgba(poll.highlightColor, 0.1) : 'rgba(21, 128, 61, 0.1)', borderColor: poll?.highlightColor ? hexToRgba(poll.highlightColor, 0.1) : 'rgba(21, 128, 61, 0.1)' }}
                  >
                    <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: poll?.highlightColor || 'var(--color-primary)' }} />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: poll?.fontColor || 'var(--color-primary)' }}>Consulta Pública</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif leading-tight tracking-tight" style={{ color: poll?.fontColor || 'var(--color-primary)' }}>
                    {poll.title}
                  </h2>

                  {poll.description && (
                    <p className="text-sm font-normal leading-relaxed" style={{ color: poll?.fontColor || 'inherit', opacity: 0.8 }}>
                      {poll.description}
                    </p>
                  )}

                  {poll.showCounter && (
                    <div className="pt-3 flex flex-col gap-3 border-t border-black/5">
                      <div className="flex justify-center">
                        <div 
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border shadow-sm backdrop-blur-md"
                          style={{ 
                            backgroundColor: poll?.highlightColor ? hexToRgba(poll.highlightColor, 0.05) : 'rgba(0,0,0,0.03)',
                            borderColor: poll?.highlightColor ? hexToRgba(poll.highlightColor, 0.15) : 'rgba(0,0,0,0.05)'
                          }}
                        >
                          <span 
                            className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: poll?.fontColor || 'var(--color-primary)', opacity: Math.max((poll?.secondaryFontAlpha ?? 80) / 100, 0.4) }}
                          >
                            Votos Computados:
                          </span>
                          <span className="text-sm font-black tracking-tight" style={{ color: poll?.highlightColor || 'var(--color-primary)' }}>
                            {poll.submissionsCount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {poll.goal && poll.goal > 0 ? (
                        <div className="w-full px-2 mt-1">
                           <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-60 mb-1.5" style={{ color: poll?.fontColor || 'var(--color-primary)'}}>
                             <span>Progresso</span>
                             <span>{poll.submissionsCount.toLocaleString()} / {poll.goal.toLocaleString()}</span>
                           </div>
                           <div className="h-1.5 w-full rounded-full overflow-hidden shadow-inner border border-black/5" style={{ backgroundColor: poll?.fontColor ? hexToRgba(poll.fontColor, 0.1) : 'rgba(0,0,0,0.05)' }}>
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(100, Math.round((poll.submissionsCount / poll.goal) * 100))}%` }}
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className="h-full rounded-full relative overflow-hidden"
                               style={{ backgroundColor: poll?.highlightColor || 'var(--color-primary)' }}
                             >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                             </motion.div>
                           </div>
                           <style dangerouslySetInnerHTML={{__html: `
                             @keyframes shimmer {
                               100% { transform: translateX(100%); }
                             }
                           `}} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div 
                  className="bg-surface/60 border border-white/10 rounded-[2.5rem] p-6 relative overflow-hidden min-h-[220px] flex flex-col justify-center shadow-lg backdrop-blur-xl"
                  style={{ backgroundColor: poll?.cardColor ? hexToRgba(poll.cardColor, poll.cardAlpha ?? 0.06) : 'rgba(21, 128, 61, 0.04)' }}
                >
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4 relative z-10"
                      >
                        <p 
                          className="text-[9px] font-black uppercase tracking-[0.4em] text-center mb-6"
                          style={{ color: poll?.fontColor || 'var(--color-primary)', opacity: (poll?.secondaryFontAlpha ?? 40) / 100 }}
                        >
                          Escolha sua Posição
                        </p>
                        <div className="flex flex-col gap-3">
                          {(poll.options || ['A Favor', 'Contra']).map((option, index) => (
                            <motion.button
                              key={option}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSelect(option)}
                              className={`w-[85%] mx-auto py-4 px-4 rounded-full border-2 border-black bg-surface/40 transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center text-center backdrop-blur-md shadow-md hover:shadow-xl hover:-translate-y-0.5
                                ${index === 0 
                                  ? 'hover:bg-emerald-500 hover:text-white hover:border-emerald-600' 
                                  : index === 1 
                                    ? 'hover:bg-red-500 hover:text-white hover:border-red-600'
                                    : 'hover:bg-black/90 hover:text-white hover:border-black dark:hover:bg-white/90 dark:hover:text-black dark:hover:border-white'
                                } `}
                              style={{ color: poll?.fontColor || 'var(--color-primary)' }}
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.form
                        key="step2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className="space-y-5 relative z-10"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p 
                            className="text-[9px] font-black uppercase tracking-[0.3em]"
                            style={{ color: poll?.fontColor || 'var(--color-primary)', opacity: (poll?.secondaryFontAlpha ?? 40) / 100 }}
                          >
                            Posição: <span style={{ opacity: 1, color: poll?.highlightColor || 'var(--color-primary)' }} className="font-bold">{selection}</span>
                          </p>
                          <button onClick={() => setStep(1)} className="text-[9px] transition-colors uppercase tracking-[0.2em] font-bold hover:underline" style={{ color: poll?.highlightColor || 'var(--color-accent)' }}>Alterar</button>
                        </div>

                        {poll.fields.map((field, index) => (
                          <div key={index} className="relative">
                            <motion.label 
                              animate={{ 
                                y: activeField === field.label || formData[field.label] ? -20 : 0,
                                scale: activeField === field.label || formData[field.label] ? 0.75 : 1,
                                color: activeField === field.label ? (poll?.highlightColor || '#000000') : '#000000'
                              }}
                              className="absolute left-0 top-2 font-black uppercase tracking-[0.3em] text-[9px] pointer-events-none origin-left transition-all"
                            >
                              {field.label}
                            </motion.label>
                            <input
                              type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
                              required={field.required}
                              onFocus={() => setActiveField(field.label)}
                              onBlur={() => setActiveField(null)}
                              value={formData[field.label] || ''}
                              onChange={(e) => handleInputChange(field.label, e.target.value)}
                              className="w-full bg-transparent border-b-2 py-1.5 font-bold text-sm outline-none transition-all placeholder:opacity-20"
                              style={{ color: poll?.fontColor || '#000000', borderColor: activeField === field.label ? (poll?.highlightColor || 'var(--color-primary)') : (poll?.fontColor ? `${poll.fontColor}22` : 'rgba(0,0,0,0.1)') }}
                            />
                          </div>
                        ))}

                        <div className="pt-3">
                          <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={submitting}
                            className="w-[90%] mx-auto relative py-4 px-6 rounded-full flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6)] transition-all overflow-hidden group border border-white/20"
                            style={{ backgroundColor: poll?.highlightColor || '#000000', color: '#ffffff' }}
                          >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out" />
                            <span className="font-bold tracking-[0.25em] uppercase text-[11px] relative z-10 drop-shadow-md">
                              {submitting ? 'VALIDANDO...' : 'Protocolar Voto'}
                            </span>
                          </motion.button>
                        </div>
                      </motion.form>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6 space-y-4 relative z-10"
                      >
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-serif" style={{ color: poll?.fontColor || '#000000' }}>Voto Validado</h3>
                          <p 
                            className="font-black tracking-widest text-[9px] uppercase"
                            style={{ color: poll?.fontColor || 'var(--color-primary)', opacity: (poll?.secondaryFontAlpha ?? 40) / 100 }}
                          >
                            Seu registro foi integrado ao sistema.
                          </p>
                        </div>
                        <button 
                          onClick={() => { setStep(1); setSubmitted(false); setFormData({}); }}
                          className="text-[9px] font-black uppercase tracking-[0.4em] transition-colors mt-6 py-2 px-4 rounded-xl"
                          style={{ color: poll?.highlightColor || 'var(--color-accent)', backgroundColor: poll?.highlightColor ? hexToRgba(poll.highlightColor, 0.05) : 'rgba(0,0,0,0.05)' }}
                        >
                          ← Nova entrada
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        animate={!isExpanded ? {
          boxShadow: [
            `0 0 0 ${(poll.fontColor || '#0ea5e9')}00`,
            `0 0 15px ${(poll.fontColor || '#0ea5e9')}33`,
            `0 0 0 ${(poll.fontColor || '#0ea5e9')}00`
          ]
        } : { boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={!isExpanded ? {
          boxShadow: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {}}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-full transition-all border ${
          !isExpanded 
            ? "bg-white text-black shadow-lg" 
            : "bg-white text-black border-black/5"
        } font-black uppercase tracking-widest text-[10px] shadow-2xl`}
        style={!isExpanded ? { borderColor: poll?.highlightColor || '#0ea5e9', color: '#000000' } : { color: '#000000' }}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="min"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 border-r border-black/5 pr-3">
                <MessageSquare size={16} style={{ color: poll?.highlightColor || '#0ea5e9' }} />
                <span className="whitespace-nowrap">{poll.title}</span>
              </div>
              
              <div className="overflow-hidden whitespace-nowrap w-32 relative">
                <motion.div
                  animate={{ x: [0, -200] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 12, 
                    ease: "linear" 
                  }}
                  className="inline-block"
                >
                  <span className="mr-8 text-black/40">PARTICIPE DA NOSSA ENQUETE</span>
                  <span className="mr-8 text-black/40">PARTICIPE DA NOSSA ENQUETE</span>
                </motion.div>
              </div>

              <ChevronUp size={14} className="opacity-20" />
            </motion.div>
          ) : (
            <motion.div
              key="exp"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <X size={16} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ActivePoll;
