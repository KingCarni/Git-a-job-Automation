User uploads a resume, pastes a job description, runs analysis, and views ATS score, missing keywords, suggested improvements, and resume preview.

# Resume Analyzer QA Test Plan

## Feature Name
Resume Analyzer: Upload Resume + Analyze Against Job Description

## User Role
Job seeker / registered user / guest user depending on current auth rules

## Platform Area
Frontend / API / AI analysis / File parsing / Credits / Resume preview

## Risk Level
High

## What Changed?
User can upload a resume file, paste a job description, run AI analysis, and receive ATS-style feedback including score, missing keywords, suggested improvements, and resume preview.

## Expected User Outcome
The user should understand how well their resume matches the job description without the app corrupting resume content, inventing experience, or producing misleading suggestions.

## Functional Test Areas
- Resume upload accepts supported file types
- Unsupported file types are rejected clearly
- Job description input accepts pasted text
- Analyze button state is correct
- Analysis returns ATS score
- Missing keywords are displayed
- Suggested improvements are displayed
- Resume preview remains readable
- User can re-run analysis without stale/corrupt data
- Credit consumption works correctly if required

## Regression Risks
- PDF parsing fails
- DOCX parsing fails
- Parsed sections become polluted
- Resume bullets move under wrong headings
- AI suggests false experience
- ATS score does not change meaningfully after edits
- Missing keywords include unsafe or irrelevant terms
- Preview layout breaks
- Auth/credits block valid users
- Re-analysis uses stale data

## Exploratory Testing Ideas
- Upload a one-page resume
- Upload a two-column resume
- Upload a DOCX resume
- Upload a resume with no clear headings
- Paste a very short job description
- Paste a very long job description
- Paste a job description with special characters
- Run analysis repeatedly
- Edit resume content then re-run analysis
- Try using browser back/refresh during analysis

## Negative Test Cases
- No resume uploaded
- No job description entered
- Empty file
- Wrong file type
- Corrupt PDF
- Extremely large resume
- Extremely long job description
- Network error during analysis
- API returns 500
- Insufficient credits
- Logged-out user attempts paid action

## Accessibility Concerns
- Upload control is keyboard accessible
- Analyze button has visible disabled state
- Error messages are readable
- Loading state is announced visually
- Results headings are clear
- Color is not the only indicator for score/risk

## Performance Concerns
- Large resume parsing time
- Long job description analysis time
- UI loading state during slow API response
- Repeated analysis should not freeze the page

## Data Integrity Concerns
- Original resume content must remain preserved
- Parsed sections must not be mixed
- AI must not invent tools, metrics, titles, or experience
- Re-analysis must use current user-visible content
- Credits should only be consumed once per successful paid action

## Security / Privacy Concerns
- Resume contents are sensitive personal data
- Uploaded files should not leak between users
- Error logs should not expose full resume text unnecessarily
- API should reject invalid payloads
- Auth-protected routes should not expose user data

## Automation Candidates
- Page loads
- Upload control exists
- Job description textarea exists
- Analyze button exists
- Analyze button disabled before required inputs
- Error appears for missing resume/job description
- Results panel appears after mocked successful response
- Resume preview remains visible

## Release Criteria
- Supported resume files parse successfully
- Unsupported files fail gracefully
- Analysis results are clear and usable
- No resume section corruption
- No obvious AI hallucination in suggestions
- Credit behavior is correct
- Core flow passes smoke/regression tests

## Risks to Raise Early
- AI output needs guardrails
- Parser needs fixture coverage
- Credit consumption needs strong regression tests
- File upload edge cases need more coverage than normal UI flows