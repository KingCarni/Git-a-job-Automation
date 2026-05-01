Key: JOB-95
Summary: Calibrate keyword fit score against selected ResumeProfile strength
Issue Type: Task
Status: Done
Labels: calibration, jobs, keyword-fit, match, scoring

Description:
Objective: make keyword fit behave more proportionally to the selected ResumeProfile, so clearly stronger profiles score materially higher than weak or cross-family profiles for the same job.

Why this matters:

- Current screenshots show a software-engineer profile and a QA-tester profile both receiving very similar keyword-fit percentages on a senior software-engineer role.
- The keyword chips themselves are improving, but the keyword-fit bar is not separating strong-fit profiles from weak-fit profiles enough.
- This makes the component look misleading even when the strong signals/gaps are directionally correct.

Observed behavior:

- software-engineer profile on a senior software-engineer role looks like it should be near the top of the range
- QA-tester profile on the same role still gets a surprisingly high keyword-fit score instead of dropping much more clearly

Desired behavior:

- keyword fit should reward concrete overlap from the selected profile more aggressively
- cross-family profiles should score materially lower even if they share a few generic tech keywords
- role-family echoes and generic terms should contribute less than concrete, role-representative signals

Scope:

1. Keyword-fit calibration

- audit keyword-fit scoring inputs and weighting
- reduce over-credit for generic overlap
- increase separation between strong same-family overlap and weak cross-family overlap

1. Generic term suppression

- downweight generic/family echo terms and broad engineering/testing vocabulary when they inflate weak profiles
- prefer concrete languages, tools, frameworks, domain terms, and title-aligned signals

1. Trust/consistency

- preserve current strong-signal and likely-gap improvements
- keep keyword-fit aligned with what the panel visually communicates

Non-goals:

- no jobs UI redesign
- no profile rebuild rewrite in this ticket
- no unrelated account/billing/auth work

Likely target areas:

- src/lib/jobs/scoring.ts
- possibly closely related jobs normalization helpers only if strictly required

Acceptance criteria:

- keyword-fit percentage shows clearer separation between software-engineer and QA-tester profiles on the same software-engineer role
- generic overlap contributes less inflation
- strong same-family overlap contributes more clearly
- no regression to current strong-signal / likely-gap behavior

Source:
Fetched from Jira by scripts/fetch-jira-ticket.js.
