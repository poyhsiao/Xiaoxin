import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationBell from './NotificationBell';

describe('NotificationBell', () => {
  const mockNotifications = [
    { id: '1', type: 'bookmark_added' as const, title: '新書籤', message: '已添加新書籤', read: false, createdAt: '1分鐘前' },
    { id: '2', type: 'member_invited' as const, title: '新成員', message: 'Bob 已加入', read: true, createdAt: '5分鐘前' },
  ];

  it('shows unread count', () => {
    render(<NotificationBell notifications={mockNotifications} />);
    expect(screen.getByText('1')).toBeDefined(); // 1 unread
  });

  it('opens dropdown when clicked', () => {
    render(<NotificationBell notifications={mockNotifications} />);
    fireEvent.click(screen.getByText('🔔'));
    expect(screen.getByText('通知')).toBeDefined();
  });

  it('shows all notifications in dropdown', () => {
    render(<NotificationBell notifications={mockNotifications} />);
    fireEvent.click(screen.getByText('🔔'));
    expect(screen.getByText('新書籤')).toBeDefined();
    expect(screen.getByText('新成員')).toBeDefined();
  });

  it('shows empty state', () => {
    render(<NotificationBell notifications={[]} />);
    fireEvent.click(screen.getByText('🔔'));
    expect(screen.getByText('沒有通知')).toBeDefined();
  });
});
