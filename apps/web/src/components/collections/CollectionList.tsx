'use client';

import { useState } from 'react';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bookmarkCount?: number;
}

interface CollectionListProps {
  collections: Collection[];
  currentCollectionId?: string;
  onSelect?: (collectionId: string) => void;
  onCreate?: (name: string, description?: string) => void;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collectionId: string) => void;
}

export default function CollectionList({
  collections,
  currentCollectionId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: CollectionListProps) {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onCreate?.(newName.trim(), newDescription.trim() || undefined);
      setNewName('');
      setNewDescription('');
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-1">
      {collections.map(collection => (
        <div
          key={collection.id}
          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
            currentCollectionId === collection.id ? 'bg-primary/10' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelect?.(collection.id)}
        >
          <span className="text-gray-400">📁</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{collection.name}</p>
          </div>
          {collection.bookmarkCount !== undefined && (
            <span className="text-xs text-gray-400">{collection.bookmarkCount}</span>
          )}
          {(onEdit || onDelete) && (
            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
              {onEdit && (
                <button
                  onClick={() => onEdit(collection)}
                  className="p-1 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(collection.id)}
                  className="p-1 text-gray-400 hover:text-red-600 text-xs"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {onCreate && (
        <div className="mt-2 pt-2 border-t">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-2 p-2 bg-gray-50 rounded">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="集合名稱"
                className="w-full p-2 text-sm border rounded"
                autoFocus
              />
              <input
                type="text"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="描述（可選）"
                className="w-full p-2 text-sm border rounded"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white text-xs py-1 rounded"
                >
                  建立
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 text-xs py-1 rounded"
                >
                  取消
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full text-left text-xs text-gray-500 hover:text-gray-700 p-2"
            >
              + 建立集合
            </button>
          )}
        </div>
      )}
    </div>
  );
}
