/**
 * Date and time rendering for the booking screens.
 *
 * Everything is formatted in BOOKING_TIMEZONE rather than the visitor's local
 * zone: a slot is an appointment in Switzerland, and showing it shifted for a
 * traveller would be worse than showing it fixed.
 */

/** Must match BOOKING_TIMEZONE in api/booking/_lib/config.ts. */
export const BOOKING_TIMEZONE = 'Europe/Zurich';

/** How far ahead the reschedule calendar may look, in days. */
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
