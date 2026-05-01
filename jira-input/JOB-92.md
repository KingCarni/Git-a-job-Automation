Key: JOB-92
Summary: ResumeProfile rebuild/backfill and stale-profile correction
Issue Type: Task
Status: Done
Labels: backfill, jobs, match, normalization, rebuild, resume-profile, stale-profile

Description:
## Objective

Add a safe ResumeProfile rebuild/backfill path so existing profiles can be regenerated with the latest normalization and profile-build logic, reducing stale profile drift and false likely gaps.

## Why this matters

Recent jobs-side scoring and profile normalization work improved matching, but current profile payloads still show stale/incomplete candidate-side signals.

Observed example from live profile payload:

- present: `c#`, `javascript`, `react`, `typescript`, `sql`, `unity`, `ci/cd`, `jenkins`, `jira`
- missing even though expected from source resume / role fit: `c++`, `java`, `.net`, `oop`, `design patterns`, `graphql`, `microservices`, `ecs`
- bad artifact present: standalone `c`
- contradictory state also exists (`normalizedTitles` includes `senior software engineer` while profile seniority remains `junior`)

This means the matcher is now exposing stale or incomplete ResumeProfile snapshots rather than purely scoring problems.

## Scope

### 1) ResumeProfile rebuild path

- add a deterministic rebuild path for existing ResumeProfile records using the latest build/normalize logic
- support rebuilding one profile and/or all profiles for the current user
- preserve safety: no cross-user rewrites, no unrelated data mutation

### 2) Backfill / stale-profile correction

- regenerate `normalizedSkills`, `keywords`, `normalizedTitles`, `summary`, `seniority`, and `yearsExperience` from current source data where possible
- clean obvious artifacts like standalone `c`
- reduce contradictory title/seniority combinations when rebuilding

### 3) Source-of-truth handling

- use the best available source snapshot already stored for the profile/resume
- fail safely when the source document is missing
- avoid inventing data when no rebuild source exists

### 4) Inspection/debug support

- make it easier to inspect what a rebuilt profile actually contains
- enough visibility to compare before vs after for skills/titles/seniority

## Non-goals

- do not redesign jobs UI
- do not rebuild the entire resume parser
- do not touch billing/auth/account systems outside what is strictly needed for profile rebuild access control
- do not add unrelated analytics in this ticket

## Likely target files

- `src/lib/resumeProfiles/buildProfile.ts`
- `src/lib/resumeProfiles/normalizeResume.ts`
- profile rebuild route/helper files if required
- possibly `src/app/api/resume-profiles/...` only if needed for a controlled rebuild endpoint

## Acceptance criteria

- existing stale profiles can be rebuilt using current logic
- rebuilt profiles preserve more concrete engineering/tool/language signals
- obvious artifacts like standalone `c` are removed
- contradictory title/seniority state is reduced
- job detail strong signals / likely gaps become more trustworthy after rebuild
- safe failure path exists when no rebuild source is available

Source:
Fetched from Jira by scripts/fetch-jira-ticket.js.
