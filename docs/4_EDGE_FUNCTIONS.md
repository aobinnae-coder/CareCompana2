# Edge Functions

1. `booking-create`
   - Trigger: HTTP Post
   - Input: senior_id, datetime, visit_type
   - Logic: Verifies family subscription tier. Checks rate limits. Creates `visits` row. Notifies matching algorithm.
   - Output: visit_id, matched_candidates

2. `visit-checkin`
   - Trigger: HTTP Post
   - Input: visit_id, companion_lat, companion_lng
   - Logic: Verifies GPS <= 100m from senior address. Updates visit status to `in_progress`. Creates `visit_logs` entry. Uses FCM to push notify family.
   - Output: Success / Distance Failure

3. `visit-checkout`
   - Trigger: HTTP Post
   - Input: visit_id, notes, mood_tag
   - Logic: Validates required note length. Updates status to `completed`. Charges Stripe PaymentIntent. Triggers `visit-summary-generate`.
   - Output: Success.

4. `payment-webhook`
   - Trigger: Webhook (Stripe)
   - Input: Stripe Event (invoice.paid, charge.disputed)
   - Logic: Idempotency check. Updates `subscriptions` or `payments` ledger.

5. `background-check-webhook`
   - Trigger: Webhook (Checkr/Persona)
   - Input: Report payload
   - Logic: Updates `companion_profiles.background_status`. If `review` or `failed`, triggers `adverse-action-workflow` and alerts Admin.

6. `visit-summary-generate`
   - Trigger: DB trigger on `visits.status = 'completed'`
   - Input: visit_id
   - Logic: Pulls all `visit_logs` text. Feeds to Anthropic Claude API `prompt: Summarize this care visit compassionately for the family.` Updates `visits.ai_summary`.

7. `emergency-alert-trigger`
   - Trigger: HTTP Post / DB Trigger
   - Input: target_senior_id, initiator
   - Logic: Twilio SMS to all emergency contacts. Slack/UI alert to Platform Ops. Creates Level 4 `incident`.
