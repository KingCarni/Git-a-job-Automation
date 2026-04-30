# Credit Ledger Integrity Tests

## Purpose
Verify credit behavior is correct, repeatable, and safe.

| ID | Scenario | Starting State | Action | Expected Result |
|---|---|---|---|---|
| CL-P0-001 | Successful analysis consumes one credit | User has 5 credits | Run successful analysis | Balance becomes 4 |
| CL-P0-002 | Failed parse does not consume credit | User has 5 credits | Upload corrupt file and analyze | Balance remains 5 |
| CL-P0-003 | AI provider failure does not consume credit unfairly | User has 5 credits | Simulate AI failure | Balance remains 5 or refund entry exists |
| CL-P0-004 | Double-click analyze does not double-charge | User has 5 credits | Double-click Analyze | Balance becomes 4, not 3 |
| CL-P0-005 | Stripe duplicate event awards once | User has 0 credits | Process same event twice | One purchase ledger entry |
| CL-P0-006 | Donation cannot exceed eligible paid credits | User has 2 paid credits | Donate 5 | Request rejected |
| CL-P0-007 | Free credits cannot be donated if rule applies | User has only free credits | Donate credits | Request rejected |
| CL-P0-008 | Ledger total matches displayed balance | User has mixed ledger entries | Open account page | Display matches ledger calculation |

## QA Judgment
Credit tests are billing-adjacent. Treat credit correctness as P0.
