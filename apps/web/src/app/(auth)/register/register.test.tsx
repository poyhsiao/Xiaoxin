import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

describe('RegisterPage', () => {
  it('renders form elements', () => {
    render(<RegisterPage />);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getByTestId('register-form')).toBeDefined();
    expect(screen.getByRole('button', { name: '註冊' })).toBeDefined();
  });

  it('shows error on failed registration', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: false } as Response);
    render(<RegisterPage />);
    const inputs = screen.getAllByRole('textbox');
    await userEvent.type(inputs[0], 'User');
    await userEvent.type(inputs[1], 'a@b.com');
    await act(async () => {
      fireEvent.change(screen.getByTestId('register-form').querySelector('input[type="password"]')!, { target: { value: 'pass123' } });
    });
    await act(async () => { fireEvent.submit(screen.getByTestId('register-form')); });
    await waitFor(() => { expect(screen.getByText('註冊失敗')).toBeDefined(); });
  });

  it('shows network error on exception', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));
    render(<RegisterPage />);
    const inputs = screen.getAllByRole('textbox');
    await userEvent.type(inputs[0], 'User');
    await userEvent.type(inputs[1], 'a@b.com');
    await act(async () => {
      fireEvent.change(screen.getByTestId('register-form').querySelector('input[type="password"]')!, { target: { value: 'pass' } });
    });
    await act(async () => { fireEvent.submit(screen.getByTestId('register-form')); });
    await waitFor(() => { expect(screen.getByText('網路錯誤')).toBeDefined(); });
  });

  it('has login link', () => {
    render(<RegisterPage />);
    expect(screen.getByText('已有帳號？')).toBeDefined();
  });
});
