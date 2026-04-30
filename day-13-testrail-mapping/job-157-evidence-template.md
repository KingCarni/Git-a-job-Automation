# JOB-157 Evidence Template

## Validation

- Playwright CI-safe titles updated with GAJ IDs
- npm run test:testrail:junit passed
- test-results/junit.xml generated
- JUnit XML contains GAJ IDs
- TRCLI import attempted

## Commands

Set JUnit output:
$env:PLAYWRIGHT_JUNIT_OUTPUT_NAME="test-results/junit.xml"

Run TestRail-friendly suite:
npm run test:testrail:junit

Check IDs:
Select-String -Path test-results\junit.xml -Pattern "GAJ-"

