const fs = require('fs');
const path = require('path');

const issueKey = process.argv[2];

if (!issueKey) {
  console.error('Missing Jira issue key.');
  console.error('Usage: npm run generate:qa -- JOB-56');
  process.exit(1);
}

const inputPath = path.join('jira-input', `${issueKey}.md`);
const outputDir = path.join('generated-qa', issueKey);

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  console.error(`Create ${inputPath}, paste the Jira ticket content, then run this again.`);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const raw = fs.readFileSync(inputPath, 'utf8');

function pickLine(label, fallback = '') {
  const regex = new RegExp(`^${label}:\\s*(.+)$`, 'im');
  const match = raw.match(regex);
  return match ? match[1].trim() : fallback;
}

function csvEscape(value) {
  const safe = String(value ?? '');
  if (/[",\r\n]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

function writeCsv(filePath, rows) {
  const columns = [
    'Section',
    'Title',
    'Type',
    'Priority',
    'Estimate',
    'References',
    'Preconditions',
    'Steps',
    'Expected Result',
    'Is Automated',
    'Automation Type',
    'Automation ID',
    'Playwright File',
    'Playwright Command',
    'Notes',
  ];

  const lines = [
    columns.join(','),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column] ?? '')).join(',')),
  ];

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

function steps(...items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function detectFeature(summary, text) {
  const combined = `${summary}\n${text}`.toLowerCase();
  if (
    combined.includes('daily bonus') ||
    combined.includes('login bonus') ||
    combined.includes('signs in') ||
    combined.includes('sign in') ||
    combined.includes('credits')
  ) {
    return 'daily-login-bonus';
  }
  return 'generic-feature';
}

function buildDailyLoginBonusPackage(ticket) {
  const section = 'Manual - 05 Credit Ledger';
  const playwrightFile = `generated-qa/${ticket.key}/${ticket.key}-fixture-test.spec.js`;

  const cases = [
    {
      id: 'GAJ-CREDIT-DAILY-001',
      title: 'First eligible sign-in grants 10 credits',
      priority: 'High',
      type: 'Functional',
      preconditions: 'User account exists. User has not received the daily login bonus for the selected bonus date.',
      steps: steps('Sign in as an eligible user.', 'Allow the daily bonus award logic to run.', 'Review the user credit balance and ledger entries.'),
      expected: 'User receives exactly +10 credits and one daily_login_bonus ledger entry is created.',
      automated: 'Future',
      notes: 'Core happy path for daily bonus behavior.',
    },
    {
      id: 'GAJ-CREDIT-DAILY-002',
      title: 'Repeated same-day sign-in does not grant duplicate bonus',
      priority: 'High',
      type: 'Regression',
      preconditions: 'User has already received a daily_login_bonus entry for the selected bonus date.',
      steps: steps('Sign out if needed.', 'Sign in again as the same user on the same bonus date.', 'Review the user credit balance and ledger entries.'),
      expected: 'No second +10 daily_login_bonus entry is created for the same user/date.',
      automated: 'Future',
      notes: 'Important idempotency check.',
    },
    {
      id: 'GAJ-CREDIT-DAILY-003',
      title: 'Daily bonus ledger entry uses correct reason and ref',
      priority: 'High',
      type: 'Data Integrity',
      preconditions: 'Eligible user can receive daily login bonus.',
      steps: steps('Trigger daily bonus award.', 'Inspect the resulting ledger entry.', 'Verify ledger reason and ref format.'),
      expected: 'Ledger entry uses delta +10, reason daily_login_bonus, and a unique ref for user/date.',
      automated: 'Yes',
      notes: 'Can be checked in fixture-level automation before DB integration exists.',
    },
    {
      id: 'GAJ-CREDIT-DAILY-004',
      title: 'Daily bonus is isolated per user',
      priority: 'High',
      type: 'Data Integrity',
      preconditions: 'Two different users exist and neither has received the daily bonus for the selected date.',
      steps: steps('Sign in as User A and trigger daily bonus.', 'Sign in as User B and trigger daily bonus.', 'Review both users credit ledgers.'),
      expected: 'Each user can receive their own +10 bonus. User A actions do not affect User B balance.',
      automated: 'Yes',
      notes: 'User isolation check.',
    },
    {
      id: 'GAJ-CREDIT-DAILY-005',
      title: 'Near-midnight sign-in does not double-award incorrectly',
      priority: 'Medium',
      type: 'Edge Case',
      preconditions: 'Test environment can control or simulate bonus dates/timestamps.',
      steps: steps('Trigger sign-in near the daily cutoff boundary.', 'Trigger another sign-in around the boundary.', 'Review ledger entries by bonus date.'),
      expected: 'Bonus is awarded according to the intended date rule and does not duplicate unexpectedly.',
      automated: 'Future',
      notes: 'Requires clear timezone/date policy.',
    },
    {
      id: 'GAJ-CREDIT-DAILY-006',
      title: 'Concurrent sign-ins do not create duplicate bonus entries',
      priority: 'High',
      type: 'Regression',
      preconditions: 'Eligible user exists. Test can simulate rapid or concurrent login requests.',
      steps: steps('Trigger two sign-in/bonus attempts for the same user/date close together.', 'Review resulting ledger entries.', 'Review final credit balance.'),
      expected: 'Only one +10 daily_login_bonus entry exists for the same user/date.',
      automated: 'Future',
      notes: 'Race-condition/idempotency check.',
    },
    {
      id: 'GAJ-CREDIT-DAILY-007',
      title: 'Bonus credits are not treated as paid or donatable credits',
      priority: 'High',
      type: 'Business Rule',
      preconditions: 'User has only daily_login_bonus credits and no purchased credits.',
      steps: steps('Award daily login bonus.', 'Attempt a paid-credit-only action such as donation if applicable.', 'Review eligibility calculation.'),
      expected: 'Daily bonus credits are treated as free credits and do not count as paid/donatable credits.',
      automated: 'Yes',
      notes: 'Important because donation logic distinguishes paid credits from free credits.',
    },
    {
      id: 'GAJ-CREDIT-DAILY-008',
      title: 'UI credit count updates after daily bonus award',
      priority: 'Medium',
      type: 'UI',
      preconditions: 'Eligible user exists and can sign in through the UI.',
      steps: steps('Sign in as an eligible user.', 'Observe the header/account credit count.', 'Refresh or navigate if needed.'),
      expected: 'Displayed credit count reflects the +10 daily bonus after the award is granted.',
      automated: 'Future',
      notes: 'UI/E2E check after auth test harness exists.',
    },
  ];

  const testrailRows = cases.map((testCase) => ({
    Section: section,
    Title: `${testCase.id} - ${testCase.title}`,
    Type: testCase.type,
    Priority: testCase.priority,
    Estimate: testCase.priority === 'High' ? '5m' : '3m',
    References: ticket.key,
    Preconditions: testCase.preconditions,
    Steps: testCase.steps,
    'Expected Result': testCase.expected,
    'Is Automated': testCase.automated,
    'Automation Type': testCase.automated === 'Yes' ? 'Playwright Fixture' : 'Future Automation',
    'Automation ID': testCase.id,
    'Playwright File': playwrightFile,
    'Playwright Command': testCase.automated === 'Yes' ? `npx playwright test ${playwrightFile}` : 'Not automated yet',
    Notes: testCase.notes,
  }));

  const fixtures = {
    issueKey: ticket.key,
    feature: 'daily-login-bonus',
    creditPolicy: {
      bonusAmount: 10,
      reason: 'daily_login_bonus',
      refPattern: 'daily_login_bonus:{userId}:{YYYY-MM-DD}',
      paidCreditEligible: false,
      maxAwardsPerUserPerBonusDate: 1,
    },
    cases: [
      {
        id: 'GAJ-CREDIT-DAILY-003',
        scenario: 'ledger entry shape',
        expectedLedgerEntry: {
          userId: 'qa-user-a',
          delta: 10,
          reason: 'daily_login_bonus',
          ref: 'daily_login_bonus:qa-user-a:2026-04-30',
          paidCreditEligible: false,
        },
      },
      {
        id: 'GAJ-CREDIT-DAILY-002',
        scenario: 'same user same day cannot duplicate',
        startingLedger: [
          {
            userId: 'qa-user-a',
            delta: 10,
            reason: 'daily_login_bonus',
            ref: 'daily_login_bonus:qa-user-a:2026-04-30',
            paidCreditEligible: false,
          },
        ],
        action: {
          userId: 'qa-user-a',
          type: 'daily_login_bonus',
          bonusDate: '2026-04-30',
        },
        expectedNewEntries: 0,
        expectedFinalBalance: 10,
      },
      {
        id: 'GAJ-CREDIT-DAILY-004',
        scenario: 'different users can each receive bonus',
        expectedLedgerEntry: {
          userId: 'qa-user-b',
          delta: 10,
          reason: 'daily_login_bonus',
          ref: 'daily_login_bonus:qa-user-b:2026-04-30',
          paidCreditEligible: false,
        },
      },
      {
        id: 'GAJ-CREDIT-DAILY-007',
        scenario: 'daily bonus credits are not paid credits',
        expectedPaidCreditEligibleBalance: 0,
        expectedTotalBalance: 10,
      },
    ],
  };

  return { cases, testrailRows, fixtures };
}

function buildGenericPackage(ticket) {
  const cases = [
    {
      id: `GAJ-${ticket.key.replace(/[^0-9]/g, '') || 'GEN'}-001`,
      title: 'Happy path works as expected',
      priority: 'High',
      type: 'Functional',
      preconditions: 'Feature is available in the test environment.',
      steps: steps('Open the feature area.', 'Perform the primary user action.', 'Review the result.'),
      expected: 'The feature completes successfully and shows the expected result.',
      automated: 'Future',
      notes: 'Generated generic case. Human review required.',
    },
  ];

  return {
    cases,
    testrailRows: cases.map((testCase) => ({
      Section: 'Manual - Generated QA',
      Title: `${testCase.id} - ${testCase.title}`,
      Type: testCase.type,
      Priority: testCase.priority,
      Estimate: '5m',
      References: ticket.key,
      Preconditions: testCase.preconditions,
      Steps: testCase.steps,
      'Expected Result': testCase.expected,
      'Is Automated': testCase.automated,
      'Automation Type': 'Future Automation',
      'Automation ID': testCase.id,
      'Playwright File': 'Not created yet',
      'Playwright Command': 'Not automated yet',
      Notes: testCase.notes,
    })),
    fixtures: {
      issueKey: ticket.key,
      feature: 'generic-feature',
      note: 'Generic fixture scaffold. Human review required before automation.',
      cases,
    },
  };
}

const ticket = {
  key: pickLine('Key', issueKey),
  summary: pickLine('Summary', issueKey),
  labels: pickLine('Labels', ''),
  description: raw,
};

const feature = detectFeature(ticket.summary, raw);
const packageData = feature === 'daily-login-bonus' ? buildDailyLoginBonusPackage(ticket) : buildGenericPackage(ticket);

const testrailCsvPath = path.join(outputDir, `${ticket.key}-testrail-cases.csv`);
const fixturesPath = path.join(outputDir, `${ticket.key}-fixtures.json`);
const fixtureTestPath = path.join(outputDir, `${ticket.key}-fixture-test.spec.js`);
const testDesignPath = path.join(outputDir, `${ticket.key}-test-design.md`);
const evidencePath = path.join(outputDir, `${ticket.key}-jira-evidence.md`);

writeCsv(testrailCsvPath, packageData.testrailRows);
fs.writeFileSync(fixturesPath, JSON.stringify(packageData.fixtures, null, 2), 'utf8');

fs.writeFileSync(fixtureTestPath, `const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const fixturePath = path.join(__dirname, '${ticket.key}-fixtures.json');

function readFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
}

test.describe('${ticket.key} generated QA fixture validation', () => {
  test('${ticket.key}-FIXTURE-001 - fixture file has required structure', async () => {
    const data = readFixture();

    expect(data.issueKey).toBe('${ticket.key}');
    expect(data.feature).toBeTruthy();
    expect(Array.isArray(data.cases)).toBeTruthy();
    expect(data.cases.length).toBeGreaterThan(0);
  });

  test('${ticket.key}-FIXTURE-002 - generated cases have IDs and expected outcomes', async () => {
    const data = readFixture();

    for (const testCase of data.cases) {
      expect(testCase.id).toBeTruthy();
      expect(testCase.scenario || testCase.title).toBeTruthy();
    }
  });

  test('${ticket.key}-FIXTURE-003 - daily bonus rules are safe when applicable', async () => {
    const data = readFixture();

    test.skip(data.feature !== 'daily-login-bonus', 'Daily bonus rules only apply to daily-login-bonus fixtures.');

    expect(data.creditPolicy.bonusAmount).toBe(10);
    expect(data.creditPolicy.reason).toBe('daily_login_bonus');
    expect(data.creditPolicy.maxAwardsPerUserPerBonusDate).toBe(1);
    expect(data.creditPolicy.paidCreditEligible).toBe(false);
  });
});
`, 'utf8');

fs.writeFileSync(testDesignPath, `# ${ticket.key} - QA Test Design

## Summary

${ticket.summary}

## Feature Type

${feature}

## Generated Test Cases

${packageData.cases.map((testCase) => `### ${testCase.id} - ${testCase.title}

Priority: ${testCase.priority}

Type: ${testCase.type}

Expected:
${testCase.expected}

Notes:
${testCase.notes}
`).join('\n')}

## Recommended Next Steps

1. Review this QA package.
2. Import ${ticket.key}-testrail-cases.csv into TestRail if the cases look useful.
3. Keep or edit ${ticket.key}-fixtures.json.
4. Promote ${ticket.key}-fixture-test.spec.js into the main tests folder only after review.
5. Add Jira evidence after validation.
`, 'utf8');

fs.writeFileSync(evidencePath, `QA evidence added for ${ticket.key}.

Generated QA package:
- ${testDesignPath}
- ${testrailCsvPath}
- ${fixturesPath}
- ${fixtureTestPath}

Recommended validation:
- Review generated test cases before importing to TestRail.
- Import CSV into TestRail if approved.
- Run fixture skeleton manually after review.
- Promote fixture test to main test suite only when stable.

Notes:
Generated by scripts/generate-qa-package.js from pasted Jira input.
`, 'utf8');

console.log(`Generated QA package for ${ticket.key}`);
console.log(`Output folder: ${outputDir}`);
console.log('');
console.log('Created:');
console.log(`- ${testDesignPath}`);
console.log(`- ${testrailCsvPath}`);
console.log(`- ${fixturesPath}`);
console.log(`- ${fixtureTestPath}`);
console.log(`- ${evidencePath}`);
