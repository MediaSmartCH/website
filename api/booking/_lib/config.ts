// Single source of truth for booking-system constants and env-derived config.
// Env vars are resolved lazily per key so an endpoint that only needs Google
// Calendar doesn't crash when an unrelated secret (e.g. the D1 token) is
// missing locally.

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

interface EnvSpec {
  envVar: string;
  fallback?: string;
}

const ENV_KEYS = {
  googleClientId: { envVar: 'GOOGLE_OAUTH_CLIENT_ID' },
  googleClientSecret: { envVar: 'GOOGLE_OAUTH_CLIENT_SECRET' },
  googleRefreshToken: { envVar: 'GOOGLE_OAUTH_REFRESH_TOKEN' },
  googleCalendarId: { envVar: 'GOOGLE_CALENDAR_ID', fallback: 'primary' },
  // Comma-separated list of calendar IDs to query for conflicts. Falls back to
  // googleCalendarId when unset so single-calendar setups keep working.
  googleFreeBusyCalendarIds: {
    envVar: 'GOOGLE_FREEBUSY_CALENDAR_IDS',
    fallback: '',
  },
  cfAccountId: { envVar: 'CLOUDFLARE_ACCOUNT_ID' },
  cfApiToken: { envVar: 'CLOUDFLARE_API_TOKEN' },
  d1DatabaseId: { envVar: 'CLOUDFLARE_D1_DATABASE_ID' },
  resendApiKey: { envVar: 'RESEND_API_KEY' },
  bookingSecret: { envVar: 'BOOKING_HMAC_SECRET' },
  siteOrigin: { envVar: 'SITE_ORIGIN', fallback: 'https://mediasmart.ch' },
} as const satisfies Record<string, EnvSpec>;

type EnvKey = keyof typeof ENV_KEYS;

function readEnv(spec: EnvSpec): string {
  const value = process.env[spec.envVar];
  if (value && value.length > 0) return value;
  if (spec.fallback !== undefined) return spec.fallback;
  throw new Error(`Missing required env var: ${spec.envVar}`);
}

// Backwards-compatible accessor: callers expecting the bundled-shape object
// can still ask for all env vars in one go. Resolving lazily on access means
// only the keys actually consumed for a given request need to be populated.
type RuntimeEnv = Record<EnvKey, string>;

let cachedProxy: RuntimeEnv | null = null;

export function getRuntimeEnv(): RuntimeEnv {
  if (cachedProxy) return cachedProxy;
  const memo: Partial<RuntimeEnv> = {};
  cachedProxy = new Proxy({} as RuntimeEnv, {
    get(_target, prop: string) {
      if (!(prop in ENV_KEYS)) return undefined;
      const key = prop as EnvKey;
      if (memo[key] === undefined) {
        memo[key] = readEnv(ENV_KEYS[key]);
      }
      return memo[key];
    },
  });
  return cachedProxy;
}
