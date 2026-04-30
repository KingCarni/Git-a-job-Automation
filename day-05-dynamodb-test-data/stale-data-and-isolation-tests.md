# Stale Data and Isolation Tests

## Stale Analysis Tests

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| SD-P0-001 | JD A keywords do not persist into JD B | Analyze Resume A against JD A, then JD B | Results only reflect JD B |
| SD-P0-002 | Resume A data does not persist into Resume B | Upload Resume A/analyze, then Resume B/analyze | Results only reflect Resume B |
| SD-P0-003 | Edited resume drives new analysis | Analyze, edit resume, re-analyze | Score/keywords reflect edited resume |
| SD-P0-004 | Browser refresh does not show half-stale result | Analyze, refresh page | Either valid restored state or clean reset |

## User Isolation Tests

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| ISO-P0-001 | User B cannot see User A resume | Analyze as User A, login as User B | User B sees only own data |
| ISO-P0-002 | User B cannot see User A credits | User A has credits, User B has zero | Balances remain separate |
| ISO-P0-003 | User B cannot access User A analysis URL | Copy deep link/result route | Access denied or own-context safe page |
| ISO-P0-004 | Admin data is hidden from non-admin | Normal user opens admin endpoint/page | 401/403 |
| ISO-P0-005 | Logout clears private state | Analyze, logout, return homepage | Resume/result data not visible |
