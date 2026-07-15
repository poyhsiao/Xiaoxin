import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

describe('LoginPage', () => {
  it('renders form elements', () => {
    render(<LoginPage />);
    expect(screen.getByRole('textbox')).toBeDefined();
    expect(screen.getByTestId('login-form')).toBeDefined();
    expect(screen.getByRole('button', { name: '登入' })).toBeDefined();
  });

  it('shows error on failed login', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: false } as Response);
    render(<LoginPage />);
    await userEvent.type(screen.getByRole('textbox'), 'a@b.com');
    await act(async () => {
      fireEvent.change(screen.getByTestId('login-form').querySelector('input[type="password"]')!, { target: { value: 'wrong' } });
    });
    await act(async () => { fireEvent.submit(screen.getByTestId('login-form')); });
    await waitFor(() => { expect(screen.getByText('登入失敗')).toBeDefined(); });
  });

  it('shows network error on exception', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));
    render(<LoginPage />);
    await userEvent.type(screen.getByRole('textbox'), 'a@b.com');
    await act(async () => {
      fireEvent.change(screen.getByTestId('login-form').querySelector('input[type="password"]')!, { target: { value: 'pass' } });
    });
    await act(async () => { fireEvent.submit(screen.getByTestId('login-form')); });
    await waitFor(() => { expect(screen.getByText('網路錯誤')).toBeDefined(); });
  });

  it('has register link', () => {
    render(<LoginPage />);
    expect(screen.getByText('還沒有帳號？')).toBeDefined();
  });
});
