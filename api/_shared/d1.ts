// We're on Vercel, not on Cloudflare, so we hit D1's HTTP query API rather
// than binding the database. The API accepts a single SQL statement plus an
// optional positional-params array and returns query results in the standard
// envelope used across the Cloudflare REST API.

// Deadline for a single D1 HTTP call. Generous enough for a cross-region
// round-trip, short enough that a Cloudflare stall never becomes ours.
const D1_TIMEOUT_MS = 5_000;

interface D1QueryMeta {
  duration: number;
  rows_read?: number;
  rows_written?: number;
  changes?: number;
  last_row_id?: number;
}

interface D1QueryResult<Row> {
  results: Row[];
  success: boolean;
  meta: D1QueryMeta;
}

interface D1ApiEnvelope<Row> {
  result: D1QueryResult<Row>[];
  success: boolean;
  errors?: Array<{ code: number; message: string }>;
  messages?: Array<{ code: number; message: string }>;
}

interface D1Credentials {
  accountId: string;
  apiToken: string;
  databaseId: string;
}

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

/**
 * True when the three Cloudflare vars are present.
 *
 * Callers that treat D1 as a best-effort dependency (the security counters)
 * use this to stay silent on a machine that never configured it, instead of
 * logging a credential error on every request.
 */
export function isD1Configured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_API_TOKEN &&
      process.env.CLOUDFLARE_D1_DATABASE_ID,
  );
}

function readCredentials(): D1Credentials {
  return {
    accountId: readEnv('CLOUDFLARE_ACCOUNT_ID'),
    apiToken: readEnv('CLOUDFLARE_API_TOKEN'),
    databaseId: readEnv('CLOUDFLARE_D1_DATABASE_ID'),
  };
}

export class D1Error extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'D1Error';
  }
}

// SQLite (D1) surfaces a partial-unique-index violation as a
// "UNIQUE constraint failed: ..." error. Callers use this to turn a lost race
// for a booking slot into a clean 409 instead of a 500.
export function isUniqueConstraintError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /UNIQUE constraint failed/i.test(message);
}

async function rawQuery<Row>(
  sql: string,
  params: Array<string | number | null>,
): Promise<D1QueryResult<Row>> {
  const credentials = readCredentials();
  const url = `https://api.cloudflare.com/client/v4/accounts/${credentials.accountId}/d1/database/${credentials.databaseId}/query`;

  // Without a deadline a stalled Cloudflare connection would hold the
  // serverless invocation open for as long as the platform allows, which on a
  // rate-limit lookup means the abuse check becomes the outage.
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), D1_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      signal: abort.signal,
    });
  } catch (error) {
    if (abort.signal.aborted) {
      throw new D1Error(`D1 request timed out after ${D1_TIMEOUT_MS}ms`, error);
    }
    throw new D1Error('D1 request failed', error);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new D1Error(
      `D1 HTTP ${response.status}: ${text.slice(0, 500)}`,
    );
  }

  const envelope = (await response.json()) as D1ApiEnvelope<Row>;
  if (!envelope.success) {
    const errMessage = envelope.errors?.map((e) => e.message).join('; ') ?? 'unknown';
    throw new D1Error(`D1 query failed: ${errMessage}`);
  }

  // The API returns one result block per statement. We only ever issue single
  // statements through this helper, so the first block is what we want.
  const block = envelope.result[0];
  if (!block) {
    throw new D1Error('D1 returned no result block');
  }
  return block;
}

export async function queryAll<Row = Record<string, unknown>>(
  sql: string,
  params: Array<string | number | null> = [],
): Promise<Row[]> {
  const result = await rawQuery<Row>(sql, params);
  return result.results;
}

export async function queryFirst<Row = Record<string, unknown>>(
  sql: string,
  params: Array<string | number | null> = [],
): Promise<Row | null> {
  const rows = await queryAll<Row>(sql, params);
  return rows[0] ?? null;
}

export async function exec(
  sql: string,
  params: Array<string | number | null> = [],
): Promise<D1QueryMeta> {
  const result = await rawQuery(sql, params);
  return result.meta;
}
