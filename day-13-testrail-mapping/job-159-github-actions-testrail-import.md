\# JOB-159 - Optional GitHub Actions TestRail Import



\## Purpose



Allow GitHub Actions to optionally upload Playwright JUnit results into TestRail using TRCLI.



\## Required GitHub Secrets



The repo must define these Actions secrets:



\- TESTRAIL\_URL

\- TESTRAIL\_USER

\- TESTRAIL\_API\_KEY



Never commit these values.



\## Workflow Behavior



Normal push and pull request runs:



\- install dependencies

\- run Playwright CI-safe JUnit suite

\- generate `test-results/junit.xml`

\- generate `playwright-report/index.html`

\- upload artifacts:

&#x20; - `junit-results`

&#x20; - `playwright-report`



Manual workflow dispatch with `upload\_to\_testrail=true`:



\- does all of the above

\- installs TRCLI

\- uploads `test-results/junit.xml` to TestRail



\## Why Upload Is Optional



TestRail imports create runs and may create/update cases depending on mapping behavior.



Keeping upload optional prevents normal CI from creating noisy TestRail runs on every push.



\## Current Import Command



```bash

trcli -y \\

&#x20; -h "$TESTRAIL\_URL" \\

&#x20; --project "Git-a-Job Automation" \\

&#x20; --username "$TESTRAIL\_USER" \\

&#x20; --key "$TESTRAIL\_API\_KEY" \\

&#x20; parse\_junit \\

&#x20; -f "test-results/junit.xml" \\

&#x20; --title "Git-a-Job Automated CI Fixture Import"

