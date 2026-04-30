# Initial Jira Backlog for Git-a-Job QA

## JOB-QA-001 — Create public smoke automation suite
Type: Task
Priority: P1
Labels: qa, automation, playwright, smoke

Acceptance Criteria:
- Homepage loads successfully
- Product-related content appears
- At least one actionable link or button exists
- Tests run locally with Playwright

---

## JOB-QA-002 — Create auth-gated resume analyzer test coverage
Type: Task
Priority: P0
Labels: qa, automation, auth, regression

Acceptance Criteria:
- Direct `/resume` access is tested
- Private analyzer controls are not exposed to logged-out users
- Safe redirect/login/not-found/blocked behavior is accepted

---

## JOB-QA-003 — Add API smoke tests for Git-a-Job endpoints
Type: Task
Priority: P1
Labels: qa, api-testing, playwright

Acceptance Criteria:
- Unknown API route returns safe response
- `/api/analyze` empty payload returns safe handled response
- Tests run through Playwright request context

---

## JOB-QA-004 — Build resume parser fixture pack
Type: Task
Priority: P0
Labels: qa, parser, fixtures, regression

Acceptance Criteria:
- Clean PDF fixture
- Clean DOCX fixture
- Two-column fixture
- Weird headings fixture
- Corrupt file fixture
- Unsupported file fixture
- All content is fake/anonymized

---

## JOB-QA-005 — Add AI hallucination safety test suite
Type: Task
Priority: P0
Labels: qa, ai-safety, release-blocker

Acceptance Criteria:
- Tool invention cases covered
- Metric invention cases covered
- Leadership inflation cases covered
- Prompt injection case covered
