"use client";

import React, { useState, useEffect } from 'react';
import { BlogTheme, getTheme, updateTheme } from '@/lib/db';
import { Save, RotateCcw, Palette } from 'lucide-react';
import { useBlogTheme } from '@/components/providers/ThemeProvider';

const DEFAULT_THEME: BlogTheme = {
  primaryColor: '#15803d',
  accentColor: '#004a99',
  fontColor: '#15803d',
  secondaryFontColor: '#475569',
  backgroundColor: '#ffffff',
  headerBackground: 'rgba(255, 255, 255, 0.7)',
  footerBackground: '#15803d',
  surfaceColor: '#f8fafc',
  footerTextColor: 'rgba(255, 255, 255, 0.6)',
  footerHighlightColor: '#004a99',
  cardBackground: '#ffffff'
};

const ThemeCustomizer = () => {
  const { refreshTheme } = useBlogTheme();
  const [theme, setTheme] = useState<BlogTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const data = await getTheme();
        setTheme(data);
      } catch (error) {
        console.error("Error fetching theme:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTheme(theme);
      await refreshTheme();
      alert('Tema atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar tema.');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    if (window.confirm('Deseja restaurar e SALVAR o tema padrão? Esta ação é imediata.')) {
      setSaving(true);
      try {
        await updateTheme(DEFAULT_THEME);
        setTheme(DEFAULT_THEME);
        await refreshTheme();
        alert('Tema restaurado para o padrão com sucesso!');
      } catch (error) {
        alert('Erro ao restaurar tema.');
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) return <div className="p-10 text-center uppercase text-[10px] font-black tracking-widest opacity-40">Carregando Cores...</div>;

  const colorFields: { key: keyof BlogTheme; label: string; desc: string }[] = [
    { key: 'primaryColor', label: 'Cor Principal', desc: 'Usada para títulos, botões e identidade principal (Verde Institucional).' },
    { key: 'accentColor', label: 'Cor de Destaque', desc: 'Usada para links, estados de hover e elementos secundários (Azul).' },
    { key: 'backgroundColor', label: 'Cor de Fundo', desc: 'Cor base das páginas.' },
    { key: 'surfaceColor', label: 'Cor de Superfície', desc: 'Cor de fundo de cartões e painéis.' },
    { key: 'footerBackground', label: 'Fundo do Rodapé', desc: 'Cor sólida do rodapé.' },
    { key: 'footerHighlightColor', label: 'Destaque do Rodapé', desc: 'Cor para títulos e ícones de destaque no rodapé.' },
    { key: 'footerTextColor', label: 'Texto do Rodapé', desc: 'Cor para links e descrições no rodapé.' },
    { key: 'cardBackground', label: 'Fundo do Card', desc: 'Cor de fundo dos cartões de notícia.' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-primary flex items-center gap-3">
             <Palette size={24} className="text-accent" /> Customização de Identidade
          </h3>
          <p className="text-[10px] text-secondary font-medium uppercase tracking-widest mt-1">Configure o DNA visual do seu blog</p>
        </div>
        <div className="flex gap-4">
          <button onClick={resetToDefault} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-red-500 transition-colors">
            <RotateCcw size={14} /> Resetar Padrão
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn-premium px-8 py-3 flex items-center gap-2"
          >
            <Save size={16} /> {saving ? 'Salvando...' : 'Aplicar Tema'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-primary">
        <div className="space-y-8">
          {colorFields.map(field => (
            <div key={field.key} className="flex items-center gap-6 p-4 bg-surface rounded-2xl border border-border/50 hover:border-accent/20 transition-all">
              <div className="relative group">
                <input 
                  type="color" 
                  value={theme[field.key] || DEFAULT_THEME[field.key]} 
                  onChange={e => setTheme({ ...theme, [field.key]: e.target.value })}
                  className="w-16 h-16 rounded-xl cursor-pointer bg-transparent border-none appearance-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-none shadow-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest block mb-1 text-primary">{field.label}</label>
                <div className="text-[9px] font-medium text-secondary/60 leading-relaxed max-w-[250px]">{field.desc}</div>
              </div>
              <div className="font-mono text-[10px] opacity-40 uppercase">{theme[field.key] || DEFAULT_THEME[field.key]}</div>
            </div>
          ))}
        </div>

        {/* Live Preview Area */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Pré-visualização em Tempo Real</h4>
          <div className="rounded-3xl border border-border overflow-hidden shadow-2xl bg-white aspect-video relative">
            {/* Mock Dashboard UI */}
            <div className="p-4 flex flex-col h-full overflow-hidden" style={{ backgroundColor: theme.backgroundColor }}>
              <div className="h-10 rounded-xl mb-4 border border-border/10 flex items-center px-4 gap-2" style={{ backgroundColor: theme.surfaceColor }}>
                <div className="w-3 h-3 rounded-full bg-red-400/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                <div className="w-3 h-3 rounded-full bg-green-400/20" />
                <div className="ml-auto w-20 h-2 rounded-full opacity-10" style={{ backgroundColor: theme.primaryColor }} />
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/3 aspect-[4/5] rounded-2xl p-4 flex flex-col justify-end gap-2" style={{ backgroundColor: theme.surfaceColor }}>
                  <div className="h-2 w-full rounded-full opacity-30" style={{ backgroundColor: theme.primaryColor }} />
                  <div className="h-2 w-2/3 rounded-full opacity-10" style={{ backgroundColor: theme.primaryColor }} />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-2/3 rounded-xl opacity-20" style={{ backgroundColor: theme.primaryColor }} />
                  <div className="h-4 w-full rounded-lg opacity-10" style={{ backgroundColor: theme.primaryColor }} />
                  <div className="h-4 w-full rounded-lg opacity-10" style={{ backgroundColor: theme.primaryColor }} />
                  <div className="h-10 w-32 rounded-full mt-4" style={{ backgroundColor: theme.accentColor }} />
                </div>
              </div>
              
              <div className="mt-auto h-12 w-full -mx-4 -mb-4 flex items-center justify-center pt-2" style={{ backgroundColor: theme.footerBackground }}>
                <div className="w-24 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
             <h5 className="text-[10px] font-black uppercase text-accent mb-2">Dica de Design</h5>
             <p className="text-[11px] text-secondary font-medium leading-relaxed italic">
               "Cores escuras no fundo com fontes claras criam um visual moderno e sofisticado. Certifique-se de manter um bom contraste entre a cor da fonte e o fundo para garantir a legibilidade."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
