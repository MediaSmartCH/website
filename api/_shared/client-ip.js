const { timingSafeEqual } = require('crypto');

/**
 * Who the caller is, when the site sits behind Cloudflare.
 *
 * ## Why this is not just `x-forwarded-for`
 *
 * Vercel overwrites `x-forwarded-for` with the address of whatever opened the
 * connection, and deliberately does not forward the value it received — that is
 * what makes it unspoofable. With Cloudflare in front, the thing opening the
 * connection *is* Cloudflare, so that header holds a Cloudflare edge address,
 * the same one for every visitor routed through that datacenter. Keying a rate
 * limit on it pools strangers into one bucket: a handful of simultaneous
 * visitors through the same city can exhaust an allowance meant for one person.
 *
 * Cloudflare passes the real address in `cf-connecting-ip`. But a header is
 * only worth what the hop that set it is worth, and the Vercel deployment URL
 * is reachable without going through Cloudflare at all — so anyone could send
 * `cf-connecting-ip: <anything>` straight to the origin and mint a fresh
 * rate-limit bucket per request. Trusting it unconditionally would be worse
 * than the pooling it fixes.
 *
 * So the hop is authenticated first. Cloudflare adds a secret header to every
 * request it forwards (a Transform Rule on the zone); we check it here, and
 * only then is `cf-connecting-ip` treated as fact.
 *
 * ## Why a secret and not an IP allowlist
 *
 * Cloudflare's published ranges are shared by every Cloudflare customer, so
 * "came from a Cloudflare address" only proves someone used Cloudflare — not
 * that they used *ours*. Anyone can point their own zone or Worker at our
 * origin and arrive from a perfectly valid Cloudflare address. The secret
 * proves the request came through our zone, and it needs no address list to
 * keep up to date.
 */

/** Header the Cloudflare Transform Rule adds on every request to the origin. */
const ORIGIN_VERIFY_HEADER = 'x-origin-verify';

function normalizeHeaderValue(value) {
  if (Array.isArray(value)) {
    return normalizeHeaderValue(value[0]);
  }

  return typeof value === 'string' ? value.trim() : '';
}

function extractRemoteIp(forwardedFor) {
  const normalizedForwardedFor = normalizeHeaderValue(forwardedFor);
  if (!normalizedForwardedFor) {
    return '';
  }

  return normalizedForwardedFor
    .split(',')[0]
    ?.trim()
    .replace(/^for=/i, '')
    .replace(/^"|"$/g, '')
    .replace(/^\[?::ffff:/i, '')
    .replace(/\]$/g, '') ?? '';
}

/**
 * The address of the hop that reached us.
 *
 * Behind Cloudflare this is a Cloudflare edge; called directly it is the
 * client. Either way it is set by the platform, not by the caller.
 *
 * `cf-connecting-ip` is deliberately absent from this chain: it is caller-
 * supplied, so it belongs only in `resolveClientIp`, and only once the
 * Cloudflare hop has been authenticated.
 */
function extractEdgeIp(headers) {
  if (!headers || typeof headers !== 'object') {
    return '';
  }

  const candidates = [
    headers['x-forwarded-for'],
    headers['x-real-ip'],
    headers['x-vercel-forwarded-for'],
    headers.forwarded,
  ];

  for (const candidate of candidates) {
    const ip = extractRemoteIp(candidate);

    if (ip) {
      return ip;
    }
  }

  return '';
}

function matchesSecret(provided, expected) {
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // Length mismatch short-circuits because timingSafeEqual throws otherwise.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Whether this request carries proof that it came through our Cloudflare zone.
 *
 * `configured` is false when no secret is set, which is the state before the
 * Transform Rule exists. Nothing is blocked then and nothing extra is trusted:
 * the site behaves exactly as it did before this module.
 *
 * `enforced` is separate on purpose. Setting the secret without the rule in
 * place would refuse every request; observing first, then enforcing, makes that
 * ordering mistake visible in the logs instead of on the site.
 */
function verifyCloudflareOrigin(headers) {
  const secret = process.env.CLOUDFLARE_ORIGIN_SECRET;

  if (!secret) {
    return { configured: false, verified: false, enforced: false };
  }

  const provided = normalizeHeaderValue(headers?.[ORIGIN_VERIFY_HEADER]);

  return {
    configured: true,
    verified: matchesSecret(provided, secret),
    enforced: process.env.CLOUDFLARE_ORIGIN_ENFORCE === 'true',
  };
}

/**
 * The visitor's address, as well as it can be known.
 *
 * Falls back to the edge address whenever the Cloudflare hop is unverified, so
 * an unauthenticated caller can never choose its own rate-limit bucket.
 */
function resolveClientIp(headers) {
  if (verifyCloudflareOrigin(headers).verified) {
    const forwarded = extractRemoteIp(headers?.['cf-connecting-ip']);
    if (forwarded) {
      return forwarded;
    }
  }

  return extractEdgeIp(headers);
}

module.exports = {
  extractEdgeIp,
  extractRemoteIp,
  normalizeHeaderValue,
  ORIGIN_VERIFY_HEADER,
  resolveClientIp,
  verifyCloudflareOrigin,
};
