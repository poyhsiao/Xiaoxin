import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CollectionList, { Collection } from './CollectionList';

describe('CollectionList', () => {
  const mockCollections: Collection[] = [
    { id: '1', name: 'Tech', slug: 'tech', bookmarkCount: 15 },
    { id: '2', name: 'Design', slug: 'design', bookmarkCount: 8 },
  ];

  it('renders collection names', () => {
    render(<CollectionList collections={mockCollections} />);
    expect(screen.getByText('Tech')).toBeDefined();
    expect(screen.getByText('Design')).toBeDefined();
  });

  it('shows bookmark counts', () => {
    render(<CollectionList collections={mockCollections} />);
    expect(screen.getByText('15')).toBeDefined();
    expect(screen.getByText('8')).toBeDefined();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<CollectionList collections={mockCollections} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Tech'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('shows create button when onCreate provided', () => {
    render(<CollectionList collections={mockCollections} onCreate={vi.fn()} />);
    expect(screen.getByText('+ 建立集合')).toBeDefined();
  });

  it('calls onCreate with form data', () => {
    const onCreate = vi.fn();
    render(<CollectionList collections={[]} onCreate={onCreate} />);

    fireEvent.click(screen.getByText('+ 建立集合'));
    fireEvent.change(screen.getByPlaceholderText('集合名稱'), { target: { value: 'New Collection' } });
    fireEvent.click(screen.getByText('建立'));

    expect(onCreate).toHaveBeenCalledWith('New Collection', undefined);
  });
});
