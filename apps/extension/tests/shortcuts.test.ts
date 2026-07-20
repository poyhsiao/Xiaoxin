import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock chrome before importing - use callback pattern matching real chrome.storage API
const mockStorage: Record<string, unknown> = {};
const mockChrome = {
  storage: {
    local: {
      get: vi.fn((key: string, cb: (result: Record<string, unknown>) => void) => {
        cb({ [key]: mockStorage[key] });
      }),
      set: vi.fn((data: Record<string, unknown>, cb: () => void) => {
        Object.assign(mockStorage, data);
        if (cb) cb();
      }),
      remove: vi.fn((_key: string, cb: () => void) => {
        if (cb) cb();
      }),
    },
  },
  commands: {
    update: vi.fn((_a: unknown, _b: unknown, cb: () => void) => {
      if (cb) cb();
    }),
  },
};
vi.stubGlobal('chrome', mockChrome);

import {
  getShortcut,
  setShortcut,
  detectConflict,
  DEFAULT_SHORTCUTS,
  type ShortcutConfig
} from '../src/lib/shortcuts';

describe('Shortcuts', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    vi.clearAllMocks();
  });

  describe('DEFAULT_SHORTCUTS', () => {
    it('should have saveBookmark shortcut', () => {
      expect(DEFAULT_SHORTCUTS.saveBookmark).toBeDefined();
      expect(DEFAULT_SHORTCUTS.saveBookmark.key).toBe('B');
    });

    it('should have openSidebar shortcut', () => {
      expect(DEFAULT_SHORTCUTS.openSidebar).toBeDefined();
    });
  });

  describe('detectConflict', () => {
    it('should not detect conflict for unused shortcut', () => {
      const conflicts = detectConflict({ key: 'Z', modifiers: ['Ctrl'] });
      expect(conflicts).toHaveLength(0);
    });

    it('should detect conflict with browser shortcuts', () => {
      const conflicts = detectConflict({ key: 'W', modifiers: ['Ctrl'] });
      expect(conflicts.length).toBeGreaterThan(0);
    });
  });

  describe('setShortcut', () => {
    it('should save shortcut to storage', async () => {
      const config: ShortcutConfig = { key: 'S', modifiers: ['Ctrl', 'Shift'] };
      await setShortcut('saveBookmark', config);
      expect(mockChrome.storage.local.set).toHaveBeenCalled();
    });
  });

  describe('getShortcut', () => {
    it('should return default for unknown action', async () => {
      const shortcut = await getShortcut('unknownAction');
      expect(shortcut.key).toBe('');
    });
  });
});
