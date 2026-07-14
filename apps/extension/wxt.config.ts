import { defineConfig } from 'wxt';

export default defineConfig({
  entrypoints: ['entrypoints/popup/Main.tsx', 'entrypoints/sidebar/Sidebar.tsx', 'entrypoints/background/main.ts'],
  manifest: {
    name: '小新書籤',
    version: '1.0.0',
    description: 'Xiaoxin bookmark manager',
    permissions: ['storage', 'activeTab'],
  },
});
