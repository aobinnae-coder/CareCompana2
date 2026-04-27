# User Flow Diagrams

## Family Onboarding & Booking
1. **Signup:** Enters Phone -> Receives OTP -> Verifies -> Enters Email.
2. **Senior Setup:** Enters Senior details, address, conditions, mobility needs.
3. **Billing Setup:** Inputs CC securely via Stripe Elements. Subscribes to Tier (e.g. Care+).
4. **Booking Initiation:** Selects Visit Type -> Selects Date/Time Duration.
5. **Matching:** System calculates Top 3 Matches -> Family reviews Profiles.
6. **Request:** Family sends booking -> Status `pending`.
7. **Confirmation:** Companion accepts -> Family receives Push notification -> Status `confirmed`.

## Companion Onboarding & Job Discovery
1. **Registration:** Enters basic details -> Uploads ID/Selfie -> Starts check (Persona/Checkr).
2. **Profile Build:** Adds skills, bio, availability radius.
3. **Job Board:** Views nearby `pending` visits list.
4. **Action:** Taps job -> Reviews Senior details (anonymized) -> Clicks "Accept".
5. **Visit Execution:** 
   - Taps "Navigate" 
   - Within 100m -> Taps "Check-in" 
   - Mid-visit -> Logs Mood / Photo
   - End-visit -> Leaves note -> Taps "Check-out"
6. **Earnings:** View transaction ledger showing payout pending 48hr clearing.

## Senior Simple Interface
1. **Ambient Display:** Tablet shows "Next Visit: Tomorrow 10am with Maria".
2. **Check-in:** Large Green Button "I'm Okay" -> Taps -> Sends "All Good" to Family Dashboard.
3. **Emergency:** Large Red Button "Help" -> Taps -> Initiates automated call tree.

## Admin Trust & Safety Flow
1. **Alert:** Level 3 Incident triggered by NLP parsing of visit notes.
2. **Review:** DB logs surface in Admin Incident Queue.
3. **Investigation:** Ops views timestamps, GPS logs, messages.
4. **Resolution Actions:** Ops can refund family, suspend companion, generate mandatory report.
