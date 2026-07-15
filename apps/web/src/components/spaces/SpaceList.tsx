'use client';

import { useState } from 'react';

export interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  bookmarkCount?: number;
}

interface SpaceListProps {
  spaces: Space[];
  currentSpaceId?: string;
  onSelect?: (spaceId: string) => void;
  onCreate?: (name: string, description?: string) => void;
  onEdit?: (space: Space) => void;
  onDelete?: (spaceId: string) => void;
}

const defaultColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function SpaceList({
  spaces,
  currentSpaceId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: SpaceListProps) {
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
    <div className="space-y-2">
      {spaces.map(space => (
        <div
          key={space.id}
          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
            currentSpaceId === space.id ? 'bg-primary/10' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelect?.(space.id)}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: space.color || '#6366f1' }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{space.name}</p>
            {space.description && (
              <p className="text-xs text-gray-500 truncate">{space.description}</p>
            )}
          </div>
          {space.bookmarkCount !== undefined && (
            <span className="text-xs text-gray-400">{space.bookmarkCount}</span>
          )}
          {(onEdit || onDelete) && (
            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
              {onEdit && (
                <button
                  onClick={() => onEdit(space)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(space.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {onCreate && (
        <div className="mt-3 pt-3 border-t">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="空間名稱"
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
                  className="flex-1 bg-primary text-white text-sm py-1 rounded"
                >
                  建立
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 text-sm py-1 rounded"
                >
                  取消
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full text-left text-sm text-gray-500 hover:text-gray-700 p-2"
            >
              + 建立空間
            </button>
          )}
        </div>
      )}
    </div>
  );
}
