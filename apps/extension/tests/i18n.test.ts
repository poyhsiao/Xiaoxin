import { describe, it, expect } from 'vitest';
import {
  t,
  setLocale,
  getLocale,
  detectBrowserLocale,
  formatMessage,
  getAvailableLocales,
  type Locale
} from '../src/lib/i18n';

describe('i18n', () => {
  describe('detectBrowserLocale', () => {
    it('should detect zh-TW locale', () => {
      const locale = detectBrowserLocale('zh-TW');
      expect(locale).toBe('zh-TW');
    });

    it('should detect zh-CN locale', () => {
      const locale = detectBrowserLocale('zh-CN');
      expect(locale).toBe('zh-CN');
    });

    it('should fallback to en for unknown locale', () => {
      const locale = detectBrowserLocale('fr-FR');
      expect(locale).toBe('en');
    });
  });

  describe('setLocale and getLocale', () => {
    it('should set and get locale', () => {
      setLocale('zh-TW');
      expect(getLocale()).toBe('zh-TW');
    });

    it('should update translations after setting locale', () => {
      setLocale('zh-TW');
      expect(t('popup_title')).toBe('📚 小新書籤');
    });
  });

  describe('formatMessage', () => {
    it('should replace placeholders', () => {
      const result = formatMessage('Hello {{name}}!', { name: 'World' });
      expect(result).toBe('Hello World!');
    });

    it('should handle multiple placeholders', () => {
      const result = formatMessage('{{count}} items found', { count: 5 });
      expect(result).toBe('5 items found');
    });
  });

  describe('translations', () => {
    it('should have all required keys in zh-TW', () => {
      setLocale('zh-TW');
      expect(t('popup_title')).toBeDefined();
      expect(t('save_button')).toBeDefined();
      expect(t('search_placeholder')).toBeDefined();
      expect(t('delete_confirm')).toBeDefined();
    });

    it('should have all required keys in en', () => {
      setLocale('en');
      expect(t('popup_title')).toBeDefined();
      expect(t('save_button')).toBeDefined();
      expect(t('search_placeholder')).toBeDefined();
      expect(t('delete_confirm')).toBeDefined();
    });
  });

  describe('getAvailableLocales', () => {
    it('should return available locales', () => {
      const locales = getAvailableLocales();
      expect(locales).toContainEqual({ code: 'en', name: 'English' });
      expect(locales).toContainEqual({ code: 'zh-TW', name: '繁體中文' });
      expect(locales).toContainEqual({ code: 'zh-CN', name: '简体中文' });
    });
  });
});
