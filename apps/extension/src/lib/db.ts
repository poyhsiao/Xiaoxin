/**
 * IndexedDB wrapper for Xiaoxin extension sync.
 *
 * Two object stores:
 *  - bookmarks: locally cached bookmarks keyed by id, with a `version` and
 *    `syncedAt` for conflict detection.
 *  - sync_queue: pending mutations (create / update / delete) waiting to be
 *    flushed when network is available.
 */

const DB_NAME = 'xiaoxin-sync';
const DB_VERSION = 1;
const STORE_BOOKMARKS = 'bookmarks';
const STORE_QUEUE = 'sync_queue';

let dbPromise: Promise<IDBDatabase> | null = null;

export interface LocalBookmark {
  id: string;
  url: string;
  title: string;
  createdAt: number;
  domain: string;
  /** Monotonic version number, incremented on each local edit. */
  version: number;
  /** Epoch ms when last successfully synced to the server, or null if unsynced. */
  syncedAt: number | null;
}

export type QueueOp = 'create' | 'update' | 'delete';

export interface QueueItem {
  id: string;
  bookmarkId: string;
  op: QueueOp;
  payload: Record<string, unknown>;
  /** Number of times we have tried and failed to flush this item. */
  attempts: number;
  /** Epoch ms when the item was queued — used for FIFO ordering. */
  createdAt: number;
}

/**
 * Opens (and caches) the IndexedDB connection, creating the required
 * object stores on first run.
 */
export function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
        db.createObjectStore(STORE_BOOKMARKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        const queueStore = db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
        queueStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to open IndexedDB'));
    req.onblocked = () => reject(new Error('IndexedDB open blocked'));
  });

  return dbPromise;
}

/** Closes the cached connection and forgets it (used by tests). */
export function _resetDbForTests(): void {
  if (dbPromise) {
    dbPromise.then(db => { try { db.close(); } catch { /* noop */ } }).catch(() => undefined);
  }
  dbPromise = null;
}

/** Wraps an IDBRequest in a promise that captures the value at success time. */
function reqAsPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IDBRequest failed'));
  });
}

/**
 * Opens a single-store readwrite transaction and resolves when the
 * transaction commits. The provided fn receives the store and must
 * initiate the actual IDBRequest (which will be awaited by the tx).
 */
function runTx(
  stores: string | string[],
  mode: IDBTransactionMode,
  fn: (tx: IDBTransaction) => void,
): Promise<void> {
  return openDb().then(db =>
    new Promise<void>((resolve, reject) => {
      const tx = db.transaction(stores, mode);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IDB transaction failed'));
      tx.onabort = () => reject(tx.error ?? new Error('IDB transaction aborted'));
      try {
        fn(tx);
      } catch (err) {
        reject(err);
      }
    }),
  );
}

/** Read a single value from a store by key. */
function getOne<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
  return openDb().then(db =>
    new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error ?? new Error('IDB get failed'));
    }),
  );
}

/** Read all values from a store. */
function getAll<T>(storeName: string): Promise<T[]> {
  return openDb().then(db =>
    new Promise<T[]>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve((req.result as T[]) ?? []);
      req.onerror = () => reject(req.error ?? new Error('IDB getAll failed'));
    }),
  );
}

// -------- Bookmark CRUD --------

export function putBookmark(bookmark: LocalBookmark): Promise<void> {
  return runTx(STORE_BOOKMARKS, 'readwrite', tx => {
    tx.objectStore(STORE_BOOKMARKS).put(bookmark);
  });
}

export function getBookmarkById(id: string): Promise<LocalBookmark | null> {
  return getOne<LocalBookmark>(STORE_BOOKMARKS, id).then(v => v ?? null);
}

export function getAllBookmarks(): Promise<LocalBookmark[]> {
  return getAll<LocalBookmark>(STORE_BOOKMARKS);
}

export async function deleteBookmark(id: string): Promise<boolean> {
  const existing = await getOne<LocalBookmark>(STORE_BOOKMARKS, id);
  if (!existing) return false;
  await runTx(STORE_BOOKMARKS, 'readwrite', tx => {
    tx.objectStore(STORE_BOOKMARKS).delete(id);
  });
  return true;
}

// -------- Sync queue --------

export function addToQueue(item: QueueItem): Promise<void> {
  return runTx(STORE_QUEUE, 'readwrite', tx => {
    tx.objectStore(STORE_QUEUE).put(item);
  });
}

export async function getQueue(): Promise<QueueItem[]> {
  const all = await getAll<QueueItem>(STORE_QUEUE);
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export function removeFromQueue(id: string): Promise<void> {
  return runTx(STORE_QUEUE, 'readwrite', tx => {
    tx.objectStore(STORE_QUEUE).delete(id);
  });
}

export async function updateQueueItem(id: string, patch: Partial<QueueItem>): Promise<void> {
  const existing = await getOne<QueueItem>(STORE_QUEUE, id);
  if (!existing) throw new Error(`Queue item not found: ${id}`);
  const merged: QueueItem = { ...existing, ...patch, id };
  await runTx(STORE_QUEUE, 'readwrite', tx => {
    tx.objectStore(STORE_QUEUE).put(merged);
  });
}

// -------- Maintenance --------

/**
 * Clears every record in both stores. Used by tests and by an explicit
 * "reset local data" user action.
 */
export function clearDb(): Promise<void> {
  return runTx([STORE_BOOKMARKS, STORE_QUEUE], 'readwrite', tx => {
    tx.objectStore(STORE_BOOKMARKS).clear();
    tx.objectStore(STORE_QUEUE).clear();
  });
}