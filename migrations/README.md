# D1 migrations (booking system)

The booking API stores data in a Cloudflare D1 database, reached over the D1
HTTP query API (`api/booking/_lib/d1.ts`). These `.sql` files are the schema
changes that must be applied to that database, in order.

## Applying a migration

With Wrangler pointed at the booking database:

```bash
# Preview
wrangler d1 execute <DB_NAME> --file=migrations/0001_add_token_version_and_slot_uniqueness.sql --local

# Production (the same DB id as CLOUDFLARE_D1_DATABASE_ID)
wrangler d1 execute <DB_NAME> --file=migrations/0001_add_token_version_and_slot_uniqueness.sql --remote
```

Or paste the SQL into the D1 console for the database in the Cloudflare
dashboard.

## Ordering

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
