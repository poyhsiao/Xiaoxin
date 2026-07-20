/**
 * Keyboard shortcuts management for Xiaoxin extension
 */

export interface ShortcutConfig {
  key: string;
  modifiers?: ('Ctrl' | 'Alt' | 'Shift' | 'Meta')[];
}

export interface ShortcutDefinition {
  action: string;
  description: string;
  default: ShortcutConfig;
}

export const DEFAULT_SHORTCUTS: Record<string, ShortcutConfig> = {
  saveBookmark: { key: 'B', modifiers: ['Alt', 'Shift'] },
  openSidebar: { key: 'S', modifiers: ['Alt', 'Shift'] },
  searchBookmarks: { key: 'K', modifiers: ['Ctrl', 'Shift'] },
};

const STORAGE_KEY = 'shortcuts';

// Reserved browser shortcuts that conflict
const RESERVED_SHORTCUTS: Array<{ key: string; modifiers: string[]; name: string }> = [
  { key: 'W', modifiers: ['Ctrl'], name: 'Close tab' },
  { key: 'T', modifiers: ['Ctrl'], name: 'New tab' },
  { key: 'N', modifiers: ['Ctrl'], name: 'New window' },
  { key: 'T', modifiers: ['Ctrl', 'Shift'], name: 'Reopen closed tab' },
  { key: 'L', modifiers: ['Ctrl'], name: 'Address bar' },
  { key: 'D', modifiers: ['Ctrl'], name: 'Bookmark current page' },
  { key: 'D', modifiers: ['Ctrl', 'Shift'], name: 'Bookmark all tabs' },
  { key: 'H', modifiers: ['Ctrl'], name: 'History' },
  { key: 'J', modifiers: ['Ctrl'], name: 'Downloads' },
  { key: 'F', modifiers: ['Ctrl'], name: 'Find' },
  { key: 'G', modifiers: ['Ctrl'], name: 'Find next' },
  { key: 'G', modifiers: ['Ctrl', 'Shift'], name: 'Find previous' },
  { key: '+', modifiers: ['Ctrl'], name: 'Zoom in' },
  { key: '-', modifiers: ['Ctrl'], name: 'Zoom out' },
  { key: '0', modifiers: ['Ctrl'], name: 'Reset zoom' },
];

export async function getShortcut(action: string): Promise<ShortcutConfig> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const shortcuts = result[STORAGE_KEY] || {};
      if (shortcuts[action]) {
        resolve(shortcuts[action]);
      } else {
        resolve(DEFAULT_SHORTCUTS[action] || { key: '', modifiers: [] });
      }
    });
  });
}

export async function setShortcut(action: string, config: ShortcutConfig): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const shortcuts = result[STORAGE_KEY] || {};
      shortcuts[action] = config;
      chrome.storage.local.set({ [STORAGE_KEY]: shortcuts }, resolve);
    });
  });
}

export function detectConflict(config: ShortcutConfig): Array<{ name: string }> {
  const conflicts: Array<{ name: string }> = [];

  for (const reserved of RESERVED_SHORTCUTS) {
    const configModifiers = config.modifiers || [];

    // Check if key matches
    if (reserved.key.toUpperCase() !== config.key.toUpperCase()) continue;

    // Check if modifiers match
    const reservedMods = reserved.modifiers.map(m => m.toLowerCase());
    const configMods = configModifiers.map(m => m.toLowerCase());

    const modsMatch =
      reservedMods.length === configMods.length &&
      reservedMods.every(m => configMods.includes(m));

    if (modsMatch) {
      conflicts.push({ name: reserved.name });
    }
  }

  return conflicts;
}

export async function registerShortcut(action: string, config: ShortcutConfig): Promise<void> {
  // Unregister existing first
  try {
    await unregisterShortcut(action);
  } catch {
    // Ignore if not registered
  }

  // Register with chrome.commands API
  const commandName = `xiaoxin-${action}`;

  return new Promise((resolve, reject) => {
    // Format for chrome.commands: Ctrl+Alt+Key -> Ctrl+Alt+Key
    const shortcutStr = formatShortcutForChrome(config);

    chrome.commands.update({
      name: commandName,
      shortcut: shortcutStr,
    }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

export async function unregisterShortcut(action: string): Promise<void> {
  const commandName = `xiaoxin-${action}`;

  return new Promise((resolve) => {
    chrome.commands.update(
      { name: commandName, shortcut: '' },
      () => resolve()
    );
  });
}

function formatShortcutForChrome(config: ShortcutConfig): string {
  const parts: string[] = [];

  if (config.modifiers) {
    for (const mod of config.modifiers) {
      if (mod === 'Ctrl') parts.push('Ctrl');
      else if (mod === 'Alt') parts.push('Alt');
      else if (mod === 'Shift') parts.push('Shift');
      else if (mod === 'Meta') parts.push('MacCtrl'); // Mac specific
    }
  }

  parts.push(config.key.toUpperCase());

  return parts.join('+');
}

export async function getAllShortcuts(): Promise<Record<string, ShortcutConfig>> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const shortcuts = result[STORAGE_KEY] || {};
      resolve({
        ...DEFAULT_SHORTCUTS,
        ...shortcuts,
      });
    });
  });
}

export async function resetToDefaults(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(STORAGE_KEY, resolve);
  });
}
