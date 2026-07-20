import React, { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ViewMode = 'list' | 'grid';

interface AppearanceSettingsProps {
  initialTheme?: Theme;
  initialViewMode?: ViewMode;
  onThemeChange?: (theme: Theme) => void;
  onViewModeChange?: (mode: ViewMode) => void;
}

export function AppearanceSettings({
  initialTheme = 'system',
  initialViewMode = 'list',
  onThemeChange,
  onViewModeChange,
}: AppearanceSettingsProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode);
    onViewModeChange?.(newMode);
    localStorage.setItem('viewMode', newMode);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">外觀設定</h2>

      {/* Theme Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">主題</label>
        <div className="flex gap-3">
          {(['light', 'dark', 'system'] as Theme[]).map(t => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                theme === t
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {t === 'light' && '☀️ 淺色'}
              {t === 'dark' && '🌙 深色'}
              {t === 'system' && '💻 系統'}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">書籤檢視模式</label>
        <div className="flex gap-3">
          <button
            onClick={() => handleViewModeChange('list')}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              viewMode === 'list'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            📋 清單
          </button>
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              viewMode === 'grid'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            📊 網格
          </button>
        </div>
      </div>

      {/* Theme Preview */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">預覽</label>
        <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            這是主題預覽文字
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppearanceSettings;
