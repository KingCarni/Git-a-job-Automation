\# JOB-158 - TestRail Automation Case Strategy



\## Decision



Use the TRCLI-created TestRail cases as the automation-linked source of truth.



\## Why



JOB-156 and JOB-157 proved that TRCLI can successfully:



\- parse Playwright JUnit XML

\- authenticate with TestRail

\- create TestRail runs

\- submit automated results



However, TRCLI did not map to the original manually imported CSV cases. It created new cases from the JUnit results.



Instead of forcing the original manual cases to map, the cleaner approach is:



```txt

TRCLI-created cases = automation-linked source

CSV/manual cases = manual/reference source

