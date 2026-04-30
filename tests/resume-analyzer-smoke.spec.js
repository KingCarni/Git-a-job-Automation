const { test, expect } = require('@playwright/test');

test.describe('Git-a-Job smoke tests', () => {
  test('homepage loads and shows Git-a-Job branding', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Git-a-Job|Resume|Job/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('homepage exposes resume-related entry points', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toContainText(/resume|cover letter|job|credits|analyze/i);
  });
});