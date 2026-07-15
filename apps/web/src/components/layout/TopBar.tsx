'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white border-b px-4 lg:px-6">
      <div className="flex items-center justify-between h-16">
        {/* Search */}
        <div className="flex-1 max-w-xl ml-10 lg:ml-0">
          <div className="relative">
            <input
              type="text"
              placeholder="搜尋書籤..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <span>🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                U
              </div>
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium">User</p>
                    <p className="text-sm text-gray-500">user@example.com</p>
                  </div>
                  <nav className="py-1">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      個人設定
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      登出
                    </button>
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
