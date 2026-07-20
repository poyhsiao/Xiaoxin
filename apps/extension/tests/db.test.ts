import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  openDb,
  putBookmark,
  getAllBookmarks,
  getBookmarkById,
  deleteBookmark,
  getQueue,
  addToQueue,
  removeFromQueue,
  updateQueueItem,
  clearDb,
  _resetDbForTests,
} from '../src/lib/db';
import type { LocalBookmark, QueueItem } from '../src/lib/db';

describe('IndexedDB wrapper (db.ts)', () => {
  beforeEach(async () => {
    // Fully delete the fake-indexeddb database between tests so each test
    // starts with a clean slate (the cached connection is also forgotten).
    _resetDbForTests();
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase('xiaoxin-sync');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      req.onblocked = () => resolve();
    });
  });

  describe('openDb', () => {
    it('opens a database named "xiaoxin-sync"', async () => {
      const db = await openDb();
      expect(db.name).toBe('xiaoxin-sync');
      expect(db.version).toBeGreaterThanOrEqual(1);
      db.close();
    });

    it('creates the bookmarks and sync_queue object stores', async () => {
      const db = await openDb();
      const storeNames = Array.from(db.objectStoreNames);
      expect(storeNames).toContain('bookmarks');
      expect(storeNames).toContain('sync_queue');
      db.close();
    });

    it('returns the same DB instance on repeated calls', async () => {
      const a = await openDb();
      const b = await openDb();
      expect(a).toBe(b);
      a.close();
    });
  });

  describe('bookmark CRUD', () => {
    it('puts and reads back a bookmark', async () => {
      const bm: LocalBookmark = {
        id: 'bm_1',
        url: 'https://example.com',
        title: 'Example',
        createdAt: 1,
        domain: 'example.com',
        version: 1,
        syncedAt: null,
      };
      await putBookmark(bm);
      const got = await getBookmarkById('bm_1');
      expect(got).toEqual(bm);
    });

    it('returns null for a missing bookmark id', async () => {
      const got = await getBookmarkById('missing');
      expect(got).toBeNull();
    });

    it('lists all bookmarks', async () => {
      await putBookmark({ id: 'a', url: 'https://a.com', title: 'A', createdAt: 1, domain: 'a.com', version: 1, syncedAt: null });
      await putBookmark({ id: 'b', url: 'https://b.com', title: 'B', createdAt: 2, domain: 'b.com', version: 1, syncedAt: null });
      const all = await getAllBookmarks();
      expect(all).toHaveLength(2);
      expect(all.map(b => b.id).sort()).toEqual(['a', 'b']);
    });

    it('overwrites an existing bookmark with the same id', async () => {
      const bm: LocalBookmark = {
        id: 'bm_dup', url: 'https://x.com', title: 'Old', createdAt: 1, domain: 'x.com', version: 1, syncedAt: null,
      };
      await putBookmark(bm);
      await putBookmark({ ...bm, title: 'New' });
      const got = await getBookmarkById('bm_dup');
      expect(got?.title).toBe('New');
    });

    it('deletes a bookmark by id', async () => {
      await putBookmark({ id: 'rm', url: 'https://r.com', title: 'R', createdAt: 1, domain: 'r.com', version: 1, syncedAt: null });
      const ok = await deleteBookmark('rm');
      expect(ok).toBe(true);
      const got = await getBookmarkById('rm');
      expect(got).toBeNull();
    });

    it('returns false when deleting a non-existent id', async () => {
      const ok = await deleteBookmark('nope');
      expect(ok).toBe(false);
    });
  });

  describe('sync queue', () => {
    it('adds and reads a queue item', async () => {
      const item: QueueItem = {
        id: 'q_1',
        bookmarkId: 'bm_1',
        op: 'create',
        payload: { url: 'https://q.com', title: 'Q' },
        attempts: 0,
        createdAt: Date.now(),
      };
      await addToQueue(item);
      const queue = await getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0]).toEqual(item);
    });

    it('removes a queue item by id', async () => {
      await addToQueue({ id: 'q_a', bookmarkId: 'b1', op: 'create', payload: {}, attempts: 0, createdAt: 1 });
      await addToQueue({ id: 'q_b', bookmarkId: 'b2', op: 'update', payload: {}, attempts: 0, createdAt: 2 });
      await removeFromQueue('q_a');
      const queue = await getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0].id).toBe('q_b');
    });

    it('updates queue item fields (e.g. attempts counter)', async () => {
      const item: QueueItem = { id: 'q_u', bookmarkId: 'b1', op: 'create', payload: {}, attempts: 0, createdAt: 1 };
      await addToQueue(item);
      await updateQueueItem('q_u', { attempts: 2 });
      const queue = await getQueue();
      expect(queue[0].attempts).toBe(2);
    });

    it('preserves queue order by createdAt', async () => {
      await addToQueue({ id: 'q_1', bookmarkId: 'b1', op: 'create', payload: {}, attempts: 0, createdAt: 3 });
      await addToQueue({ id: 'q_2', bookmarkId: 'b2', op: 'create', payload: {}, attempts: 0, createdAt: 1 });
      await addToQueue({ id: 'q_3', bookmarkId: 'b3', op: 'create', payload: {}, attempts: 0, createdAt: 2 });
      const queue = await getQueue();
      expect(queue.map(q => q.id)).toEqual(['q_2', 'q_3', 'q_1']);
    });
  });

  describe('clearDb', () => {
    it('removes all bookmarks and queue items', async () => {
      await putBookmark({ id: 'b', url: 'https://b.com', title: 'B', createdAt: 1, domain: 'b.com', version: 1, syncedAt: null });
      await addToQueue({ id: 'q', bookmarkId: 'b', op: 'create', payload: {}, attempts: 0, createdAt: 1 });
      await clearDb();
      const all = await getAllBookmarks();
      const queue = await getQueue();
      expect(all).toEqual([]);
      expect(queue).toEqual([]);
    });
  });
});
