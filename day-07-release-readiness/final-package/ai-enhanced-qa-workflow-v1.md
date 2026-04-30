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
