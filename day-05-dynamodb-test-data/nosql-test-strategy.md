# Day 5 NoSQL / DynamoDB-Style Test Strategy

## Purpose
Practice testing Git-a-Job with a DynamoDB/NoSQL mindset, even if the current app uses Prisma/Postgres.

## Key QA Risks
- missing fields
- null values
- wrong types
- duplicate records
- stale reads
- cross-user data leakage
- bad migration/backfill assumptions
- incorrect credit ledger behavior

## Git-a-Job Data Areas

| Area | Example Data | QA Risk |
|---|---|---|
| User | email, auth ID, role | wrong user state, auth leakage |
| Resume | parsed text, sections, bullets | corrupted candidate facts |
| Analysis | ATS score, keywords, suggestions | stale or misleading output |
| Credits | ledger entries, purchase refs | double-charge, wrong balance |
| Stripe Events | event ID, session ID | duplicate processing |
| Donation Requests | donor, amount, recipient | free-credit donation abuse |
| Admin | admin email/role | unauthorized access |
