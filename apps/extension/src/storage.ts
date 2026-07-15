/**
 * Bookmark storage and management
 */

import type { Bookmark } from './messages';
import { extractDomain } from './url';

const STORAGE_KEY = 'xiaoxin_bookmarks';

/**
 * Generates a unique ID for bookmarks
 */
export function generateId(): string {
  return `bm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates a bookmark object from URL
 */
export function createBookmark(url: string, title?: string): Bookmark | null {
  const domain = extractDomain(url);
  if (!domain) return null;

  return {
    id: generateId(),
    url,
    title: title || domain,
    createdAt: Date.now(),
    domain,
  };
}

/**
 * Gets all bookmarks from storage
 */
export async function getBookmarks(): Promise<Bookmark[]> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  const bookmarks: Bookmark[] = result[STORAGE_KEY] || [];
  return bookmarks;
}

/**
 * Saves a bookmark to storage
 */
export async function saveBookmark(url: string, title?: string): Promise<Bookmark | null> {
  const bookmark = createBookmark(url, title);
  if (!bookmark) return null;

  const bookmarks = await getBookmarks();
  bookmarks.unshift(bookmark); // Add to beginning
  await browser.storage.local.set({ [STORAGE_KEY]: bookmarks });

  return bookmark;
}

/**
 * Deletes a bookmark by ID
 */
export async function deleteBookmark(id: string): Promise<boolean> {
  const bookmarks = await getBookmarks();
  const index = bookmarks.findIndex(b => b.id === id);

  if (index === -1) return false;

  bookmarks.splice(index, 1);
  await browser.storage.local.set({ [STORAGE_KEY]: bookmarks });

  return true;
}

/**
 * Searches bookmarks by query (matches URL, title, or domain)
 */
export async function searchBookmarks(query: string): Promise<Bookmark[]> {
  const bookmarks = await getBookmarks();
  const lowerQuery = query.toLowerCase();

  return bookmarks.filter(b =>
    b.url.toLowerCase().includes(lowerQuery) ||
    b.title.toLowerCase().includes(lowerQuery) ||
    b.domain.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Clears all bookmarks
 */
export async function clearAllBookmarks(): Promise<void> {
  await browser.storage.local.remove(STORAGE_KEY);
}
