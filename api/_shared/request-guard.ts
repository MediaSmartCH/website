import type { IncomingHttpHeaders } from 'http';

import type { ApiRequest, ApiResponse } from './http-types.js';

/**
 * The checks every endpoint runs before it looks at a payload.
 *
 * None of these stop a determined attacker with curl — headers are trivially
 * forged. That is not what they are for. They stop the traffic that is not
 * targeting this site specifically: a page on another domain scripting our
 * form, a scanner POSTing junk to every path it finds, a body large enough to
 * be a denial-of-service on its own. That is the overwhelming majority of what
 * an unauthenticated public endpoint actually receives, and refusing it before
 * any validation, reCAPTCHA call or database round-trip keeps the expensive
 * defences for the requests that look real.
 */

export interface RequestGuardOptions {
  /** HTTP methods this endpoint answers. */
  methods: string[];
  /** Require a JSON content type. Default: true for POST-only endpoints. */
  requireJsonBody?: boolean;
  /** Reject a body larger than this, before parsing. */
  maxBodyBytes?: number;
  /**
   * Require the request to come from one of our own pages.
   * Default: true for anything other than a read-only endpoint.
   */
  requireSameOrigin?: boolean;
}

export interface GuardRejection {
  ok: false;
  status: number;
  message: string;
  /** Short machine-readable tag, for logs. Never sent to the client. */
  reason: string;
}

export type GuardResult = { ok: true } | GuardRejection;

/**
 * Ceiling on a request body.
 *
 * The longest field any endpoint accepts is the 5 000-character contact
 * message; 64 KiB leaves room for multi-byte characters and JSON overhead
 * while refusing anything that could only be an attempt to make us parse
 * megabytes.
 */
export const DEFAULT_MAX_BODY_BYTES = 64 * 1024;

const ALLOWED_PREVIEW_HOST = /^[a-z0-9-]+\.vercel\.app$/i;
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

function headerValue(headers: IncomingHttpHeaders, name: string): string {
  const raw = headers[name];
  if (Array.isArray(raw)) return raw[0]?.trim() ?? '';
  return typeof raw === 'string' ? raw.trim() : '';
}

function isProduction(): boolean {
  return process.env.VERCEL_ENV === 'production';
}

/**
 * The origins allowed to talk to the API.
 *
 * `SITE_ORIGIN` and its `www.` sibling are always in. `ALLOWED_ORIGINS` adds
 * any extra domain the site is served from. Preview deployments and localhost
 * are accepted outside production only, so a `*.vercel.app` URL can never be
 * used to reach the production functions.
 */
export function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;

  let host: string;
  let protocol: string;
  try {
    const parsed = new URL(origin);
    host = parsed.host.toLowerCase();
    protocol = parsed.protocol;
  } catch {
    return false;
  }

  const configured = [
    process.env.SITE_ORIGIN ?? 'https://mediasmart.ch',
    ...(process.env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  ];

  const allowedHosts = new Set<string>();
  for (const entry of configured) {
    try {
      const parsed = new URL(entry);
      const entryHost = parsed.host.toLowerCase();
      allowedHosts.add(entryHost);
      // The apex and the www. host serve the same app; one being configured
      // must not lock the other out.
      allowedHosts.add(
        entryHost.startsWith('www.') ? entryHost.slice(4) : `www.${entryHost}`,
      );
    } catch {
      console.warn(`Ignoring malformed allowed origin: ${entry}`);
    }
  }

  if (allowedHosts.has(host)) {
    return protocol === 'https:' || LOCAL_HOST.test(host);
  }

  if (isProduction()) return false;

  return ALLOWED_PREVIEW_HOST.test(host) || LOCAL_HOST.test(host);
}

/**
 * Decides whether a request came from one of our own pages.
 *
 * Browsers attach `Origin` to every fetch that can change state, so an allowed
 * value is the normal case and a foreign one is a cross-site attempt. A
 * missing `Origin` is only accepted when the Fetch Metadata headers say the
 * request is same-origin — that combination happens in practice, an entirely
 * header-less POST to a JSON API does not.
 */
function hasTrustedOrigin(headers: IncomingHttpHeaders): boolean {
  const origin = headerValue(headers, 'origin');

  if (origin) {
    return isAllowedOrigin(origin);
  }

  const site = headerValue(headers, 'sec-fetch-site').toLowerCase();
  if (site === 'same-origin' || site === 'same-site') {
    return true;
  }

  // Last resort before refusing: some privacy tooling strips `Origin` and
  // sends no Fetch Metadata at all. Fall back to the referrer, which has to
  // point at one of our own pages.
  const referer = headerValue(headers, 'referer');
  return referer ? isAllowedOrigin(referer) : false;
}

function contentLength(headers: IncomingHttpHeaders): number | null {
  const raw = headerValue(headers, 'content-length');
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function isJsonContentType(headers: IncomingHttpHeaders): boolean {
  const value = headerValue(headers, 'content-type').toLowerCase();
  // `application/json; charset=utf-8` and `application/…+json` both count.
  return /^application\/([\w.+-]+\+)?json\b/.test(value);
}

/**
 * Runs the pre-flight checks and returns the first failure, if any.
 *
 * Does not write to the response: the caller decides how to answer, because
 * the error shape differs between the contact endpoints and the booking ones.
 */
export function guardRequest(
  req: ApiRequest,
  options: RequestGuardOptions,
): GuardResult {
  const methods = options.methods.map((method) => method.toUpperCase());
  const method = (req.method ?? 'GET').toUpperCase();
  const mutates = method !== 'GET' && method !== 'HEAD';

  if (!methods.includes(method)) {
    return {
      ok: false,
      status: 405,
      message: 'Method not allowed',
      reason: 'method',
    };
  }

  const requireSameOrigin = options.requireSameOrigin ?? mutates;
  if (requireSameOrigin && !hasTrustedOrigin(req.headers)) {
    return {
      ok: false,
      status: 403,
      message: 'Forbidden',
      reason: 'origin',
    };
  }

  if (mutates) {
    const maxBytes = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
    const length = contentLength(req.headers);
    if (length !== null && length > maxBytes) {
      return {
        ok: false,
        status: 413,
        message: 'Payload too large',
        reason: 'body-size',
      };
    }

    const requireJsonBody = options.requireJsonBody ?? true;
    if (requireJsonBody && !isJsonContentType(req.headers)) {
      return {
        ok: false,
        status: 415,
        message: 'Unsupported media type',
        reason: 'content-type',
      };
    }
  }

  return { ok: true };
}

/**
 * Sets the response headers every API answer carries.
 *
 * `no-store` keeps a reply that may contain a visitor's own booking out of any
 * shared cache; `noindex` keeps the JSON endpoints out of search results even
 * if one is ever linked.
 */
export function applyApiResponseHeaders(res: ApiResponse, allow: string[]) {
  res.setHeader('Allow', allow.join(', '));
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
  // No `Access-Control-Allow-Origin` is ever sent: the API is same-origin
  // only, so a browser refuses to hand a cross-site caller the response even
  // if the request itself slipped through.
  res.setHeader('Vary', 'Origin');
}
