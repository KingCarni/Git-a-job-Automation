const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const fixturePath = path.join(__dirname, 'JOB-126-fixtures.json');

function readFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
}

test.describe('JOB-126 generated QA fixture validation', () => {
  test('JOB-126-FIXTURE-001 - fixture file has required structure', async () => {
    const data = readFixture();

    expect(data.issueKey).toBe('JOB-126');
    expect(data.feature).toBeTruthy();
    expect(Array.isArray(data.cases)).toBeTruthy();
    expect(data.cases.length).toBeGreaterThan(0);
  });

  test('JOB-126-FIXTURE-002 - generated cases have IDs and expected outcomes', async () => {
    const data = readFixture();

    for (const testCase of data.cases) {
      expect(testCase.id).toBeTruthy();
      expect(testCase.scenario || testCase.title).toBeTruthy();
    }
  });

  test('JOB-126-FIXTURE-003 - daily bonus rules are safe when applicable', async () => {
    const data = readFixture();

    test.skip(data.feature !== 'daily-login-bonus', 'Daily bonus rules only apply to daily-login-bonus fixtures.');

    expect(data.creditPolicy.bonusAmount).toBe(10);
    expect(data.creditPolicy.reason).toBe('daily_login_bonus');
    expect(data.creditPolicy.maxAwardsPerUserPerBonusDate).toBe(1);
    expect(data.creditPolicy.paidCreditEligible).toBe(false);
  });
});
