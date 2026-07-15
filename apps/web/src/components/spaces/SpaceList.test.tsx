import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SpaceList, { Space } from './SpaceList';

describe('SpaceList', () => {
  const mockSpaces: Space[] = [
    { id: '1', name: 'Work', slug: 'work', bookmarkCount: 10 },
    { id: '2', name: 'Personal', slug: 'personal', bookmarkCount: 5 },
  ];

  it('renders space names', () => {
    render(<SpaceList spaces={mockSpaces} />);
    expect(screen.getByText('Work')).toBeDefined();
    expect(screen.getByText('Personal')).toBeDefined();
  });

  it('shows bookmark counts', () => {
    render(<SpaceList spaces={mockSpaces} />);
    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<SpaceList spaces={mockSpaces} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Work'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('shows create button when onCreate provided', () => {
    render(<SpaceList spaces={mockSpaces} onCreate={vi.fn()} />);
    expect(screen.getByText('+ 建立空間')).toBeDefined();
  });

  it('shows create form when create button clicked', () => {
    render(<SpaceList spaces={[]} onCreate={vi.fn()} />);
    fireEvent.click(screen.getByText('+ 建立空間'));
    expect(screen.getByPlaceholderText('空間名稱')).toBeDefined();
  });

  it('calls onCreate with form data', () => {
    const onCreate = vi.fn();
    render(<SpaceList spaces={[]} onCreate={onCreate} />);

    fireEvent.click(screen.getByText('+ 建立空間'));
    fireEvent.change(screen.getByPlaceholderText('空間名稱'), { target: { value: 'New Space' } });
    fireEvent.click(screen.getByText('建立'));

    expect(onCreate).toHaveBeenCalledWith('New Space', undefined);
  });

  it('shows empty state', () => {
    render(<SpaceList spaces={[]} />);
    expect(screen.queryByText('Work')).toBeNull();
  });
});
