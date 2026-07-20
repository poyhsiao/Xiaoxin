import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationPreferences } from './NotificationPreferences';

describe('NotificationPreferences', () => {
  const mockOnSave = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all toggle sections', () => {
    render(<NotificationPreferences onSave={mockOnSave} />);
    expect(screen.getByText('通知方式')).toBeInTheDocument();
    expect(screen.getByText('書籤事件')).toBeInTheDocument();
    expect(screen.getByText('成員事件')).toBeInTheDocument();
  });

  it('renders all toggle labels', () => {
    render(<NotificationPreferences onSave={mockOnSave} />);
    expect(screen.getByText('Email 通知')).toBeInTheDocument();
    expect(screen.getByText('推播通知')).toBeInTheDocument();
    expect(screen.getByText('新書籤加入')).toBeInTheDocument();
    expect(screen.getByText('書籤被編輯')).toBeInTheDocument();
  });

  it('calls onSave with current prefs', async () => {
    render(<NotificationPreferences onSave={mockOnSave} />);
    fireEvent.click(screen.getByRole('button', { name: '儲存設定' }));
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      emailEnabled: true,
      pushEnabled: true,
    }));
  });

  it('renders mute duration selector', () => {
    render(<NotificationPreferences onSave={mockOnSave} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
