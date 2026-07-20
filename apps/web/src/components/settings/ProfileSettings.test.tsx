import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileSettings } from './ProfileSettings';

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatarUrl: null,
  bio: '',
};

const mockOnUpdate = vi.fn().mockResolvedValue(undefined);

describe('ProfileSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile form correctly', () => {
    render(<ProfileSettings user={mockUser} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('個人資料設定')).toBeInTheDocument();
    expect(screen.getByLabelText('名稱')).toHaveValue('Test User');
  });

  it('validates empty name', async () => {
    render(<ProfileSettings user={mockUser} onUpdate={mockOnUpdate} />);
    const nameInput = screen.getByLabelText('名稱');
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: '儲存' }));
    expect(await screen.findByText('名稱不能為空')).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('validates name length (2-50 chars)', async () => {
    render(<ProfileSettings user={mockUser} onUpdate={mockOnUpdate} />);
    const nameInput = screen.getByLabelText('名稱');
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.click(screen.getByRole('button', { name: '儲存' }));
    expect(await screen.findByText('名稱需為 2-50 字元')).toBeInTheDocument();
  });

  it('calls onUpdate with valid data', async () => {
    render(<ProfileSettings user={mockUser} onUpdate={mockOnUpdate} />);
    const nameInput = screen.getByLabelText('名稱');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.click(screen.getByRole('button', { name: '儲存' }));
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({ name: 'New Name', bio: '' });
    });
  });

  it('displays bio character count', async () => {
    render(<ProfileSettings user={mockUser} onUpdate={mockOnUpdate} />);
    const bioInput = screen.getByLabelText(/個人簡介/);
    expect(screen.getByText('0/200')).toBeInTheDocument();
  });
});
