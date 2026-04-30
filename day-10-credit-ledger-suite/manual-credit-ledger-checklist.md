# Credit Ledger Manual QA Checklist

## Successful Paid Action
- [ ] User starts with known credit balance
- [ ] User completes successful analysis/rewrite
- [ ] Balance decreases by expected amount
- [ ] Ledger contains one matching debit entry
- [ ] Reason/ref are correct

## Failed Action
- [ ] Corrupt file or failed AI response tested
- [ ] User receives recoverable error
- [ ] Balance remains unchanged or refund entry exists
- [ ] No duplicate/partial charge remains

## Double Submit
- [ ] User rapidly clicks Analyze
- [ ] UI disables button or request is idempotent
- [ ] Only one charge occurs
- [ ] Only one successful analysis result is recorded

## Stripe/Webhook
- [ ] Same event processed twice
- [ ] Credits awarded once
- [ ] Event/ref dedupe is visible in logs or DB

## Donation Eligibility
- [ ] Free credits cannot be donated if product rule requires paid credits
- [ ] Donation cannot exceed eligible balance
- [ ] Donation creates correct debit/credit entries
