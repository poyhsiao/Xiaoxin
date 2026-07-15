import { describe, it, expect } from 'vitest';
import {
  isValidMessage,
  createSaveBookmarkMessage,
  createSearchBookmarksMessage,
  createDeleteBookmarkMessage,
  type ExtensionMessage,
} from '../src/messages';

describe('Message Passing', () => {
  describe('isValidMessage', () => {
    it('should return true for valid SAVE_BOOKMARK message', () => {
      const msg: ExtensionMessage = { type: 'SAVE_BOOKMARK', payload: { url: 'https://example.com' } };
      expect(isValidMessage(msg)).toBe(true);
    });

    it('should return true for valid GET_BOOKMARKS message', () => {
      const msg: ExtensionMessage = { type: 'GET_BOOKMARKS' };
      expect(isValidMessage(msg)).toBe(true);
    });

    it('should return true for valid SEARCH_BOOKMARKS message', () => {
      const msg: ExtensionMessage = { type: 'SEARCH_BOOKMARKS', payload: { query: 'test' } };
      expect(isValidMessage(msg)).toBe(true);
    });

    it('should return true for valid DELETE_BOOKMARK message', () => {
      const msg: ExtensionMessage = { type: 'DELETE_BOOKMARK', payload: { id: '123' } };
      expect(isValidMessage(msg)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidMessage(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isValidMessage('string' as unknown as ExtensionMessage)).toBe(false);
    });

    it('should return false for missing type', () => {
      expect(isValidMessage({ payload: {} } as unknown as ExtensionMessage)).toBe(false);
    });

    it('should return false for invalid type', () => {
      expect(isValidMessage({ type: 'INVALID_TYPE' } as unknown as ExtensionMessage)).toBe(false);
    });

    it('should return false for message requiring payload without it', () => {
      expect(isValidMessage({ type: 'SAVE_BOOKMARK' } as unknown as ExtensionMessage)).toBe(false);
    });

    it('should return false for message with unexpected payload', () => {
      const msg = { type: 'GET_BOOKMARKS', payload: { something: true } };
      expect(isValidMessage(msg as unknown as ExtensionMessage)).toBe(false);
    });
  });

  describe('createSaveBookmarkMessage', () => {
    it('should create message with url only', () => {
      const msg = createSaveBookmarkMessage('https://example.com');
      expect(msg).toEqual({
        type: 'SAVE_BOOKMARK',
        payload: { url: 'https://example.com' },
      });
    });

    it('should create message with url and title', () => {
      const msg = createSaveBookmarkMessage('https://example.com', 'Example Site');
      expect(msg).toEqual({
        type: 'SAVE_BOOKMARK',
        payload: { url: 'https://example.com', title: 'Example Site' },
      });
    });
  });

  describe('createSearchBookmarksMessage', () => {
    it('should create message with query', () => {
      const msg = createSearchBookmarksMessage('test query');
      expect(msg).toEqual({
        type: 'SEARCH_BOOKMARKS',
        payload: { query: 'test query' },
      });
    });
  });

  describe('createDeleteBookmarkMessage', () => {
    it('should create message with id', () => {
      const msg = createDeleteBookmarkMessage('bm_123');
      expect(msg).toEqual({
        type: 'DELETE_BOOKMARK',
        payload: { id: 'bm_123' },
      });
    });
  });
});
