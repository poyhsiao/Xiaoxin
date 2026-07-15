'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface Bookmark {
  id: string;
  url: string;
  title?: string;
  description?: string;
  ogImage?: string;
  tags?: string[];
  createdAt?: string;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (id: string) => void;
}

export default function BookmarkCard({ bookmark, onEdit, onDelete }: BookmarkCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
      {bookmark.ogImage && !imgError ? (
        <div className="relative h-32 w-full bg-gray-100">
          <Image
            src={bookmark.ogImage}
            alt=""
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="h-32 w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <span className="text-4xl text-gray-300">🔖</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
          {bookmark.title || bookmark.url}
        </h3>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline line-clamp-1 mb-2 block"
        >
          {bookmark.url}
        </a>

        {bookmark.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {bookmark.description}
          </p>
        )}

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bookmark.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t">
          {onEdit && (
            <button
              onClick={() => onEdit(bookmark)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              編輯
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(bookmark.id)}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              刪除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
