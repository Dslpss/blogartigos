'use client';

import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Props = {
  articleId: string;
  initial?: number;
};

export default function ArticleViews({ articleId, initial = 0 }: Props) {
  const [views, setViews] = useState<number>(initial);

  useEffect(() => {
    if (!articleId) return;
    const ref = doc(db, 'article_stats', articleId);
    let mounted = true;

    // one-off fetch to ensure latest value
    getDoc(ref).then((snap) => {
      if (!mounted) return;
      if (snap.exists()) {
        const v = (snap.data() as any).views || 0;
        setViews(v);
      }
    }).catch(() => {});

    // subscribe to realtime updates
    const unsub = onSnapshot(ref, (snap) => {
      if (!mounted) return;
      if (snap.exists()) {
        const v = (snap.data() as any).views || 0;
        setViews(v);
      }
    }, () => {});

    return () => {
      mounted = false;
      unsub();
    };
  }, [articleId]);

  return (
    <div className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
      <span className="font-black text-accent">{views}</span> 
      <span className="opacity-60">visitas</span>
    </div>
  );
}
