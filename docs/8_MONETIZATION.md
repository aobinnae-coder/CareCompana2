# Monetization Integration Map

## 1. Family Subscription Plans (Stripe Billing)
- **Basic:** $0/mo. Platform fee: 25% per visit. 48hr booking window.
- **Care+:** $99/mo. Includes 1 prepaid visit. Platform fee: 20%. Live GPS & Wellness Dashboard enabled.
- **Family Pro:** $299/mo. Unlimited coordination, 15% platform fee, priority matching.
*Stripe integration via Customer Portal for upgrades/downgrades. Subscriptions manage feature flags (e.g., GPS tracking) via DB lookup.*

## 2. Per-Visit Marketplace Fee
- Base companion rate: e.g., $25/hr.
- Platform fee dynamically applied based on family's tier and market surge pricing.
- Stripe PaymentIntent created on booking confirmation, authorized with a 7-day hold. Captured upon successful `visit-checkout`.

## 3. Background Check Pass-through
- Cost of Checkr/Sterling ($25-45).
- Setup Fee charged directly to Companion upon onboarding, establishing their Stripe Connect Custom Account.

## 4. Payouts (Stripe Connect)
- Captured funds are held in platform balance.
- Companion's ledger updated immediately (`pending_payout`).
- T+2 days: Funds routed to Companion's Stripe Connect `Destination Charge`.
- Platform retains the platform fee fraction.
- End of Year: Stripe issues 1099-K/NEC automagically.
