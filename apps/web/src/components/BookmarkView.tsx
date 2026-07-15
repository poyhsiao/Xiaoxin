'use client';

import { useState } from 'react';

export type ViewMode = 'card' | 'list';

interface BookmarkViewProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  itemCount?: number;
}

export default function BookmarkView({
  viewMode,
  onViewModeChange,
  itemCount,
}: BookmarkViewProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewModeChange('card')}
          className={`p-2 rounded ${
            viewMode === 'card'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="卡片視圖"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded ${
            viewMode === 'list'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="清單視圖"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {itemCount !== undefined && (
          <span className="text-sm text-gray-500 ml-2">
            {itemCount} 個書籤
          </span>
        )}
      </div>
    </div>
  );
}
