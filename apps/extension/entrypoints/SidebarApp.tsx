import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { fetchBookmarks, fetchCollections, createBookmark, type Bookmark, type Collection } from '../lib/api';
import { getCurrentTab, fetchMetadata, getFaviconForUrl } from '../lib/metadata';

function SidebarApp() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cols, bks] = await Promise.all([fetchCollections(), fetchBookmarks()]);
      setCollections(cols);
      setBookmarks(bks);
      if (cols.length > 0) setSelectedCollection(cols[0].id);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMetadata = async () => {
    const tab = await getCurrentTab();
    if (tab?.url) {
      setUrl(tab.url);
      const meta = await fetchMetadata(tab.url);
      setTitle(meta.title || '');
      setDescription(meta.description || '');
    }
  };

  const handleSave = async () => {
    if (!url || !selectedCollection) return;
    setSaving(true);
    try {
      await createBookmark({ url, title, description, collectionId: selectedCollection });
      setUrl('');
      setTitle('');
      setDescription('');
      loadData();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = bookmarks.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.url.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-4 text-center">載入中...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b bg-white">
        <h1 className="text-lg font-bold mb-3">📚 小新書籤</h1>
        <input type="search" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="搜尋..." className="w-full p-2 border rounded" />
      </div>

      <div className="p-4 border-b bg-gray-50">
        <button onClick={handleFetchMetadata}
          className="w-full mb-2 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
          + 儲存當前頁面
        </button>
        <div className="space-y-2">
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="或輸入 URL..." className="w-full p-2 border rounded text-sm" />
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="標題" className="w-full p-2 border rounded text-sm" />
          <select value={selectedCollection} onChange={e => setSelectedCollection(e.target.value)}
            className="w-full p-2 border rounded text-sm">
            {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={handleSave} disabled={saving || !url}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50">
            {saving ? '儲存中...' : '儲存'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map(b => (
          <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer"
            className="flex gap-3 p-3 rounded hover:bg-gray-100 mb-1">
            <img src={getFaviconForUrl(b.url)} alt="" className="w-5 h-5 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{b.title || b.url}</p>
              {b.description && <p className="text-xs text-gray-500 truncate">{b.description}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

const root = document.getElementById('root')!;
createRoot(root).render(<SidebarApp />);
