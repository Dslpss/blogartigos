"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTheme, BlogTheme } from '@/lib/db';

const ThemeContext = createContext<{
  theme: BlogTheme | null;
  refreshTheme: () => Promise<void>;
}>({
  theme: null,
  refreshTheme: async () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<BlogTheme | null>(null);

  const refreshTheme = async () => {
    try {
      const data = await getTheme();
      setTheme(data);
      applyTheme(data);
    } catch (error) {
      console.error("Failed to fetch theme:", error);
    }
  };

  const applyTheme = (t: BlogTheme) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Core Colors
    root.style.setProperty('--color-primary', t.primaryColor);
    root.style.setProperty('--color-accent', t.accentColor);
    root.style.setProperty('--color-background', t.backgroundColor);
    root.style.setProperty('--color-surface', t.surfaceColor);
    
    // Component Backgrounds (Fallback to core if not explicit)
    root.style.setProperty('--color-header-bg', t.headerBackground || '#ffffff');
    root.style.setProperty('--color-footer-bg', t.footerBackground || '#15803d');
    root.style.setProperty('--color-card-bg', t.cardBackground || '#ffffff');
    root.style.setProperty('--color-text-primary', t.fontColor || '#15803d');
    root.style.setProperty('--color-text-secondary', t.secondaryFontColor || '#475569');
    
    // Typography
    const fonts = {
      sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
      serif: "'Playfair Display', ui-serif, Georgia, serif"
    };
    root.style.setProperty('--font-heading', fonts[t.headingFont || 'sans']);
    root.style.setProperty('--font-body', fonts[t.bodyFont || 'sans']);

    // Geometry (Border Radius)
    const radiusMap = {
      none: '0rem',
      small: '0.5rem',
      medium: '1rem',
      large: '2rem'
    };
    root.style.setProperty('--radius-factor', radiusMap[t.borderRadiusPreset || 'medium']);

    // Effects (Glassmorphism)
    root.style.setProperty('--glass-blur', `${(t.glassIntensity ?? 20) / 2}px`);
    
    // Footer Specific Text Colors
    root.style.setProperty('--color-footer-text', t.footerTextColor || '#ffffff');
    root.style.setProperty('--color-footer-highlight', t.footerHighlightColor || '#00ccff');
  };

  useEffect(() => {
    refreshTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useBlogTheme = () => useContext(ThemeContext);
