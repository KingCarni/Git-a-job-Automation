# Resume Fixture Manifest

## Source Text Fixtures

| Fixture ID | Source File | Expected File | Primary Risk |
|---|---|---|---|
| clean-qa-resume | source-text/clean-qa-resume.txt | expected-output/clean-qa-resume.expected.json | Happy path parsing |
| two-column-style-resume | source-text/two-column-style-resume.txt | expected-output/two-column-style-resume.expected.json | Two-column section mixing |
| weird-headings-resume | source-text/weird-headings-resume.txt | expected-output/weird-headings-resume.expected.json | Non-standard headings |
| paragraph-style-resume | source-text/paragraph-style-resume.txt | expected-output/paragraph-style-resume.expected.json | No bullet structure |
| weak-match-marketing-resume | source-text/weak-match-marketing-resume.txt | expected-output/weak-match-marketing-resume.expected.json | Weak role match / AI hallucination risk |

## Unsupported / Corrupt Fixtures

| Fixture | Purpose |
|---|---|
| unsupported/unsupported-resume.txt | Unsupported file validation |
| corrupt/corrupt-pdf-placeholder.txt | Placeholder for corrupt PDF fixture |

## Next Step
Convert these source fixtures into PDF and DOCX files for real parser regression.
