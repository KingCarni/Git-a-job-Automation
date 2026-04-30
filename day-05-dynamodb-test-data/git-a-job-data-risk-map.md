# Git-a-Job Data Risk Map

## Resume Data
Risk: parsed resume content may become corrupted, mixed, overwritten, or polluted by job description text.

Examples:
- Skills appear under Work Experience
- Education appears under Experience
- Job description keywords silently appear in resume preview
- Resume A content appears after uploading Resume B

Severity: P0

## Analysis Data
Risk: analysis results may not match current resume or current job description.

Examples:
- Missing keywords from old JD remain after new JD
- ATS score does not change after major resume edit
- Suggestions reference old job description

Severity: P0

## Credit Ledger Data
Risk: credits are consumed or awarded incorrectly.

Examples:
- Failed analysis consumes credit
- Double-click consumes two credits
- Stripe retry awards credits twice
- Donation allows free credits to be donated

Severity: P0

## Auth/User Data
Risk: users may see or mutate another user’s data.

Examples:
- User B sees User A resume preview
- User B sees User A credit balance
- Admin-only endpoints accessible to non-admin

Severity: P0
