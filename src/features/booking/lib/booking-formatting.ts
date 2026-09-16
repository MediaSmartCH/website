/**
 * Date and time rendering for the booking screens.
 *
 * Everything is formatted in BOOKING_TIMEZONE rather than the visitor's local
 * zone: a slot is an appointment in Switzerland, and showing it shifted for a
 * traveller would be worse than showing it fixed.
 */

/** Must match BOOKING_TIMEZONE in api/booking/_lib/config.ts. */
export const BOOKING_TIMEZONE = 'Europe/Zurich';

/**
 * How far ahead the calendars may look, in days.
 *
 * Matches MAX_HORIZON_DAYS in api/booking/_lib/config.ts so the client never
 * offers a slot the server would refuse.
 */
export const HORIZON_DAYS = 28;

export function formatHumanDate(date: Date, language: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CH' : 'en-GB', {
    timeZone: BOOKING_TIMEZONE,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTimeOnly(date: Date, language: 'fr' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CH' : 'en-GB', {
    timeZone: BOOKING_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Calendar day key ("2027-02-15") for a slot, in BOOKING_TIMEZONE. */
export function dateKeyInBookingTz(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Day heading for a calendar key, without the year. */
export function formatDayHuman(dateKey: string, language: 'fr' | 'en'): string {
  // Midday keeps the key from landing on the previous day in a negative offset.
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CH' : 'en-GB', {
    timeZone: BOOKING_TIMEZONE,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${dateKey}T12:00:00Z`));
}
