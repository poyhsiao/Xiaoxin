/**
 * Sync management for the Xiaoxin browser extension.
 *
 * Responsibilities:
 *  - Mutex lock so two flushes can't run at once.
 *  - Queue local mutations while offline; flush them when network returns.
 *  - Listen for browser `online` / `offline` events and auto-flush.
 *  - Expose a status observable (`offline` / `syncing` / `synced` / `error`).
 *  - Detect 409 conflicts when the server already has a newer version.
 */

import {
  addToQueue,
  getQueue,
  removeFromQueue,
  updateQueueItem,
  putBookmark,
  getBookmarkById,
  type LocalBookmark,
  type QueueItem,
  type QueueOp,
} from './db';

export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error';

// -------- Lock --------

interface LockState {
  held: boolean;
  queue: Array<() => void>;
}

const lockStates = new Map<string, LockState>();

function getLockState(key: string): LockState {
  let s = lockStates.get(key);
  if (!s) {
    s = { held: false, queue: [] };
    lockStates.set(key, s);
  }
  return s;
}

/**
 * Acquire a named lock. Returns true on success, false if the lock is
 * already held. Callers that need to wait should use `withLock`.
 */
export function acquireLock(key: string): Promise<boolean> {
  const s = getLockState(key);
  if (s.held) return Promise.resolve(false);
  s.held = true;
  return Promise.resolve(true);
}

/** Release a previously acquired lock and wake the next waiter (if any). */
export function releaseLock(key: string): Promise<void> {
  const s = getLockState(key);
  if (!s.held) return Promise.resolve();
  const next = s.queue.shift();
  if (next) {
    // Hand the lock directly to the next waiter; keep `held = true`.
    next();
  } else {
    s.held = false;
  }
  return Promise.resolve();
}

/**
 * Run `fn` while holding the named lock. Waits for the lock if currently
 * held, then guarantees release on success or failure.
 */
export function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const s = getLockState(key);
  if (!s.held) {
    s.held = true;
    return runAndRelease(key, fn);
  }
  return new Promise<T>((resolve, reject) => {
    s.queue.push(() => {
      runAndRelease(key, fn).then(resolve, reject);
    });
  });
}

function runAndRelease<T>(key: string, fn: () => Promise<T>): Promise<T> {
  return fn().finally(() => { void releaseLock(key); });
}

// -------- Status observable --------

let status: SyncStatus = typeof navigator !== 'undefined' && navigator.onLine === false
  ? 'offline'
  : 'synced';
const subscribers = new Set<(s: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus {
  // Reflect current network state if we haven't been told otherwise.
  if (typeof navigator !== 'undefined' && navigator.onLine === false && status !== 'syncing') {
    return 'offline';
  }
  return status;
}

export function setSyncStatus(next: SyncStatus): void {
  if (status === next) return;
  status = next;
  for (const cb of subscribers) {
    try { cb(next); } catch { /* ignore subscriber errors */ }
  }
}

export function subscribeStatus(cb: (s: SyncStatus) => void): () => void {
  subscribers.add(cb);
  // Push current state immediately so subscribers don't miss it.
  try { cb(getSyncStatus()); } catch { /* ignore */ }
  return () => { subscribers.delete(cb); };
}

// -------- Queue & flush --------

const SYNC_LOCK_KEY = 'sync:flush';

/**
 * Save (or update) a bookmark locally and enqueue it for sync.
 *  - Always persists the local copy first.
 *  - If autoSync is on (via startSync) and the network is up, attempts a
 *    non-blocking flush; failure just leaves the queue intact.
 *  - Otherwise leaves the item in the queue for a later flush.
 */
export async function enqueueBookmark(bookmark: LocalBookmark): Promise<{ queued: boolean }> {
  await putBookmark(bookmark);
  const item: QueueItem = {
    id: `q_${bookmark.id}_${Date.now()}`,
    bookmarkId: bookmark.id,
    op: 'create',
    payload: { ...bookmark },
    attempts: 0,
    createdAt: Date.now(),
  };
  await addToQueue(item);
  if (started && typeof navigator !== 'undefined' && navigator.onLine !== false) {
    void flushQueue().catch(() => undefined);
  }
  return { queued: true };
}

/**
 * Attempt to push every queued item to the server. Returns the number of
 * items successfully flushed. Concurrent calls are serialized via the lock.
 */
export async function flushQueue(): Promise<number> {
  return withLock(SYNC_LOCK_KEY, async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setSyncStatus('offline');
      return 0;
    }

    const queue = await getQueue();
    if (queue.length === 0) {
      setSyncStatus('synced');
      return 0;
    }

    setSyncStatus('syncing');
    let flushed = 0;

    for (const item of queue) {
      try {
        await flushOne(item);
        await removeFromQueue(item.id);
        flushed++;
      } catch (err) {
        await updateQueueItem(item.id, { attempts: item.attempts + 1 });
        // If we got here because we're actually offline, reflect that
        // truthfully; otherwise it's a real server error.
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
          setSyncStatus('offline');
        } else {
          setSyncStatus('error');
        }
        // Stop on first failure to preserve ordering and to avoid hammering.
        break;
      }
    }

    const remaining = await getQueue();
    if (remaining.length === 0) setSyncStatus('synced');
    else if (typeof navigator !== 'undefined' && navigator.onLine === false) setSyncStatus('offline');

    return flushed;
  });
}

async function flushOne(item: QueueItem): Promise<void> {
  const url = `${API_BASE}/bookmarks/${encodeURIComponent(item.bookmarkId)}`;
  const init: RequestInit = {
    method: item.op === 'create' ? 'POST' : item.op === 'update' ? 'PUT' : 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  if (item.op !== 'delete') init.body = JSON.stringify(item.payload);

  const token = await getToken();
  if (token) (init.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(item.op === 'create' ? `${API_BASE}/bookmarks` : url, init);

  if (res.status === 409) {
    throw new Error(`Conflict for bookmark ${item.bookmarkId}`);
  }
  if (!res.ok && res.status !== 204) {
    throw new Error(`Sync failed: ${res.status}`);
  }

  if (item.op !== 'delete') {
    const local = await getBookmarkById(item.bookmarkId);
    if (local) {
      await putBookmark({ ...local, syncedAt: Date.now() });
    }
  }
}

// -------- Online/offline event wiring --------

let started = false;
function onOnline(): void {
  setSyncStatus('syncing');
  void flushQueue().catch(() => undefined);
}
function onOffline(): void {
  setSyncStatus('offline');
}

/** Start listening to browser online/offline events. Idempotent. */
export function startSync(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    setSyncStatus('offline');
  }
}

/** Stop listening; safe to call multiple times. */
export function stopSync(): void {
  if (!started || typeof window === 'undefined') return;
  started = false;
  window.removeEventListener('online', onOnline);
  window.removeEventListener('offline', onOffline);
}

/** Public alias for `flushQueue` so callers can request an explicit sync. */
export const syncNow = flushQueue;

// -------- Helpers & test hooks --------

const API_BASE = typeof process !== 'undefined' && (process as { env?: Record<string, string | undefined> }).env?.API_BASE
  ? (process as { env: Record<string, string> }).env.API_BASE!
  : 'http://localhost:3000/api/v1';

async function getToken(): Promise<string | null> {
  // `browser` is provided by the extension host at build/runtime; not by
  // the Node test environment. We probe carefully and accept both the WXT
  // global and the `chrome` fallback.
  type LocalStorageLike = { get(keys: string[], cb: (r: Record<string, unknown>) => void): void };
  const ext = (globalThis as Record<string, unknown>)['browser'] as { storage?: { local?: LocalStorageLike } } | undefined
    ?? (globalThis as Record<string, unknown>)['chrome'] as { storage?: { local?: LocalStorageLike } } | undefined;
  if (!ext?.storage?.local) return null;
  return new Promise(resolve => {
    ext.storage!.local!.get(['token'], (result: Record<string, unknown>) => {
      resolve(((result as { token?: string }).token) ?? null);
    });
  });
}

/** Reset all in-module state. Used by tests only. */
export function _resetSyncForTests(): void {
  lockStates.clear();
  subscribers.clear();
  status = typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'synced';
  started = false;
  if (typeof globalThis !== 'undefined' && (globalThis as { window?: Window }).window) {
    const w = (globalThis as { window: Window }).window;
    w.removeEventListener('online', onOnline);
    w.removeEventListener('offline', onOffline);
  }
}

// Avoid unused-type warnings while keeping the export surface explicit.
export type { LocalBookmark, QueueItem, QueueOp };