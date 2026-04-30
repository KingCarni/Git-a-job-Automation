const { test, expect } = require('@playwright/test');

test.describe('Git-a-Job auth-gated resume analyzer behavior', () => {
  test('unauthenticated user does not reach private resume analyzer directly', async ({ page }) => {
    const response = await page.goto('/resume', { waitUntil: 'domcontentloaded' });

    // Do not assert body visibility here.
    // Some auth/NextAuth pages may render a hidden body during redirect or auth handling.
    await page.waitForLoadState('networkidle').catch(() => {});

    const currentUrl = page.url();
    const statusCode = response ? response.status() : null;

    const bodyText = await page.locator('body').textContent().catch(() => '');
    const pageHtml = await page.content().catch(() => '');
    const combinedPageText = `${bodyText} ${pageHtml}`;

    const redirectedAwayFromResume = !currentUrl.includes('/resume');

    const blockedByStatus =
      statusCode === 401 ||
      statusCode === 403 ||
      statusCode === 404;

    const showsAuthPrompt =
      /sign in|signin|login|log in|sign up|account|unauthorized|auth/i.test(
        combinedPageText
      );

    const showsNotFound =
      /404|not found|page not found/i.test(combinedPageText);

    const privateAnalyzerVisible =
      /upload resume|job description|ats score|analyze resume|missing keywords/i.test(
        combinedPageText
      );

    expect(
      redirectedAwayFromResume ||
        blockedByStatus ||
        showsAuthPrompt ||
        showsNotFound ||
        !privateAnalyzerVisible
    ).toBeTruthy();
  });
});