'use client';

import React from 'react';

const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-border/40 overflow-hidden flex flex-col h-full bg-white" style={{ borderRadius: 'var(--radius-xl, 1.5rem)' }}>
      <div className="w-full h-48 mb-6 overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={{ borderRadius: 'calc(var(--radius-factor, 1rem) * 0.8)' }} />
      <div className="p-6 pt-0 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="w-24 h-4 rounded-full bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-4 rounded-full bg-gray-200" />
            <div className="w-1 h-1" />
            <div className="w-12 h-4 rounded-full bg-gray-200" />
          </div>
        </div>

        <h3 className="h-6 w-3/4 rounded-full bg-gray-200 mb-4" />

        <p className="h-4 w-full rounded-full bg-gray-200 mb-2" />
        <p className="h-4 w-5/6 rounded-full bg-gray-200 mb-2" />
        <p className="h-4 w-2/3 rounded-full bg-gray-200 mb-6" />

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="w-20 h-4 rounded-full bg-gray-200" />
            <div className="w-28 h-3 rounded-full bg-gray-200 mt-2" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;
