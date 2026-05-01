\# Git-a-Job Automation QA Project



This repository is my QA automation and test-management project for \*\*Git-a-Job\*\*, a resume and job-analysis SaaS product.



The goal of this project is not just to write a few Playwright tests. The bigger goal is to build a realistic QA workflow that connects:



\- test planning

\- automation

\- CI evidence

\- test management

\- Jira traceability

\- release readiness



In plain terms: this is a working example of how I would structure QA coverage for a real product feature.



\---



\## What this project tests



Git-a-Job has a resume analyzer flow where a user can upload or provide resume content, paste a job description, run analysis, and receive ATS-style feedback.



The main product risks are:



\- resume parsing can fail or corrupt sections

\- AI suggestions can hallucinate experience

\- missing keywords can encourage false claims

\- ATS scoring can become stale or misleading

\- credits can be charged incorrectly

\- authenticated flows can behave differently than public pages

\- API endpoints can accept bad input or return inconsistent responses

\- release decisions can happen without enough evidence



This repo builds QA coverage around those risks.



\---



\## Current coverage



\### Public smoke tests



These check that the public Git-a-Job pages load and expose basic product content.



Covered by:



```txt

local/public-smoke.local.spec.js

