const {
  extractRemoteIp,
  resolveClientIp,
} = require('./client-ip.js');

const recaptchaErrors = {
  failed: 'Security verification failed',
  missingToken: 'Security token missing',
  serverError: 'Security verification unavailable',
};

function normalizeRecaptchaToken(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Deadline for the siteverify call.
 *
 * Google has no SLA we can rely on here and the fetch has no timeout of its
 * own, so a stalled connection would hold the function open until the platform
 * killed it — turning the anti-bot check into the outage. Five seconds is well
 * past the normal round-trip and well inside any request budget.
 */
const RECAPTCHA_TIMEOUT_MS = 5_000;

/**
 * How old a solved challenge may be.
 *
 * Google already expires tokens after two minutes, so this mostly guards
 * against a future change on their side. It also caps how long a token
 * harvested from a real browser session stays useful to a replay script.
 */
const MAX_CHALLENGE_AGE_MS = 5 * 60 * 1000;

const DEFAULT_MIN_SCORE = 0.5;

const PREVIEW_HOSTNAME = /^[a-z0-9-]+\.vercel\.app$/i;
const LOCAL_HOSTNAME = /^(localhost|127\.0\.0\.1|\[?::1\]?)$/i;

function hostOf(value) {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return '';
  }
}

/**
 * The hostnames a token may have been solved on.
 *
 * reCAPTCHA reports where the challenge was served. Checking it means a token
 * minted on an attacker's own page — even one using a stolen copy of our site
 * key — cannot be spent against our API.
 */
function allowedRecaptchaHostnames() {
  const configured = [
    process.env.SITE_ORIGIN || 'https://mediasmart.ch',
    ...(process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  ];

  const hostnames = new Set();
  for (const entry of configured) {
    const host = hostOf(entry) || entry.toLowerCase();
    if (!host) continue;
    const bare = host.replace(/:\d+$/, '');
    hostnames.add(bare);
    hostnames.add(bare.startsWith('www.') ? bare.slice(4) : `www.${bare}`);
  }

  return hostnames;
}

function isAllowedRecaptchaHostname(hostname) {
  // reCAPTCHA omits the hostname for app keys and may omit it if the payload
  // ever changes shape. Absent means "nothing to check", not "wrong host": the
  // other signals (success, action, score, freshness) still have to pass, so
  // refusing here would only break legitimate visitors on a Google change.
  if (typeof hostname !== 'string' || !hostname) {
    return true;
  }

  const normalized = hostname.toLowerCase().replace(/:\d+$/, '');

  if (allowedRecaptchaHostnames().has(normalized)) {
    return true;
  }

  if (process.env.VERCEL_ENV === 'production') {
    return false;
  }

  return PREVIEW_HOSTNAME.test(normalized) || LOCAL_HOSTNAME.test(normalized);
}

function isFreshChallenge(challengeTs) {
  if (typeof challengeTs !== 'string' || !challengeTs) {
    return true;
  }

  const solvedAt = Date.parse(challengeTs);
  if (Number.isNaN(solvedAt)) {
    return true;
  }

  // Only lateness matters: a client clock ahead of ours is Google's timestamp,
  // not the visitor's, so it cannot be skewed by the caller.
  return Date.now() - solvedAt <= MAX_CHALLENGE_AGE_MS;
}

function readMinScore(fallback) {
  const raw = process.env.RECAPTCHA_MIN_SCORE;
  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    console.warn('RECAPTCHA_MIN_SCORE must be between 0 and 1; ignoring');
    return fallback;
  }

  return parsed;
}

async function verifyRecaptcha({
  token,
  expectedAction,
  remoteIp,
  minScore = DEFAULT_MIN_SCORE,
}) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const normalizedToken = normalizeRecaptchaToken(token);
  const requiredScore = readMinScore(minScore);

  if (!secret) {
    console.error('RECAPTCHA_SECRET_KEY is missing');
    return { ok: false, status: 500, message: recaptchaErrors.serverError };
  }

  if (!normalizedToken) {
    return { ok: false, status: 400, message: recaptchaErrors.missingToken };
  }

  // A token is a bounded opaque string. Anything longer is not one, and
  // forwarding it would only hand Google our bandwidth.
  if (normalizedToken.length > 4096) {
    return { ok: false, status: 400, message: recaptchaErrors.failed };
  }

  const params = new URLSearchParams({
    secret,
    response: normalizedToken,
  });

  if (remoteIp) {
    params.set('remoteip', remoteIp);
  }

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), RECAPTCHA_TIMEOUT_MS);

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
      signal: abort.signal,
    });

    if (!response.ok) {
      throw new Error(`Unexpected reCAPTCHA response status: ${response.status}`);
    }

    const payload = await response.json();
    const score = typeof payload.score === 'number' ? payload.score : 0;
    const actionMatches = expectedAction ? payload.action === expectedAction : true;
    const hostnameAllowed = isAllowedRecaptchaHostname(payload.hostname);
    const fresh = isFreshChallenge(payload.challenge_ts);

    if (
      !payload.success ||
      !actionMatches ||
      !hostnameAllowed ||
      !fresh ||
      score < requiredScore
    ) {
      // Logged without the token or the IP: this line exists to explain a
      // refusal, not to build a record of who was refused.
      console.warn('reCAPTCHA rejected request', {
        action: payload.action,
        actionMatches,
        errorCodes: payload['error-codes'],
        expectedAction,
        fresh,
        hostname: payload.hostname,
        hostnameAllowed,
        requiredScore,
        score,
        success: payload.success,
      });

      return { ok: false, status: 400, message: recaptchaErrors.failed };
    }

    return { ok: true, score, action: payload.action };
  } catch (error) {
    // Fails closed, including on timeout: we would rather ask a visitor to
    // retry than let every bot through while Google is unreachable.
    if (abort.signal.aborted) {
      console.error('reCAPTCHA verification timed out');
    } else {
      console.error('reCAPTCHA verification failed', error);
    }
    return { ok: false, status: 500, message: recaptchaErrors.serverError };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  // Re-exported so the handlers keep one import for "who is calling". The
  // resolution itself lives in client-ip.js, which owns the Cloudflare rules.
  extractClientIp: resolveClientIp,
  extractRemoteIp,
  isAllowedRecaptchaHostname,
  recaptchaErrors,
  verifyRecaptcha,
};
