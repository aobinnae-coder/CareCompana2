# Notification Matrix

| Event | Channel | Recipient | Trigger Condition | Message Template |
|-------|---------|-----------|------------------|------------------|
| Booking Confirmed | Push, In-app | Family | Companion accepts | "Your visit for [Senior] with [Companion] is confirmed for [Date]." |
| New Job Available | Push | Companion | Valid match > 80% | "New visit request near you: [Time], Est payout: $[Amt]." |
| Companion En Route| Push | Family | Companion taps 'Start' | "[Companion] is on the way to visit [Senior]." |
| Check-in | Push, SMS | Family | GPS verified arrival | "[Companion] has arrived safely at [Senior]'s location." |
| Important Note | Push | Family | Companion logs a note | "New update from [Companion]: [Snippet]..." |
| Check-out / Summary | Email, Push| Family | Visit completed API | "Visit complete! Read the AI summary of [Senior]'s day." |
| Background Check | Email | Companion| Status changed to Clear | "Your background check is clear. You can now accept visits." |
| Emergency Alert | SMS(Twilio) | Family, Ops| Panic button pressed | "URGENT: Emergency alert triggered for [Senior]. Ops team notified. Please check app." |
| Suspicious Activity | Slack/Admin| Ops | Incident L3/L4 created| "ALERT: Level [Severity] incident reported on Visit [ID]." |
