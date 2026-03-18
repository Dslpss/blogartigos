'use client';

import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TotalViews() {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const ref = doc(db, 'stats', 'global');
    let mounted = true;

    getDoc(ref).then((snap) => {
      if (!mounted) return;
      if (snap.exists()) {
        const v = (snap.data() as any).totalViews || 0;
        setTotal(v);
      }
    }).catch(() => {});

    const unsub = onSnapshot(ref, (snap) => {
      if (!mounted) return;
      if (snap.exists()) {
        const v = (snap.data() as any).totalViews || 0;
        setTotal(v);
      }
    }, () => {});

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const format = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  };

  return (
    <div>
      <div className="text-3xl font-black" style={{ color: 'var(--color-text-primary)' }}>{format(total)}</div>
    </div>
  );
}
