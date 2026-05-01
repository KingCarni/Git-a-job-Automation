# JOB-56 - QA Test Design

## Summary

System - Daily bonus of 10 credits if user signs in

## Feature Type

daily-login-bonus

## Generated Test Cases

### GAJ-CREDIT-DAILY-001 - First eligible sign-in grants 10 credits

Priority: High

Type: Functional

Expected:
User receives exactly +10 credits and one daily_login_bonus ledger entry is created.

Notes:
Core happy path for daily bonus behavior.

### GAJ-CREDIT-DAILY-002 - Repeated same-day sign-in does not grant duplicate bonus

Priority: High

Type: Regression

Expected:
No second +10 daily_login_bonus entry is created for the same user/date.

Notes:
Important idempotency check.

### GAJ-CREDIT-DAILY-003 - Daily bonus ledger entry uses correct reason and ref

Priority: High

Type: Data Integrity

Expected:
Ledger entry uses delta +10, reason daily_login_bonus, and a unique ref for user/date.

Notes:
Can be checked in fixture-level automation before DB integration exists.

### GAJ-CREDIT-DAILY-004 - Daily bonus is isolated per user

Priority: High

Type: Data Integrity

Expected:
Each user can receive their own +10 bonus. User A actions do not affect User B balance.

Notes:
User isolation check.

### GAJ-CREDIT-DAILY-005 - Near-midnight sign-in does not double-award incorrectly

Priority: Medium

Type: Edge Case

Expected:
Bonus is awarded according to the intended date rule and does not duplicate unexpectedly.

Notes:
Requires clear timezone/date policy.

### GAJ-CREDIT-DAILY-006 - Concurrent sign-ins do not create duplicate bonus entries

Priority: High

Type: Regression

Expected:
Only one +10 daily_login_bonus entry exists for the same user/date.

Notes:
Race-condition/idempotency check.

### GAJ-CREDIT-DAILY-007 - Bonus credits are not treated as paid or donatable credits

Priority: High

Type: Business Rule

Expected:
Daily bonus credits are treated as free credits and do not count as paid/donatable credits.

Notes:
Important because donation logic distinguishes paid credits from free credits.

### GAJ-CREDIT-DAILY-008 - UI credit count updates after daily bonus award

Priority: Medium

Type: UI

Expected:
Displayed credit count reflects the +10 daily bonus after the award is granted.

Notes:
UI/E2E check after auth test harness exists.


## Recommended Next Steps

1. Review this QA package.
2. Import JOB-56-testrail-cases.csv into TestRail if the cases look useful.
3. Keep or edit JOB-56-fixtures.json.
4. Promote JOB-56-fixture-test.spec.js into the main tests folder only after review.
5. Add Jira evidence after validation.
