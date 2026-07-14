import { defineConfig } from 'wxt';

export default defineConfig({
  publicDir: 'public',
  manifest: {
    name: '小新書籤',
    version: '1.0.0',
    description: 'Xiaoxin bookmark manager',
    permissions: ['storage', 'activeTab'],
  },
});
