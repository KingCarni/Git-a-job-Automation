const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const fixtureRoot = path.join(__dirname, '..', 'ai-safety-fixtures');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(fixtureRoot, relativePath), 'utf8'));
}

test.describe('AI hallucination safety fixture validation', () => {
  test('rewrite safety cases have required fields', async () => {
    const data = readJson('rewrite-cases/rewrite-safety-cases.json');

    expect(data.suite).toBe('rewrite-safety-cases');
    expect(Array.isArray(data.cases)).toBeTruthy();
    expect(data.cases.length).toBeGreaterThanOrEqual(8);

    for (const testCase of data.cases) {
      expect(testCase.id).toMatch(/^AI-RW-/);
      expect(testCase.risk).toBeTruthy();
      expect(testCase.originalBullet).toBeTruthy();
      expect(testCase.jobDescriptionExcerpt).toBeTruthy();
      expect(testCase.safeRewrite).toBeTruthy();
      expect(testCase.expectedVerdict).toMatch(/pass|fail/);
      expect(Array.isArray(testCase.blockedClaims)).toBeTruthy();
    }
  });

  test('unsafe rewrite examples include their blocked claims', async () => {
    const data = readJson('rewrite-cases/rewrite-safety-cases.json');
    const failingCases = data.cases.filter((testCase) => testCase.expectedVerdict === 'fail');

    expect(failingCases.length).toBeGreaterThan(0);

    for (const testCase of failingCases) {
      expect(testCase.unsafeRewrite).toBeTruthy();
      expect(testCase.blockedClaims.length).toBeGreaterThan(0);

      const unsafeLower = testCase.unsafeRewrite.toLowerCase();

      const atLeastOneBlockedClaimAppears = testCase.blockedClaims.some((claim) =>
        unsafeLower.includes(claim.toLowerCase())
      );

      expect(atLeastOneBlockedClaimAppears).toBeTruthy();
    }
  });

  test('safe rewrites do not contain blocked claims', async () => {
    const data = readJson('rewrite-cases/rewrite-safety-cases.json');

    for (const testCase of data.cases) {
      const safeLower = testCase.safeRewrite.toLowerCase();

      for (const blockedClaim of testCase.blockedClaims) {
        expect(safeLower.includes(blockedClaim.toLowerCase())).toBeFalsy();
      }
    }
  });

  test('analysis safety cases cover prompt injection and hiring guarantee risks', async () => {
    const data = readJson('analysis-cases/analysis-safety-cases.json');

    expect(data.suite).toBe('analysis-safety-cases');
    expect(Array.isArray(data.cases)).toBeTruthy();

    const risks = data.cases.map((testCase) => testCase.risk);

    expect(risks).toContain('prompt_injection');
    expect(risks).toContain('hiring_guarantee');
    expect(risks).toContain('missing_keyword_framing');
    expect(risks).toContain('leadership_gap');
  });

  test('safety rules include blocked terms and safe language examples', async () => {
    const rules = readJson('expected-output/safety-rules.expected.json');

    expect(rules.blockedTermsByRisk.tool_invention).toContain('Cypress');
    expect(rules.blockedTermsByRisk.tool_invention).toContain('Playwright');
    expect(rules.blockedTermsByRisk.metric_invention).toContain('30%');
    expect(rules.blockedTermsByRisk.leadership_inflation).toContain('owned QA strategy');
    expect(rules.blockedTermsByRisk.hiring_guarantee).toContain('guarantee');

    expect(rules.safeLanguageExamples).toContain('only add this if true');
  });
});
