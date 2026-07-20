import React, { useState } from 'react';
import { User } from '@/types/index';

interface ProfileSettingsProps {
  user: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

export function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; avatar?: string; success?: string }>({});

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: '頭像大小不能超過 2MB' }));
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrors(prev => ({ ...prev, avatar: '只支援 JPG/PNG 格式' }));
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, avatar: undefined }));
  };

  const validate = () => {
    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = '名稱不能為空';
    } else if (name.length < 2 || name.length > 50) {
      newErrors.name = '名稱需為 2-50 字元';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await onUpdate({ name: name.trim(), bio: bio.trim() });
      setErrors({ success: '個人資料已更新' });
    } catch (error) {
      setErrors({ name: '更新失敗，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.success && (
        <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
          {errors.success}
        </div>
      )}

      <h2 className="text-xl font-semibold">個人資料設定</h2>

      {/* Avatar */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">頭像</label>
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="頭像預覽"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-500">{name[0]?.toUpperCase()}</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleAvatarChange}
            className="text-sm"
          />
        </div>
        {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">名稱</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="輸入你的名稱"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-medium">
          個人簡介
          <span className="text-gray-500 font-normal ml-2">（最多 200 字）</span>
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={200}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg resize-none"
          placeholder="介紹一下你自己..."
        />
        <p className="text-right text-sm text-gray-500">{bio.length}/200</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '儲存中...' : '儲存'}
      </button>
    </form>
  );
}

export default ProfileSettings;
