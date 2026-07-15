// ponytail: API_BASE configured via build-time env var, defaults to localhost for dev
const API_BASE = typeof process !== 'undefined' && process.env.API_BASE
  ? process.env.API_BASE
  : 'http://localhost:3000/api/v1';

export interface Bookmark {
  id: string;
  url: string;
  title?: string;
  description?: string;
  ogImage?: string;
  status: string;
  collectionId: string;
}

export interface Collection {
  id: string;
  name: string;
  spaceId: string;
}

export interface Space {
  id: string;
  name: string;
}

export async function getToken(): Promise<string | null> {
  return new Promise(resolve => {
    chrome.storage.local.get(['token'], result => {
      resolve(result.token || null);
    });
  });
}

export async function fetchBookmarks(collectionId?: string): Promise<Bookmark[]> {
  const token = await getToken();
  // Use correct endpoint: GET /collections/:collectionId/bookmarks
  const url = collectionId
    ? `${API_BASE}/collections/${collectionId}/bookmarks`
    : `${API_BASE}/bookmarks`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch bookmarks');
  return res.json();
}

export async function fetchCollections(spaceId?: string): Promise<Collection[]> {
  const token = await getToken();
  const url = spaceId
    ? `${API_BASE}/collections?spaceId=${spaceId}`
    : `${API_BASE}/collections`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch collections');
  return res.json();
}

export async function fetchSpaces(): Promise<Space[]> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/spaces`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch spaces');
  return res.json();
}

export async function createBookmark(data: {
  url: string;
  title?: string;
  description?: string;
  collectionId: string;
}): Promise<Bookmark> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create bookmark');
  return res.json();
}
