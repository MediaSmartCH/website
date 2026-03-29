const recaptchaErrors = {
  failed: 'Security verification failed',
  missingToken: 'Security token missing',
  serverError: 'Security verification unavailable',
};

function normalizeRecaptchaToken(value) {
  return typeof value === 'string' ? value.trim() : '';
}

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

function extractClientIp(headers) {
  if (!headers || typeof headers !== 'object') {
    return '';
  }

  const candidates = [
    headers['x-forwarded-for'],
    headers['x-real-ip'],
    headers['x-vercel-forwarded-for'],
    headers['cf-connecting-ip'],
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

async function verifyRecaptcha({
  token,
  expectedAction,
  remoteIp,
  minScore = 0.5,
}) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const normalizedToken = normalizeRecaptchaToken(token);

  if (!secret) {
    console.error('RECAPTCHA_SECRET_KEY is missing');
    return { ok: false, status: 500, message: recaptchaErrors.serverError };
  }

  if (!normalizedToken) {
    return { ok: false, status: 400, message: recaptchaErrors.missingToken };
  }

  const params = new URLSearchParams({
    secret,
    response: normalizedToken,
  });

  if (remoteIp) {
    params.set('remoteip', remoteIp);
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Unexpected reCAPTCHA response status: ${response.status}`);
    }

    const payload = await response.json();
    const score = typeof payload.score === 'number' ? payload.score : 0;
    const actionMatches = expectedAction ? payload.action === expectedAction : true;

    if (!payload.success || !actionMatches || score < minScore) {
      console.warn('reCAPTCHA rejected request', {
        action: payload.action,
        actionMatches,
        errorCodes: payload['error-codes'],
        expectedAction,
        score,
        success: payload.success,
      });

      return { ok: false, status: 400, message: recaptchaErrors.failed };
    }

    return { ok: true, score, action: payload.action };
  } catch (error) {
    console.error('reCAPTCHA verification failed', error);
    return { ok: false, status: 500, message: recaptchaErrors.serverError };
  }
}

module.exports = {
  extractClientIp,
  extractRemoteIp,
  recaptchaErrors,
  verifyRecaptcha,
};
