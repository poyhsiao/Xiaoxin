import { useState } from 'react';

export default function Popup() {
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const saveBookmark = async () => {
    if (!url) return;
    setSaving(true);
    // TODO: call API to save bookmark
    setTimeout(() => { setSaving(false); setUrl(''); }, 1000);
  };

  return (
    <div className="w-80 p-4">
      <h1 className="text-lg font-bold mb-4">小新書籤</h1>
      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="輸入 URL..."
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={saveBookmark}
        disabled={saving || !url}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {saving ? '儲存中...' : '儲存書籤'}
      </button>
    </div>
  );
}
