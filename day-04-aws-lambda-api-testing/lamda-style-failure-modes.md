# AWS Lambda-Style Failure Modes for QA

## Why This Matters
Peekapak’s stack includes AWS Lambda and DynamoDB. Git-a-Job may not currently run this way, but testing with a serverless mindset builds transferable QA skill.

## Lambda/API Failure Modes

### 1. Cold Start Delay
Function takes longer on first request.

QA Check:
- UI shows loading state quickly
- User does not double-submit
- Timeout handling is clear

### 2. Timeout
Function exceeds max execution time.

QA Check:
- User receives recoverable error
- No partial data corruption
- No credit consumed unfairly

### 3. Retry / Duplicate Invocation
Serverless functions or webhook providers may retry.

QA Check:
- Idempotency exists
- Duplicate events do not double-charge or double-award credits

### 4. Partial Failure
AI call succeeds but database update fails, or database update succeeds but response fails.

QA Check:
- System can recover
- Ledger remains correct
- User does not get charged twice on retry

### 5. Stateless Execution
Function cannot rely on local memory between requests.

QA Check:
- Re-analysis uses persisted/current request data
- No stale in-memory state leaks between users or analyses

### 6. Eventual Consistency
DynamoDB-style systems may not show writes instantly in every read pattern.

QA Check:
- UI handles delayed credit/result updates
- Tests avoid brittle immediate-read assumptions unless strongly consistent reads are used

### 7. Bad Event Shape
Lambda receives malformed event/body.

QA Check:
- Returns 400
- Does not throw unhandled exception
- Logs enough context without leaking private resume data

### 8. Secrets / Environment Variables Missing
API key, DB URL, or webhook secret missing.

QA Check:
- Startup/runtime error is safe
- User sees generic error
- Logs identify missing config without exposing secrets

---

## Interview Talking Point
“I practiced testing Git-a-Job APIs with a serverless mindset: retries, idempotency, timeouts, statelessness, malformed events, and billing-side effects. That maps directly to Lambda/DynamoDB-style systems.”