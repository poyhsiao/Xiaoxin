import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MemberInvite from './MemberInvite';

// Ponytail: hoisted mock - must not have top-level variables in factory
vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from '@/lib/api';

describe('MemberInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and role inputs', () => {
    render(<MemberInvite organizationId="org-1" />);

    expect(screen.getByPlaceholderText('user@example.com')).toBeDefined();
    expect(screen.getByRole('button', { name: '發送邀請' })).toBeDefined();
    expect(screen.getByText('生成邀請連結')).toBeDefined();
  });

  it('allows selecting role', () => {
    render(<MemberInvite organizationId="org-1" />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('EDITOR');

    fireEvent.change(select, { target: { value: 'ADMIN' } });
    expect(select.value).toBe('ADMIN');
  });

  it('disables button when email is empty', () => {
    render(<MemberInvite organizationId="org-1" />);

    const button = screen.getByRole('button', { name: '發送邀請' });
    expect(button).toBeDisabled();
  });

  it('enables button when email is entered', async () => {
    render(<MemberInvite organizationId="org-1" />);

    const input = screen.getByPlaceholderText('user@example.com');
    await fireEvent.change(input, { target: { value: 'test@example.com' } });

    const button = screen.getByRole('button', { name: '發送邀請' });
    expect(button).not.toBeDisabled();
  });

  it('calls API with correct data when submitting', async () => {
    (api.post as any).mockResolvedValue({ data: {} });
    render(<MemberInvite organizationId="org-1" />);

    const input = screen.getByPlaceholderText('user@example.com');
    await fireEvent.change(input, { target: { value: 'test@example.com' } });

    const button = screen.getByRole('button', { name: '發送邀請' });
    await fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/organizations/org-1/invite', {
        email: 'test@example.com',
        role: 'EDITOR',
      });
    });
  });

  it('generates invite link', async () => {
    (api.post as any).mockResolvedValue({ data: { link: 'https://xiaoxin.app/invite/abc123' } });
    render(<MemberInvite organizationId="org-1" />);

    const button = screen.getByText('生成邀請連結');
    await fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://xiaoxin.app/invite/abc123')).toBeDefined();
    });
  });

  it('shows error message on API failure', async () => {
    (api.post as any).mockRejectedValue({ response: { data: { message: '邀請失敗' } } });
    render(<MemberInvite organizationId="org-1" />);

    const input = screen.getByPlaceholderText('user@example.com');
    await fireEvent.change(input, { target: { value: 'test@example.com' } });

    const button = screen.getByRole('button', { name: '發送邀請' });
    await fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('邀請失敗')).toBeDefined();
    });
  });
});
