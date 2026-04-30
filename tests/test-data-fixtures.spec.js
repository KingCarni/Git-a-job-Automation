const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Test data fixture validation', () => {
  test('GAJ-DATA-001 - Generated test data has required user and ledger records', async () => {
    const filePath = path.join(
      __dirname,
      '..',
      'test-artifacts',
      'generated-test-data.json'
    );

    expect(fs.existsSync(filePath)).toBeTruthy();

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    expect(Array.isArray(data.users)).toBeTruthy();
    expect(Array.isArray(data.creditLedger)).toBeTruthy();
    expect(Array.isArray(data.analysisRecords)).toBeTruthy();

    expect(data.users.length).toBeGreaterThanOrEqual(5);

    const userWithCredits = data.users.find(
      (user) => user.id === 'qa-user-with-credits'
    );

    expect(userWithCredits).toBeTruthy();
    expect(userWithCredits.credits).toBeGreaterThan(0);
  });
});

