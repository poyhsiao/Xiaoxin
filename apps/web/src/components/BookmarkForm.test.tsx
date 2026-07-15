import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkForm from './BookmarkForm';

vi.mock('@/lib/api', () => ({
  __esModule: true,
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
}));

describe('BookmarkForm', () => {
  it('renders URL input and submit button', () => {
    render(<BookmarkForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText('https://example.com')).toBeDefined();
    expect(screen.getByRole('button', { name: '儲存' })).toBeDefined();
  });

  it('renders cancel button when onCancel provided', () => {
    render(<BookmarkForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole('button', { name: '取消' })).toBeDefined();
  });

  it('hides cancel button when onCancel not provided', () => {
    render(<BookmarkForm onSubmit={vi.fn()} />);
    expect(screen.queryByRole('button', { name: '取消' })).toBeNull();
  });

  it('calls onCancel when cancel clicked', () => {
    const onCancel = vi.fn();
    render(<BookmarkForm onSubmit={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
