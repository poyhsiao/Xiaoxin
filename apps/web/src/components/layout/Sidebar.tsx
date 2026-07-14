'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: '儀表板', icon: '🏠' },
  { href: '/organizations', label: '組織', icon: '🏢' },
  { href: '/bookmarks', label: '書籤', icon: '🔖' },
  { href: '/settings', label: '設定', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-screen p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">小新</h1>
        <p className="text-sm text-gray-500">書籤管理</p>
      </div>
      <nav className="space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded ${
              pathname === item.href ? 'bg-primary text-white' : 'hover:bg-gray-100'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
        >
          登出
        </button>
      </div>
    </aside>
  );
}
