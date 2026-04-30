# Final Release Readiness Checklist

## Product
Git-a-Job / Resume Analyzer

## Automated Test Gate

Run:

npx playwright test

Required:
- [ ] Public smoke tests pass
- [ ] Auth-gated tests pass
- [ ] API smoke tests pass
- [ ] Fixture validation tests pass
- [ ] No unexpected skipped tests
- [ ] No flaky failures

## Manual QA Gate

### Resume Upload / Parser
- [ ] Valid PDF tested
- [ ] Valid DOCX tested
- [ ] Unsupported file rejected
- [ ] Corrupt file handled safely
- [ ] Parsed sections remain accurate
- [ ] Resume preview does not mix sections

### Job Description / Analysis
- [ ] Empty JD blocked
- [ ] Very long JD handled safely
- [ ] Prompt-injection JD tested
- [ ] Re-analysis does not show stale keywords

### AI Safety
- [ ] AI does not invent tools
- [ ] AI does not invent metrics
- [ ] AI does not invent leadership experience
- [ ] Missing keywords are framed as gaps, not false claims
- [ ] App does not guarantee hiring outcomes

### Credits / Billing-Like Behavior
- [ ] Successful paid action consumes expected credit amount
- [ ] Failed parse does not consume credit
- [ ] Failed AI request does not double-charge
- [ ] Double-click Analyze does not double-charge

### Auth / Data Isolation
- [ ] Logged-out user cannot access private resume data
- [ ] Logged-in user can access expected tools
- [ ] User A data does not appear for User B
- [ ] Logout clears private state
- [ ] Admin-only functions are blocked for non-admin users

## Release Decision
- [ ] Ship
- [ ] Ship with known issues
- [ ] Hold release
