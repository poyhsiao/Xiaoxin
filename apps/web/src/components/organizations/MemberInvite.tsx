'use client';

import { useState } from 'react';
import api from '@/lib/api';

interface MemberInviteProps {
  organizationId: string;
  onInviteSent?: () => void;
}

export default function MemberInvite({ organizationId, onInviteSent }: MemberInviteProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('EDITOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post(`/organizations/${organizationId}/invite`, { email, role });
      setSuccess(`已邀請 ${email}`);
      setEmail('');
      onInviteSent?.();
    } catch (err: any) {
      setError(err.response?.data?.message || '邀請失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(`/organizations/${organizationId}/invite-link`);
      setInviteLink(res.data.link);
      setSuccess('邀請連結已生成');
    } catch (err: any) {
      setError(err.response?.data?.message || '生成連結失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setSuccess('連結已複製到剪貼簿');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleInvite} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">電子郵件</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">角色</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as typeof role)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="ADMIN">管理者</option>
            <option value="EDITOR">編輯者</option>
            <option value="VIEWER">檢視者</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? '發送中...' : '發送邀請'}
        </button>
      </form>

      <div className="border-t pt-4">
        <button
          type="button"
          onClick={handleGenerateLink}
          disabled={loading}
          className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          生成邀請連結
        </button>

        {inviteLink && (
          <div className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 p-2 border rounded text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                複製
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
