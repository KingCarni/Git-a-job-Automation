const { test, expect } = require('@playwright/test');

test.describe('Git-a-Job public smoke tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Git-a-Job|Resume|Job/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('homepage contains product-related content', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toContainText(
      /resume|cover letter|job|credits|analyze|ATS/i
    );
  });

  test('homepage has at least one actionable link or button', async ({ page }) => {
    await page.goto('/');

    const actionCount =
      (await page.getByRole('link').count()) +
      (await page.getByRole('button').count());

    expect(actionCount).toBeGreaterThan(0);
  });
});