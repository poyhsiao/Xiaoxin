/**
 * i18n - Internationalization support for Xiaoxin extension
 */

export type Locale = 'en' | 'zh-TW' | 'zh-CN';

export interface TranslationMap {
  [key: string]: string | TranslationMap;
}

const translations: Record<Locale, TranslationMap> = {
  en: {
    popup_title: 'Xiaoxin Bookmarks',
    save_button: 'Save',
    saving: 'Saving...',
    search_placeholder: 'Search...',
    delete_confirm: 'Delete this bookmark?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    edit: 'Edit',
    delete: 'Delete',
    collection: 'Collection',
    no_bookmarks: 'No bookmarks yet',
    load_error: 'Failed to load',
    url_placeholder: 'Enter URL...',
    title_placeholder: 'Title',
    description_placeholder: 'Description (optional)',
    settings: 'Settings',
    language: 'Language',
    shortcut_save: 'Save bookmark',
    shortcut_sidebar: 'Open sidebar',
    shortcut_search: 'Search bookmarks',
    conflict_warning: 'This shortcut conflicts with:',
    saved_success: 'Bookmark saved!',
    deleted_success: 'Bookmark deleted',
    undo: 'Undo',
  },
  'zh-TW': {
    popup_title: '📚 小新書籤',
    save_button: '儲存',
    saving: '儲存中...',
    search_placeholder: '搜尋...',
    delete_confirm: '確定刪除這個書籤？',
    cancel: '取消',
    confirm: '確認',
    edit: '編輯',
    delete: '刪除',
    collection: '集合',
    no_bookmarks: '尚無書籤',
    load_error: '載入失敗',
    url_placeholder: '輸入網址...',
    title_placeholder: '標題',
    description_placeholder: '描述（選填）',
    settings: '設定',
    language: '語言',
    shortcut_save: '儲存書籤',
    shortcut_sidebar: '開啟側邊欄',
    shortcut_search: '搜尋書籤',
    conflict_warning: '此快捷鍵與以下功能衝突：',
    saved_success: '書籤已儲存！',
    deleted_success: '書籤已刪除',
    undo: '復原',
  },
  'zh-CN': {
    popup_title: '📚 小新书签',
    save_button: '保存',
    saving: '保存中...',
    search_placeholder: '搜索...',
    delete_confirm: '确定删除这个书签？',
    cancel: '取消',
    confirm: '确认',
    edit: '编辑',
    delete: '删除',
    collection: '集合',
    no_bookmarks: '尚无书签',
    load_error: '载入失败',
    url_placeholder: '输入网址...',
    title_placeholder: '标题',
    description_placeholder: '描述（选填）',
    settings: '设置',
    language: '语言',
    shortcut_save: '保存书签',
    shortcut_sidebar: '开启侧边栏',
    shortcut_search: '搜索书签',
    conflict_warning: '此快捷键与以下功能冲突：',
    saved_success: '书签已保存！',
    deleted_success: '书签已删除',
    undo: '撤销',
  },
};

let currentLocale: Locale = 'en';

export function detectBrowserLocale(navigatorLanguage?: string): Locale {
  const lang = (navigatorLanguage || 'en').toLowerCase();

  if (lang.startsWith('zh-tw') || lang.startsWith('zh-hk')) {
    return 'zh-TW';
  }
  if (lang.startsWith('zh')) {
    return 'zh-CN';
  }
  if (lang.startsWith('en')) {
    return 'en';
  }

  return 'en';
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: TranslationMap | string = translations[currentLocale];

  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = value[k] as TranslationMap | string;
    } else {
      // Fallback to English
      value = translations['en'];
      for (const ek of keys) {
        if (typeof value === 'object' && value !== null && ek in value) {
          value = value[ek] as TranslationMap | string;
        } else {
          return key;
        }
      }
      break;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  if (params) {
    return formatMessage(value, params);
  }

  return value;
}

export function formatMessage(template: string, params: Record<string, string | number>): string {
  let result = template;

  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }

  return result;
}

export async function initLocale(): Promise<void> {
  // Try to get saved preference
  const result = await browser.storage.local.get('locale');
  if (result.locale) {
    currentLocale = result.locale as Locale;
  } else {
    // Detect from browser
    currentLocale = detectBrowserLocale(navigator.language);
  }
}

export async function saveLocale(locale: Locale): Promise<void> {
  currentLocale = locale;
  await browser.storage.local.set({ locale });
}

export function getAvailableLocales(): Array<{ code: Locale; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'zh-CN', name: '简体中文' },
  ];
}
