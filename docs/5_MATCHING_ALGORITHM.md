# Matching Algorithm Specification

The algorithm determines the compatibility between a Senior/Family booking request and available Companions. It outputs a Match Score (0-100).

## Scoring Formula Weights
- **Geographic Proximity (40%)**: Uses Google Maps Distance Matrix. Max score if < 3 miles. Linear degradation to 0 at max_radius (e.g., 20 miles).
- **Skill/Condition Match (25%)**: Jaccard index or strict intersection between `seniors.conditions` and `companion.skills`. Extra weighting for critical tags like "Dementia Care".
- **Companion Rating (15%)**: Normalized score `(avg_rating / 5.0) * 15`. Companion with 5.0 gets full 15 points.
- **Shared Interests / Language (10%)**: Boolean match on `primary_language` gives 5pts. Intersection of `interests` gives up to 5pts.
- **Availability Overlap (10%)**: If the companion has a buffer of > 1 hour before/after the requested slot, full points.

## Exclusion Rules (Hard Filters)
- If Companion is blocked by the Family -> Exclude.
- If Companion `background_status` != `clear` -> Exclude.
- If Companion `risk_score` < 70 -> Exclude.

## Surfacing to Family
The top 3 matches are shown to the Family.
The UI surfaces the "Why this match?" reasons based on the highest-scoring categories:
- "Maria lives 2 miles away and has experience with Dementia Care."

## Recompute Triggers
Computed on-the-fly via a PostgreSQL stored procedure or Edge Function when a family initiates a search for a specific `datetime` block. Results are cached briefly using Redis or Supabase in-memory caching.
