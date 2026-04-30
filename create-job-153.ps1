New-Item -ItemType Directory -Force -Path `
  "day-12-test-management-flow", `
  "testrail-import" | Out-Null

Set-Content "day-12-test-management-flow/playwright-to-test-management-flow.md" @"
# JOB-153 — Playwright-to-Test-Management Result Flow

## Purpose

Document how Git-a-Job Automation test results move between Playwright, GitHub Actions, TestRail, and Jira.

This creates a repeatable QA evidence workflow instead of relying on screenshots or memory.

---

## System Roles

| System | Role |
|---|---|
| Jira | Work tracking, bugs, QA tasks, acceptance criteria |
| TestRail | Test case repository, test runs, execution history |
| GitHub | Source control, automation repo, CI pipeline |
| GitHub Actions | Runs CI-safe Playwright tests |
| Playwright | Automated test execution |
| Git-a-Job | System under test |

---

## Current Integration Model

```txt
Jira task
  ↓ referenced by
TestRail test case
  ↓ maps to
Playwright test / fixture validation
  ↓ runs in
GitHub Actions
  ↓ produces
HTML report + JUnit XML
  ↓ evidence recorded in
TestRail run + Jira comment