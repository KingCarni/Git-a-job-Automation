const fs = require('fs');
const path = require('path');

const issueKey = process.argv[2];

if (!issueKey) {
  console.error('Missing Jira issue key.');
  console.error('Usage: npm run generate:qa -- JOB-103');
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
    combined.includes('ftue') ||
    combined.includes('first-time setup') ||
    combined.includes('first time setup') ||
    combined.includes('first-time user') ||
    combined.includes('first time user') ||
    combined.includes('onboarding') ||
    combined.includes('initial profile build') ||
    combined.includes('canonical resume') ||
    combined.includes('canonical structured resume') ||
    combined.includes('shared resume engine') ||
    combined.includes('job-aware mode') ||
    combined.includes('setup mode')
  ) {
    return 'ftue-resume-onboarding';
  }

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

function buildRows(ticket, cases, section, playwrightFile) {
  return cases.map((testCase) => ({
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

  return { cases, testrailRows: buildRows(ticket, cases, section, playwrightFile), fixtures };
}

function buildFtueResumeOnboardingPackage(ticket) {
  const section = 'Manual - 08 Future Authenticated E2E';
  const playwrightFile = `generated-qa/${ticket.key}/${ticket.key}-fixture-test.spec.js`;

  const cases = [
    {
      id: 'GAJ-FTUE-001',
      title: 'First-time user enters setup mode',
      priority: 'High',
      type: 'Functional',
      preconditions: 'User is new and has no canonical structured resume or completed onboarding resume.',
      steps: steps('Open the resume experience as a first-time user.', 'Allow resume engine mode selection to run.', 'Observe the selected mode.'),
      expected: 'User enters first-time setup mode instead of normal job-aware mode.',
      automated: 'Yes',
      notes: 'Core mode-selection rule for new users.',
    },
    {
      id: 'GAJ-FTUE-002',
      title: 'Returning user bypasses setup mode',
      priority: 'High',
      type: 'Regression',
      preconditions: 'User has a canonical structured resume/profile and completed onboarding state.',
      steps: steps('Open the resume experience as a returning user.', 'Allow resume engine mode selection to run.', 'Observe the selected mode.'),
      expected: 'User bypasses setup mode and enters the normal job-aware path when applicable.',
      automated: 'Yes',
      notes: 'Prevents returning users from being trapped in onboarding.',
    },
    {
      id: 'GAJ-FTUE-003',
      title: 'Setup mode uses shared resume engine',
      priority: 'High',
      type: 'Architecture',
      preconditions: 'First-time setup mode is available.',
      steps: steps('Enter setup mode.', 'Inspect behavior/components used by setup mode.', 'Compare with normal resume engine behavior where practical.'),
      expected: 'Setup mode is a mode/state of the shared resume engine, not a separate divergent resume system.',
      automated: 'Future',
      notes: 'Mostly architectural/manual until implementation exposes testable hooks.',
    },
    {
      id: 'GAJ-FTUE-004',
      title: 'Initial profile build does not charge credits',
      priority: 'High',
      type: 'Business Rule',
      preconditions: 'First-time user is eligible for initial resume/profile setup.',
      steps: steps('Start first-time resume/profile setup.', 'Complete initial setup actions.', 'Review credit balance and credit ledger.'),
      expected: 'Initial profile setup is free and does not consume credits.',
      automated: 'Yes',
      notes: 'Critical monetization and trust check.',
    },
    {
      id: 'GAJ-FTUE-005',
      title: 'Completing setup persists canonical structured resume',
      priority: 'High',
      type: 'Data Integrity',
      preconditions: 'First-time user has completed setup inputs or imported resume data.',
      steps: steps('Complete guided resume setup.', 'Save/finish the setup flow.', 'Reload account/profile or query stored profile state.'),
      expected: 'A canonical structured resume/profile snapshot is persisted and available for ATS/matching.',
      automated: 'Yes',
      notes: 'Core data persistence check.',
    },
    {
      id: 'GAJ-FTUE-006',
      title: 'User routes to Account/Profile after setup',
      priority: 'Medium',
      type: 'Navigation',
      preconditions: 'First-time user completes setup.',
      steps: steps('Finish first-time setup.', 'Observe the next route or CTA.', 'Open Account/Profile if routed there.'),
      expected: 'User is routed or prompted toward Account/Profile for optional cleanup after setup.',
      automated: 'Future',
      notes: 'May depend on final UX routing decision.',
    },
    {
      id: 'GAJ-FTUE-007',
      title: 'User can continue into Jobs/Match after setup',
      priority: 'Medium',
      type: 'Navigation',
      preconditions: 'User has completed setup and has a canonical structured resume/profile.',
      steps: steps('Complete first-time setup.', 'Choose to continue into Jobs/Match or Apply Pack flow.', 'Observe whether the profile is available to the downstream flow.'),
      expected: 'User can continue into Jobs/Match with the canonical profile available.',
      automated: 'Future',
      notes: 'Good later E2E candidate.',
    },
    {
      id: 'GAJ-FTUE-008',
      title: 'Job-aware mode uses canonical profile after onboarding',
      priority: 'High',
      type: 'Regression',
      preconditions: 'User completed onboarding and has a canonical structured profile. Job/role context exists.',
      steps: steps('Open a job-aware resume or matching flow.', 'Load or apply role/job context.', 'Observe the source profile used by the flow.'),
      expected: 'Job-aware mode uses the canonical structured profile created during setup.',
      automated: 'Yes',
      notes: 'Connects FTUE output to later matching/ATS behavior.',
    },
    {
      id: 'GAJ-FTUE-009',
      title: 'Tutorial messaging explains base resume vs role tailoring',
      priority: 'Medium',
      type: 'Content',
      preconditions: 'First-time user is in setup/tutorial flow.',
      steps: steps('Open setup/tutorial messaging.', 'Read the explanation for base resume/profile setup.', 'Review any mention of tailoring per role later.'),
      expected: 'Messaging clearly explains that the user builds a strong base resume once and tailors per role later.',
      automated: 'Future',
      notes: 'Manual content/UX review.',
    },
    {
      id: 'GAJ-FTUE-010',
      title: 'Incomplete onboarding resumes correctly',
      priority: 'High',
      type: 'Edge Case',
      preconditions: 'User starts onboarding but does not complete setup.',
      steps: steps('Begin first-time setup.', 'Exit or refresh before completion.', 'Return to the resume experience.'),
      expected: 'User can resume setup without being incorrectly marked complete or losing entered/imported state.',
      automated: 'Yes',
      notes: 'Important state recovery case.',
    },
  ];

  const fixtures = {
    issueKey: ticket.key,
    feature: 'ftue-resume-onboarding',
    modeRules: {
      firstTimeUserEntersSetupMode: true,
      returningUserBypassesSetupMode: true,
      setupModeUsesSharedResumeEngine: true,
      initialSetupIsFree: true,
      completingSetupPersistsCanonicalProfile: true,
      jobAwareModeRequiresCanonicalProfile: true,
      incompleteOnboardingCanResume: true,
    },
    modes: ['first-time setup mode', 'normal job-aware mode'],
    cases: [
      {
        id: 'GAJ-FTUE-001',
        scenario: 'first-time user mode selection',
        userState: {
          isNewUser: true,
          hasCanonicalStructuredResume: false,
          hasCompletedOnboardingResume: false,
          hasJobContext: false,
        },
        expectedMode: 'first-time setup mode',
      },
      {
        id: 'GAJ-FTUE-002',
        scenario: 'returning user mode selection',
        userState: {
          isNewUser: false,
          hasCanonicalStructuredResume: true,
          hasCompletedOnboardingResume: true,
          hasJobContext: false,
        },
        expectedMode: 'normal job-aware mode',
      },
      {
        id: 'GAJ-FTUE-004',
        scenario: 'initial setup is free',
        action: 'complete_initial_profile_setup',
        expectedCreditDelta: 0,
        shouldConsumeCredits: false,
      },
      {
        id: 'GAJ-FTUE-005',
        scenario: 'completion persists canonical profile',
        action: 'complete_setup',
        expectedState: {
          hasCanonicalStructuredResume: true,
          hasCompletedOnboardingResume: true,
        },
      },
      {
        id: 'GAJ-FTUE-010',
        scenario: 'incomplete onboarding resumes correctly',
        userState: {
          startedOnboarding: true,
          completedOnboarding: false,
        },
        expectedMode: 'first-time setup mode',
        expectedDataLoss: false,
      },
    ],
  };

  return { cases, testrailRows: buildRows(ticket, cases, section, playwrightFile), fixtures };
}

function buildGenericPackage(ticket) {
  const section = 'Manual - Generated QA';
  const playwrightFile = 'Not created yet';
  const safeNumber = ticket.key.replace(/[^0-9]/g, '') || 'GEN';

  const cases = [
    {
      id: `GAJ-${safeNumber}-001`,
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

  const fixtures = {
    issueKey: ticket.key,
    feature: 'generic-feature',
    note: 'Generic fixture scaffold. Human review required before automation.',
    cases,
  };

  return { cases, testrailRows: buildRows(ticket, cases, section, playwrightFile), fixtures };
}

function buildFixtureTest(ticket, feature) {
  const dailyValidation = feature === 'daily-login-bonus' ? `
  test('${ticket.key}-FIXTURE-003 - daily bonus rules are safe when applicable', async () => {
    const data = readFixture();

    expect(data.creditPolicy.bonusAmount).toBe(10);
    expect(data.creditPolicy.reason).toBe('daily_login_bonus');
    expect(data.creditPolicy.maxAwardsPerUserPerBonusDate).toBe(1);
    expect(data.creditPolicy.paidCreditEligible).toBe(false);
  });
` : '';

  const ftueValidation = feature === 'ftue-resume-onboarding' ? `
  test('${ticket.key}-FIXTURE-003 - FTUE mode rules are represented', async () => {
    const data = readFixture();

    expect(data.feature).toBe('ftue-resume-onboarding');
    expect(data.modeRules.firstTimeUserEntersSetupMode).toBe(true);
    expect(data.modeRules.returningUserBypassesSetupMode).toBe(true);
    expect(data.modeRules.setupModeUsesSharedResumeEngine).toBe(true);
    expect(data.modeRules.initialSetupIsFree).toBe(true);
    expect(data.modeRules.completingSetupPersistsCanonicalProfile).toBe(true);
    expect(data.modes).toContain('first-time setup mode');
    expect(data.modes).toContain('normal job-aware mode');
  });

  test('${ticket.key}-FIXTURE-004 - FTUE cases include setup and job-aware outcomes', async () => {
    const data = readFixture();

    const expectedModes = data.cases.map((testCase) => testCase.expectedMode).filter(Boolean);
    const freeSetupCase = data.cases.find((testCase) => testCase.id === 'GAJ-FTUE-004');

    expect(expectedModes).toContain('first-time setup mode');
    expect(expectedModes).toContain('normal job-aware mode');
    expect(freeSetupCase.shouldConsumeCredits).toBe(false);
    expect(freeSetupCase.expectedCreditDelta).toBe(0);
  });
` : '';

  return `const { test, expect } = require('@playwright/test');
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
${dailyValidation}${ftueValidation}
});
`;
}

const ticket = {
  key: pickLine('Key', issueKey),
  summary: pickLine('Summary', issueKey),
  labels: pickLine('Labels', ''),
  description: raw,
};

const feature = detectFeature(ticket.summary, raw);

let packageData;

if (feature === 'daily-login-bonus') {
  packageData = buildDailyLoginBonusPackage(ticket);
} else if (feature === 'ftue-resume-onboarding') {
  packageData = buildFtueResumeOnboardingPackage(ticket);
} else {
  packageData = buildGenericPackage(ticket);
}

const testrailCsvPath = path.join(outputDir, `${ticket.key}-testrail-cases.csv`);
const fixturesPath = path.join(outputDir, `${ticket.key}-fixtures.json`);
const fixtureTestPath = path.join(outputDir, `${ticket.key}-fixture-test.spec.js`);
const testDesignPath = path.join(outputDir, `${ticket.key}-test-design.md`);
const evidencePath = path.join(outputDir, `${ticket.key}-jira-evidence.md`);

writeCsv(testrailCsvPath, packageData.testrailRows);
fs.writeFileSync(fixturesPath, JSON.stringify(packageData.fixtures, null, 2), 'utf8');
fs.writeFileSync(fixtureTestPath, buildFixtureTest(ticket, feature), 'utf8');

const testDesign = `# ${ticket.key} - QA Test Design

## Summary

${ticket.summary}

## Source

This QA package was generated from pasted Jira ticket text.

## Feature Type

${feature}

## Test Strategy

This package starts with a reviewable QA design, TestRail CSV rows, fixture JSON, and a Playwright fixture-test skeleton.

The first pass is intentionally rule/template-based. Human review is still expected before importing cases or promoting fixture tests into the main test suite.

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
`;

fs.writeFileSync(testDesignPath, testDesign, 'utf8');

const evidence = `QA evidence added for ${ticket.key}.

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
`;

fs.writeFileSync(evidencePath, evidence, 'utf8');

console.log(`Generated QA package for ${ticket.key}`);
console.log(`Feature type: ${feature}`);
console.log(`Output folder: ${outputDir}`);
console.log('');
console.log('Created:');
console.log(`- ${testDesignPath}`);
console.log(`- ${testrailCsvPath}`);
console.log(`- ${fixturesPath}`);
console.log(`- ${fixtureTestPath}`);
console.log(`- ${evidencePath}`);
