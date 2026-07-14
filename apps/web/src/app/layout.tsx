import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Xiaoxin - 書籤管理平台',
  description: '小新 - 現代化的書籤管理平台',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
