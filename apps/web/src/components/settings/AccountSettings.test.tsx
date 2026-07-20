import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountSettings } from './AccountSettings';

describe('AccountSettings', () => {
  const mockOnExportData = vi.fn().mockResolvedValue(undefined);
  const mockOnDeleteAccount = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders export section', () => {
    render(
      <AccountSettings
        onExportData={mockOnExportData}
        onDeleteAccount={mockOnDeleteAccount}
      />
    );
    expect(screen.getByText('匯出書籤資料')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '匯出' })).toBeInTheDocument();
  });

  it('calls onExportData when export clicked', () => {
    render(
      <AccountSettings onExportData={mockOnExportData} />
    );
    fireEvent.click(screen.getByRole('button', { name: '匯出' }));
    expect(mockOnExportData).toHaveBeenCalled();
  });

  it('opens confirmation modal when delete clicked', () => {
    render(
      <AccountSettings onDeleteAccount={mockOnDeleteAccount} />
    );
    // Click the delete account button in the danger zone section
    const deleteButtons = screen.getAllByRole('button', { name: '刪除帳戶' });
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText('確認刪除帳戶')).toBeInTheDocument();
  });

  it('requires confirmation text to enable delete', () => {
    render(
      <AccountSettings onDeleteAccount={mockOnDeleteAccount} />
    );
    const deleteButtons = screen.getAllByRole('button', { name: '刪除帳戶' });
    fireEvent.click(deleteButtons[0]);

    const input = screen.getByPlaceholderText('刪除帳戶');
    fireEvent.change(input, { target: { value: 'wrong' } });
    expect(screen.getByRole('button', { name: '確認刪除' })).toBeDisabled();
  });

  it('enables delete button when confirmation matches', () => {
    render(
      <AccountSettings onDeleteAccount={mockOnDeleteAccount} />
    );
    const deleteButtons = screen.getAllByRole('button', { name: '刪除帳戶' });
    fireEvent.click(deleteButtons[0]);

    const input = screen.getByPlaceholderText('刪除帳戶');
    fireEvent.change(input, { target: { value: '刪除帳戶' } });
    expect(screen.getByRole('button', { name: '確認刪除' })).toBeEnabled();
  });

  it('calls onDeleteAccount when confirmed', () => {
    render(
      <AccountSettings onDeleteAccount={mockOnDeleteAccount} />
    );
    const deleteButtons = screen.getAllByRole('button', { name: '刪除帳戶' });
    fireEvent.click(deleteButtons[0]);

    const input = screen.getByPlaceholderText('刪除帳戶');
    fireEvent.change(input, { target: { value: '刪除帳戶' } });
    fireEvent.click(screen.getByRole('button', { name: '確認刪除' }));
    expect(mockOnDeleteAccount).toHaveBeenCalled();
  });
});
