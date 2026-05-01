# JOB-165 - Jira Ticket Fetch Command

## Purpose

Fetch a Jira ticket and write it into `jira-input/<ISSUE>.md` for the QA package generator.

This removes the manual copy/paste step before running:

```powershell
npm run generate:qa -- JOB-103
```

## Required Environment Variables

```powershell
$env:JIRA_BASE_URL="https://top-secret-games.atlassian.net"
$env:JIRA_EMAIL="your-email@example.com"
$env:JIRA_API_TOKEN="your-jira-api-token"
```

Do not commit Jira API tokens.

## Commands

Fetch a ticket:

```powershell
npm run fetch:jira -- JOB-103
```

If the input file already exists, the command will stop and refuse to overwrite it.

Force overwrite:

```powershell
npm run fetch:jira -- JOB-103 -- --force
```

## Full Workflow

```powershell
npm run fetch:jira -- JOB-103
npm run generate:qa -- JOB-103
npm run import:testrail-csv -- JOB-103
```

Apply TestRail import only after reviewing the generated CSV:

```powershell
npm run import:testrail-csv -- JOB-103 -- --apply
```

## Output

```txt
jira-input/JOB-103.md
```

The generated input includes:

- Key
- Summary
- Issue Type
- Status
- Labels
- Description
- Source note

## Safety

- Uses environment variables only.
- Does not store credentials.
- Does not overwrite existing input unless `--force` is used.
- Does not import to TestRail.
- Does not generate QA files by itself.
