Key: JOB-82
Summary: AI Job Match - Tailor Resume keeps stale previous job context instead of current selected job
Issue Type: Bug
Status: Done
Labels: 

Description:
Problem:

When a user clicks a different job posting and then uses Tailor Resume, the resume flow can keep the first parsed/previous job instead of the newly selected job.

Why this matters:

- Breaks trust in the core job-aware tailoring loop.
- Can generate the wrong tailored asset for the wrong role.
- Makes the jobs → resume handoff feel flaky even when the feed itself is working.

Expected behavior:

- The currently selected job should always overwrite previous job context.
- Resume handoff should reflect the latest selected job title, company, description, and jobId.
- Navigating from /jobs or /jobs/[id] to Tailor Resume should not reuse stale state from an earlier selection.

Suggested acceptance:

- Selecting Job B after Job A results in Tailor Resume opening with Job B context.
- Stored query/session/local state is overwritten correctly on each new handoff.
- Refreshing or navigating back/forward does not resurrect the old job unexpectedly.
- Cover Letter handoff should be checked for the same stale-context pattern.

Notes:

- Likely stale query/session/localStorage state or non-overwriting hydration bug.
- This should be treated as a core workflow bug, not polish.

Source:
Fetched from Jira by scripts/fetch-jira-ticket.js.
