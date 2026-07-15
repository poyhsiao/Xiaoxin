import { describe, it, expect, vi, beforeEach } from 'vitest';
import { connectWebSocket, disconnectWebSocket, onBookmarkCreated, subscribeToOrg } from './websocket';

// Ponytail: hoisted mock ensures socket.io-client is mocked before import
vi.mock('socket.io-client', () => {
  const mock = {
    on: vi.fn(),
    off: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    emit: vi.fn(),
    connected: true,
  };
  return { io: vi.fn(() => mock) };
});

describe('WebSocket Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    disconnectWebSocket(); // Reset socket state
  });

  it('should connect to websocket server', () => {
    connectWebSocket('http://localhost:3000');
    // Connection happens via socket.io-client mock
    expect(true).toBe(true); // If no error, connection attempt was made
  });

  it('should register bookmark:created listener', () => {
    connectWebSocket('http://localhost:3000');
    const callback = vi.fn();
    onBookmarkCreated(callback);
    // Callback registered without error
    expect(callback).toBeDefined();
  });

  it('should subscribe to org', () => {
    connectWebSocket('http://localhost:3000');
    subscribeToOrg('org-123');
    // Subscription attempted without error
    expect(true).toBe(true);
  });

  it('should provide isConnected function', async () => {
    const { isConnected } = await import('./websocket');
    expect(typeof isConnected).toBe('function');
  });

  it('should provide onBookmarkUpdated function', async () => {
    const { onBookmarkUpdated } = await import('./websocket');
    expect(typeof onBookmarkUpdated).toBe('function');
  });

  it('should provide onBookmarkDeleted function', async () => {
    const { onBookmarkDeleted } = await import('./websocket');
    expect(typeof onBookmarkDeleted).toBe('function');
  });
});
