# JOB-157 - Align Playwright Test Titles with TestRail Automation IDs

## Purpose

Make Playwright/JUnit output easier to map to existing TestRail GAJ test cases.

## Problem Found in JOB-156

TRCLI successfully imported 16/16 JUnit results, but it created new TestRail cases instead of mapping to the existing GAJ cases.

## Fix in This Pass

Add GAJ IDs to the CI-safe Playwright test titles.

Example:

Before:
rewrite safety cases have required fields

After:
GAJ-AI-001 - Rewrite safety cases have required fields

## Expected Result

The regenerated JUnit file should include GAJ IDs in testcase names.

## Remaining Work

TRCLI may still require TestRail automation_id values to match the generated JUnit testcase names exactly.

