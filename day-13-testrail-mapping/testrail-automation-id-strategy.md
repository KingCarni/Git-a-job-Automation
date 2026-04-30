# TestRail Automation ID Strategy

## Recommended Strategy

Use GAJ IDs in Playwright test titles and TestRail case titles.

## Why

This makes test results readable across Playwright output, JUnit XML, TestRail cases, Jira references, and GitHub Actions artifacts.

## TRCLI Mapping Note

TRCLI may use generated automation_id values from JUnit testcase metadata. If title alignment is not enough, the next step is to backfill TestRail automation_id fields.

