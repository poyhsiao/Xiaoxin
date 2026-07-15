import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import MemberList, { Member } from './MemberList';

describe('MemberList', () => {
  const mockMembers: Member[] = [
    { id: '1', userId: 'u1', name: 'Alice', email: 'alice@test.com', role: 'OWNER' },
    { id: '2', userId: 'u2', name: 'Bob', email: 'bob@test.com', role: 'ADMIN' },
    { id: '3', userId: 'u3', name: 'Charlie', email: 'charlie@test.com', role: 'EDITOR' },
  ];

  it('renders member names and emails', () => {
    render(<MemberList members={mockMembers} currentUserRole="OWNER" />);

    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('alice@test.com')).toBeDefined();
    expect(screen.getByText('Bob')).toBeDefined();
    expect(screen.getByText('charlie@test.com')).toBeDefined();
  });

  it('renders role labels correctly', () => {
    render(<MemberList members={mockMembers} currentUserRole="OWNER" />);

    expect(screen.getByText('擁有者')).toBeDefined();
    expect(screen.getByText('管理者')).toBeDefined();
    expect(screen.getByText('編輯者')).toBeDefined();
  });

  it('shows remove button for ADMIN when current user is OWNER', () => {
    const onRemove = vi.fn();
    render(
      <MemberList
        members={mockMembers.filter(m => m.role !== 'OWNER')}
        currentUserRole="OWNER"
        onRemove={onRemove}
      />
    );

    const removeButtons = screen.getAllByText('移除');
    expect(removeButtons.length).toBe(2);
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <MemberList
        members={mockMembers.filter(m => m.role !== 'OWNER')}
        currentUserRole="OWNER"
        onRemove={onRemove}
      />
    );

    const removeButtons = screen.getAllByText('移除');
    fireEvent.click(removeButtons[0]);

    expect(onRemove).toHaveBeenCalledWith('2');
  });

  it('does not show manage UI when current user is VIEWER', () => {
    render(<MemberList members={mockMembers} currentUserRole="VIEWER" />);

    // VIEWER can see role labels but cannot manage (no remove buttons, no role selects)
    expect(screen.queryByText('移除')).toBeNull();
    // But role labels are still visible
    expect(screen.getByText('管理者')).toBeDefined();
  });

  it('shows empty state when no members', () => {
    render(<MemberList members={[]} currentUserRole="OWNER" />);

    expect(screen.getByText('沒有成員')).toBeDefined();
  });

  it('displays member avatars with initials when no avatar URL', () => {
    render(<MemberList members={mockMembers} currentUserRole="OWNER" />);

    // Owner should show A, Admin B, Editor C
    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();
  });
});
