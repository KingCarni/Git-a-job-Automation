# Credit and Webhook API Risks

## Areas
- `/api/stripe/webhook`
- `/api/account/donate-credits`
- `/api/admin/donation-pool`
- AI action credit consumption

## Main Risks

### 1. Duplicate Stripe Event
Stripe may retry webhook delivery.

Expected:
- Event is processed once
- Credits are awarded once
- Duplicate event is safely ignored

Test:
- Send same event ID twice
- Verify ledger has one purchase entry

---

### 2. Failed Analysis Charges Credit
AI action fails after credit deduction.

Expected:
- Credit is only consumed after successful action, or failed action is refunded
- User never loses credits for no result

Test:
- Force `/api/analyze` failure
- Verify credit balance unchanged or compensated

---

### 3. Double Click Analyze
User rapidly submits the same paid action.

Expected:
- Only one request is processed
- Only one credit charge occurs
- UI disables button while loading

Test:
- Double-click Analyze
- Inspect network/API calls
- Verify ledger

---

### 4. Donation of Free Credits
User attempts to donate credits that were not purchased.

Expected:
- Only paid credits are eligible for donation
- Free/signup credits cannot be donated if product rules say so

Test:
- User has free credits only
- Attempt donation
- API rejects request

---

### 5. Admin Endpoint Access
Non-admin user attempts to access donation pool/admin fulfillment.

Expected:
- 401/403
- No data exposed
- No mutation performed

Test:
- Call admin endpoint as normal user

---

## QA Recommendation
Credit logic should have API-level tests and database/ledger verification. UI tests alone are not enough for billing-like behavior.