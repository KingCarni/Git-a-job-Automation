# Resume Analyzer Human-Reviewed QA Matrix

## Review Summary

The AI-generated suite is useful and broad, but it needs human QA review before becoming an execution plan.

Strong areas:
- File upload coverage
- Parser regression coverage
- AI hallucination safety checks
- Credit/billing risk coverage
- Re-analysis stale state coverage
- Prompt injection coverage

Needs refinement:
- Some tests require authenticated state that is not set up yet
- Some AI-output tests are only partially automatable
- Some parser tests require fixture files before they can be executed
- Exact ATS score assertions should be avoided because scoring may change
- Live AI output should not be tested with strict exact text assertions

## Do Not Automate Yet

| Area | Reason |
|---|---|
| Exact AI wording | AI output can vary; assert safety rules instead |
| Exact ATS score number | Scoring model may evolve; test directionality and recalculation instead |
| Complex parser quality | Needs stable fixture baseline first |
| Live Stripe payment flow | Use Stripe test mode/webhook mocks instead |
| Visual resume preview pixel checks | Too brittle early; use semantic/text assertions first |
| Full cross-account isolation | Valuable, but requires reliable seeded test users |

## P0 Release Blockers

| Test ID | Area | Scenario | Why It Blocks Release | Automation |
|---|---|---|---|---|
| GAJ-HP-001 | Core Flow | Upload valid PDF and analyze | Primary product flow | Yes |
| GAJ-HP-002 | Core Flow | Upload valid DOCX and analyze | Primary product flow | Yes |
| GAJ-NEG-004 | Validation | Analyze without resume blocked | Prevents invalid analysis | Yes |
| GAJ-NEG-005 | Validation | Analyze without JD blocked | Prevents invalid analysis | Yes |
| GAJ-NEG-007 | Error Handling | API failure handled safely | Prevents broken user state | Yes |
| GAJ-REG-003 | ATS Score | Score recalculates after resume edit | Prevents stale/misleading results | Yes |
| GAJ-REG-005 | State | Missing keywords do not persist across analyses | Prevents stale JD leakage | Yes |
| GAJ-DATA-005 | Data Integrity | JD keywords are not inserted into resume preview | Prevents resume corruption | Yes/API |
| GAJ-DATA-009 | Data Isolation | Resume A does not leak into Resume B | Prevents privacy/data trust issue | Yes |
| GAJ-AI-001 | AI Safety | AI does not invent tools | Prevents dishonest resume claims | Partial |
| GAJ-AI-003 | AI Safety | AI does not invent metrics | Prevents fake quantified claims | Partial |
| GAJ-AI-009 | AI Safety | Prompt injection ignored | Prevents JD manipulating AI output | Yes/API |
| GAJ-AUTH-005 | Credits | Credit consumed once per successful analysis | Billing trust | Yes/API |
| GAJ-AUTH-008 | Credits | Double-click Analyze does not double-charge | Billing/race condition | Yes |
| GAJ-PERF-009 | Stability | Rapid-click does not send duplicate requests | Prevents duplicate API/credit use | Yes |