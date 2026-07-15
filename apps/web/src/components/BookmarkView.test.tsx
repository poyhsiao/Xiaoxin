import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkView from './BookmarkView';

describe('BookmarkView', () => {
  it('renders card and list toggle buttons', () => {
    render(<BookmarkView viewMode="card" onViewModeChange={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('renders card button with active state', () => {
    render(<BookmarkView viewMode="card" onViewModeChange={() => {}} />);
    const btns = screen.getAllByRole('button');
    expect(btns[0]).toHaveAttribute('title', '卡片視圖');
    expect(btns[1]).toHaveAttribute('title', '清單視圖');
  });

  it('renders list button with active state', () => {
    render(<BookmarkView viewMode="list" onViewModeChange={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('shows item count when provided', () => {
    render(<BookmarkView viewMode="card" onViewModeChange={() => {}} itemCount={5} />);
    expect(screen.getByText('5 個書籤')).toBeDefined();
  });

  it('does not show item count when undefined', () => {
    render(<BookmarkView viewMode="card" onViewModeChange={() => {}} />);
    expect(screen.queryByText('個書籤')).toBeNull();
  });

  it('shows zero item count', () => {
    render(<BookmarkView viewMode="card" onViewModeChange={() => {}} itemCount={0} />);
    expect(screen.getByText('0 個書籤')).toBeDefined();
  });

  it('calls onViewModeChange with "card" when card button clicked', () => {
    let mode: string = '';
    render(<BookmarkView viewMode="list" onViewModeChange={(m) => { mode = m; }} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(mode).toBe('card');
  });

  it('calls onViewModeChange with "list" when list button clicked', () => {
    let mode: string = '';
    render(<BookmarkView viewMode="card" onViewModeChange={(m) => { mode = m; }} />);
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(mode).toBe('list');
  });
});
