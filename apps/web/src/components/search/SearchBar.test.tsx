import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('搜尋...')).toBeDefined();
  });

  it('calls onSearch after debounce', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} debounceMs={100} />);

    fireEvent.change(screen.getByPlaceholderText('搜尋...'), { target: { value: 'test' } });

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('test');
    }, { timeout: 200 });
  });

  it('shows clear button when has value', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });
    expect(screen.getByText('✕')).toBeDefined();
  });

  it('clears input when clear button clicked', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });
    fireEvent.click(screen.getByText('✕'));

    expect(onSearch).toHaveBeenCalledWith('');
  });
});
