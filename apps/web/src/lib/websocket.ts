'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let connectionCallbacks: Array<(connected: boolean) => void> = [];

// ponytail: singleton socket instance, reconnect handled by socket.io built-in
export function connectWebSocket(url: string = process.env.NEXT_PUBLIC_API_WS_URL || 'http://localhost:3000'): void {
  if (socket?.connected) return;

  socket = io(url, {
    path: '/api/v1/sync',
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    connectionCallbacks.forEach(cb => cb(true));
  });

  socket.on('disconnect', () => {
    connectionCallbacks.forEach(cb => cb(false));
  });
}

export function disconnectWebSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function isConnected(): boolean {
  return socket?.connected ?? false;
}

export function onConnectionChange(callback: (connected: boolean) => void): () => void {
  connectionCallbacks.push(callback);
  return () => {
    connectionCallbacks = connectionCallbacks.filter(cb => cb !== callback);
  };
}

// Bookmark event handlers
export function onBookmarkCreated(callback: (bookmark: any) => void): void {
  socket?.on('bookmark:created', callback);
}

export function onBookmarkUpdated(callback: (bookmark: any) => void): void {
  socket?.on('bookmark:updated', callback);
}

export function onBookmarkDeleted(callback: (id: string) => void): void {
  socket?.on('bookmark:deleted', callback);
}

export function offBookmarkCreated(callback?: (bookmark: any) => void): void {
  if (callback) {
    socket?.off('bookmark:created', callback);
  } else {
    socket?.off('bookmark:created');
  }
}

export function offBookmarkUpdated(callback?: (bookmark: any) => void): void {
  if (callback) {
    socket?.off('bookmark:updated', callback);
  } else {
    socket?.off('bookmark:updated');
  }
}

export function offBookmarkDeleted(callback?: (id: string) => void): void {
  if (callback) {
    socket?.off('bookmark:deleted', callback);
  } else {
    socket?.off('bookmark:deleted');
  }
}

// Subscription management
export function subscribeToOrg(orgId: string): void {
  socket?.emit('subscribe:org', orgId);
}

export function unsubscribeFromOrg(orgId: string): void {
  socket?.emit('unsubscribe:org', orgId);
}

export function subscribeToSpace(spaceId: string): void {
  socket?.emit('subscribe:space', spaceId);
}

export function unsubscribeFromSpace(spaceId: string): void {
  socket?.emit('unsubscribe:space', spaceId);
}

export function subscribeToCollection(collectionId: string): void {
  socket?.emit('subscribe:collection', collectionId);
}

export function unsubscribeFromCollection(collectionId: string): void {
  socket?.emit('unsubscribe:collection', collectionId);
}

// Export socket instance for direct access if needed
export function getSocket(): Socket | null {
  return socket;
}
