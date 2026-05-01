# JOB-163 - TestRail CSV Import Command

## Purpose

Import generated QA package CSV files into TestRail without using the manual CSV wizard every time.

This is for manual/reference cases generated from Jira tickets.

It is separate from the Playwright/JUnit/TRCLI automation result flow.

## Commands

Dry run:

```powershell
npm run import:testrail-csv -- JOB-126
```

Apply/import:

```powershell
npm run import:testrail-csv -- JOB-126 --apply
```

## Required Environment Variables

```powershell
$env:TESTRAIL_URL="https://gitajobautomation.testrail.io"
$env:TESTRAIL_USER="your-email@example.com"
$env:TESTRAIL_API_KEY="your-api-key"
```

Optional:

```powershell
$env:TESTRAIL_PROJECT="Git-a-Job Automation"
```

## Input

The importer reads:

```txt
generated-qa/<ISSUE>/<ISSUE>-testrail-cases.csv
```

Example:

```txt
generated-qa/JOB-126/JOB-126-testrail-cases.csv
```

## Behavior

The importer:

- finds the TestRail project by name
- reads the generated CSV
- finds or creates the section named in the CSV `Section` column
- skips cases if the title already exists
- creates missing manual/reference cases
- adds Jira references through the `References` column
- keeps automation-linked `.spec.js` sections untouched

## Safety

By default, the command runs in dry-run mode.

It only writes to TestRail when `--apply` is passed.

Do not commit API keys or credentials.
