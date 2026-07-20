import React, { useState } from 'react';

type Language = 'zh-TW' | 'zh-CN' | 'en';

interface LanguageSettingsProps {
  initialLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const LANGUAGE_OPTIONS: { value: Language; label: string; nativeLabel: string }[] = [
  { value: 'zh-TW', label: '繁體中文', nativeLabel: '繁體中文' },
  { value: 'zh-CN', label: 'Simplified Chinese', nativeLabel: '簡體中文' },
  { value: 'en', label: 'English', nativeLabel: 'English' },
];

export function LanguageSettings({
  initialLanguage = 'zh-TW',
  onLanguageChange,
}: LanguageSettingsProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const handleChange = (newLang: Language) => {
    setLanguage(newLang);
    onLanguageChange?.(newLang);
    localStorage.setItem('language', newLang);
  };

  // Format date according to current language
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const sampleDate = formatDate(new Date());

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">語言設定</h2>

      {/* Language Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">選擇語言</label>
        <div className="space-y-2">
          {LANGUAGE_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleChange(option.value)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-colors ${
                language === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium">{option.nativeLabel}</span>
              <span className="text-gray-500 text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date Format Preview */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">日期格式預覽</label>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">現在日期：</div>
          <div className="font-medium">{sampleDate}</div>
        </div>
      </div>

      {/* Current Selection Indicator */}
      <div className="text-sm text-gray-500">
        目前的語言設定：{LANGUAGE_OPTIONS.find(l => l.value === language)?.nativeLabel}
      </div>
    </div>
  );
}

export default LanguageSettings;
