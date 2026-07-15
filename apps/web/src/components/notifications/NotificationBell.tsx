'use client';

import { useState } from 'react';

export interface Notification {
  id: string;
  type: 'bookmark_added' | 'member_invited' | 'share_update' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

const notificationIcons: Record<Notification['type'], string> = {
  bookmark_added: '🔖',
  member_invited: '👤',
  share_update: '🔗',
  system: '⚙️',
};

export default function NotificationBell({ notifications, onMarkRead, onMarkAllRead }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold">通知</h3>
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  onClick={onMarkAllRead}
                  className="text-sm text-primary hover:underline"
                >
                  全部標記為已讀
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-center text-gray-500">沒有通知</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                      !n.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => onMarkRead?.(n.id)}
                  >
                    <div className="flex gap-3">
                      <span className="text-lg">{notificationIcons[n.type]}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.createdAt}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
