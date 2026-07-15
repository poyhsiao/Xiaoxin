import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkList from './BookmarkList';

const make = (id: string, title: string) => ({ id, url: `https://${id}.com`, title });

describe('BookmarkList', () => {
  it('renders empty state message', () => {
    render(<BookmarkList bookmarks={[]} />);
    expect(screen.getByText('沒有書籤')).toBeDefined();
  });

  it('renders single bookmark', () => {
    render(<BookmarkList bookmarks={[make('1', 'Only')]} />);
    expect(screen.getByText('Only')).toBeDefined();
  });

  it('renders multiple bookmarks', () => {
    render(<BookmarkList bookmarks={[make('1', 'A'), make('2', 'B'), make('3', 'C')]} />);
    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();
  });

  it('calls onEdit with bookmark when edit clicked', () => {
    let edited: any = null;
    render(<BookmarkList bookmarks={[make('5', 'EditMe')]} onEdit={(b) => { edited = b; }} onDelete={() => {}} />);
    screen.getAllByRole('button', { name: '編輯' })[0].click();
    expect(edited?.id).toBe('5');
  });

  it('calls onDelete with id when delete clicked', () => {
    let deleted = '';
    render(<BookmarkList bookmarks={[make('7', 'DelMe')]} onEdit={() => {}} onDelete={(id) => { deleted = id; }} />);
    screen.getAllByRole('button', { name: '刪除' })[0].click();
    expect(deleted).toBe('7');
  });

  it('renders bookmark with url column', () => {
    render(<BookmarkList bookmarks={[make('x', 'UrlTest')]} />);
    expect(screen.getByText('https://x.com')).toBeDefined();
  });
});
