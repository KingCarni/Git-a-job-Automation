# Day 3 Notes

## What Worked
- Playwright JavaScript is installed and running
- Local Git-a-Job app is reachable through baseURL
- Public smoke tests pass
- Tests now avoid assuming private route behavior

## What We Learned
- Direct `/resume` access may be auth-gated, redirected, or not the correct user path
- Authenticated app testing needs a separate setup
- Smoke tests should not make brittle assumptions about private flows

## Next QA Actions
- Identify the real Resume Analyzer route
- Add stable `data-testid` attributes to key UI elements
- Create a QA login/session strategy
- Add fixture resumes
- Build mocked analysis response tests

## Candidate Stable Selectors Needed

- `data-testid="resume-upload-input"`
- `data-testid="job-description-input"`
- `data-testid="analyze-button"`
- `data-testid="ats-score"`
- `data-testid="missing-keywords-list"`
- `data-testid="suggested-improvements"`
- `data-testid="resume-preview"`
- `data-testid="credits-balance"`