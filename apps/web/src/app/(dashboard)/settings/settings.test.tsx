import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SettingsPage from './page';

describe('SettingsPage', () => {
  it('renders heading', () => {
    render(<SettingsPage />);
    expect(screen.getByText('設定')).toBeDefined();
  });

  it('renders personal info section', () => {
    render(<SettingsPage />);
    expect(screen.getByText('個人資訊')).toBeDefined();
  });

  it('renders inputs', () => {
    render(<SettingsPage />);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('email input is disabled', () => {
    render(<SettingsPage />);
    const emailInput = screen.getAllByRole('textbox')[1] as HTMLInputElement;
    expect(emailInput).toHaveAttribute('disabled');
  });

  it('renders save button', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('button', { name: '儲存' })).toBeDefined();
  });
});
