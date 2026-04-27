# UI Structure & State Management

## Family App (Mobile/Web)
- **Onboarding:**
  - Login/Register (Phone SMS OTP)
  - Senior Profile Setup (Form wizard: Details -> Conditions -> Emergency Contacts)
  - Payment Method (Stripe Elements check)
- **Dashboard:**
  - Active/Upcoming Visits Card (Pulse/Realtime)
  - Wellness Score & Analytics Graph (Recharts)
  - "Book New Visit" FAB
- **Booking Flow:**
  - Visit Type Selection -> Date/Time Slider -> Companion Match Viewer (Tinder-style or list) -> Checkout
- **Live Visit view:**
  - Map View (Google Maps Embed)
  - Timeline of Check-ins, Notes, Photos
  - Emergency Panic Button
  - Auto-generated Visit Summary (Post-visit)

## Companion App (Mobile-first)
- **Job Discovery:**
  - Map / List view of nearby pending visits
  - Filter by duration, payout
- **Visit Execution:**
  - Navigation Action -> Turn-by-turn Maps
  - "Arrived" Button (GPS validated)
  - Visit Log interface (Mood tags, camera integration for photos)
- **Earnings & Profile:**
  - Weekly summary, Stripe Connect Dashboard
  - Background Check status viewer

## Admin Panel (Web)
- **Trust & Safety Dashboard:**
  - Incident queues (High/Med/Low severity)
  - Background Check review queue
  - Manual ID verification
- **Visits Oversight:**
  - Live Map of all active visits
  - Alerts for "Late check-in" or "Unusual GPS pattern"
- **User Management:**
  - Suspend, Flag, Audit logs view

## Shared Component Library
- Colors: Trust Blue, Safety Orange, Clinical White, Accessible Gray.
- Typography: Inter (UI), Space Grotesk (Headers).
- State: URL paths for macro-navigation, Global state (Context/Zustand) for Auth and Realtime connections, Local state for forms.
