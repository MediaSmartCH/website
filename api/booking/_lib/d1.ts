import { getRuntimeEnv } from './config.js';

// We're on Vercel, not on Cloudflare, so we hit D1's HTTP query API rather
// than binding the database. The API accepts a single SQL statement plus an
// optional positional-params array and returns query results in the standard
// envelope used across the Cloudflare REST API.

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
  const env = getRuntimeEnv();
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.cfAccountId}/d1/database/${env.d1DatabaseId}/query`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.cfApiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

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
