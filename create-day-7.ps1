New-Item -ItemType Directory -Force -Path `
  "day-07-release-readiness", `
  "day-07-release-readiness\jira", `
  "day-07-release-readiness\final-package", `
  "prompts" | Out-Null

@'
# AI-Enhanced QA Workflow V1

## Product
Git-a-Job / Resume Analyzer

## Purpose
Use AI tools and structured QA processes to improve test coverage, reduce blind spots, speed up debugging, and support safer releases.

## Core Principle
AI accelerates QA. It does not replace QA judgment.

## Workflow Overview

### 1. Feature Intake
- Jira ticket
- acceptance criteria
- product risk
- user role
- affected feature area

### 2. AI Test Generation
Use AI to generate happy paths, negative tests, edge cases, regression risks, data checks, auth/credit risks, accessibility checks, and automation candidates.

### 3. Automation Layer
Playwright JavaScript tests cover:
- public smoke flows
- auth-gated route behavior
- API smoke checks
- test fixture validation

### 4. API/Data Layer
API and data checks focus on:
- invalid payloads
- auth behavior
- response shape
- credit side effects
- duplicate requests
- stale state
- user isolation

### 5. Release Readiness
Before release:
- run Playwright tests
- review AI safety risks
- check parser/data integrity
- validate credit behavior
- document known risks
- make ship/hold decision

## Tool Stack
- JavaScript ES2015+
- Playwright
- VS Code
- Git
- GitHub
- GitHub Actions
- Jira
- AWS CLI
- AWS Lambda/DynamoDB testing mindset
- ChatGPT/AI-assisted test generation

## Release Philosophy
A release should not ship if Git-a-Job corrupts resume data, invents candidate facts, leaks user data, charges credits incorrectly, or gives stale analysis results.
'@ | Set-Content "day-07-release-readiness/final-package/ai-enhanced-qa-workflow-v1.md"

@'
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
'@ | Set-Content "day-07-release-readiness/final-package/final-release-readiness-checklist.md"

@'
# Jira Integration Setup Notes

## Jira Project
Project URL:
https://top-secret-games.atlassian.net/jira/software/projects/JOB/boards/70

Project Key:
JOB

Project Name:
Git-a-Job

## Supported Issue Types
- Task
- Epic
- Subtask
- Bug

## Suggested Labels
- qa
- automation
- playwright
- api-testing
- ai-safety
- parser
- credits
- auth
- regression
- release-blocker

## Recommended Jira Workflow Usage

### Task
Use for planned QA work:
- Create resume analyzer regression suite
- Add authenticated Playwright test strategy
- Build parser fixture pack

### Bug
Use for confirmed defects:
- Resume sections become mixed after re-analysis
- AI rewrite invents Cypress experience
- Credits consumed after failed analysis

### Epic
Use for larger QA initiatives:
- AI QA Automation Bootcamp
- Resume Parser Quality Improvements
- Credit Ledger Regression Coverage
'@ | Set-Content "day-07-release-readiness/jira/jira-integration-setup-notes.md"

@'
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
'@ | Set-Content "day-07-release-readiness/jira/initial-jira-backlog.md"

@'
# Day 7 AI QA Prompt Library

## Feature to Test Plan

Act as a senior QA analyst testing Git-a-Job, a ReactJS + JavaScript resume SaaS.

Feature:
[PASTE FEATURE]

Generate:
1. Happy path tests
2. Negative tests
3. Edge cases
4. Regression risks
5. Data integrity tests
6. AI safety concerns
7. Auth/credits risks
8. Automation candidates
9. Release blockers

---

## AI Safety Review

Act as a QA analyst reviewing AI resume output.

Original resume content:
[PASTE ORIGINAL]

Job description:
[PASTE JD]

AI output:
[PASTE OUTPUT]

Check:
1. Did it invent tools?
2. Did it invent metrics?
3. Did it invent leadership/scope?
4. Did it copy job requirements as experience?
5. Did it preserve candidate truth?
6. Pass/fail verdict
7. Safer rewrite if needed

---

## Release Risk Summary

Act as a QA lead preparing release signoff.

Test results:
[PASTE RESULTS]

Known issues:
[PASTE ISSUES]

Summarize:
1. release confidence
2. P0 risks
3. P1 risks
4. suggested go/no-go decision
5. follow-up tickets
'@ | Set-Content "day-07-release-readiness/final-package/ai-qa-prompt-library.md"

@'
# AI QA Bootcamp Portfolio Summary

## Project
Git-a-Job AI QA Bootcamp

## Summary
Built a 7-day AI-enhanced QA workflow around Git-a-Job, a ReactJS + JavaScript resume SaaS.

The project combines:
- Playwright JavaScript automation
- API smoke testing
- AI-generated test design
- human-reviewed QA matrices
- NoSQL/DynamoDB-style data risk thinking
- GitHub Actions CI
- Jira-ready process templates
- release readiness gates

## Current Automated Test Count
21 Playwright tests passing locally.

## Coverage Areas
- Public homepage smoke testing
- Auth-gated route behavior
- API safety smoke checks
- Test fixture validation

## Strongest Talking Point
“I used AI to accelerate QA coverage, but kept human review as the authority. I built test plans, automation candidates, API checks, AI hallucination safety tests, credit/data integrity checks, and release gates around a real product.”
'@ | Set-Content "day-07-release-readiness/final-package/portfolio-summary.md"

@'
# Day 7 Notes

## What We Completed
- Final AI-enhanced QA workflow
- Release readiness checklist
- Jira integration notes
- Initial Jira backlog
- AI QA prompt library
- Portfolio/interview summary

## Jira Project
https://top-secret-games.atlassian.net/jira/software/projects/JOB/boards/70

## Current State
The bootcamp now has:
- structured QA documentation
- passing Playwright automation
- API smoke coverage
- fake test data strategy
- GitHub CI workflow
- Jira-ready process artifacts
- release decision framework

## Next Best Improvements
1. Push repo to GitHub
2. Confirm GitHub Actions runs
3. Create Jira tickets from the initial backlog
4. Add authenticated Playwright session setup
5. Add fake PDF/DOCX fixture files
6. Add test IDs to Git-a-Job UI
7. Add mocked `/api/analyze` result tests
'@ | Set-Content "day-07-release-readiness/day-07-notes.md"

Write-Host "Day 7 files created successfully."