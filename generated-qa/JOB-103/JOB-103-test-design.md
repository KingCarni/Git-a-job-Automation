# JOB-103 - QA Test Design

## Summary

Resume FTUE - Add first-time setup mode on shared resume engine and free initial profile build

## Source

This QA package was generated from pasted/fetched Jira ticket text.

## Feature Type

ftue-resume-onboarding

## Test Strategy

This package starts with a reviewable QA design, TestRail CSV rows, fixture JSON, and a Playwright fixture-test skeleton.

The first pass is intentionally rule/template-based. Human review is still expected before importing cases or promoting fixture tests into the main test suite.

## Generated Test Cases

### GAJ-FTUE-001 - First-time user enters setup mode

Priority: High

Type: Functional

Expected:
User enters first-time setup mode instead of normal job-aware mode.

Notes:
Core mode-selection rule for new users.

### GAJ-FTUE-002 - Returning user bypasses setup mode

Priority: High

Type: Regression

Expected:
User bypasses setup mode and enters the normal job-aware path when applicable.

Notes:
Prevents returning users from being trapped in onboarding.

### GAJ-FTUE-003 - Setup mode uses shared resume engine

Priority: High

Type: Architecture

Expected:
Setup mode is a mode/state of the shared resume engine, not a separate divergent resume system.

Notes:
Mostly architectural/manual until implementation exposes testable hooks.

### GAJ-FTUE-004 - Initial profile build does not charge credits

Priority: High

Type: Business Rule

Expected:
Initial profile setup is free and does not consume credits.

Notes:
Critical monetization and trust check.

### GAJ-FTUE-005 - Completing setup persists canonical structured resume

Priority: High

Type: Data Integrity

Expected:
A canonical structured resume/profile snapshot is persisted and available for ATS/matching.

Notes:
Core data persistence check.

### GAJ-FTUE-006 - User routes to Account/Profile after setup

Priority: Medium

Type: Navigation

Expected:
User is routed or prompted toward Account/Profile for optional cleanup after setup.

Notes:
May depend on final UX routing decision.

### GAJ-FTUE-007 - User can continue into Jobs/Match after setup

Priority: Medium

Type: Navigation

Expected:
User can continue into Jobs/Match with the canonical profile available.

Notes:
Good later E2E candidate.

### GAJ-FTUE-008 - Job-aware mode uses canonical profile after onboarding

Priority: High

Type: Regression

Expected:
Job-aware mode uses the canonical structured profile created during setup.

Notes:
Connects FTUE output to later matching/ATS behavior.

### GAJ-FTUE-009 - Tutorial messaging explains base resume vs role tailoring

Priority: Medium

Type: Content

Expected:
Messaging clearly explains that the user builds a strong base resume once and tailors per role later.

Notes:
Manual content/UX review.

### GAJ-FTUE-010 - Incomplete onboarding resumes correctly

Priority: High

Type: Edge Case

Expected:
User can resume setup without being incorrectly marked complete or losing entered/imported state.

Notes:
Important state recovery case.


## Recommended Next Steps

1. Review this QA package.
2. Import JOB-103-testrail-cases.csv into TestRail if the cases look useful.
3. Keep or edit JOB-103-fixtures.json.
4. Promote JOB-103-fixture-test.spec.js into the main tests folder only after review.
5. Add Jira evidence after validation.
