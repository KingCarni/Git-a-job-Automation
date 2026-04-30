New-Item -ItemType Directory -Force -Path "day-13-testrail-mapping", "testrail-import" | Out-Null

$files = @{
  "tests\test-data-fixtures.spec.js" = @{
    "generated test data has required user and ledger records" = "GAJ-DATA-001 - Generated test data has required user and ledger records"
  }

  "tests\resume-fixtures.spec.js" = @{
    "source text fixtures and expected output files exist" = "GAJ-PARSER-001 - Resume fixture source and expected files exist"
    "expected output files are valid JSON" = "GAJ-PARSER-002 - Resume expected-output files are valid JSON"
    "fixtures use fake example emails only" = "GAJ-PARSER-003 - Resume fixtures use fake/anonymized emails"
    "unsupported and corrupt fixture placeholders exist" = "GAJ-PARSER-004 - Unsupported and corrupt fixture placeholders exist"
  }

  "tests\ai-safety-fixtures.spec.js" = @{
    "rewrite safety cases have required fields" = "GAJ-AI-001 - Rewrite safety cases have required fields"
    "unsafe rewrite examples include their blocked claims" = "GAJ-AI-002 - Unsafe rewrite examples include blocked claims"
    "safe rewrites do not contain blocked claims" = "GAJ-AI-003 - Safe rewrites do not contain blocked claims"
    "analysis safety cases cover prompt injection and hiring guarantee risks" = "GAJ-AI-004 - Analysis safety cases cover prompt injection and hiring guarantee risks"
    "safety rules include blocked terms and safe language examples" = "GAJ-AI-005 - Safety rules include blocked terms and safe language examples"
  }

  "tests\credit-ledger-fixtures.spec.js" = @{
    "credit ledger cases have required fields" = "GAJ-CREDIT-001 - Credit ledger cases have required fields"
    "ledger balance case matches sum of deltas" = "GAJ-CREDIT-002 - Ledger balance matches sum of deltas"
    "cross-user balance isolation case scopes balances by user" = "GAJ-CREDIT-003 - Cross-user credit balances remain isolated"
    "webhook idempotency cases include duplicate event protections" = "GAJ-CREDIT-004 - Webhook idempotency cases include duplicate event protections"
    "donation cases enforce paid-credit eligibility rules" = "GAJ-CREDIT-005 - Donation cases enforce paid-credit eligibility rules"
    "credit ledger rules include required P0 protections" = "GAJ-CREDIT-006 - Credit ledger rules include required P0 protections"
  }
}

foreach ($file in $files.Keys) {
  if (-not (Test-Path $file)) {
    Write-Host "Missing file: $file"
    continue
  }

  $content = Get-Content $file -Raw

  foreach ($oldTitle in $files[$file].Keys) {
    $newTitle = $files[$file][$oldTitle]
    $content = $content.Replace("test('$oldTitle'", "test('$newTitle'")
    $content = $content.Replace('test("' + $oldTitle + '"', 'test("' + $newTitle + '"')
  }

  Set-Content $file $content
}

Set-Content "day-13-testrail-mapping\job-157-plan.md" "# JOB-157 - Align Playwright Test Titles with TestRail Automation IDs

## Purpose

Make Playwright/JUnit output easier to map to existing TestRail GAJ test cases.

## Problem Found in JOB-156

TRCLI successfully imported 16/16 JUnit results, but it created new TestRail cases instead of mapping to the existing GAJ cases.

## Fix in This Pass

Add GAJ IDs to the CI-safe Playwright test titles.

Example:

Before:
rewrite safety cases have required fields

After:
GAJ-AI-001 - Rewrite safety cases have required fields

## Expected Result

The regenerated JUnit file should include GAJ IDs in testcase names.

## Remaining Work

TRCLI may still require TestRail automation_id values to match the generated JUnit testcase names exactly.
"

Set-Content "day-13-testrail-mapping\testrail-automation-id-strategy.md" "# TestRail Automation ID Strategy

## Recommended Strategy

Use GAJ IDs in Playwright test titles and TestRail case titles.

## Why

This makes test results readable across Playwright output, JUnit XML, TestRail cases, Jira references, and GitHub Actions artifacts.

## TRCLI Mapping Note

TRCLI may use generated automation_id values from JUnit testcase metadata. If title alignment is not enough, the next step is to backfill TestRail automation_id fields.
"

Set-Content "day-13-testrail-mapping\job-157-evidence-template.md" "# JOB-157 Evidence Template

## Validation

- Playwright CI-safe titles updated with GAJ IDs
- npm run test:testrail:junit passed
- test-results/junit.xml generated
- JUnit XML contains GAJ IDs
- TRCLI import attempted

## Commands

Set JUnit output:
`$env:PLAYWRIGHT_JUNIT_OUTPUT_NAME=`"test-results/junit.xml`"

Run TestRail-friendly suite:
npm run test:testrail:junit

Check IDs:
Select-String -Path test-results\junit.xml -Pattern `"GAJ-`"
"

Write-Host "JOB-157 title alignment files updated successfully."