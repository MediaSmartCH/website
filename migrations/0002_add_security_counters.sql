-- Migration 0002 — shared abuse counters
--
-- Apply to the Cloudflare D1 database backing the booking system BEFORE
-- deploying the matching API changes. Without the table the counters fail
-- soft: every endpoint falls back to the per-instance in-memory limiter and
-- logs the failure, so the site keeps working but the shared ceilings — the
-- ones that actually stop a parallel flood — are not enforced.
--
-- One table backs three controls (see api/_shared/security-counters.ts):
--
--   rl:<endpoint>       request rate limit, keyed by hashed client IP
--   mail:<flow>:rcpt    outbound mail per recipient, keyed by hashed address
--   mail:<flow>:global  outbound mail budget for the whole site, fixed key
--
-- `key` is always `<namespace>:<salted sha256>`, never a plaintext IP or
-- e-mail address: this table holds no personal data and a dump of it cannot be
-- turned back into a visitor list.
--
-- Rows are self-expiring (`reset_at` in the past means "empty window") and the
-- daily cron at /api/booking/health deletes them.

CREATE TABLE IF NOT EXISTS security_counters (
  key      TEXT    PRIMARY KEY,
  hits     INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);

-- Supports the cron purge, which is the only query that does not go through
-- the primary key.
CREATE INDEX IF NOT EXISTS idx_security_counters_reset_at
  ON security_counters (reset_at);
