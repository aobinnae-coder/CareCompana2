# CareCircle System Architecture

## Component Map

```mermaid
graph TD
    subgraph Client Apps
        FA[Family App - Web/Mobile]
        CA[Companion App - Mobile First]
        SA[Senior Interface - Tablet]
        AA[Admin Panel - Web]
    end

    subgraph API Gateway & Edge
        CDN[CDN / WAF]
        EdgeFunc[Supabase Edge Functions]
    end

    subgraph Core Services
        Auth[Supabase Auth]
        DB[(Supabase PostgreSQL)]
        Realtime[Supabase Realtime]
        Storage[Supabase Storage]
        Vault[Supabase Vault]
    end

    subgraph Third-Party Integrations
        Stripe[Stripe - Subscriptions & Connect]
        Checkr[Checkr/Persona - Background & IDV]
        Maps[Google Maps - Routing & Tracking]
        LLM[Anthropic Claude API - Summaries]
        Twilio[Twilio - SMS Alerts]
        FCM[Firebase Cloud Messaging - Push]
        Analytics[Sentry & PostHog]
    end

    Client Apps --> CDN
    CDN --> Auth
    CDN --> DB
    CDN --> Realtime
    CDN --> Storage
    
    DB --> EdgeFunc
    EdgeFunc --> Stripe
    EdgeFunc --> Checkr
    EdgeFunc --> Maps
    EdgeFunc --> LLM
    EdgeFunc --> Twilio
    EdgeFunc --> FCM
    
    Auth --> Vault
```

## Data Flows

### Booking Creation Flow (Async)
1. Family requests booking via API.
2. Row inserted into `visits` table (status: `pending`).
3. DB triggers hit Supabase Realtime channel for Companion App job discovery.
4. Companion accepts -> updates `visits` to `accepted`.
5. Edge Function triggered: Verifies Companion availability, holds funds via Stripe PaymentIntent.
6. Realtime sync updates Family App UI.

### Live Visit Tracking (Sync & Async)
1. Companion checks in (requires GPS verification via Google Maps Distance Matrix).
2. `visits.status` updated to `in_progress`.
3. Companion app pings location to `location_pings` table every 60s (Offline mode queues and syncs).
4. Family App subscribed to Realtime channel for `location_pings` and `visit_logs`.
5. Photos and notes upload directly to Supabase Storage; DB is updated with reference URLs.

### Payment Processing
1. Visit marked `completed`.
2. Edge function `visit-checkout` triggered.
3. Edge function calculates total duration and overrides (if any).
4. Edge function captures Stripe PaymentIntent.
5. Transfer requested via Stripe Connect to Companion account.
6. DB `payments` ledger updated.
