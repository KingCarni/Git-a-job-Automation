# Test Data Strategy

## Goal
Create repeatable fake data that lets QA test Git-a-Job without using real private resumes.

## Data Rules
- Use fake names, emails, phone numbers, companies, and schools
- Do not use real private resumes
- Keep fixture data realistic enough to catch parser and AI issues
- Create strong-match and weak-match scenarios

## Test Personas

| Persona | Purpose |
|---|---|
| QA User With Credits | Successful analysis and rewrite testing |
| QA User With Zero Credits | Blocked paid-action testing |
| Admin User | Donation pool/admin endpoint testing |
| User A | Data isolation testing |
| User B | Cross-account leakage testing |

## Fixture Types
- clean-qa-resume
- weak-match-resume
- two-column-resume
- no-bullets-resume
- weird-headings-resume
- corrupt-file
- unsupported-txt-file
