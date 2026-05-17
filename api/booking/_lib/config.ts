// Single source of truth for booking-system constants and env-derived config.
// Read once at import time; throw early in production so a misconfigured deploy
// fails fast at the boundary instead of producing silently broken availability.

export const BOOKING_TIMEZONE = 'Europe/Zurich';

// Working hours expressed in BOOKING_TIMEZONE (local clock time, 24h format).
export const BUSINESS_HOURS = {
  startHour: 9,
  endHour: 18,
} as const;

// Sunday=0 … Saturday=6. Days NOT in this set are unavailable.
export const BUSINESS_DAYS = new Set<number>([1, 2, 3, 4, 5]);

export const MEETING_DURATION_MIN = 30;

// Slot lookups round to a fixed grid so visitors see clean times.
export const SLOT_GRANULARITY_MIN = 30;

// Earliest a visitor can book from "now", in milliseconds.
export const MIN_NOTICE_MS = 24 * 60 * 60 * 1000;

// How far out the calendar opens, in days from today.
export const MAX_HORIZON_DAYS = 28;

// Where booking notifications land. The visitor's confirmation is sent FROM
// this address too (must be a Resend verified sender).
export const NOTIFICATION_EMAIL = 'booking@mediasmart.ch';

// "From" header on outgoing mail. Friendly name + verified sender.
export const MAIL_FROM = 'MediaSmart <booking@mediasmart.ch>';

interface RuntimeEnv {
  googleClientId: string;
  googleClientSecret: string;
  googleRefreshToken: string;
  googleCalendarId: string;
  cfAccountId: string;
  cfApiToken: string;
  d1DatabaseId: string;
  resendApiKey: string;
  bookingSecret: string;
  siteOrigin: string;
}

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required env var: ${name}`);
}

let cachedEnv: RuntimeEnv | null = null;

export function getRuntimeEnv(): RuntimeEnv {
  if (cachedEnv) return cachedEnv;
  cachedEnv = {
    googleClientId: readEnv('GOOGLE_OAUTH_CLIENT_ID'),
    googleClientSecret: readEnv('GOOGLE_OAUTH_CLIENT_SECRET'),
    googleRefreshToken: readEnv('GOOGLE_OAUTH_REFRESH_TOKEN'),
    googleCalendarId: readEnv('GOOGLE_CALENDAR_ID', 'primary'),
    cfAccountId: readEnv('CLOUDFLARE_ACCOUNT_ID'),
    cfApiToken: readEnv('CLOUDFLARE_API_TOKEN'),
    d1DatabaseId: readEnv('CLOUDFLARE_D1_DATABASE_ID'),
    resendApiKey: readEnv('RESEND_API_KEY'),
    bookingSecret: readEnv('BOOKING_HMAC_SECRET'),
    siteOrigin: readEnv('SITE_ORIGIN', 'https://mediasmart.ch'),
  };
  return cachedEnv;
}
