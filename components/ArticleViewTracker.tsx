'use client';

import React, { useEffect } from 'react';
import { incrementArticleViews } from '@/lib/db';

const VIEW_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const VIEW_DELAY_MS = 3000; // 3 seconds delay to reduce bot noise

export default function ArticleViewTracker({ articleId }: { articleId?: string }) {
  useEffect(() => {
    if (!articleId) return;

    const key = `article_viewed_${articleId}`;

    try {
      const last = localStorage.getItem(key);
      if (last && Date.now() - Number(last) < VIEW_TTL_MS) return;
    } catch (e) {
      // localStorage might be unavailable (e.g., private mode). Fall back to cookies.
      const cookieMatch = document.cookie.match(new RegExp(`(^|; )${key}=1`));
      if (cookieMatch) return;
    }

    // Basic bot heuristics
    const ua = navigator.userAgent || '';
    const botRegex = /\b(bot|crawl|spider|slurp|facebookexternalhit|pingdom|monitoring|loader)\b/i;
    if (botRegex.test(ua)) return;

    // Only count when page is visible (likely human)
    if (document.visibilityState !== 'visible') return;

    const timer = window.setTimeout(async () => {
      try {
        await incrementArticleViews(articleId);
        try {
          localStorage.setItem(key, String(Date.now()));
          const expires = new Date(Date.now() + VIEW_TTL_MS).toUTCString();
          document.cookie = `${key}=1; expires=${expires}; path=/; SameSite=Lax`;
        } catch (e) {
          // ignore storage/cookie failures
        }
      } catch (e) {
        // ignore increment errors
      }
    }, VIEW_DELAY_MS);

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') {
        window.clearTimeout(timer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [articleId]);

  return null;
}
