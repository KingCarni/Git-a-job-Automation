# Day 2 Execution Shortlist

## First Tests to Automate

1. Homepage loads
2. Logged-out user sees public Git-a-Job entry points
3. Resume analyzer access requires expected auth/session behavior
4. Analyze cannot run without resume
5. Analyze cannot run without job description
6. Unsupported file type is rejected
7. Rapid-click Analyze does not create duplicate request
8. API failure shows recoverable error
9. Missing keywords do not persist after JD change
10. Credits are not consumed after failed analysis

## First Tests to Keep Manual

1. AI does not invent tools
2. AI does not invent metrics
3. AI does not invent leadership scope
4. Parsed resume sections remain truthful
5. Two-column PDF parsing quality
6. Graphic-heavy resume parsing quality
7. Suggested improvements are useful and honest

## Required Test Data

- Clean fake PDF resume
- Clean fake DOCX resume
- Two-column fake resume
- Corrupt PDF
- Unsupported `.txt` file
- QA Analyst job description
- Automation-heavy job description
- Prompt-injection job description
- Weak-match job description