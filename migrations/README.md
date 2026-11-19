# D1 migrations (booking system)

The booking API stores data in a Cloudflare D1 database, reached over the D1
HTTP query API (`api/booking/_lib/d1.ts`). These `.sql` files are the schema
changes that must be applied to that database, in order.

## Applying a migration

`scripts/d1-migrate.mjs` applies the pending files and records each one in a
`schema_migrations` table, so the database itself answers "which migrations are
live?". It talks to the same D1 HTTP API as the deployed code and reads the
same three variables (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_D1_DATABASE_ID`), from `.env.local` or from the environment.

```bash
pnpm d1:status             # read-only: what is applied, what is pending
pnpm d1:migrate:dry-run    # what --apply would run, without writing
pnpm d1:migrate            # apply everything pending, in order
```

A bare `pnpm d1:status` never writes, which is why it is the default: this
points at the production database.

`d1:status` exits non-zero when the record and the files have parted ways —
a file edited after it was applied, or a row with no file left on disk — so CI
can fail on it.

### Adopting this on a database that is already up to date

A database migrated by hand before this script existed has no rows to show for
it, and `d1:migrate` would try to replay those files. `0001` would fail on
`duplicate column name: token_version`, because `ALTER TABLE ... ADD COLUMN`
cannot run twice.

Record them as applied instead, without running them — once, per database:

```bash
node scripts/d1-migrate.mjs --baseline 0002_add_security_counters
```

That marks every migration up to and including the named one as applied. Check
first that the schema really does match those files; `--dry-run` shows what
would be recorded.

### Applying by hand

Still possible, and still the fallback when the script cannot reach D1 — but
nothing gets recorded, so `d1:status` will keep reporting the migration as
pending until it is baselined:

```bash
npx wrangler d1 execute mediasmart-website-bookings --remote \
  --file=migrations/0002_add_security_counters.sql
```

Or paste the SQL into the D1 console for the database in the Cloudflare
dashboard.

## Ordering

Apply `0002_*` **before** deploying the API changes that depend on it:

- `security_counters` — the shared abuse counters (rate limits and outbound
  mail budgets) for every endpoint, not just the booking ones. Missing, the
  counters fail soft: each instance falls back to its own in-memory limiter and
  logs the failure, so the site keeps working but a flood spread across
  instances is no longer caught.

Apply `0001_*` **before** deploying the API changes that depend on it:

- `token_version` — read by every booking endpoint and written by
  `reschedule`. Deploying the code first would make every query reference a
  missing column.
- `idx_bookings_active_slot` — `create`/`reschedule` rely on the unique index
  to detect a lost race; without it, concurrent double-bookings are still
  possible (the code just no longer double-writes once the index exists).

## Reference: expected `bookings` shape

For convenience, the columns the code expects (the table itself predates these
migration files):

| column             | type    | notes                                    |
|--------------------|---------|------------------------------------------|
| id                 | TEXT    | primary key, UUIDv4                      |
| calendar_event_id  | TEXT    | nullable; set after the calendar write   |
| attendee_name      | TEXT    |                                          |
| attendee_email     | TEXT    |                                          |
| attendee_message   | TEXT    | nullable                                 |
| attendee_language  | TEXT    | 'fr' \| 'en'                             |
| start_at           | INTEGER | unix seconds                             |
| end_at             | INTEGER | unix seconds                             |
| status             | TEXT    | 'confirmed' \| 'cancelled'               |
| token_version      | INTEGER | NOT NULL DEFAULT 0  (added in 0001)      |
| created_at         | INTEGER | unix seconds                             |
| updated_at         | INTEGER | unix seconds                             |
| cancelled_at       | INTEGER | nullable                                 |
| cancel_reason      | TEXT    | nullable                                 |

## Reference: expected `security_counters` shape

Written and read by `api/_shared/security-counters.ts`. Rows are self-expiring
and the daily cron at `/api/booking/health` deletes the closed ones.

| column   | type    | notes                                              |
|----------|---------|----------------------------------------------------|
| key      | TEXT    | primary key, `<namespace>:<salted sha256>`          |
| hits     | INTEGER | requests counted in the current window              |
| reset_at | INTEGER | unix **milliseconds**; in the past means "empty"    |

`key` never contains a plaintext IP or e-mail address.

## Reference: expected `schema_migrations` shape

Created and maintained by `scripts/d1-migrate.mjs`. It has no `.sql` file of
its own on purpose: a migration that creates the table recording migrations
could not be recorded before it had run.

| column     | type    | notes                                              |
|------------|---------|----------------------------------------------------|
| id         | TEXT    | primary key, the filename without `.sql`            |
| applied_at | INTEGER | unix **seconds**                                    |
| checksum   | TEXT    | sha256 of the file's text when it was applied       |

`checksum` is what lets `d1:status` tell "applied" from "applied, then the file
was edited" — the second is a migration the database does not actually match,
and editing an applied migration instead of adding a new one is the usual way
an environment drifts without anyone noticing.
