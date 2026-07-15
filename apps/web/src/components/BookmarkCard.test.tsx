import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkCard from './BookmarkCard';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} data-testid="next-image" />,
}));

const bm = (overrides: Partial<Parameters<typeof BookmarkCard>[0]['bookmark']> = {}) => ({
  id: '1', url: 'https://example.com', ...overrides,
});

describe('BookmarkCard - title & URL', () => {
  it('renders title when provided', () => {
    render(<BookmarkCard bookmark={bm({ title: 'My Site' })} />);
    expect(screen.getByText('My Site')).toBeDefined();
  });

  it('shows URL when no title', () => {
    const { container } = render(<BookmarkCard bookmark={bm()} />);
    expect(container.textContent).toContain('https://example.com');
  });

  it('uses title over URL in anchor', () => {
    render(<BookmarkCard bookmark={bm({ title: 'My Site' })} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });
});

describe('BookmarkCard - description', () => {
  it('renders description when provided', () => {
    render(<BookmarkCard bookmark={bm({ description: 'A great site' })} />);
    expect(screen.getByText('A great site')).toBeDefined();
  });

  it('hides description when not provided', () => {
    const { container } = render(<BookmarkCard bookmark={bm()} />);
    expect(container.textContent).not.toContain('description');
  });
});

describe('BookmarkCard - tags', () => {
  it('renders multiple tags', () => {
    render(<BookmarkCard bookmark={bm({ tags: ['tech', 'news', 'react'] })} />);
    expect(screen.getByText('tech')).toBeDefined();
    expect(screen.getByText('news')).toBeDefined();
    expect(screen.getByText('react')).toBeDefined();
  });

  it('renders single tag', () => {
    render(<BookmarkCard bookmark={bm({ tags: ['work'] })} />);
    expect(screen.getByText('work')).toBeDefined();
  });
});

describe('BookmarkCard - actions', () => {
  it('shows edit/delete when handlers provided', () => {
    render(<BookmarkCard bookmark={bm()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('編輯')).toBeDefined();
    expect(screen.getByText('刪除')).toBeDefined();
  });

  it('hides actions when no handlers', () => {
    render(<BookmarkCard bookmark={bm()} />);
    expect(screen.queryByText('編輯')).toBeNull();
    expect(screen.queryByText('刪除')).toBeNull();
  });

  it('calls onEdit with bookmark object', () => {
    let captured: any = null;
    const handler = { onEdit: (b: any) => { captured = b; }, onDelete: vi.fn() };
    render(<BookmarkCard bookmark={bm({ title: 'Edit Me' })} {...handler} />);
    fireEvent.click(screen.getByText('編輯'));
    expect(captured.title).toBe('Edit Me');
  });

  it('calls onDelete with id', () => {
    let deleted = '';
    const handler = { onEdit: vi.fn(), onDelete: (id: string) => { deleted = id; } };
    render(<BookmarkCard bookmark={bm({ id: 'delete-me' })} {...handler} />);
    fireEvent.click(screen.getByText('刪除'));
    expect(deleted).toBe('delete-me');
  });
});

describe('BookmarkCard - URL link', () => {
  it('link has correct href', () => {
    render(<BookmarkCard bookmark={bm({ url: 'https://test.com/path' })} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://test.com/path');
  });

  it('link opens in new tab', () => {
    render(<BookmarkCard bookmark={bm()} />);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });
});
