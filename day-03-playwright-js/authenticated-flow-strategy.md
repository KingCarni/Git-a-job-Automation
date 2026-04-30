# Authenticated Flow Strategy

## Problem
The Resume Analyzer appears to require authenticated access or a specific in-app navigation path.

## Why This Matters
The highest-value Git-a-Job flows are not public homepage flows. They require user state, credits, saved data, and possibly session cookies.

## Options

### Option 1 — Test Login Account
Create a dedicated QA account.

Pros:
- Closest to real user behavior
- Good for end-to-end smoke tests

Cons:
- Can be slower
- May break if login provider changes
- Requires careful test data cleanup

### Option 2 — Stored Playwright Auth State
Login once, save session state, reuse it in tests.

Pros:
- Fast
- Common Playwright approach
- Avoids logging in before every test

Cons:
- Session can expire
- Needs refresh process

### Option 3 — Local Dev Auth Bypass
Create a local-only test mode or seeded session.

Pros:
- Fastest and most stable
- Good for local regression

Cons:
- Must be protected from production
- Requires dev implementation

## Recommendation
Use stored Playwright auth state for near-term testing, then add a local test-mode auth helper if Git-a-Job needs heavier automated coverage.

## Required Before Full Resume Analyzer Automation

- Confirm actual resume analyzer route
- Confirm login method
- Create QA test user
- Confirm credit rules for test user
- Add fixture resume files
- Add stable selectors or test IDs