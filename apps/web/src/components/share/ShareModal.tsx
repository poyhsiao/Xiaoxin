'use client';

import { useState } from 'react';
import api from '@/lib/api';

interface ShareModalProps {
  type: 'organization' | 'space' | 'collection' | 'bookmark';
  resourceId: string;
  resourceName: string;
  onClose: () => void;
}

export default function ShareModal({ type, resourceId, resourceName, onClose }: ShareModalProps) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [permission, setPermission] = useState<'VIEWER' | 'EDITOR'>('VIEWER');

  const getEndpoint = () => {
    switch (type) {
      case 'organization': return `/organizations/${resourceId}/share`;
      case 'space': return `/spaces/${resourceId}/share`;
      case 'collection': return `/collections/${resourceId}/share`;
      case 'bookmark': return `/bookmarks/${resourceId}/share`;
    }
  };

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      const res = await api.post(getEndpoint(), { permission });
      setShareLink(res.data.link);
    } catch (error) {
      console.error('Failed to create share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">分享 {resourceName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">分享權限</label>
            <select
              value={permission}
              onChange={e => setPermission(e.target.value as typeof permission)}
              className="w-full p-2 border rounded"
            >
              <option value="VIEWER">唯讀</option>
              <option value="EDITOR">可編輯</option>
            </select>
          </div>

          {!shareLink ? (
            <button
              onClick={handleCreateLink}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? '生成中...' : '生成分享連結'}
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">分享連結</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 p-2 border rounded text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {copied ? '已複製!' : '複製'}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                權限: {permission === 'VIEWER' ? '唯讀' : '可編輯'}
              </div>

              <button
                onClick={handleCreateLink}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                重新生成連結
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
