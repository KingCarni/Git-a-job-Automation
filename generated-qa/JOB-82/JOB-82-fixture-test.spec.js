const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const fixturePath = path.join(__dirname, 'JOB-82-fixtures.json');

function readFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
}

test.describe('JOB-82 generated QA fixture validation', () => {
  test('JOB-82-FIXTURE-001 - fixture file has required structure', async () => {
    const data = readFixture();

    expect(data.issueKey).toBe('JOB-82');
    expect(data.feature).toBe('auth-access-control');
    expect(data.rules).toBeTruthy();
    expect(Array.isArray(data.cases)).toBeTruthy();
    expect(data.cases.length).toBeGreaterThan(0);
  });

  test('JOB-82-FIXTURE-002 - generated cases have stable IDs and expected outcomes', async () => {
    const data = readFixture();

    for (const testCase of data.cases) {
      expect(testCase.id).toMatch(/^GAJ-/);
      expect(testCase.title).toBeTruthy();
      expect(testCase.expected).toBeTruthy();
    }
  });

  test('JOB-82-FIXTURE-003 - generated rule references exist in fixture rules', async () => {
    const data = readFixture();
    const availableRules = new Set(Object.keys(data.rules || {}));

    for (const testCase of data.cases) {
      for (const ruleRef of testCase.ruleRefs || []) {
        expect(availableRules.has(ruleRef)).toBeTruthy();
      }
    }
  });
});
