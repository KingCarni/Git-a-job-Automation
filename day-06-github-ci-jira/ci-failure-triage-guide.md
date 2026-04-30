# CI Failure Triage Guide

## Purpose
Help QA quickly understand and respond to failed GitHub Actions / Playwright checks.

## Triage Steps

### 1. Identify Failure Type
- Test assertion failure
- App failed to start/reach URL
- Dependency install failure
- Browser install failure
- Timeout/flaky behavior
- Environment/config issue

### 2. Check Scope
- One browser only?
- All browsers?
- One test file?
- API only?
- UI only?

### 3. Review Evidence
- Playwright report
- Screenshots
- Traces
- Console logs
- Network logs
- Git diff

### 4. Decide Category

| Category | Meaning | Action |
|---|---|---|
| Product Bug | App behavior is wrong | File Jira bug |
| Test Bug | Test assumption is wrong | Fix test |
| Environment Issue | CI/local config issue | Fix pipeline/config |
| Flaky Test | Inconsistent timing/state | Stabilize selector/wait/data |
| Known Gap | Expected failure due to missing setup | Document and skip only with reason |

## Common Fixes

### Bad Selector
Use role, label, text, or `data-testid`.

### Timing Issue
Prefer Playwright web-first assertions over fixed waits.

### Auth Issue
Use stored auth state or test-mode login.

### API Contract Changed
Update test only after confirming product behavior is intentionally changed.

## QA Rule
Never blindly loosen a failing test just to make CI green. First decide whether the product, test, or environment is wrong.
