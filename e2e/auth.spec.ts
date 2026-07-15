import { test, expect } from '@playwright/test';

test.describe('Auth flows', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('登入 小新');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('register page renders', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1')).toContainText('註冊 小新');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
