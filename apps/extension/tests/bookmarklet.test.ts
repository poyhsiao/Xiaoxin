import { describe, it, expect } from 'vitest';
import { generateBookmarkletUrl, parseBookmarkletParams, isBookmarkletUrl, createBookmarkletHtml } from '../src/bookmarklet';

describe('Bookmarklet', () => {
  describe('generateBookmarkletUrl', () => {
    it('should generate a basic bookmarklet URL', () => {
      const url = generateBookmarkletUrl('https://xiaoxin.app');
      expect(url).toContain('javascript:');
    });

    it('should return javascript prefix', () => {
      const url = generateBookmarkletUrl('https://xiaoxin.app');
      expect(url.startsWith('javascript:')).toBe(true);
    });
  });

  describe('isBookmarkletUrl', () => {
    it('should return true for bookmarklet URLs', () => {
      expect(isBookmarkletUrl('javascript:void(0)')).toBe(true);
      expect(isBookmarkletUrl('javascript:alert(1)')).toBe(true);
    });

    it('should return false for regular URLs', () => {
      expect(isBookmarkletUrl('https://example.com')).toBe(false);
      expect(isBookmarkletUrl('http://example.com')).toBe(false);
    });
  });

  describe('parseBookmarkletParams', () => {
    it('should parse bookmarklet URL parameters', () => {
      const result = parseBookmarkletParams('https://xiaoxin.app/api/bookmarklet?url=test&title=hello');
      expect(result?.url).toBe('test');
      expect(result?.title).toBe('hello');
    });

    it('should return null for invalid URLs', () => {
      expect(parseBookmarkletParams('not-a-url')).toBeNull();
    });
  });

  describe('createBookmarkletHtml', () => {
    it('should create HTML with bookmarklet link', () => {
      const html = createBookmarkletHtml('https://xiaoxin.app');
      expect(html).toContain('xiaoxin');
      expect(html).toContain('bookmarklet');
    });
  });
});
