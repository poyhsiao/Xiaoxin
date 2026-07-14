'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Bookmark {
  id: string;
  url: string;
  title?: string;
  description?: string;
  status: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookmarks/search?q=').then(res => {
      setBookmarks(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>載入中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">書籤</h1>
      <div className="mb-4">
        <input
          type="search"
          placeholder="搜尋書籤..."
          className="w-full max-w-md p-2 border rounded"
        />
      </div>
      {bookmarks.length === 0 ? (
        <p className="text-gray-500">還沒有書籤</p>
      ) : (
        <div className="space-y-3">
          {bookmarks.map(bm => (
            <a
              key={bm.id}
              href={bm.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-medium">{bm.title || bm.url}</h3>
              {bm.description && <p className="text-sm text-gray-500 mt-1">{bm.description}</p>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
