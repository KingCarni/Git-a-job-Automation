# JOB-166 - Expanded QA Generator Templates

## Purpose

Expand the QA package generator so common Git-a-Job feature tickets produce useful multi-case QA packages instead of falling back to a single generic happy-path case.

## Supported Templates - Pass 1

The generator now supports these feature templates:

- `resume-parser-import`
- `ai-analysis-safety`
- `credit-ledger-billing`
- `stripe-webhooks`
- `auth-access-control`
- `ftue-resume-onboarding`
- `daily-login-bonus`
- `job-search-match-apply`
- `ui-navigation-smoke`
- `accessibility-usability`
- `admin-donation-pool`
- `generic-feature`

## Recommended Workflow

```powershell
npm run fetch:jira -- JOB-### -- --force
notepad jira-input\JOB-###.md

npm run generate:qa -- JOB-###
dir generated-qa\JOB-###
notepad generated-qa\JOB-###\JOB-###-test-design.md

npm run import:testrail-csv -- JOB-###
npm run import:testrail-csv -- JOB-### -- --apply
```

Keep the review pauses. Do not blindly import generated cases.

## Validation Commands

```powershell
npm run generate:qa -- JOB-103
npm run test:ci
npm run test:all
```

For generated fixture tests, validate one package directly or promote it into `tests/generated/` if Playwright does not pick up `generated-qa/`.

## Notes

This is still template-based generation, not AI generation. The goal is predictable scaffolding that QA can review quickly.
