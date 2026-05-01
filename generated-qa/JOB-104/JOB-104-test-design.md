# JOB-104 - QA Test Design

## Summary

Add signup and daily credit bonus messaging to landing page

## Source

This QA package was generated from pasted/fetched Jira ticket text.

## Feature Type

stripe-webhooks

## Test Strategy

This package starts with a reviewable QA design, TestRail CSV rows, fixture JSON, and a Playwright fixture-test skeleton.

The first pass is intentionally rule/template-based. Human review is still expected before importing cases or promoting fixture tests into the main test suite.

## Generated Test Cases

### GAJ-STRIPE-001 - Checkout completed event awards purchased credits

Priority: High

Type: Integration

Expected:
Purchased credits are awarded once with a purchase_stripe ledger reason/ref.

Notes:
Core payment-to-credit path.

### GAJ-STRIPE-002 - Duplicate Stripe event does not double-award credits

Priority: High

Type: Regression

Expected:
Duplicate event is ignored/idempotent and credits are not double-awarded.

Notes:
Critical billing idempotency.

### GAJ-STRIPE-003 - Invalid signature is rejected

Priority: High

Type: Security

Expected:
Webhook is rejected and no credits are awarded.

Notes:
Security boundary.

### GAJ-STRIPE-004 - Unknown event type is handled safely

Priority: Medium

Type: Negative

Expected:
Event is safely ignored or acknowledged without creating credits.

Notes:
Webhook resilience check.

### GAJ-STRIPE-005 - Database failure does not mark credit award successful

Priority: High

Type: Data Integrity

Expected:
Failure does not create false success state and can be retried safely.

Notes:
Prevents payment/credit inconsistency.


## Recommended Next Steps

1. Review this QA package.
2. Import JOB-104-testrail-cases.csv into TestRail if the cases look useful.
3. Keep or edit JOB-104-fixtures.json.
4. Promote JOB-104-fixture-test.spec.js into the main tests folder only after review.
5. Add Jira evidence after validation.
