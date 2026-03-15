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
    root.style.setProperty('--color-header-bg', t.headerBackground || 'rgba(255, 255, 255, 0.7)');
    root.style.setProperty('--color-footer-bg', t.footerBackground || t.primaryColor);
    
    // Footer Specific Text Colors
    root.style.setProperty('--color-footer-text', t.footerTextColor || 'rgba(255, 255, 255, 0.6)');
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
