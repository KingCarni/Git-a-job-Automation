# Day 4 API Test Strategy

## Product
Git-a-Job / Resume Analyzer

## Goal
Build an API testing strategy for Git-a-Job that can later transfer to AWS Lambda-style systems.

## Primary API Areas

| Area | Endpoint | Risk |
|---|---|---|
| Resume Analysis | `/api/analyze` | AI output quality, stale state, bad payloads, credit use |
| Bullet Rewrite | `/api/rewrite-bullet` | Hallucinated claims, unsafe keyword insertion |
| Feedback | `/api/feedback` | User input validation, abuse/spam |
| PDF Rendering | `/api/render-pdf` | malformed resume data, rendering failure |
| Resume PDF Export | `/api/resume-pdf` | PDF generation, private data leakage |
| Stripe Webhook | `/api/stripe/webhook` | duplicate events, credit ledger correctness |
| Credit Donation | `/api/account/donate-credits` | paid-credit rules, balance integrity |
| Admin Donation Pool | `/api/admin/donation-pool` | admin-only access, data integrity |

## API Testing Priorities

### P0
- Invalid payloads return safe errors
- Missing auth is handled correctly
- Failed AI actions do not consume credits incorrectly
- AI rewrite does not invent resume facts
- Stripe webhook is idempotent
- User data does not leak across accounts

### P1
- Large payloads handled safely
- Network/API timeouts recover gracefully
- Duplicate requests do not double-charge
- API responses have predictable shape

### P2
- Performance timing
- Rate limiting
- Abuse prevention
- Observability/logging quality

## Testing Approach

### 1. Contract/API Shape Testing
Verify each endpoint returns expected status codes and response structure.

### 2. Negative Testing
Send missing fields, wrong types, empty strings, oversized content, and malicious input.

### 3. Data Integrity Testing
Confirm resume content, user credits, and AI outputs remain truthful and correctly scoped.

### 4. Failure Injection
Simulate provider failures, invalid files, timeouts, and duplicate requests.

### 5. Serverless Mindset
Assume APIs may run as stateless functions with cold starts, retries, timeouts, partial failures, and idempotency requirements.

## What Not To Assert
- Exact AI wording
- Exact ATS score number unless algorithm is deterministic
- Exact PDF pixels/layout unless visual testing is intentionally added
- Real Stripe live payment behavior in normal regression