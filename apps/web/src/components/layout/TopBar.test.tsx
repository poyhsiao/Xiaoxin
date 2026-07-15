import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from './TopBar';

const mockStorage = { removeItem: vi.fn() };
Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  writable: true,
});

describe('TopBar', () => {
  beforeEach(() => { mockStorage.removeItem.mockClear(); });

  it('renders search input', () => {
    render(<TopBar />);
    expect(screen.getByPlaceholderText('搜尋書籤...')).toBeDefined();
  });

  it('renders notification bell', () => {
    render(<TopBar />);
    expect(screen.getByText('🔔')).toBeDefined();
  });

  it('toggles dropdown on user button click', () => {
    render(<TopBar />);
    const userBtn = screen.getByText('U').closest('button');
    fireEvent.click(userBtn!);
    expect(screen.getByText('個人設定')).toBeDefined();
  });

  it('calls localStorage.removeItem on logout', () => {
    render(<TopBar />);
    const userBtn = screen.getByText('U').closest('button');
    fireEvent.click(userBtn!);
    fireEvent.click(screen.getByText('登出'));
    expect(mockStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
