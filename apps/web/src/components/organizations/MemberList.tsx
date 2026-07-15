'use client';

export interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  avatar?: string;
}

interface MemberListProps {
  members: Member[];
  currentUserRole: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  onRemove?: (memberId: string) => void;
  onRoleChange?: (memberId: string, newRole: Member['role']) => void;
}

const roleLabels: Record<Member['role'], string> = {
  OWNER: '擁有者',
  ADMIN: '管理者',
  EDITOR: '編輯者',
  VIEWER: '檢視者',
};

const roleColors: Record<Member['role'], string> = {
  OWNER: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-blue-100 text-blue-800',
  EDITOR: 'bg-green-100 text-green-800',
  VIEWER: 'bg-gray-100 text-gray-800',
};

export default function MemberList({ members, currentUserRole, onRemove, onRoleChange }: MemberListProps) {
  const canManage = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  return (
    <div className="space-y-3">
      {members.map(member => (
        <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 text-xs rounded ${roleColors[member.role]}`}>
              {roleLabels[member.role]}
            </span>
            {canManage && member.role !== 'OWNER' && (
              <div className="flex gap-2">
                {onRoleChange && (
                  <select
                    value={member.role}
                    onChange={e => onRoleChange(member.id, e.target.value as Member['role'])}
                    className="text-sm border rounded px-2 py-1"
                    disabled={currentUserRole === 'ADMIN'}
                  >
                    <option value="ADMIN">管理者</option>
                    <option value="EDITOR">編輯者</option>
                    <option value="VIEWER">檢視者</option>
                  </select>
                )}
                {onRemove && (
                  <button
                    onClick={() => onRemove(member.id)}
                    className="text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                  >
                    移除
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      {members.length === 0 && (
        <p className="text-center text-gray-500 py-4">沒有成員</p>
      )}
    </div>
  );
}
