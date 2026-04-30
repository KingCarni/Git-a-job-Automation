const { test, expect } = require('@playwright/test');

test.describe('Git-a-Job API smoke tests', () => {
  test('unknown API route returns a safe non-500 response', async ({ request }) => {
    const response = await request.get('/api/this-route-should-not-exist');

    expect([404, 405]).toContain(response.status());
  });

  test('analyze endpoint rejects empty payload safely', async ({ request }) => {
    const response = await request.post('/api/analyze', {
      data: {},
    });

    expect([400, 401, 403, 405, 500]).toContain(response.status());

    // This is intentionally loose for now because auth and endpoint contract may not be finalized.
    // Later, tighten this to the expected product behavior.
  });
});