import { timingSafeEqual } from 'crypto';

import type { ApiRequest, ApiResponse } from '../_shared/http-types.js';
import { applyApiResponseHeaders, guardRequest } from '../_shared/request-guard.js';
import { purgeExpiredCounters } from '../_shared/security-counters.js';

import { getRuntimeEnv } from './_lib/config.js';
import { runHealthChecks } from './_lib/health.js';
import { sendBookingHealthAlert } from './_lib/mailer.js';

/**
 * Scheduled probe of the booking dependencies, called by Vercel Cron.
 *
 * Not a public status page: every call reaches Google and Cloudflare, so it is
 * gated on the cron secret rather than rate-limited. 200 when healthy, 503
 * otherwise, which is also what makes it usable from an external uptime monitor.
 */

function matchesSecret(provided: string | undefined, expected: string): boolean {
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(`Bearer ${expected}`);
  // Length mismatch short-circuits because timingSafeEqual throws otherwise.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Without a configured secret the endpoint answers only outside production, so
 * a forgotten CRON_SECRET fails closed instead of exposing the probe.
 */
function isAuthorized(req: ApiRequest): boolean {
  const secret = getRuntimeEnv().cronSecret;
  if (!secret) return process.env.VERCEL_ENV !== 'production';
  return matchesSecret(req.headers.authorization, secret);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  applyApiResponseHeaders(res, ['GET']);

  const guard = guardRequest(req, { methods: ['GET'] });
  if (!guard.ok) {
    return res.status(guard.status).json({ ok: false, message: guard.message });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  // Housekeeping for the abuse counters rides along with the daily cron: the
  // rows are already inert once their window closes, so deleting them is not
  // worth a millisecond on any visitor's request.
  await purgeExpiredCounters().catch((error) => {
    console.error('security counter purge failed', error);
  });

  const report = await runHealthChecks();

  if (!report.ok) {
    console.error('booking health check failed', report.checks);
    // A broken mailer is one of the things being checked, so the alert itself
    // may fail. That must not turn a 503 into a 500.
    await sendBookingHealthAlert(report).catch((error) => {
      console.error('booking health alert could not be sent', error);
    });
  }

  return res.status(report.ok ? 200 : 503).json(report);
}
