# JOB-138 - QA Test Design

## Summary

Build internal resume parser foundation

## Source

This QA package was generated from pasted/fetched Jira ticket text.

## Feature Type

resume-parser-import

## Test Strategy

This package starts with a reviewable QA design, TestRail CSV rows, fixture JSON, and a Playwright fixture-test skeleton.

The first pass is intentionally rule/template-based. Human review is still expected before importing cases or promoting fixture tests into the main test suite.

## Generated Test Cases

### GAJ-PARSER-IMP-001 - PDF resume imports without parser crash

Priority: High

Type: Functional

Expected:
The PDF imports without crashing and produces usable structured resume data.

Notes:
Core parser/import happy path.

### GAJ-PARSER-IMP-002 - DOCX resume imports without parser crash

Priority: High

Type: Functional

Expected:
The DOCX imports without crashing and produces usable structured resume data.

Notes:
Core DOCX import check.

### GAJ-PARSER-IMP-003 - Unsupported file type is rejected safely

Priority: High

Type: Negative

Expected:
The app shows a safe error and does not save corrupted resume data.

Notes:
Prevents bad parser state.

### GAJ-PARSER-IMP-004 - Corrupt resume file fails gracefully

Priority: High

Type: Negative

Expected:
The parser fails gracefully with no crash and no partial/corrupt profile save.

Notes:
Protects import reliability.

### GAJ-PARSER-IMP-005 - Two-column resume layout preserves major sections

Priority: Medium

Type: Regression

Expected:
Major sections such as experience, education, skills, and contact details are not mixed or lost.

Notes:
Parser layout complexity check.

### GAJ-PARSER-IMP-006 - Parsed resume data remains fake/anonymized in fixtures

Priority: Medium

Type: Data Integrity

Expected:
Fixtures use fake/anonymized content only.

Notes:
Prevents accidental real personal data in repo.


## Recommended Next Steps

1. Review this QA package.
2. Import JOB-138-testrail-cases.csv into TestRail if the cases look useful.
3. Keep or edit JOB-138-fixtures.json.
4. Promote JOB-138-fixture-test.spec.js into the main tests folder only after review.
5. Add Jira evidence after validation.
