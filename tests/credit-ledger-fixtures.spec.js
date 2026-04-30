const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const fixtureRoot = path.join(__dirname, '..', 'credit-ledger-fixtures');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(fixtureRoot, relativePath), 'utf8'));
}

function sumLedger(entries, userId) {
  return entries
    .filter((entry) => !userId || entry.userId === userId)
    .reduce((total, entry) => total + entry.delta, 0);
}

test.describe('Credit ledger regression fixture validation', () => {
  test('credit ledger cases have required fields', async () => {
    const data = readJson('ledger-cases/credit-ledger-regression-cases.json');

    expect(data.suite).toBe('credit-ledger-regression-cases');
    expect(Array.isArray(data.cases)).toBeTruthy();
    expect(data.cases.length).toBeGreaterThanOrEqual(6);

    for (const testCase of data.cases) {
      expect(testCase.id).toMatch(/^CL-/);
      expect(testCase.risk).toBeTruthy();
      expect(Array.isArray(testCase.startingLedger)).toBeTruthy();
      expect(testCase.expectedVerdict).toBe('pass');
    }
  });

  test('ledger balance case matches sum of deltas', async () => {
    const data = readJson('ledger-cases/credit-ledger-regression-cases.json');
    const balanceCase = data.cases.find((testCase) => testCase.id === 'CL-P0-005');

    expect(balanceCase).toBeTruthy();
    expect(sumLedger(balanceCase.startingLedger)).toBe(balanceCase.expectedFinalBalance);
  });

  test('cross-user balance isolation case scopes balances by user', async () => {
    const data = readJson('ledger-cases/credit-ledger-regression-cases.json');
    const isolationCase = data.cases.find((testCase) => testCase.id === 'CL-P0-006');

    expect(isolationCase).toBeTruthy();

    const simulatedLedger = [
      ...isolationCase.startingLedger,
      {
        userId: isolationCase.action.userId,
        delta: -1,
        reason: isolationCase.action.type,
        ref: isolationCase.action.ref
      }
    ];

    expect(sumLedger(simulatedLedger, 'qa-user-a')).toBe(isolationCase.expectedBalances['qa-user-a']);
    expect(sumLedger(simulatedLedger, 'qa-user-b')).toBe(isolationCase.expectedBalances['qa-user-b']);
  });

  test('webhook idempotency cases include duplicate event protections', async () => {
    const data = readJson('webhook-cases/stripe-webhook-idempotency-cases.json');

    expect(data.suite).toBe('stripe-webhook-idempotency-cases');

    const duplicateEventCase = data.cases.find((testCase) => testCase.id === 'WH-P0-001');
    const sameSessionCase = data.cases.find((testCase) => testCase.id === 'WH-P0-004');

    expect(duplicateEventCase).toBeTruthy();
    expect(duplicateEventCase.expectedLedgerEntries).toBe(1);
    expect(duplicateEventCase.webhookDeliveries.length).toBeGreaterThan(1);

    expect(sameSessionCase).toBeTruthy();
    expect(sameSessionCase.expectedLedgerEntries).toBe(1);
  });

  test('donation cases enforce paid-credit eligibility rules', async () => {
    const data = readJson('donation-cases/donation-eligibility-cases.json');

    expect(data.suite).toBe('donation-eligibility-cases');

    const freeCreditCase = data.cases.find((testCase) => testCase.id === 'DN-P0-002');
    const overDonationCase = data.cases.find((testCase) => testCase.id === 'DN-P0-001');
    const paidCreditCase = data.cases.find((testCase) => testCase.id === 'DN-P0-003');

    expect(freeCreditCase.expectedStatus).toBe('rejected');
    expect(freeCreditCase.expectedEligiblePaidCredits).toBe(0);

    expect(overDonationCase.expectedStatus).toBe('rejected');

    expect(paidCreditCase.expectedStatus).toBe('accepted');
    expect(paidCreditCase.expectedLedgerEntry.reason).toBe('donate_credits');
  });

  test('credit ledger rules include required P0 protections', async () => {
    const rules = readJson('expected-output/credit-ledger-rules.expected.json');

    expect(rules.allowedLedgerReasons).toContain('purchase_stripe');
    expect(rules.allowedLedgerReasons).toContain('analyze_resume');
    expect(rules.allowedLedgerReasons).toContain('donate_credits');
    expect(rules.allowedLedgerReasons).toContain('refund_failed_analysis');

    expect(rules.p0Rules.length).toBeGreaterThanOrEqual(6);
    expect(rules.recommendedApiAssertions).toContain('ledger entry count is correct');
  });
});
