const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'test-artifacts');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const users = [
  {
    id: 'qa-user-with-credits',
    email: 'qa.user.credits@example.com',
    role: 'user',
    credits: 10,
  },
  {
    id: 'qa-user-zero-credits',
    email: 'qa.user.zero@example.com',
    role: 'user',
    credits: 0,
  },
  {
    id: 'qa-admin-user',
    email: 'qa.admin@example.com',
    role: 'admin',
    credits: 25,
  },
  {
    id: 'qa-user-a',
    email: 'qa.user.a@example.com',
    role: 'user',
    credits: 5,
  },
  {
    id: 'qa-user-b',
    email: 'qa.user.b@example.com',
    role: 'user',
    credits: 2,
  },
];

const creditLedger = [
  {
    id: 'ledger-001',
    userId: 'qa-user-with-credits',
    delta: 10,
    reason: 'purchase_stripe',
    ref: 'stripe-test-event-001',
  },
  {
    id: 'ledger-002',
    userId: 'qa-user-with-credits',
    delta: -1,
    reason: 'analyze_resume',
    ref: 'analysis-test-001',
  },
  {
    id: 'ledger-003',
    userId: 'qa-user-zero-credits',
    delta: 0,
    reason: 'initial_state',
    ref: 'seed-zero-credits',
  },
];

const analysisRecords = [
  {
    id: 'analysis-001',
    userId: 'qa-user-a',
    resumeId: 'clean-qa-resume',
    jobDescriptionId: 'qa-analyst-edtech',
    score: 82,
    missingKeywords: ['Playwright', 'API testing'],
  },
  {
    id: 'analysis-002',
    userId: 'qa-user-b',
    resumeId: 'weak-match-resume',
    jobDescriptionId: 'qa-analyst-edtech',
    score: 34,
    missingKeywords: ['QA', 'Regression Testing', 'Jira'],
  },
];

const output = {
  generatedAt: new Date().toISOString(),
  users,
  creditLedger,
  analysisRecords,
};

const outputPath = path.join(outputDir, 'generated-test-data.json');

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Generated test data at: ${outputPath}`);
