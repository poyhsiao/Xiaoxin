import 'fake-indexeddb/auto';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  acquireLock,
  releaseLock,
  withLock,
  enqueueBookmark,
  flushQueue,
  startSync,
  stopSync,
  getSyncStatus,
  subscribeStatus,
  syncNow,
  _resetSyncForTests,
} from '../src/lib/sync';
import type { LocalBookmark, QueueItem } from '../src/lib/db';
import {
  _resetDbForTests,
  putBookmark,
  getAllBookmarks,
  getQueue,
} from '../src/lib/db';

// In-memory remote store keyed by id; the mock fetcher reads/writes this.
const remoteStore: Map<string, Record<string, unknown>> = new Map();
let serverVersions: Map<string, number> = new Map();

// Configurable network state for tests.
let onlineValue = true;
let fetchShouldFail = false;

function makeFetchMock() {
  return vi.fn(async (url: string, init?: RequestInit) => {
    if (!onlineValue) {
      return new Response('offline', { status: 503 });
    }
    if (fetchShouldFail) {
      return new Response('boom', { status: 500 });
    }
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(init.body as string) : null;
    // Strip any origin + /api/v1 prefix so the mock can match the suffix.
    const path = url.replace(/^https?:\/\/[^/]+/, '').replace(/^\/api\/v\d+/, '');
    const m = path.match(/^\/bookmarks\/([^/?]+)/);
    if (m && method === 'GET') {
      const id = m[1];
      const r = remoteStore.get(id);
      if (!r) return new Response('not found', { status: 404 });
      return new Response(JSON.stringify(r), {
        status: 200,
        headers: { 'content-type': 'application/json', 'etag': String(serverVersions.get(id) ?? 1) },
      });
    }
    if (method === 'POST' && path.endsWith('/bookmarks')) {
      const id = body.id;
      remoteStore.set(id, body);
      serverVersions.set(id, 1);
      return new Response(JSON.stringify({ ...body, version: 1 }), {
        status: 201,
        headers: { 'content-type': 'application/json', 'etag': '1' },
      });
    }
    if (m && method === 'PUT') {
      const id = m[1];
      const current = serverVersions.get(id) ?? 0;
      const incoming = body.version ?? current + 1;
      if (incoming <= current) {
        return new Response('conflict', { status: 409 });
      }
      serverVersions.set(id, incoming);
      remoteStore.set(id, body);
      return new Response(JSON.stringify({ ...body, version: incoming }), {
        status: 200,
        headers: { 'content-type': 'application/json', 'etag': String(incoming) },
      });
    }
    if (m && method === 'DELETE') {
      const id = m[1];
      remoteStore.delete(id);
      serverVersions.delete(id);
      return new Response('', { status: 204 });
    }
    return new Response('unhandled ' + path + ' ' + method, { status: 404 });
  });
}

async function resetAll(): Promise<void> {
  _resetSyncForTests();
  _resetDbForTests();
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase('xiaoxin-sync');
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
  remoteStore.clear();
  serverVersions.clear();
  onlineValue = true;
  fetchShouldFail = false;
  setNavigatorOnline(true);
  vi.stubGlobal('fetch', makeFetchMock());
}

function setNavigatorOnline(value: boolean): void {
  Object.defineProperty(globalThis.navigator, 'onLine', {
    configurable: true,
    get: () => value,
  });
}

beforeEach(async () => {
  await resetAll();
});

describe('Sync lock', () => {
  it('acquires a lock and blocks concurrent acquisition', async () => {
    expect(await acquireLock('key1')).toBe(true);
    expect(await acquireLock('key1')).toBe(false);
    await releaseLock('key1');
  });

  it('releases a lock so another acquirer succeeds', async () => {
    await acquireLock('k');
    await releaseLock('k');
    expect(await acquireLock('k')).toBe(true);
  });

  it('withLock runs the body and guarantees release', async () => {
    const fn = vi.fn(async () => 42);
    const result = await withLock('k', fn);
    expect(result).toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(await acquireLock('k')).toBe(true);
  });

  it('withLock releases even if the body throws', async () => {
    const fn = vi.fn(async () => { throw new Error('boom'); });
    await expect(withLock('k', fn)).rejects.toThrow('boom');
    expect(await acquireLock('k')).toBe(true);
  });
});

describe('Offline queueing', () => {
  it('queues a bookmark when offline and returns queued=true', async () => {
    onlineValue = false;
    const bm: LocalBookmark = {
      id: 'bm_offline', url: 'https://offline.example', title: 'Offline',
      createdAt: 1, domain: 'offline.example', version: 1, syncedAt: null,
    };
    const result = await enqueueBookmark(bm);
    expect(result.queued).toBe(true);
    const queue = await getQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].op).toBe('create');
    expect(queue[0].bookmarkId).toBe('bm_offline');
  });

  it('persists the bookmark locally even when offline', async () => {
    onlineValue = false;
    const bm: LocalBookmark = {
      id: 'bm_offline', url: 'https://offline.example', title: 'Offline',
      createdAt: 1, domain: 'offline.example', version: 1, syncedAt: null,
    };
    await enqueueBookmark(bm);
    const all = await getAllBookmarks();
    expect(all.find(b => b.id === 'bm_offline')).toBeDefined();
  });
});

describe('Sync status', () => {
  it('starts as "offline" or "synced" depending on navigator state', () => {
    const s = getSyncStatus();
    expect(['synced', 'offline']).toContain(s);
  });

  it('transitions to "syncing" during a flush and back to "synced" after', async () => {
    const bm: LocalBookmark = {
      id: 'bm_status', url: 'https://status.example', title: 'S',
      createdAt: 1, domain: 'status.example', version: 1, syncedAt: null,
    };
    await enqueueBookmark(bm);

    const seen: string[] = [];
    const unsub = subscribeStatus(s => seen.push(s));

    await syncNow();

    // We must have observed at least one "syncing" state and a final "synced".
    expect(seen).toContain('syncing');
    expect(seen[seen.length - 1]).toBe('synced');
    unsub();
  });

  it('reports "offline" when navigator is offline', async () => {
    onlineValue = false;
    setNavigatorOnline(false);
    const bm: LocalBookmark = {
      id: 'bm_off', url: 'https://off.example', title: 'Off',
      createdAt: 1, domain: 'off.example', version: 1, syncedAt: null,
    };
    await enqueueBookmark(bm);
    await _resetSyncForTests();
    onlineValue = false;
    setNavigatorOnline(false);
    await enqueueBookmark(bm);
    await syncNow();
    expect(getSyncStatus()).toBe('offline');
  });
});

describe('flushQueue', () => {
  it('flushes all queued items when online', async () => {
    const a: LocalBookmark = { id: 'a', url: 'https://a.example', title: 'A', createdAt: 1, domain: 'a.example', version: 1, syncedAt: null };
    const b: LocalBookmark = { id: 'b', url: 'https://b.example', title: 'B', createdAt: 2, domain: 'b.example', version: 1, syncedAt: null };
    await enqueueBookmark(a);
    await enqueueBookmark(b);

    const flushed = await flushQueue();
    expect(flushed).toBe(2);
    expect(await getQueue()).toEqual([]);
    expect(remoteStore.has('a')).toBe(true);
    expect(remoteStore.has('b')).toBe(true);
  });

  it('marks syncedAt on local copies after a successful push', async () => {
    const bm: LocalBookmark = { id: 'c', url: 'https://c.example', title: 'C', createdAt: 1, domain: 'c.example', version: 1, syncedAt: null };
    await enqueueBookmark(bm);
    await flushQueue();
    const all = await getAllBookmarks();
    const got = all.find(b => b.id === 'c');
    expect(got?.syncedAt).not.toBeNull();
  });

  it('does nothing when offline', async () => {
    onlineValue = false;
    setNavigatorOnline(false);
    const bm: LocalBookmark = { id: 'o', url: 'https://o.example', title: 'O', createdAt: 1, domain: 'o.example', version: 1, syncedAt: null };
    await enqueueBookmark(bm);
    const flushed = await flushQueue();
    expect(flushed).toBe(0);
    expect(await getQueue()).toHaveLength(1);
  });

  it('increments attempts and keeps the item on transient failure', async () => {
    fetchShouldFail = true;
    const bm: LocalBookmark = { id: 'f', url: 'https://f.example', title: 'F', createdAt: 1, domain: 'f.example', version: 1, syncedAt: null };
    await enqueueBookmark(bm);
    const flushed = await flushQueue();
    expect(flushed).toBe(0);
    const queue = await getQueue();
    expect(queue[0].attempts).toBeGreaterThanOrEqual(1);
  });

  it('serializes concurrent flushes (no double-flush)', async () => {
    for (let i = 0; i < 5; i++) {
      await enqueueBookmark({ id: `bm_${i}`, url: `https://${i}.example`, title: `${i}`, createdAt: i, domain: `${i}.example`, version: 1, syncedAt: null });
    }
    const results = await Promise.all([flushQueue(), flushQueue(), flushQueue()]);
    // Only one of the calls should have done work; the others should report 0.
    const total = results.reduce((s, n) => s + n, 0);
    expect(total).toBe(5);
  });
});

describe('Auto-sync on online event', () => {
  it('flushes the queue when an "online" event fires', async () => {
    onlineValue = false;
    setNavigatorOnline(false);
    const bm: LocalBookmark = { id: 'auto', url: 'https://auto.example', title: 'A', createdAt: 1, domain: 'auto.example', version: 1, syncedAt: null };
    await enqueueBookmark(bm);
    expect(await getQueue()).toHaveLength(1);

    // Start listening for online events.
    startSync();
    onlineValue = true;
    setNavigatorOnline(true);
    window.dispatchEvent(new Event('online'));

    // Poll until the queue drains (online handler is async).
    const deadline = Date.now() + 2000;
    while ((await getQueue()).length > 0 && Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 25));
    }

    expect(await getQueue()).toEqual([]);
    expect(remoteStore.has('auto')).toBe(true);
    stopSync();
  });
});