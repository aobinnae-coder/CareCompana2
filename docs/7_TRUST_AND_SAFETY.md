# Trust & Safety Integration (CareCircle)

## 1. Background Verification Pipeline
- Uses **Persona** for KYC (Selfie + Govt ID).
- Uses **Checkr** for FCRA-Compliant background screening.
- **Adverse Action Workflow:** If a report fails, the `background-check-webhook` triggers a "Pre-Adverse Action" email containing rights and the report. A 7-day timer is set via a scheduled cron edge function. After 7 days, if not disputed, the "Adverse Action" final notice is sent and the account is suspended.

## 2. Risk Scoring System
Each companion starts with a Risk Score of 100.
Deductions:
- Late arrival (> 15 mins): -2 pts.
- Visit cancellation (< 24hrs): -5 pts.
- Rating < 4.0: -10 pts.
- Minor incident reported (L1): -15 pts.
- Safety incident (L3): Immediately set to 0.

Thresholds:
- Score < 70: Manual review required. Account paused.
- Score < 40: Permanent Deactivation.

## 3. Incident Classification
- **Level 1 (Minor)**: E.g., companion was disorganized. Logged against profile.
- **Level 2 (Behavioral)**: E.g., rude communication. Flags account, pauses new bookings.
- **Level 3 (Safety)**: E.g., unsafe driving, theft accusation. Immediate admin escalation, account suspension.
- **Level 4 (Emergency)**: Medical emergency, signs of abuse. Triggers 911 workflows, Automatic APS (Adult Protective Services) report generation draft.

## 4. Fraud Prevention
- **GPS Spoofing**: `visit-checkin` function verifies device mock-location APIs (via mobile SDK) and checks IP location matching.
- **Duplicate Accounts**: Persona handles de-duplication based on biometric vectors and ID document uniqueness.

## 5. Audit & Forensics
The `audit_logs` table (see Schema) is immutable. DB triggers record changes to user status, payment ledgers, and visit status. Data is never deleted (Soft Delete only) for forensic capability.
