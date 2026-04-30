# Day 3 Playwright Automation Plan

## Product
Git-a-Job / Resume Analyzer

## Automation Goal
Build a practical Playwright JavaScript regression foundation for public, auth-gated, and eventually authenticated resume-analysis flows.

## Current Test Layers

### Layer 1 — Public Smoke Tests
Purpose:
Confirm the public app loads, renders product content, and exposes interactive entry points.

Current coverage:
- Homepage loads
- Page title contains product-related terms
- Body content contains resume/job/ATS-related copy
- At least one button or link exists

### Layer 2 — Auth-Gated Route Tests
Purpose:
Confirm private resume analyzer routes do not expose functionality incorrectly to logged-out users.

Current coverage:
- Direct visit to `/resume`
- Confirms user is redirected, prompted to login, blocked, or shown a safe not-found state

### Layer 3 — Authenticated Resume Analyzer Tests
Status:
Not implemented yet.

Needs:
- Test user
- Auth setup
- Stored Playwright auth state or test-mode login
- Stable route to resume analyzer
- Fixture resume files

## Highest-Value Tests to Automate Next

1. Logged-in user can access Resume Analyzer
2. Resume upload input is visible
3. Job description textarea is visible
4. Analyze button is visible
5. Analyze is blocked without resume
6. Analyze is blocked without job description
7. Unsupported file type is rejected
8. Rapid-click Analyze does not duplicate requests
9. Mocked successful API response displays ATS score
10. Mocked API failure displays recoverable error

## Tests Not Ready Yet

| Test | Why Not Ready |
|---|---|
| Valid PDF upload and analyze | Needs fixture resume and auth |
| Valid DOCX upload and analyze | Needs fixture resume and auth |
| Credit deduction check | Needs stable test account or API/db check |
| AI hallucination check | Better as manual/API safety review first |
| Exact ATS score check | Score algorithm may change |
| Parser accuracy check | Needs baseline fixture expectations |

## QA Judgment
Automation should start with stable UI access, validation, and error handling. Parser correctness and AI safety should remain manual or fixture-based until the product has deterministic outputs and stable test data.