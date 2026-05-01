# JOB-82 - QA Test Design

## Summary

AI Job Match - Tailor Resume keeps stale previous job context instead of current selected job

## Source

This QA package was generated from pasted/fetched Jira ticket text.

## Feature Type

auth-access-control

## Test Strategy

This package starts with a reviewable QA design, TestRail CSV rows, fixture JSON, and a Playwright fixture-test skeleton.

The first pass is intentionally rule/template-based. Human review is still expected before importing cases or promoting fixture tests into the main test suite.

## Generated Test Cases

### GAJ-AUTH-001 - Logged-out user is blocked from private resume analyzer

Priority: High

Type: Security

Expected:
Logged-out user is redirected or blocked safely.

Notes:
Basic auth gate.

### GAJ-AUTH-002 - Authenticated user can access private resume analyzer

Priority: High

Type: Functional

Expected:
Authenticated user can access the private analyzer experience.

Notes:
Requires reliable test auth harness.

### GAJ-AUTH-003 - Protected API rejects unauthenticated request

Priority: High

Type: Security

Expected:
API rejects request without exposing private data.

Notes:
API-level auth coverage.

### GAJ-AUTH-004 - Stale session is handled safely

Priority: Medium

Type: Regression

Expected:
Stale session does not allow unauthorized access or corrupt state.

Notes:
Session edge case.


## Recommended Next Steps

1. Review this QA package.
2. Import JOB-82-testrail-cases.csv into TestRail if the cases look useful.
3. Keep or edit JOB-82-fixtures.json.
4. Promote JOB-82-fixture-test.spec.js into the main tests folder only after review.
5. Add Jira evidence after validation.
