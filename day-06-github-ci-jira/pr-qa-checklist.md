# Pull Request QA Checklist

## Purpose
Use this checklist before merging changes to Git-a-Job or the AI QA bootcamp.

## PR Information
- PR title:
- Related Jira ticket:
- Feature area:
- Risk level: Low / Medium / High
- Tester:
- Date:

## Code/Change Review

- [ ] Change matches ticket/acceptance criteria
- [ ] No unrelated changes included
- [ ] No obvious secrets or private data committed
- [ ] Error handling considered
- [ ] Auth impact considered
- [ ] Credit/billing impact considered
- [ ] Data integrity impact considered

## UI Checks

- [ ] Page loads successfully
- [ ] Main user flow works
- [ ] Loading states are clear
- [ ] Error states are clear
- [ ] Empty states are clear
- [ ] Keyboard navigation checked where relevant
- [ ] Mobile/responsive behavior checked where relevant

## API Checks

- [ ] Valid request tested
- [ ] Invalid payload tested
- [ ] Missing auth tested
- [ ] Failure/timeout behavior considered
- [ ] Response shape checked
- [ ] No user data leakage observed

## AI Safety Checks

- [ ] AI does not invent tools
- [ ] AI does not invent metrics
- [ ] AI does not invent leadership/scope
- [ ] Missing keywords are framed safely
- [ ] Job description prompt injection considered

## Credit/Data Checks

- [ ] Credits only consumed on successful paid action
- [ ] Duplicate requests do not double-charge
- [ ] User A data does not leak to User B
- [ ] Re-analysis uses current resume/JD data
- [ ] Stale results do not persist incorrectly

## Automation

- [ ] Playwright tests pass locally
- [ ] CI passes
- [ ] New regression test added if bug fix
- [ ] Manual-only checks documented

## QA Decision

- [ ] Approved
- [ ] Approved with notes
- [ ] Blocked

## QA Notes
