import React, { useState } from 'react';

export interface NotificationPrefs {
  emailEnabled: boolean;
  pushEnabled: boolean;
  bookmarkCreated: boolean;
  bookmarkUpdated: boolean;
  bookmarkDeleted: boolean;
  memberInvited: boolean;
  memberRemoved: boolean;
  mutedUntil: string | null;
}

interface NotificationPreferencesProps {
  initialPrefs?: Partial<NotificationPrefs>;
  onSave?: (prefs: NotificationPrefs) => Promise<void>;
}

const defaultPrefs: NotificationPrefs = {
  emailEnabled: true,
  pushEnabled: true,
  bookmarkCreated: true,
  bookmarkUpdated: true,
  bookmarkDeleted: true,
  memberInvited: true,
  memberRemoved: true,
  mutedUntil: null,
};

export function NotificationPreferences({
  initialPrefs = {},
  onSave,
}: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    ...defaultPrefs,
    ...initialPrefs,
  });
  const [loading, setLoading] = useState(false);
  const [mutedHours, setMutedHours] = useState(0);

  const updatePref = <K extends keyof NotificationPrefs>(
    key: K,
    value: NotificationPrefs[K]
  ) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave?.(prefs);
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">通知偏好設定</h2>

      {/* Channel Toggles */}
      <div className="space-y-2 border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase">通知方式</h3>
        <Toggle
          checked={prefs.emailEnabled}
          onChange={v => updatePref('emailEnabled', v)}
          label="Email 通知"
        />
        <Toggle
          checked={prefs.pushEnabled}
          onChange={v => updatePref('pushEnabled', v)}
          label="推播通知"
        />
      </div>

      {/* Event Toggles */}
      <div className="space-y-2 border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase">書籤事件</h3>
        <Toggle
          checked={prefs.bookmarkCreated}
          onChange={v => updatePref('bookmarkCreated', v)}
          label="新書籤加入"
        />
        <Toggle
          checked={prefs.bookmarkUpdated}
          onChange={v => updatePref('bookmarkUpdated', v)}
          label="書籤被編輯"
        />
        <Toggle
          checked={prefs.bookmarkDeleted}
          onChange={v => updatePref('bookmarkDeleted', v)}
          label="書籤被刪除"
        />
      </div>

      {/* Member Event Toggles */}
      <div className="space-y-2 border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase">成員事件</h3>
        <Toggle
          checked={prefs.memberInvited}
          onChange={v => updatePref('memberInvited', v)}
          label="被邀請加入"
        />
        <Toggle
          checked={prefs.memberRemoved}
          onChange={v => updatePref('memberRemoved', v)}
          label="被移除"
        />
      </div>

      {/* Mute Duration */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase">靜音時段</h3>
        <select
          value={mutedHours}
          onChange={e => setMutedHours(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value={0}>關閉</option>
          <option value={1}>1 小時</option>
          <option value={4}>4 小時</option>
          <option value={8}>8 小時</option>
          <option value={24}>1 天</option>
          <option value={168}>1 週</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '儲存中...' : '儲存設定'}
      </button>
    </div>
  );
}

export default NotificationPreferences;
