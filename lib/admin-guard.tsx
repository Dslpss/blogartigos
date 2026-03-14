'use client';

import React, { useEffect } from 'react';
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin, isEditor } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (!isAdmin && !isEditor))) {
      router.push('/admin/login');
    }
  }, [user, loading, isAdmin, isEditor, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (!user || (!isAdmin && !isEditor)) {
    return null;
  }

  return <>{children}</>;
};
