import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

const mockRemoveItem = vi.fn();
Object.defineProperty(globalThis, 'localStorage', {
  value: { removeItem: mockRemoveItem },
  writable: true,
});

describe('Sidebar', () => {
  it('renders app name', () => {
    render(<Sidebar />);
    expect(screen.getByText('小新')).toBeDefined();
    expect(screen.getByText('書籤管理')).toBeDefined();
  });

  it('renders all nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText('儀表板')).toBeDefined();
    expect(screen.getByText('組織')).toBeDefined();
    expect(screen.getByText('書籤')).toBeDefined();
    expect(screen.getByText('設定')).toBeDefined();
  });

  it('renders logout button', () => {
    render(<Sidebar />);
    expect(screen.getByText('登出')).toBeDefined();
  });
});
