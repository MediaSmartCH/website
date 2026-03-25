const recaptchaErrors = {
  failed: 'Security verification failed',
  missingToken: 'Security token missing',
  serverError: 'Security verification unavailable',
};

function normalizeRecaptchaToken(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function extractRemoteIp(forwardedFor) {
  if (Array.isArray(forwardedFor)) {
    return extractRemoteIp(forwardedFor[0]);
  }

  if (typeof forwardedFor !== 'string') {
    return '';
  }

  return forwardedFor.split(',')[0]?.trim() ?? '';
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
  extractRemoteIp,
  recaptchaErrors,
  verifyRecaptcha,
};
