/**
 * Message passing types and utilities for extension communication
 */

export type MessageType = 'SAVE_BOOKMARK' | 'GET_BOOKMARKS' | 'SEARCH_BOOKMARKS' | 'DELETE_BOOKMARK';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  createdAt: number;
  domain: string;
}

export interface SaveBookmarkMessage {
  type: 'SAVE_BOOKMARK';
  payload: {
    url: string;
    title?: string;
  };
}

export interface GetBookmarksMessage {
  type: 'GET_BOOKMARKS';
  payload?: never;
}

export interface SearchBookmarksMessage {
  type: 'SEARCH_BOOKMARKS';
  payload: {
    query: string;
  };
}

export interface DeleteBookmarkMessage {
  type: 'DELETE_BOOKMARK';
  payload: {
    id: string;
  };
}

export type ExtensionMessage =
  | SaveBookmarkMessage
  | GetBookmarksMessage
  | SearchBookmarksMessage
  | DeleteBookmarkMessage;

export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates a message has the correct structure
 */
export function isValidMessage(message: unknown): message is ExtensionMessage {
  if (!message || typeof message !== 'object') return false;
  const msg = message as Record<string, unknown>;

  if (typeof msg.type !== 'string') return false;

  const validTypes: MessageType[] = ['SAVE_BOOKMARK', 'GET_BOOKMARKS', 'SEARCH_BOOKMARKS', 'DELETE_BOOKMARK'];
  if (!validTypes.includes(msg.type as MessageType)) return false;

  // Validate payload presence based on message type
  const requiresPayload = ['SAVE_BOOKMARK', 'SEARCH_BOOKMARKS', 'DELETE_BOOKMARK'];
  if (requiresPayload.includes(msg.type as MessageType) && !msg.payload) {
    return false;
  }

  // Validate no unexpected payload for GET_BOOKMARKS
  if (msg.type === 'GET_BOOKMARKS' && msg.payload !== undefined) {
    return false;
  }

  return true;
}

/**
 * Creates a SAVE_BOOKMARK message
 */
export function createSaveBookmarkMessage(url: string, title?: string): SaveBookmarkMessage {
  return {
    type: 'SAVE_BOOKMARK',
    payload: { url, title },
  };
}

/**
 * Creates a SEARCH_BOOKMARKS message
 */
export function createSearchBookmarksMessage(query: string): SearchBookmarksMessage {
  return {
    type: 'SEARCH_BOOKMARKS',
    payload: { query },
  };
}

/**
 * Creates a DELETE_BOOKMARK message
 */
export function createDeleteBookmarkMessage(id: string): DeleteBookmarkMessage {
  return {
    type: 'DELETE_BOOKMARK',
    payload: { id },
  };
}
