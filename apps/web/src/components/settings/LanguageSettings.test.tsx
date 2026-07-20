import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageSettings } from './LanguageSettings';

describe('LanguageSettings', () => {
  const mockOnLanguageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders language section', () => {
    render(<LanguageSettings onLanguageChange={mockOnLanguageChange} />);
    expect(screen.getByText(/選擇語言/)).toBeInTheDocument();
  });

  it('renders language buttons', () => {
    render(<LanguageSettings onLanguageChange={mockOnLanguageChange} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3); // 3 language options
  });

  it('renders date preview section', () => {
    render(<LanguageSettings onLanguageChange={mockOnLanguageChange} />);
    expect(screen.getByText(/現在日期/)).toBeInTheDocument();
  });
});
