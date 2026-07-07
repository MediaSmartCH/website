-- Migration 0001 — token versioning + slot uniqueness
--
-- Apply to the Cloudflare D1 database backing the booking system BEFORE
-- deploying the matching API changes.
--
-- 1. token_version: per-booking counter folded into the HMAC of the manage
--    tokens. Rescheduling bumps it, which invalidates every previously-issued
--    cancel/reschedule link for that booking (see api/booking/_lib/tokens.ts).
--
-- 2. idx_bookings_active_slot: a PARTIAL unique index that lets the database be
--    the authoritative guard against two confirmed bookings on the same start
--    time. api/booking/create.ts and reschedule.ts claim the row before writing
--    to Google Calendar and turn a violation into an HTTP 409.

ALTER TABLE bookings ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_active_slot
  ON bookings (start_at)
  WHERE status = 'confirmed';
