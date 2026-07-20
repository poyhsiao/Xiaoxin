import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppearanceSettings } from './AppearanceSettings';

describe('AppearanceSettings', () => {
  const mockOnThemeChange = vi.fn();
  const mockOnViewModeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders theme section', () => {
    render(
      <AppearanceSettings
        onThemeChange={mockOnThemeChange}
        onViewModeChange={mockOnViewModeChange}
      />
    );
    expect(screen.getByText('外觀設定')).toBeInTheDocument();
  });

  it('renders view mode section', () => {
    render(
      <AppearanceSettings
        onThemeChange={mockOnThemeChange}
        onViewModeChange={mockOnViewModeChange}
      />
    );
    expect(screen.getByText(/書籤檢視/)).toBeInTheDocument();
  });

  it('renders all buttons', () => {
    render(
      <AppearanceSettings
        onThemeChange={mockOnThemeChange}
        onViewModeChange={mockOnViewModeChange}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(5); // 3 theme + 2 view mode + preview
  });
});
