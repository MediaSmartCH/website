// Minimal hand-rolled validators. We do not pull in zod/yup to keep the
// serverless cold-start lean. All validators are total: every public function
// either returns a clean shape or a structured failure.

export interface ValidationFailure {
  field: string;
  code: 'missing' | 'too_long' | 'invalid';
  message: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ValidationFailure };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CreateBookingPayload {
  name: string;
  email: string;
  message: string | null;
  language: 'fr' | 'en';
  startUtc: Date;
  honeypot?: unknown;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export function validateCreatePayload(
  raw: Record<string, unknown>,
): ValidationResult<CreateBookingPayload> {
  const nameRaw = asString(raw.name)?.trim() ?? '';
  if (!nameRaw) {
    return { ok: false, error: { field: 'name', code: 'missing', message: 'Name is required' } };
  }
  if (nameRaw.length > 120) {
    return { ok: false, error: { field: 'name', code: 'too_long', message: 'Name is too long' } };
  }

  const emailRaw = asString(raw.email)?.trim().toLowerCase() ?? '';
  if (!emailRaw) {
    return { ok: false, error: { field: 'email', code: 'missing', message: 'Email is required' } };
  }
  if (emailRaw.length > 254 || !EMAIL_REGEX.test(emailRaw)) {
    return { ok: false, error: { field: 'email', code: 'invalid', message: 'Email is invalid' } };
  }

  const messageRaw = asString(raw.message);
  const message = messageRaw?.trim() ?? null;
  if (message && message.length > 2000) {
    return { ok: false, error: { field: 'message', code: 'too_long', message: 'Message is too long' } };
  }

  const languageRaw = asString(raw.language)?.toLowerCase() ?? '';
  if (languageRaw !== 'fr' && languageRaw !== 'en') {
    return { ok: false, error: { field: 'language', code: 'invalid', message: 'Language must be fr or en' } };
  }

  const startRaw = asString(raw.startUtc) ?? '';
  if (!startRaw) {
    return { ok: false, error: { field: 'startUtc', code: 'missing', message: 'Slot is required' } };
  }
  const startUtc = new Date(startRaw);
  if (Number.isNaN(startUtc.getTime())) {
    return { ok: false, error: { field: 'startUtc', code: 'invalid', message: 'Slot is invalid' } };
  }

  return {
    ok: true,
    value: {
      name: nameRaw,
      email: emailRaw,
      message,
      language: languageRaw,
      startUtc,
      honeypot: raw.website,
    },
  };
}

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export interface AvailabilityQuery {
  from: Date;
  to: Date;
}

// Accepts either `?from=YYYY-MM-DD&to=YYYY-MM-DD` or `?from=<isoDate>&to=<isoDate>`.
// Anchor short dates at the start of the BOOKING_TIMEZONE day to keep callers
// from having to reason about the tz themselves.
export function parseAvailabilityRange(
  fromInput: string | null,
  toInput: string | null,
): ValidationResult<AvailabilityQuery> {
  if (!fromInput || !toInput) {
    return { ok: false, error: { field: 'from', code: 'missing', message: 'from + to required' } };
  }

  const expandIfDate = (raw: string): string => {
    if (ISO_DATE_REGEX.test(raw)) return `${raw}T00:00:00.000Z`;
    return raw;
  };

  const from = new Date(expandIfDate(fromInput));
  const to = new Date(expandIfDate(toInput));

  if (Number.isNaN(from.getTime())) {
    return { ok: false, error: { field: 'from', code: 'invalid', message: 'from is invalid' } };
  }
  if (Number.isNaN(to.getTime())) {
    return { ok: false, error: { field: 'to', code: 'invalid', message: 'to is invalid' } };
  }
  if (from >= to) {
    return { ok: false, error: { field: 'from', code: 'invalid', message: 'from must precede to' } };
  }

  return { ok: true, value: { from, to } };
}
