const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const fixtureRoot = path.join(__dirname, '..', 'resume-fixtures');

const expectedFixtures = [
  'clean-qa-resume',
  'two-column-style-resume',
  'weird-headings-resume',
  'paragraph-style-resume',
  'weak-match-marketing-resume',
];

test.describe('Resume parser fixture pack validation', () => {
  test('source text fixtures and expected output files exist', async () => {
    for (const fixtureId of expectedFixtures) {
      const sourcePath = path.join(
        fixtureRoot,
        'source-text',
        `${fixtureId}.txt`
      );

      const expectedPath = path.join(
        fixtureRoot,
        'expected-output',
        `${fixtureId}.expected.json`
      );

      expect(fs.existsSync(sourcePath), `Missing source: ${sourcePath}`).toBeTruthy();
      expect(fs.existsSync(expectedPath), `Missing expected: ${expectedPath}`).toBeTruthy();
    }
  });

  test('expected output files are valid JSON', async () => {
    for (const fixtureId of expectedFixtures) {
      const expectedPath = path.join(
        fixtureRoot,
        'expected-output',
        `${fixtureId}.expected.json`
      );

      const parsed = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));

      expect(parsed.fixtureId).toBe(fixtureId);
      expect(
        parsed.expectedCandidateName ||
          parsed.expectedRole ||
          parsed.expectedRisk
      ).toBeTruthy();
    }
  });

  test('fixtures use fake example emails only', async () => {
    const sourceDir = path.join(fixtureRoot, 'source-text');
    const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.txt'));

    for (const file of files) {
      const text = fs.readFileSync(path.join(sourceDir, file), 'utf8');

      const emailMatches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];

      for (const email of emailMatches) {
        expect(email.endsWith('@example.com')).toBeTruthy();
      }
    }
  });

  test('unsupported and corrupt fixture placeholders exist', async () => {
    expect(
      fs.existsSync(path.join(fixtureRoot, 'unsupported', 'unsupported-resume.txt'))
    ).toBeTruthy();

    expect(
      fs.existsSync(path.join(fixtureRoot, 'corrupt', 'corrupt-pdf-placeholder.txt'))
    ).toBeTruthy();
  });
});
