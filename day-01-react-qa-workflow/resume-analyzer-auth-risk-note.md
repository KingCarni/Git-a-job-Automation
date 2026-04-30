# Resume Analyzer Auth Risk Note

## Observation
Initial Playwright smoke tests confirmed that the Git-a-Job homepage loads successfully at `http://localhost:3000`.

A deeper route-level test for the resume analyzer could not safely continue because the resume analyzer appears to require authenticated access or a specific in-app navigation path.

## QA Impact
Authenticated user flows need a separate test strategy from public smoke tests.

## Risk
If QA only tests the public homepage, core resume analyzer bugs may escape because the most important flows are behind login/session state.

## Recommended Test Layers

### Public Smoke Tests
- Homepage loads
- Branding/product text appears
- Primary navigation renders
- Public CTAs render

### Authenticated Smoke Tests
- User can access resume analyzer
- Resume upload control appears
- Job description input appears
- Analyze action appears
- Credits/account state appears if applicable

### Full Regression Tests
- Upload PDF/DOCX
- Parse resume sections
- Paste job description
- Run analysis
- View ATS score
- View missing keywords
- Re-run analysis without stale data
- Confirm credits are consumed correctly

## Next Action
Create an authenticated test setup using either:
1. test login account
2. stored Playwright auth state
3. local development auth bypass/mock