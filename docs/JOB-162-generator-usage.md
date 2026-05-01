# JOB-162 - Jira to QA Package Generator

## Purpose

This generator turns pasted Jira ticket text into a reviewable QA package.

It is local-only and does not call Jira, TestRail, OpenAI, or any external API.

## Input

Create a file like:

```txt
jira-input/JOB-56.md
```

## Command

```powershell
npm run generate:qa -- JOB-56
```

## Output

```txt
generated-qa/JOB-56/
  JOB-56-test-design.md
  JOB-56-testrail-cases.csv
  JOB-56-fixtures.json
  JOB-56-fixture-test.spec.js
  JOB-56-jira-evidence.md
```

## Workflow

1. Paste Jira ticket text into `jira-input/<ISSUE>.md`.
2. Run `npm run generate:qa -- <ISSUE>`.
3. Review the generated package.
4. Import the CSV into TestRail if it looks good.
5. Promote fixture tests into the main test suite only after review.

## Current Scope

The first version is template/rule-based.

It has a stronger template for credit/daily-login-bonus tickets and a generic fallback for other tickets.
