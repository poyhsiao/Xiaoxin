import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: {
    command: 'cd apps/web && pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
