import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock browser.storage
const mockStorage: Record<string, unknown> = {};
vi.stubGlobal('browser', {
  storage: {
    local: {
      get: vi.fn((key: string) => Promise.resolve({ [key]: mockStorage[key] })),
      set: vi.fn((data: Record<string, unknown>) => {
        Object.assign(mockStorage, data);
        return Promise.resolve();
      }),
      remove: vi.fn((key: string) => {
        delete mockStorage[key];
        return Promise.resolve();
      }),
    },
  },
});

import {
  generateId,
  createBookmark,
  getBookmarks,
  saveBookmark,
  deleteBookmark,
  searchBookmarks,
  clearAllBookmarks,
} from '../src/storage';

describe('Bookmark Storage', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    vi.clearAllMocks();
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with correct prefix', () => {
      const id = generateId();
      expect(id.startsWith('bm_')).toBe(true);
    });
  });

  describe('createBookmark', () => {
    it('should create bookmark from valid URL', () => {
      const bookmark = createBookmark('https://example.com');
      expect(bookmark).toMatchObject({
        url: 'https://example.com',
        domain: 'example.com',
      });
      expect(bookmark?.id).toBeDefined();
      expect(bookmark?.createdAt).toBeDefined();
    });

    it('should create bookmark with custom title', () => {
      const bookmark = createBookmark('https://example.com', 'My Bookmark');
      expect(bookmark?.title).toBe('My Bookmark');
    });

    it('should use domain as title when not provided', () => {
      const bookmark = createBookmark('https://example.com');
      expect(bookmark?.title).toBe('example.com');
    });

    it('should return null for empty URL', () => {
      const bookmark = createBookmark('');
      expect(bookmark).toBeNull();
    });
  });

  describe('getBookmarks', () => {
    it('should return empty array when no bookmarks exist', async () => {
      const bookmarks = await getBookmarks();
      expect(bookmarks).toEqual([]);
    });

    it('should return stored bookmarks', async () => {
      mockStorage['xiaoxin_bookmarks'] = [
        { id: '1', url: 'https://example.com', title: 'Example', createdAt: Date.now(), domain: 'example.com' },
      ];

      const bookmarks = await getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].url).toBe('https://example.com');
    });
  });

  describe('saveBookmark', () => {
    it('should save a new bookmark', async () => {
      const bookmark = await saveBookmark('https://example.com');
      expect(bookmark).toMatchObject({
        url: 'https://example.com',
        domain: 'example.com',
      });
    });

    it('should add bookmark to beginning of list', async () => {
      await saveBookmark('https://first.com');
      await saveBookmark('https://second.com');

      const bookmarks = await getBookmarks();
      expect(bookmarks[0].url).toBe('https://second.com');
      expect(bookmarks[1].url).toBe('https://first.com');
    });

    it('should return null for empty URL', async () => {
      const bookmark = await saveBookmark('');
      expect(bookmark).toBeNull();
    });
  });

  describe('deleteBookmark', () => {
    it('should delete existing bookmark', async () => {
      const saved = await saveBookmark('https://example.com');
      expect(saved).not.toBeNull();

      const result = await deleteBookmark(saved!.id);
      expect(result).toBe(true);

      const bookmarks = await getBookmarks();
      expect(bookmarks).toHaveLength(0);
    });

    it('should return false for non-existent bookmark', async () => {
      const result = await deleteBookmark('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('searchBookmarks', () => {
    beforeEach(async () => {
      await saveBookmark('https://example.com', 'Example Site');
      await saveBookmark('https://test.com', 'Test Page');
      await saveBookmark('https://foo.example.com', 'Foo Subdomain');
    });

    it('should search by URL', async () => {
      const results = await searchBookmarks('example.com');
      expect(results).toHaveLength(2); // example.com and foo.example.com
    });

    it('should search by title', async () => {
      const results = await searchBookmarks('Test');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Test Page');
    });

    it('should search by domain', async () => {
      const results = await searchBookmarks('test.com');
      expect(results).toHaveLength(1);
    });

    it('should be case insensitive', async () => {
      const results = await searchBookmarks('EXAMPLE');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', async () => {
      const results = await searchBookmarks('nonexistent');
      expect(results).toEqual([]);
    });
  });

  describe('clearAllBookmarks', () => {
    it('should clear all bookmarks', async () => {
      await saveBookmark('https://example.com');
      await saveBookmark('https://test.com');

      await clearAllBookmarks();

      const bookmarks = await getBookmarks();
      expect(bookmarks).toEqual([]);
    });
  });
});
