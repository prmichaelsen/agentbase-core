# Task 8: Tests — Utilities (format-time, linkify, uuid)

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: Task 2

## Objective

Write unit tests for `formatExactTime`, `getRelativeTime`, `linkifyText`, and `generateUUID`.

## Context

- Time functions are pure — easy to test with fixed dates
- Linkify has a 3-pass approach with protected zones — needs thorough regex testing
- UUID needs to verify format and uniqueness

## Steps

### format-time.test.ts
1. `formatExactTime` — formats date string to "h:mm AM Day M/D/YY"
2. `getRelativeTime` — "Just now", "Xm ago", "Xh ago", "Xd ago", "Xw ago", fallback to date

### linkify.test.ts
3. Protocol URLs (https://...) converted to markdown links
4. www.* URLs get https:// prefix
5. Bare domain URLs (example.com) get https:// prefix
6. Protected zones: code blocks not linkified
7. Protected zones: inline code not linkified
8. Protected zones: existing markdown links not double-linkified
9. Protected zones: markdown images not affected
10. Mixed content with URLs and protected zones

### uuid.test.ts
11. Returns valid UUID v4 format (8-4-4-4-12 hex)
12. Version nibble is 4
13. Variant bits are correct (8, 9, a, b)
14. Two calls return different values

## Verification

- [ ] Time formatting correct for various inputs
- [ ] Relative time thresholds (minutes, hours, days, weeks) verified
- [ ] Linkify handles all URL patterns
- [ ] Protected zones preserved in linkify
- [ ] UUID format and uniqueness verified
