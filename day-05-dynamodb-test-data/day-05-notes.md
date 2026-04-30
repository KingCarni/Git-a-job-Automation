# Day 5 Notes

## What We Practiced
- NoSQL/DynamoDB-style QA thinking
- Data shape validation
- Missing/stale/duplicate record risks
- Credit ledger integrity
- User isolation testing
- Test fixture generation with JavaScript

## Key Lesson
In data-heavy systems, a passing UI does not prove the data is correct.

For Git-a-Job, the biggest data risks are:
- corrupted resume sections
- stale analysis results
- leaked user data
- incorrect credit ledger entries
- duplicate Stripe/webhook events

## Interview Talking Point
“I built a data-risk testing strategy for Git-a-Job using a DynamoDB-style mindset. I focused on stale data, duplicate events, user isolation, missing fields, and ledger correctness.”
