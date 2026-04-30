# JOB-145 Resume Parser Fixture Pack

## Purpose
Create fake/anonymized resume fixtures for Git-a-Job parser regression testing.

## Why This Matters
Resume parsing is one of Git-a-Job's highest-risk areas. A parser can fail loudly, but the more dangerous bug is quiet corruption:
- skills leaking into work experience
- education mixing with experience
- job description keywords entering resume preview
- Resume A data appearing in Resume B
- unsupported/corrupt files causing broken UI state

## Fixture Strategy

This first pass creates source text and expected-output JSON fixtures.

Later passes should convert selected source text fixtures into:
- PDF
- DOCX
- two-column layout PDF
- table-style DOCX/PDF
- corrupt PDF
- unsupported file samples

## Current Fixture Types

| Fixture | Purpose |
|---|---|
| clean-qa-resume | Happy path parser baseline |
| two-column-style-resume | Simulates two-column parsing risk |
| weird-headings-resume | Tests unusual section names |
| paragraph-style-resume | Tests resumes without bullets |
| weak-match-marketing-resume | Tests weak match / unrelated role |
| unsupported-txt-file | Tests unsupported file rejection |
| corrupt-placeholder | Documents corrupt file scenario |

## Rules
- No real private resumes
- All names, companies, schools, emails, and phone numbers are fake
- Expected output should preserve candidate facts exactly
- Parser should never silently insert job description text into resume content
