'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { Poll, submitPollResponse } from '@/lib/db';
import { Sparkles, CheckCircle2, X, MessageSquare, ChevronUp } from 'lucide-react';

const ActivePoll = () => {
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
              className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-[90vw] md:w-[450px] max-h-[80vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 z-20 p-2.5 rounded-full transition-all bg-black/5 hover:bg-black/10 text-black group"
              >
                <X size={18} />
              </button>

              <div className="absolute inset-0 bg-transparent -z-10" />
              
              <div className="p-8 md:p-10 relative z-10 space-y-8">
                {/* Content Header */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 backdrop-blur-3xl">
                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Consulta Pública</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight text-primary">
                    {poll.title}
                  </h2>

                  {poll.description && (
                    <p className="text-base font-normal leading-relaxed text-secondary">
                      {poll.description}
                    </p>
                  )}

                  {poll.showCounter && (
                    <div className="pt-4 flex items-center gap-4 border-t border-black/5">
                      <div className="flex flex-col">
                        <span className="text-3xl font-serif text-primary">
                          {poll.submissionsCount.toLocaleString()}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] mt-1 text-black/20">Assinaturas</span>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="bg-neutral-50 border border-black/5 rounded-[2rem] p-8 relative overflow-hidden min-h-[300px] flex flex-col justify-center shadow-inner"
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
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-center mb-6 text-black/30">Escolha sua Posição</p>
                        <div className="grid grid-cols-1 gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect('A Favor')}
                            className="w-full py-5 rounded-2xl border border-black/10 bg-white hover:bg-emerald-500 text-black hover:text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-sm hover:shadow-emerald-500/10"
                          >
                            Sou a Favor
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect('Contra')}
                            className="w-full py-5 rounded-2xl border border-black/10 bg-white hover:bg-red-500 text-black hover:text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-sm"
                          >
                            Sou Contra
                          </motion.button>
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
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40">Posição: <span className="text-primary">{selection}</span></p>
                          <button onClick={() => setStep(1)} className="text-[9px] transition-colors uppercase tracking-[0.2em] text-accent font-bold hover:underline">Alterar</button>
                        </div>

                        {poll.fields.map((field, index) => (
                          <div key={index} className="relative">
                            <motion.label 
                              animate={{ 
                                y: activeField === field.label || formData[field.label] ? -20 : 0,
                                scale: activeField === field.label || formData[field.label] ? 0.75 : 1,
                                color: activeField === field.label ? 'var(--color-primary)' : 'var(--color-secondary)'
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
                              className="w-full bg-transparent border-b-2 py-2 font-bold text-base text-black outline-none transition-all placeholder:opacity-20 border-black/10 focus:border-primary"
                            />
                          </div>
                        ))}

                        <div className="pt-2">
                          <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={submitting}
                            className="btn-premium w-full relative py-4 rounded-2xl flex items-center justify-center shadow-lg"
                          >
                            <span className="font-black tracking-[0.4em] uppercase text-[10px]">
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
                          <h3 className="text-xl font-serif text-black">Voto Validado</h3>
                          <p className="font-black tracking-widest text-[9px] uppercase text-black/30">Seu registro foi integrado ao sistema.</p>
                        </div>
                        <button 
                          onClick={() => { setStep(1); setSubmitted(false); setFormData({}); }}
                          className="text-[9px] font-black uppercase tracking-[0.4em] text-accent hover:text-accent/80 transition-colors mt-6 py-2 px-4 rounded-xl bg-accent/5"
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
            ? "bg-white text-black border-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.1)]" 
            : "bg-white text-black border-black/5"
        } font-black uppercase tracking-widest text-[10px] shadow-2xl`}
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
                <MessageSquare size={16} className="text-sky-500" />
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
