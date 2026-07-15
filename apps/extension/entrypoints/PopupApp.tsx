import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { fetchBookmarks, fetchCollections, createBookmark, type Bookmark, type Collection } from '../lib/api';
import { getCurrentTab, fetchMetadata, getFaviconForUrl } from '../lib/metadata';

function PopupApp() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cols, bks] = await Promise.all([
        fetchCollections(),
        fetchBookmarks(),
      ]);
      setCollections(cols);
      setBookmarks(bks);
      if (cols.length > 0) setSelectedCollection(cols[0].id);
    } catch (err) {
      setError('載入失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMetadata = async () => {
    if (!url) {
      const tab = await getCurrentTab();
      if (tab?.url) {
        setUrl(tab.url);
        const meta = await fetchMetadata(tab.url);
        setTitle(meta.title || '');
        setDescription(meta.description || '');
        setOgImage(meta.ogImage || '');
      }
    }
  };

  const handleSave = async () => {
    if (!url || !selectedCollection) return;
    setSaving(true);
    setError('');
    try {
      await createBookmark({ url, title, description, collectionId: selectedCollection });
      setUrl('');
      setTitle('');
      setDescription('');
      setOgImage('');
      loadData();
    } catch (err) {
      setError('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  const filteredBookmarks = bookmarks.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.url.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-4 text-center">載入中...</div>;
  if (error && bookmarks.length === 0) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-96 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h1 className="text-lg font-bold mb-3">小新書籤</h1>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋書籤..."
          aria-label="搜尋書籤"
          className="w-full p-2 border rounded text-sm"
        />
      </div>

      {/* Add Form */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="URL"
            className="flex-1 p-2 border rounded text-sm"
          />
          <button
            onClick={handleFetchMetadata}
            className="px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
          >
            抓取
          </button>
        </div>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="標題"
          className="w-full p-2 border rounded text-sm mb-2"
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="描述"
          className="w-full p-2 border rounded text-sm mb-2 h-16 resize-none"
        />
        <select
          value={selectedCollection}
          onChange={e => setSelectedCollection(e.target.value)}
          className="w-full p-2 border rounded text-sm mb-2"
        >
          {collections.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {ogImage && (
          <img src={ogImage} alt="" className="w-full h-24 object-cover rounded mb-2" />
        )}
        <button
          onClick={handleSave}
          disabled={saving || !url || !selectedCollection}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {saving ? '儲存中...' : '儲存書籤'}
        </button>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {/* Bookmark List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredBookmarks.length === 0 ? (
          <p className="text-center text-gray-500 py-4">沒有書籤</p>
        ) : (
          <div className="space-y-2">
            {filteredBookmarks.map(bookmark => (
              <a
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-2 rounded hover:bg-gray-100"
              >
                <img
                  src={getFaviconForUrl(bookmark.url)}
                  alt=""
                  className="w-6 h-6 mt-1 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">{bookmark.title || bookmark.url}</p>
                  {bookmark.description && (
                    <p className="text-xs text-gray-500 truncate">{bookmark.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const root = document.getElementById('root')!;
createRoot(root).render(<PopupApp />);
