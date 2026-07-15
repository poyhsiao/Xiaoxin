import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';

describe('DashboardPage', () => {
  it('renders heading', () => {
    render(<DashboardPage />);
    expect(screen.getByText('儀表板')).toBeDefined();
  });

  it('renders navigation cards', () => {
    render(<DashboardPage />);
    expect(screen.getByText('組織')).toBeDefined();
    expect(screen.getByText('書籤')).toBeDefined();
    expect(screen.getByText('設定')).toBeDefined();
  });

  it('renders card links', () => {
    render(<DashboardPage />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
