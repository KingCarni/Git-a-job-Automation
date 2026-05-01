Key: JOB-56
Summary: System - Daily bonus of 10 credits if user signs in
Labels: Credit_System

Description:
Award a daily login bonus of 10 credits to eligible users when they sign in to Git-a-Job.

Acceptance Criteria:
- First eligible sign-in grants 10 credits.
- Repeated same-day sign-in does not grant duplicate credits.
- Ledger entry uses reason daily_login_bonus.
- Ledger ref is unique per user per day.
- Different users can each receive their own bonus.
- Bonus credits are not treated as paid/donatable credits.
- UI credit count updates after daily bonus award.

Risks:
- Duplicate credit grants could inflate balances.
- Race conditions could create duplicate ledger entries.
- Timezone handling could award credits too early or too late.
- Bonus credits could accidentally be treated as paid credits.
