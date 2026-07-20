import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SecuritySettings } from './SecuritySettings';

const mockSessions = [
  { id: '1', device: 'Chrome on Mac', location: '台北', lastActive: '刚刚', isCurrent: true },
  { id: '2', device: 'Safari on iPhone', location: '台北', lastActive: '2 小時前', isCurrent: false },
];

describe('SecuritySettings', () => {
  const mockOnEnable2FA = vi.fn().mockResolvedValue(undefined);
  const mockOnRevokeSession = vi.fn().mockResolvedValue(undefined);
  const mockOnRevokeAllSessions = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sessions list', () => {
    render(
      <SecuritySettings
        sessions={mockSessions}
        onEnable2FA={mockOnEnable2FA}
        onRevokeSession={mockOnRevokeSession}
        onRevokeAllSessions={mockOnRevokeAllSessions}
      />
    );
    expect(screen.getByText('Chrome on Mac')).toBeInTheDocument();
    expect(screen.getByText('Safari on iPhone')).toBeInTheDocument();
  });

  it('shows current session badge', () => {
    render(
      <SecuritySettings
        sessions={mockSessions}
        onEnable2FA={mockOnEnable2FA}
      />
    );
    expect(screen.getByText('當前')).toBeInTheDocument();
  });

  it('calls onEnable2FA when button clicked', () => {
    render(
      <SecuritySettings
        twoFactorEnabled={false}
        onEnable2FA={mockOnEnable2FA}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '啟用' }));
    expect(mockOnEnable2FA).toHaveBeenCalled();
  });

  it('calls onRevokeSession when revoke clicked', () => {
    render(
      <SecuritySettings
        sessions={mockSessions}
        onRevokeSession={mockOnRevokeSession}
      />
    );
    fireEvent.click(screen.getByText('撤銷'));
    expect(mockOnRevokeSession).toHaveBeenCalledWith('2');
  });

  it('shows revoke all button when multiple sessions', () => {
    render(
      <SecuritySettings
        sessions={mockSessions}
        onRevokeAllSessions={mockOnRevokeAllSessions}
      />
    );
    expect(screen.getByText('撤銷所有其他')).toBeInTheDocument();
  });
});
