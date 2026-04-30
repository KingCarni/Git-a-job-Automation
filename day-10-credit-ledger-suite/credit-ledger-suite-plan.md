# JOB-147 Credit Ledger Regression Suite

## Purpose
Create regression coverage for Git-a-Job credit ledger behavior.

## Why This Matters
Credits are billing-adjacent. Even if they are not direct money in every case, users will treat incorrect credit behavior as a trust failure.

## Covered Risk Areas

| Risk | Example |
|---|---|
| Successful paid action consumes credit | User runs successful analysis and balance decreases by 1 |
| Failed action no-charge | Parse/API/AI failure should not unfairly consume credit |
| Double-submit | User double-clicks Analyze and gets charged twice |
| Duplicate webhook | Stripe retries same event and awards credits twice |
| Donation eligibility | User donates free/non-paid credits when only paid credits should be eligible |
| Balance mismatch | Displayed balance differs from ledger-derived balance |
| Cross-user leakage | User A action affects User B balance |

## Core QA Principle
Do not trust a displayed balance alone. Verify ledger entries and reason/ref behavior wherever possible.
