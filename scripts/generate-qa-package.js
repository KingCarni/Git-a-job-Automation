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
  console.error(`Create ${inputPath}, paste/fetch the Jira ticket content, then run this again.`);
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
    'Section', 'Title', 'Type', 'Priority', 'Estimate', 'References', 'Preconditions', 'Steps',
    'Expected Result', 'Is Automated', 'Automation Type', 'Automation ID', 'Playwright File',
    'Playwright Command', 'Notes',
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

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function detectFeature(summary, text) {
  const combined = `${summary}\n${text}`.toLowerCase();

  if (containsAny(combined, [
    'ftue', 'first-time setup', 'first time setup', 'first-time user', 'first time user',
    'onboarding', 'initial profile build', 'canonical resume', 'canonical structured resume',
    'shared resume engine', 'job-aware mode', 'setup mode',
  ])) return 'ftue-resume-onboarding';

  if (containsAny(combined, [
    'resume parser', 'resume parsing', 'parser fixture', 'pdf upload', 'docx upload',
    'resume import', 'extract sections', 'two-column', 'two column', 'corrupt file',
    'unsupported file', 'ocr',
  ])) return 'resume-parser-import';

  if (containsAny(combined, [
    'hallucination', 'ai safety', 'rewrite', 'missing keyword', 'prompt injection',
    'false claim', 'false claims', 'invent experience', 'hiring guarantee', 'ats analysis',
    'ai analysis',
  ])) return 'ai-analysis-safety';

  if (containsAny(combined, [
    'stripe', 'checkout.session.completed', 'webhook', 'payment', 'purchase credits',
    'checkout', 'signature', 'stripe event',
  ])) return 'stripe-webhooks';

  if (containsAny(combined, [
    'daily bonus', 'login bonus', 'signs in', 'sign in bonus', 'daily_login_bonus',
  ])) return 'daily-login-bonus';

  if (containsAny(combined, [
    'credit ledger', 'creditsledger', 'paid credits', 'free credits', 'donation',
    'donate credits', 'ledger delta', 'balance', 'idempotency',
  ])) return 'credit-ledger-billing';

  if (containsAny(combined, [
    'auth', 'authentication', 'access control', 'logged-out', 'logged out', 'signin',
    'sign in', 'sign-in', 'session', 'protected route', 'private route', 'account page',
  ])) return 'auth-access-control';

  if (containsAny(combined, [
    'job search', 'job match', 'jobs/match', 'apply pack', 'saved job', 'role context',
    'job context', 'tailor per role', 'matching',
  ])) return 'job-search-match-apply';

  if (containsAny(combined, [
    'homepage', 'landing', 'cta', 'navigation', 'nav', 'header', 'footer', 'smoke',
    'responsive',
  ])) return 'ui-navigation-smoke';

  if (containsAny(combined, [
    'accessibility', 'a11y', 'keyboard', 'focus state', 'focus states', 'screen reader',
    'aria', 'contrast', 'form label',
  ])) return 'accessibility-usability';

  if (containsAny(combined, [
    'admin', 'donation pool', 'fulfill', 'admin-only', 'non-admin', 'request fulfillment',
    'audit',
  ])) return 'admin-donation-pool';

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

function makePackage(ticket, feature, section, cases, rules) {
  const playwrightFile = `generated-qa/${ticket.key}/${ticket.key}-fixture-test.spec.js`;
  const fixtures = {
    issueKey: ticket.key,
    feature,
    rules,
    cases: cases.map((testCase) => ({
      id: testCase.id,
      title: testCase.title,
      priority: testCase.priority,
      type: testCase.type,
      expected: testCase.expected,
      ruleRefs: testCase.ruleRefs || [],
    })),
  };

  return { cases, testrailRows: buildRows(ticket, cases, section, playwrightFile), fixtures };
}

function makeCase(id, title, priority, type, preconditions, stepList, expected, automated, notes, ruleRefs) {
  return { id, title, priority, type, preconditions, steps: steps(...stepList), expected, automated, notes, ruleRefs };
}

function buildResumeParserPackage(ticket) {
  const cases = [
    makeCase('GAJ-PARSER-IMP-001', 'PDF resume imports without parser crash', 'High', 'Functional',
      'A valid fake/anonymized PDF resume fixture is available.',
      ['Upload/import a valid PDF resume.', 'Run parsing/import flow.', 'Review extracted resume state.'],
      'The PDF imports without crashing and produces usable structured resume data.', 'Yes',
      'Core parser/import happy path.', ['validPdfSupported', 'structuredOutputRequired']),
    makeCase('GAJ-PARSER-IMP-002', 'DOCX resume imports without parser crash', 'High', 'Functional',
      'A valid fake/anonymized DOCX resume fixture is available.',
      ['Upload/import a valid DOCX resume.', 'Run parsing/import flow.', 'Review extracted resume state.'],
      'The DOCX imports without crashing and produces usable structured resume data.', 'Yes',
      'Core DOCX import check.', ['validDocxSupported', 'structuredOutputRequired']),
    makeCase('GAJ-PARSER-IMP-003', 'Unsupported file type is rejected safely', 'High', 'Negative',
      'Unsupported test file is available.',
      ['Attempt to upload unsupported file type.', 'Observe user-facing error.', 'Check that no corrupted resume state is saved.'],
      'The app shows a safe error and does not save corrupted resume data.', 'Yes',
      'Prevents bad parser state.', ['unsupportedRejectedSafely']),
    makeCase('GAJ-PARSER-IMP-004', 'Corrupt resume file fails gracefully', 'High', 'Negative',
      'Corrupt PDF/DOCX fixture is available.',
      ['Upload corrupt resume fixture.', 'Run import/parser flow.', 'Observe error handling.'],
      'The parser fails gracefully with no crash and no partial/corrupt profile save.', 'Yes',
      'Protects import reliability.', ['corruptRejectedSafely']),
    makeCase('GAJ-PARSER-IMP-005', 'Two-column resume layout preserves major sections', 'Medium', 'Regression',
      'Two-column fake resume fixture is available.',
      ['Import two-column resume.', 'Review parsed sections.', 'Compare against expected output.'],
      'Major sections such as experience, education, skills, and contact details are not mixed or lost.', 'Future',
      'Parser layout complexity check.', ['sectionIntegrityRequired']),
    makeCase('GAJ-PARSER-IMP-006', 'Parsed resume data remains fake/anonymized in fixtures', 'Medium', 'Data Integrity',
      'Fixture corpus is available.',
      ['Review fixture input/output files.', 'Scan for non-fake emails or personal identifiers.', 'Confirm fixture data policy.'],
      'Fixtures use fake/anonymized content only.', 'Yes',
      'Prevents accidental real personal data in repo.', ['fakeDataOnly']),
  ];
  return makePackage(ticket, 'resume-parser-import', 'Manual - 03 Resume Parser Fixtures', cases, {
    validPdfSupported: true, validDocxSupported: true, unsupportedRejectedSafely: true,
    corruptRejectedSafely: true, structuredOutputRequired: true, sectionIntegrityRequired: true,
    fakeDataOnly: true,
  });
}

function buildAiSafetyPackage(ticket) {
  const cases = [
    makeCase('GAJ-AI-SAFE-001', 'Rewrite suggestions do not invent candidate experience', 'High', 'AI Safety',
      'Resume bullet and job description inputs are available.',
      ['Run AI rewrite/suggestion flow.', 'Compare output against original resume facts.', 'Look for invented tools, employers, metrics, or duties.'],
      'Suggestions preserve candidate facts and do not invent experience.', 'Yes',
      'Highest-risk AI behavior.', ['noInventedExperience']),
    makeCase('GAJ-AI-SAFE-002', 'Job description keywords do not become false claims', 'High', 'AI Safety',
      'Job description includes skills not present in the resume.',
      ['Run analysis/rewrite flow.', 'Review missing keyword suggestions and rewrites.', 'Check whether missing skills are represented as experience.'],
      'Missing job keywords remain advisory and are not converted into false resume claims.', 'Yes',
      'Protects truthfulness and user trust.', ['missingKeywordsAdvisoryOnly']),
    makeCase('GAJ-AI-SAFE-003', 'Prompt injection content is ignored safely', 'High', 'Security',
      'Resume/job text contains prompt injection instructions.',
      ['Submit content containing prompt injection.', 'Run AI analysis.', 'Review output for policy bypass or instruction leakage.'],
      'The system ignores malicious instructions and provides safe analysis only.', 'Yes',
      'Prompt injection regression coverage.', ['promptInjectionBlocked']),
    makeCase('GAJ-AI-SAFE-004', 'Hiring guarantee language is blocked', 'Medium', 'AI Safety',
      'Input or requested output encourages guaranteed hiring/result language.',
      ['Run AI content generation.', 'Review generated text.', 'Check for guarantee claims.'],
      'Output avoids guaranteed hiring, interview, or job-offer claims.', 'Yes',
      'Avoids misleading user-facing claims.', ['noHiringGuarantees']),
    makeCase('GAJ-AI-SAFE-005', 'Safe rewrite language remains specific and truthful', 'Medium', 'Regression',
      'Valid resume bullet and role context exist.',
      ['Generate a safe rewrite.', 'Review wording.', 'Check clarity, specificity, and truthfulness.'],
      'Rewrite improves clarity without adding unsupported facts.', 'Future',
      'Manual review may be needed for language quality.', ['truthfulRewrite']),
  ];
  return makePackage(ticket, 'ai-analysis-safety', 'Manual - 04 AI Safety / Hallucination', cases, {
    noInventedExperience: true, missingKeywordsAdvisoryOnly: true, promptInjectionBlocked: true,
    noHiringGuarantees: true, truthfulRewrite: true,
  });
}

function buildCreditLedgerPackage(ticket) {
  const cases = [
    makeCase('GAJ-CREDIT-LEDGER-001', 'Credit balance equals sum of ledger deltas', 'High', 'Data Integrity',
      'User has multiple credit ledger entries.',
      ['Fetch or calculate user ledger entries.', 'Sum all deltas.', 'Compare against displayed/computed balance.'],
      'Credit balance matches the sum of ledger deltas.', 'Yes', 'Core ledger invariant.', ['balanceFromDeltas']),
    makeCase('GAJ-CREDIT-LEDGER-002', 'Paid credits are separated from free credits', 'High', 'Business Rule',
      'User has purchased and free/bonus credits.',
      ['Review ledger entries by reason.', 'Calculate paid-credit eligible balance.', 'Compare against donation/purchase-only eligibility.'],
      'Paid credits remain distinguishable from free credits.', 'Yes', 'Required for donation eligibility.', ['paidVsFreeSeparated']),
    makeCase('GAJ-CREDIT-LEDGER-003', 'Duplicate credit event does not double-award', 'High', 'Regression',
      'Duplicate event/ref can be simulated.',
      ['Submit or process first credit event.', 'Submit duplicate event with same ref.', 'Review ledger entries and balance.'],
      'Only one ledger entry is created for the same idempotent ref.', 'Yes', 'Idempotency coverage.', ['idempotentRefs']),
    makeCase('GAJ-CREDIT-LEDGER-004', 'Donation eligibility uses paid credits only', 'High', 'Business Rule',
      'User has free credits and insufficient paid credits.',
      ['Attempt credit donation.', 'Review validation result.', 'Review ledger state.'],
      'Donation is blocked when paid-credit eligibility is insufficient.', 'Yes', 'Protects paid-credit accounting.', ['donationUsesPaidOnly']),
    makeCase('GAJ-CREDIT-LEDGER-005', 'Ledger entries remain isolated by user', 'High', 'Data Integrity',
      'Two users have separate ledger histories.',
      ['Calculate User A balance.', 'Calculate User B balance.', 'Confirm no cross-user entries are counted.'],
      'Each user balance is isolated to that user only.', 'Yes', 'Prevents account data leakage/corruption.', ['userIsolation']),
  ];
  return makePackage(ticket, 'credit-ledger-billing', 'Manual - 05 Credit Ledger', cases, {
    balanceFromDeltas: true, paidVsFreeSeparated: true, idempotentRefs: true,
    donationUsesPaidOnly: true, userIsolation: true,
  });
}

function buildDailyLoginBonusPackage(ticket) {
  const cases = [
    makeCase('GAJ-CREDIT-DAILY-001', 'First eligible sign-in grants 10 credits', 'High', 'Functional',
      'User account exists. User has not received the daily login bonus for the selected bonus date.',
      ['Sign in as an eligible user.', 'Allow the daily bonus award logic to run.', 'Review the user credit balance and ledger entries.'],
      'User receives exactly +10 credits and one daily_login_bonus ledger entry is created.', 'Future', 'Core happy path for daily bonus behavior.', ['bonusAmount', 'oncePerDay']),
    makeCase('GAJ-CREDIT-DAILY-002', 'Repeated same-day sign-in does not grant duplicate bonus', 'High', 'Regression',
      'User has already received a daily_login_bonus entry for the selected bonus date.',
      ['Sign out if needed.', 'Sign in again as the same user on the same bonus date.', 'Review the user credit balance and ledger entries.'],
      'No second +10 daily_login_bonus entry is created for the same user/date.', 'Future', 'Important idempotency check.', ['oncePerDay']),
    makeCase('GAJ-CREDIT-DAILY-003', 'Daily bonus ledger entry uses correct reason and ref', 'High', 'Data Integrity',
      'Eligible user can receive daily login bonus.',
      ['Trigger daily bonus award.', 'Inspect the resulting ledger entry.', 'Verify ledger reason and ref format.'],
      'Ledger entry uses delta +10, reason daily_login_bonus, and a unique ref for user/date.', 'Yes', 'Can be checked in fixture-level automation before DB integration exists.', ['bonusReason', 'uniqueRef']),
    makeCase('GAJ-CREDIT-DAILY-004', 'Daily bonus is isolated per user', 'High', 'Data Integrity',
      'Two different users exist and neither has received the daily bonus for the selected date.',
      ['Sign in as User A and trigger daily bonus.', 'Sign in as User B and trigger daily bonus.', 'Review both users credit ledgers.'],
      'Each user can receive their own +10 bonus. User A actions do not affect User B balance.', 'Yes', 'User isolation check.', ['userIsolation']),
    makeCase('GAJ-CREDIT-DAILY-005', 'Near-midnight sign-in does not double-award incorrectly', 'Medium', 'Edge Case',
      'Test environment can control or simulate bonus dates/timestamps.',
      ['Trigger sign-in near the daily cutoff boundary.', 'Trigger another sign-in around the boundary.', 'Review ledger entries by bonus date.'],
      'Bonus is awarded according to the intended date rule and does not duplicate unexpectedly.', 'Future', 'Requires clear timezone/date policy.', ['dateBoundarySafe']),
    makeCase('GAJ-CREDIT-DAILY-006', 'Concurrent sign-ins do not create duplicate bonus entries', 'High', 'Regression',
      'Eligible user exists. Test can simulate rapid or concurrent login requests.',
      ['Trigger two sign-in/bonus attempts for the same user/date close together.', 'Review resulting ledger entries.', 'Review final credit balance.'],
      'Only one +10 daily_login_bonus entry exists for the same user/date.', 'Future', 'Race-condition/idempotency check.', ['concurrentSafe']),
    makeCase('GAJ-CREDIT-DAILY-007', 'Bonus credits are not treated as paid or donatable credits', 'High', 'Business Rule',
      'User has only daily_login_bonus credits and no purchased credits.',
      ['Award daily login bonus.', 'Attempt a paid-credit-only action such as donation if applicable.', 'Review eligibility calculation.'],
      'Daily bonus credits are treated as free credits and do not count as paid/donatable credits.', 'Yes', 'Important because donation logic distinguishes paid credits from free credits.', ['bonusIsFreeCredit']),
    makeCase('GAJ-CREDIT-DAILY-008', 'UI credit count updates after daily bonus award', 'Medium', 'UI',
      'Eligible user exists and can sign in through the UI.',
      ['Sign in as an eligible user.', 'Observe the header/account credit count.', 'Refresh or navigate if needed.'],
      'Displayed credit count reflects the +10 daily bonus after the award is granted.', 'Future', 'UI/E2E check after auth test harness exists.', ['uiReflectsBalance']),
  ];
  return makePackage(ticket, 'daily-login-bonus', 'Manual - 05 Credit Ledger', cases, {
    bonusAmount: 10, bonusReason: 'daily_login_bonus', oncePerDay: true,
    uniqueRef: 'daily_login_bonus:{userId}:{YYYY-MM-DD}', bonusIsFreeCredit: true,
    userIsolation: true, dateBoundarySafe: true, concurrentSafe: true, uiReflectsBalance: true,
  });
}

function buildStripeWebhookPackage(ticket) {
  const cases = [
    makeCase('GAJ-STRIPE-001', 'Checkout completed event awards purchased credits', 'High', 'Integration',
      'Valid Stripe checkout.session.completed event fixture exists.',
      ['Process valid checkout completed event.', 'Review Stripe event handling result.', 'Review credit ledger entries.'],
      'Purchased credits are awarded once with a purchase_stripe ledger reason/ref.', 'Future', 'Core payment-to-credit path.', ['checkoutAwardsCredits']),
    makeCase('GAJ-STRIPE-002', 'Duplicate Stripe event does not double-award credits', 'High', 'Regression',
      'Same Stripe event can be processed twice.',
      ['Process Stripe event once.', 'Process same Stripe event again.', 'Review ledger entries.'],
      'Duplicate event is ignored/idempotent and credits are not double-awarded.', 'Yes', 'Critical billing idempotency.', ['stripeEventIdempotency']),
    makeCase('GAJ-STRIPE-003', 'Invalid signature is rejected', 'High', 'Security',
      'Webhook request with invalid signature is available.',
      ['Submit webhook with invalid signature.', 'Review response.', 'Review ledger state.'],
      'Webhook is rejected and no credits are awarded.', 'Future', 'Security boundary.', ['signatureRequired']),
    makeCase('GAJ-STRIPE-004', 'Unknown event type is handled safely', 'Medium', 'Negative',
      'Unknown/unhandled Stripe event fixture exists.',
      ['Process unknown Stripe event type.', 'Review response/log behavior.', 'Review ledger state.'],
      'Event is safely ignored or acknowledged without creating credits.', 'Future', 'Webhook resilience check.', ['unknownEventsSafe']),
    makeCase('GAJ-STRIPE-005', 'Database failure does not mark credit award successful', 'High', 'Data Integrity',
      'Database write failure can be simulated.',
      ['Process valid payment event while ledger write fails.', 'Review response/error handling.', 'Retry after DB recovery if applicable.'],
      'Failure does not create false success state and can be retried safely.', 'Future', 'Prevents payment/credit inconsistency.', ['dbFailureSafe']),
  ];
  return makePackage(ticket, 'stripe-webhooks', 'Manual - 05 Credit Ledger', cases, {
    checkoutAwardsCredits: true, stripeEventIdempotency: true, signatureRequired: true,
    unknownEventsSafe: true, dbFailureSafe: true,
  });
}

function buildAuthAccessPackage(ticket) {
  const cases = [
    makeCase('GAJ-AUTH-001', 'Logged-out user is blocked from private resume analyzer', 'High', 'Security',
      'User is logged out.', ['Navigate directly to private resume analyzer route.', 'Observe response or redirect.', 'Check that private data is not shown.'],
      'Logged-out user is redirected or blocked safely.', 'Yes', 'Basic auth gate.', ['loggedOutBlocked']),
    makeCase('GAJ-AUTH-002', 'Authenticated user can access private resume analyzer', 'High', 'Functional',
      'User is authenticated.', ['Navigate to private analyzer route.', 'Allow page/session to load.', 'Observe analyzer availability.'],
      'Authenticated user can access the private analyzer experience.', 'Future', 'Requires reliable test auth harness.', ['authUserAllowed']),
    makeCase('GAJ-AUTH-003', 'Protected API rejects unauthenticated request', 'High', 'Security',
      'No valid session/token is provided.', ['Call protected API endpoint without auth.', 'Review status and response body.', 'Check for data leakage.'],
      'API rejects request without exposing private data.', 'Future', 'API-level auth coverage.', ['protectedApiRejectsUnauth']),
    makeCase('GAJ-AUTH-004', 'Stale session is handled safely', 'Medium', 'Regression',
      'Expired/stale session can be simulated.', ['Open private route with stale session.', 'Trigger protected action.', 'Observe refresh/logout behavior.'],
      'Stale session does not allow unauthorized access or corrupt state.', 'Future', 'Session edge case.', ['staleSessionSafe']),
  ];
  return makePackage(ticket, 'auth-access-control', 'Manual - 01 Auth & Access Control', cases, {
    loggedOutBlocked: true, authUserAllowed: true, protectedApiRejectsUnauth: true, staleSessionSafe: true,
  });
}

function buildFtueResumeOnboardingPackage(ticket) {
  const cases = [
    makeCase('GAJ-FTUE-001', 'First-time user enters setup mode', 'High', 'Functional',
      'User is new and has no canonical structured resume or completed onboarding resume.',
      ['Open the resume experience as a first-time user.', 'Allow resume engine mode selection to run.', 'Observe the selected mode.'],
      'User enters first-time setup mode instead of normal job-aware mode.', 'Yes', 'Core mode-selection rule for new users.', ['firstTimeUserEntersSetupMode']),
    makeCase('GAJ-FTUE-002', 'Returning user bypasses setup mode', 'High', 'Regression',
      'User has a canonical structured resume/profile and completed onboarding state.',
      ['Open the resume experience as a returning user.', 'Allow resume engine mode selection to run.', 'Observe the selected mode.'],
      'User bypasses setup mode and enters the normal job-aware path when applicable.', 'Yes', 'Prevents returning users from being trapped in onboarding.', ['returningUserBypassesSetupMode']),
    makeCase('GAJ-FTUE-003', 'Setup mode uses shared resume engine', 'High', 'Architecture',
      'First-time setup mode is available.', ['Enter setup mode.', 'Inspect behavior/components used by setup mode.', 'Compare with normal resume engine behavior where practical.'],
      'Setup mode is a mode/state of the shared resume engine, not a separate divergent resume system.', 'Future', 'Mostly architectural/manual until implementation exposes testable hooks.', ['setupModeUsesSharedResumeEngine']),
    makeCase('GAJ-FTUE-004', 'Initial profile build does not charge credits', 'High', 'Business Rule',
      'First-time user is eligible for initial resume/profile setup.', ['Start first-time resume/profile setup.', 'Complete initial setup actions.', 'Review credit balance and credit ledger.'],
      'Initial profile setup is free and does not consume credits.', 'Yes', 'Critical monetization and trust check.', ['initialSetupIsFree']),
    makeCase('GAJ-FTUE-005', 'Completing setup persists canonical structured resume', 'High', 'Data Integrity',
      'First-time user has completed setup inputs or imported resume data.', ['Complete guided resume setup.', 'Save/finish the setup flow.', 'Reload account/profile or query stored profile state.'],
      'A canonical structured resume/profile snapshot is persisted and available for ATS/matching.', 'Yes', 'Core data persistence check.', ['completingSetupPersistsCanonicalProfile']),
    makeCase('GAJ-FTUE-006', 'User routes to Account/Profile after setup', 'Medium', 'Navigation',
      'First-time user completes setup.', ['Finish first-time setup.', 'Observe the next route or CTA.', 'Open Account/Profile if routed there.'],
      'User is routed or prompted toward Account/Profile for optional cleanup after setup.', 'Future', 'May depend on final UX routing decision.', ['postSetupProfileRoute']),
    makeCase('GAJ-FTUE-007', 'User can continue into Jobs/Match after setup', 'Medium', 'Navigation',
      'User has completed setup and has a canonical structured resume/profile.', ['Complete first-time setup.', 'Choose to continue into Jobs/Match or Apply Pack flow.', 'Observe whether the profile is available to the downstream flow.'],
      'User can continue into Jobs/Match with the canonical profile available.', 'Future', 'Good later E2E candidate.', ['jobsMatchUsesProfile']),
    makeCase('GAJ-FTUE-008', 'Job-aware mode uses canonical profile after onboarding', 'High', 'Regression',
      'User completed onboarding and has a canonical structured profile. Job/role context exists.', ['Open a job-aware resume or matching flow.', 'Load or apply role/job context.', 'Observe the source profile used by the flow.'],
      'Job-aware mode uses the canonical structured profile created during setup.', 'Yes', 'Connects FTUE output to later matching/ATS behavior.', ['jobAwareModeUsesCanonicalProfile']),
    makeCase('GAJ-FTUE-009', 'Tutorial messaging explains base resume vs role tailoring', 'Medium', 'Content',
      'First-time user is in setup/tutorial flow.', ['Open setup/tutorial messaging.', 'Read the explanation for base resume/profile setup.', 'Review any mention of tailoring per role later.'],
      'Messaging clearly explains that the user builds a strong base resume once and tailors per role later.', 'Future', 'Manual content/UX review.', ['tutorialMessagingClear']),
    makeCase('GAJ-FTUE-010', 'Incomplete onboarding resumes correctly', 'High', 'Edge Case',
      'User starts onboarding but does not complete setup.', ['Begin first-time setup.', 'Exit or refresh before completion.', 'Return to the resume experience.'],
      'User can resume setup without being incorrectly marked complete or losing entered/imported state.', 'Yes', 'Important state recovery case.', ['incompleteOnboardingCanResume']),
  ];
  return makePackage(ticket, 'ftue-resume-onboarding', 'Manual - 08 Future Authenticated E2E', cases, {
    firstTimeUserEntersSetupMode: true, returningUserBypassesSetupMode: true,
    setupModeUsesSharedResumeEngine: true, initialSetupIsFree: true,
    completingSetupPersistsCanonicalProfile: true, jobAwareModeUsesCanonicalProfile: true,
    incompleteOnboardingCanResume: true, postSetupProfileRoute: true, jobsMatchUsesProfile: true,
    tutorialMessagingClear: true,
  });
}

function buildJobSearchPackage(ticket) {
  const cases = [
    makeCase('GAJ-JOBS-001', 'Canonical profile is required before matching', 'High', 'Business Rule',
      'User has no canonical profile.', ['Open Jobs/Match flow.', 'Attempt to start matching/apply flow.', 'Observe routing or validation.'],
      'User is guided to create or complete a canonical profile before matching.', 'Future', 'Keeps matching grounded in user profile data.', ['canonicalProfileRequired']),
    makeCase('GAJ-JOBS-002', 'Job context is applied correctly', 'High', 'Functional',
      'User has canonical profile and selected job/role context.', ['Select or open job context.', 'Run matching/analysis.', 'Review displayed job context in results.'],
      'The selected job context is used consistently for scoring/matching.', 'Future', 'Prevents stale/wrong job context.', ['jobContextApplied']),
    makeCase('GAJ-JOBS-003', 'Role-specific tailoring avoids false claims', 'High', 'AI Safety',
      'User profile and job description exist.', ['Generate role-specific suggestions/apply pack.', 'Review claims against canonical profile.', 'Look for unsupported experience.'],
      'Tailored output aligns to the role without inventing candidate experience.', 'Future', 'Bridges job matching and AI safety.', ['noFalseClaims']),
    makeCase('GAJ-JOBS-004', 'Saved job state persists for returning user', 'Medium', 'Regression',
      'User saves or interacts with a job.', ['Save/select job.', 'Leave and return to Jobs/Match.', 'Review saved state.'],
      'Saved job or match state is retained for the user.', 'Future', 'State persistence check.', ['savedJobPersists']),
  ];
  return makePackage(ticket, 'job-search-match-apply', 'Manual - 08 Future Authenticated E2E', cases, {
    canonicalProfileRequired: true, jobContextApplied: true, noFalseClaims: true, savedJobPersists: true,
  });
}

function buildUiSmokePackage(ticket) {
  const cases = [
    makeCase('GAJ-UI-001', 'Page loads without critical error', 'High', 'Smoke',
      'Target environment is available.', ['Open the target page.', 'Wait for page load.', 'Check for major visible error states.'],
      'Page loads successfully without a critical error.', 'Future', 'Basic smoke check.', ['pageLoads']),
    makeCase('GAJ-UI-002', 'Primary CTA is visible and actionable', 'Medium', 'UI',
      'Target page is loaded.', ['Locate primary CTA.', 'Click or inspect destination.', 'Verify expected navigation/action.'],
      'Primary CTA is visible and leads to the expected flow.', 'Future', 'Conversion/navigation check.', ['ctaWorks']),
    makeCase('GAJ-UI-003', 'Header/navigation links do not break primary flow', 'Medium', 'Regression',
      'Header/nav is visible.', ['Click primary nav links.', 'Observe route changes.', 'Confirm no broken or blank pages.'],
      'Navigation works without broken pages or dead ends.', 'Future', 'Useful broad smoke check.', ['navSafe']),
  ];
  return makePackage(ticket, 'ui-navigation-smoke', 'Manual - 00 Public Smoke', cases, {
    pageLoads: true, ctaWorks: true, navSafe: true,
  });
}

function buildAccessibilityPackage(ticket) {
  const cases = [
    makeCase('GAJ-A11Y-001', 'Keyboard navigation reaches primary controls', 'Medium', 'Accessibility',
      'Target page is loaded.', ['Use keyboard Tab/Shift+Tab only.', 'Navigate through primary controls.', 'Confirm controls can be reached.'],
      'Primary controls are reachable by keyboard.', 'Future', 'Manual/semiautomated accessibility check.', ['keyboardReachable']),
    makeCase('GAJ-A11Y-002', 'Form inputs have useful labels or accessible names', 'Medium', 'Accessibility',
      'Target form is visible.', ['Inspect form inputs.', 'Check labels/placeholders/accessibility tree where practical.', 'Submit invalid form to view errors.'],
      'Inputs have clear labels/accessibility names and errors are understandable.', 'Future', 'Important for resume upload/forms.', ['formsLabeled']),
    makeCase('GAJ-A11Y-003', 'Visible focus states are present', 'Low', 'Accessibility',
      'Interactive controls exist.', ['Navigate with keyboard.', 'Observe focus indicator.', 'Check important buttons/links.'],
      'Focused controls have visible focus states.', 'Future', 'Manual visual check.', ['visibleFocus']),
  ];
  return makePackage(ticket, 'accessibility-usability', 'Manual - 07 Release Readiness', cases, {
    keyboardReachable: true, formsLabeled: true, visibleFocus: true,
  });
}

function buildAdminDonationPackage(ticket) {
  const cases = [
    makeCase('GAJ-ADMIN-001', 'Non-admin user is blocked from admin route', 'High', 'Security',
      'User is authenticated but not admin.', ['Navigate to admin/donation route.', 'Observe response.', 'Check for private admin data exposure.'],
      'Non-admin user is blocked or redirected safely.', 'Future', 'Admin access gate.', ['nonAdminBlocked']),
    makeCase('GAJ-ADMIN-002', 'Admin can view donation pool state', 'Medium', 'Functional',
      'Admin user is authenticated.', ['Open admin donation pool view.', 'Review visible pool state.', 'Compare against expected ledger/pool data.'],
      'Admin can view accurate donation pool information.', 'Future', 'Admin visibility check.', ['adminCanViewPool']),
    makeCase('GAJ-ADMIN-003', 'Fulfillment updates request and ledger consistently', 'High', 'Data Integrity',
      'Pending donation/credit request exists.', ['Fulfill request as admin.', 'Review request status.', 'Review credit ledger/pool changes.'],
      'Fulfillment updates request status and ledger/pool records consistently.', 'Future', 'Important admin accounting flow.', ['fulfillmentConsistent']),
  ];
  return makePackage(ticket, 'admin-donation-pool', 'Manual - 07 Release Readiness', cases, {
    nonAdminBlocked: true, adminCanViewPool: true, fulfillmentConsistent: true,
  });
}

function buildGenericPackage(ticket) {
  const safeNumber = ticket.key.replace(/[^0-9]/g, '') || 'GEN';
  const cases = [makeCase(`GAJ-${safeNumber}-001`, 'Happy path works as expected', 'High', 'Functional',
    'Feature is available in the test environment.', ['Open the feature area.', 'Perform the primary user action.', 'Review the result.'],
    'The feature completes successfully and shows the expected result.', 'Future', 'Generated generic case. Human review required.', ['humanReviewRequired'])];
  return makePackage(ticket, 'generic-feature', 'Manual - Generated QA', cases, { humanReviewRequired: true });
}

function buildFixtureTest(ticket, feature) {
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
    expect(data.feature).toBe('${feature}');
    expect(data.rules).toBeTruthy();
    expect(Array.isArray(data.cases)).toBeTruthy();
    expect(data.cases.length).toBeGreaterThan(0);
  });

  test('${ticket.key}-FIXTURE-002 - generated cases have stable IDs and expected outcomes', async () => {
    const data = readFixture();

    for (const testCase of data.cases) {
      expect(testCase.id).toMatch(/^GAJ-/);
      expect(testCase.title).toBeTruthy();
      expect(testCase.expected).toBeTruthy();
    }
  });

  test('${ticket.key}-FIXTURE-003 - generated rule references exist in fixture rules', async () => {
    const data = readFixture();
    const availableRules = new Set(Object.keys(data.rules || {}));

    for (const testCase of data.cases) {
      for (const ruleRef of testCase.ruleRefs || []) {
        expect(availableRules.has(ruleRef)).toBeTruthy();
      }
    }
  });
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

const packageBuilders = {
  'daily-login-bonus': buildDailyLoginBonusPackage,
  'ftue-resume-onboarding': buildFtueResumeOnboardingPackage,
  'resume-parser-import': buildResumeParserPackage,
  'ai-analysis-safety': buildAiSafetyPackage,
  'credit-ledger-billing': buildCreditLedgerPackage,
  'stripe-webhooks': buildStripeWebhookPackage,
  'auth-access-control': buildAuthAccessPackage,
  'job-search-match-apply': buildJobSearchPackage,
  'ui-navigation-smoke': buildUiSmokePackage,
  'accessibility-usability': buildAccessibilityPackage,
  'admin-donation-pool': buildAdminDonationPackage,
  'generic-feature': buildGenericPackage,
};

const packageData = (packageBuilders[feature] || buildGenericPackage)(ticket);

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

This QA package was generated from pasted/fetched Jira ticket text.

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

Feature type:
- ${feature}

Generated case count:
- ${packageData.cases.length}

Recommended validation:
- Review generated test cases before importing to TestRail.
- Import CSV into TestRail if approved.
- Run fixture skeleton manually after review.
- Promote fixture test to main test suite only when stable.

Notes:
Generated by scripts/generate-qa-package.js from Jira input.
`;

fs.writeFileSync(evidencePath, evidence, 'utf8');

console.log(`Generated QA package for ${ticket.key}`);
console.log(`Feature type: ${feature}`);
console.log(`Case count: ${packageData.cases.length}`);
console.log(`Output folder: ${outputDir}`);
console.log('');
console.log('Created:');
console.log(`- ${testDesignPath}`);
console.log(`- ${testrailCsvPath}`);
console.log(`- ${fixturesPath}`);
console.log(`- ${fixtureTestPath}`);
console.log(`- ${evidencePath}`);
