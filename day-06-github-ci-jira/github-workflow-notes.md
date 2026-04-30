# GitHub Workflow Notes

## Branch Strategy
Use a feature branch for each meaningful change.

Example:
- feature/day-06-ci-jira-workflow
- fix/api-smoke-test-contract
- test/resume-analyzer-auth-flow

## Pull Request Expectations
Each PR should include:
- Summary
- Related Jira ticket
- Test evidence
- Risk notes
- Screenshots/report links if relevant

## QA Review Style
QA should review:
- What changed
- What could break
- What was tested
- What was not tested
- Whether automation should be added

## Recommended PR Comment

QA Summary:
- Tested:
- Passed:
- Bugs found:
- Risks:
- Automation added:
- Release recommendation:
