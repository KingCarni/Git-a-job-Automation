# JOB-152 — Add Playwright JUnit reporter output for CI results

New-Item -ItemType Directory -Force -Path `
  "scripts", `
  "test-results", `
  "day-11-junit-reporting", `
  "testrail-import" | Out-Null

@'
const { spawnSync } = require('child_process');
const path = require('path');

const junitOutputPath = path.join('test-results', 'junit.xml');

const ciSafeTestFiles = [
  'tests/test-data-fixtures.spec.js',
  'tests/resume-fixtures.spec.js',
  'tests/ai-safety-fixtures.spec.js',
  'tests/credit-ledger-fixtures.spec.js',
];

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

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
'@ | Set-Content "scripts\run-ci-junit.js"

@'
# JOB-152 Playwright JUnit Reporting

## Purpose

Generate JUnit XML output from Playwright so CI results can be imported or linked into test management tools.

## Why This Matters

JUnit XML is a common automation-result format supported by many tools, including:

- TestRail import workflows
- Xray import workflows
- Zephyr-style automation integrations
- CI/CD reporting tools

## Current Flow

```txt
npm run test:ci:junit
↓
Playwright CI-safe tests run
↓
test-results/junit.xml is generated
↓
GitHub Actions uploads junit.xml as artifact
↓
Future step: import junit.xml into TestRail test run