const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const outputDir = 'test-results';
const junitOutputPath = path.join(outputDir, 'junit.xml');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const ciSafeTestFiles = [
  'tests/test-data-fixtures.spec.js',
  'tests/resume-fixtures.spec.js',
  'tests/ai-safety-fixtures.spec.js',
  'tests/credit-ledger-fixtures.spec.js',
];

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

console.log('Running CI-safe Playwright tests with JUnit output...');
console.log(`JUnit output: ${junitOutputPath}`);

const result = spawnSync(
  command,
  [
    'playwright',
    'test',
    ...ciSafeTestFiles,
    '--reporter=line,junit',
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_JUNIT_OUTPUT_NAME: junitOutputPath,
    },
  }
);

process.exit(result.status ?? 1);