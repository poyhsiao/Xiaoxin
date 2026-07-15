'use client';

import { useState } from 'react';

export interface Bookmark {
  id: string;
  url: string;
  title?: string;
  description?: string;
  ogImage?: string;
  tags?: string[];
  createdAt?: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (id: string) => void;
  sortField?: 'title' | 'url' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: 'title' | 'url' | 'createdAt') => void;
}

export default function BookmarkList({
  bookmarks,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}: BookmarkListProps) {
  const SortIcon = ({ field }: { field: 'title' | 'url' | 'createdAt' }) => {
    if (sortField !== field) return <span className="text-gray-400">⇅</span>;
    return <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onClick={() => onSort?.('title')}
            >
              <div className="flex items-center gap-1">
                標題 <SortIcon field="title" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onClick={() => onSort?.('url')}
            >
              <div className="flex items-center gap-1">
                URL <SortIcon field="url" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              標籤
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onClick={() => onSort?.('createdAt')}
            >
              <div className="flex items-center gap-1">
                建立時間 <SortIcon field="createdAt" />
              </div>
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookmarks.map(bookmark => (
            <tr key={bookmark.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                >
                  {bookmark.title || bookmark.url}
                </a>
              </td>
              <td className="px-4 py-3">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline line-clamp-1"
                >
                  {bookmark.url}
                </a>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {bookmark.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {bookmark.createdAt
                  ? new Date(bookmark.createdAt).toLocaleDateString('zh-TW')
                  : '-'}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(bookmark)}
                      className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    >
                      編輯
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(bookmark.id)}
                      className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      刪除
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bookmarks.length === 0 && (
        <div className="text-center py-8 text-gray-500">沒有書籤</div>
      )}
    </div>
  );
}
