# Release Gate Checklist

## Purpose
Define minimum quality criteria before releasing Git-a-Job changes.

## P0 Release Blockers

A release should be blocked if any of these fail:

- Core page does not load
- Auth flow blocks valid users
- Logged-out users can access private data
- Resume parsing corrupts user content
- AI suggestions invent candidate facts
- Credits are consumed incorrectly
- Stripe/webhook duplicate processing causes duplicate credits
- User A data leaks into User B
- API returns unsafe 500s for common bad input
- Re-analysis uses stale resume or job description data

## Required Checks Before Release

### Automated
- [ ] Public smoke tests pass
- [ ] Auth-gated smoke tests pass
- [ ] API smoke tests pass
- [ ] Fixture validation tests pass
- [ ] CI passes in GitHub Actions

### Manual
- [ ] Resume upload checked with at least one PDF
- [ ] Resume upload checked with at least one DOCX
- [ ] Job description analysis reviewed
- [ ] AI output reviewed for hallucinated claims
- [ ] Credit behavior checked if AI action is paid
- [ ] Error path checked

## Release Decision

- [ ] Ship
- [ ] Ship with known issues
- [ ] Hold release

## Known Issues / Risks
