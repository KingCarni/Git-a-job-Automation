# Credit Ledger API Regression Strategy

## Current State
This suite validates credit ledger fixture rules and expected behaviors.

## Future API Targets
- `/api/analyze`
- `/api/rewrite-bullet`
- `/api/stripe/webhook`
- `/api/account/donate-credits`
- `/api/admin/donation-pool`

## Recommended Test Strategy
- Use deterministic test users
- Seed known ledger state
- Run action
- Verify ledger-derived balance
- Verify user isolation
- Verify idempotency ref behavior

## Important
UI balance checks are not enough. Credit correctness should be verified at API/data level whenever possible.
