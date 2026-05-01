# JOB-164 - FTUE/Onboarding Generator Template

## Purpose

JOB-164 adds a specific FTUE/resume-onboarding template to the QA package generator.

This prevents rich product-flow tickets like JOB-103 from producing only a generic one-case package.

## Detection Terms

The generator now detects FTUE/onboarding tickets when the pasted Jira input contains terms like:

- FTUE
- first-time setup
- first time setup
- first-time user
- onboarding
- initial profile build
- canonical resume
- canonical structured resume
- shared resume engine
- job-aware mode
- setup mode

## Generated FTUE Cases

The FTUE template generates these cases:

- GAJ-FTUE-001 - First-time user enters setup mode
- GAJ-FTUE-002 - Returning user bypasses setup mode
- GAJ-FTUE-003 - Setup mode uses shared resume engine
- GAJ-FTUE-004 - Initial profile build does not charge credits
- GAJ-FTUE-005 - Completing setup persists canonical structured resume
- GAJ-FTUE-006 - User routes to Account/Profile after setup
- GAJ-FTUE-007 - User can continue into Jobs/Match after setup
- GAJ-FTUE-008 - Job-aware mode uses canonical profile after onboarding
- GAJ-FTUE-009 - Tutorial messaging explains base resume vs role tailoring
- GAJ-FTUE-010 - Incomplete onboarding resumes correctly

## Command

```powershell
npm run generate:qa -- JOB-103
```

## Expected Output

```txt
generated-qa/JOB-103/
  JOB-103-test-design.md
  JOB-103-testrail-cases.csv
  JOB-103-fixtures.json
  JOB-103-fixture-test.spec.js
  JOB-103-jira-evidence.md
```

## Validation

```powershell
npx playwright test "generated-qa/JOB-103/JOB-103-fixture-test.spec.js"
npm run test:ci
npm run test:all
```

If generated-qa is not picked up by Playwright directly, promote the generated spec and fixture JSON into `tests/generated/` for validation.
