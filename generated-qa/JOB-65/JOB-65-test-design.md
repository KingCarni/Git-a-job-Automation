# JOB-65 - QA Test Design

## Summary

AI Job Match v1

## Source

This QA package was generated from pasted/fetched Jira ticket text.

## Feature Type

job-search-match-apply

## Test Strategy

This package starts with a reviewable QA design, TestRail CSV rows, fixture JSON, and a Playwright fixture-test skeleton.

The first pass is intentionally rule/template-based. Human review is still expected before importing cases or promoting fixture tests into the main test suite.

## Generated Test Cases

### GAJ-JOBS-001 - Canonical profile is required before matching

Priority: High

Type: Business Rule

Expected:
User is guided to create or complete a canonical profile before matching.

Notes:
Keeps matching grounded in user profile data.

### GAJ-JOBS-002 - Job context is applied correctly

Priority: High

Type: Functional

Expected:
The selected job context is used consistently for scoring/matching.

Notes:
Prevents stale/wrong job context.

### GAJ-JOBS-003 - Role-specific tailoring avoids false claims

Priority: High

Type: AI Safety

Expected:
Tailored output aligns to the role without inventing candidate experience.

Notes:
Bridges job matching and AI safety.

### GAJ-JOBS-004 - Saved job state persists for returning user

Priority: Medium

Type: Regression

Expected:
Saved job or match state is retained for the user.

Notes:
State persistence check.


## Recommended Next Steps

1. Review this QA package.
2. Import JOB-65-testrail-cases.csv into TestRail if the cases look useful.
3. Keep or edit JOB-65-fixtures.json.
4. Promote JOB-65-fixture-test.spec.js into the main tests folder only after review.
5. Add Jira evidence after validation.
