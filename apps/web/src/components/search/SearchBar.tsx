'use client';

import { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = '搜尋...',
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [localQuery, setLocalQuery] = useState(query);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(localQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localQuery, debounceMs]);

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <input
        type="search"
        value={localQuery}
        onChange={e => setLocalQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
      {localQuery && (
        <button
          onClick={() => setLocalQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
