import { describe, it, expect } from 'vitest';
import {
  createEditMessage,
  parseEditMessage,
  isEditMessage,
  type UpdateBookmarkMessage
} from '../src/messages';

describe('Bookmark Edit', () => {
  describe('createEditMessage', () => {
    it('should create UPDATE_BOOKMARK message', () => {
      const msg = createEditMessage('bm_123', {
        title: 'Updated Title',
        url: 'https://newurl.com'
      });
      expect(msg.type).toBe('UPDATE_BOOKMARK');
      expect(msg.payload.id).toBe('bm_123');
      expect(msg.payload.title).toBe('Updated Title');
      expect(msg.payload.url).toBe('https://newurl.com');
    });
  });

  describe('parseEditMessage', () => {
    it('should parse UPDATE_BOOKMARK message', () => {
      const msg: UpdateBookmarkMessage = {
        type: 'UPDATE_BOOKMARK',
        payload: {
          id: 'bm_456',
          title: 'Parsed Title'
        }
      };
      const parsed = parseEditMessage(msg);
      expect(parsed.id).toBe('bm_456');
      expect(parsed.title).toBe('Parsed Title');
    });
  });

  describe('isEditMessage', () => {
    it('should return true for edit messages', () => {
      expect(isEditMessage({ type: 'UPDATE_BOOKMARK', payload: { id: '1' } })).toBe(true);
    });

    it('should return false for non-edit messages', () => {
      expect(isEditMessage({ type: 'GET_BOOKMARKS' })).toBe(false);
      expect(isEditMessage({ type: 'SAVE_BOOKMARK', payload: { url: 'x' } })).toBe(false);
    });
  });
});
