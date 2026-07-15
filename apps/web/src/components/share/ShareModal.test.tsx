import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareModal from './ShareModal';

// Mock API
vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('ShareModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with resource name', () => {
    render(<ShareModal type="collection" resourceId="col-1" resourceName="My Collection" onClose={vi.fn()} />);

    expect(screen.getByText('分享 My Collection')).toBeDefined();
  });

  it('shows permission select', () => {
    render(<ShareModal type="bookmark" resourceId="bm-1" resourceName="Test Bookmark" onClose={vi.fn()} />);

    expect(screen.getByRole('combobox')).toBeDefined();
    expect(screen.getByText('唯讀')).toBeDefined();
  });

  it('creates share link when button clicked', async () => {
    (api.post as any).mockResolvedValue({ data: { link: 'https://xiaoxin.app/share/abc123' } });

    render(<ShareModal type="collection" resourceId="col-1" resourceName="My Collection" onClose={vi.fn()} />);

    fireEvent.click(screen.getByText('生成分享連結'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/collections/col-1/share', { permission: 'VIEWER' });
    });
  });

  it('displays share link after creation', async () => {
    (api.post as any).mockResolvedValue({ data: { link: 'https://xiaoxin.app/share/abc123' } });

    render(<ShareModal type="collection" resourceId="col-1" resourceName="My Collection" onClose={vi.fn()} />);

    fireEvent.click(screen.getByText('生成分享連結'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://xiaoxin.app/share/abc123')).toBeDefined();
    });
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<ShareModal type="bookmark" resourceId="bm-1" resourceName="Test" onClose={onClose} />);

    fireEvent.click(screen.getByText('✕'));
    expect(onClose).toHaveBeenCalled();
  });
});
