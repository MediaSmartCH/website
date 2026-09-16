/**
 * Test doubles for the minimal request/response contract the API handlers use.
 *
 * The handlers are written against `ApiRequest`/`ApiResponse` from
 * `_shared/http-types.ts` rather than the Vercel builder types, so a plain
 * object implementing `status`/`json`/`send`/`setHeader` is enough to drive
 * them. This module holds no assertions: it only records what a handler did.
 */

import type { ApiRequest, ApiResponse } from '../_shared/http-types.js';

export interface ResponseRecorder {
  res: ApiResponse;
  /** HTTP status passed to `res.status()`, or null when never called. */
  statusCode: () => number | null;
  /** Body passed to `res.json()` / `res.send()`, or null when never called. */
  body: () => unknown;
  header: (name: string) => string | undefined;
}

/**
 * Headers a real browser attaches to a same-origin JSON POST.
 *
 * The handlers refuse a request that does not look like one (see
 * `_shared/request-guard.ts`), so a fixture without these would exercise the
 * rejection path rather than the behaviour under test. Cases that mean to test
 * the guard itself override them explicitly.
 */
export function sameOriginHeaders(): Record<string, string> {
  return {
    'content-type': 'application/json',
    // Read per call rather than once at import: each suite sets its own
    // SITE_ORIGIN, and the guard compares the two.
    origin: process.env.SITE_ORIGIN ?? 'https://mediasmart.ch',
    'sec-fetch-site': 'same-origin',
  };
}

export function createRequest(
  overrides: Partial<ApiRequest> & { body?: Record<string, unknown> } = {},
): ApiRequest {
  return {
    method: 'POST',
    headers: sameOriginHeaders(),
    body: {},
    query: {},
    ...overrides,
  } as ApiRequest;
}

export function createResponse(): ResponseRecorder {
  const headers = new Map<string, string>();
  let statusCode: number | null = null;
  let body: unknown = null;

  const res = {
    setHeader(name: string, value: unknown) {
      headers.set(name.toLowerCase(), String(value));
      return res;
    },
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(payload: unknown) {
      body = payload;
      return res;
    },
    send(payload: unknown) {
      body = payload;
      return res;
    },
  } as unknown as ApiResponse;

  return {
    res,
    statusCode: () => statusCode,
    body: () => body,
    header: (name: string) => headers.get(name.toLowerCase()),
  };
}

/**
 * Returns headers carrying a unique client IP.
 *
 * The rate limiter keys on the client IP in a module-global map that survives
 * between tests, so each case that must start from a clean allowance needs its
 * own address.
 */
let ipCounter = 0;
export function uniqueClientHeaders(): Record<string, string> {
  ipCounter += 1;
  return {
    ...sameOriginHeaders(),
    'x-forwarded-for': `10.0.${Math.floor(ipCounter / 250)}.${ipCounter % 250}`,
  };
}
