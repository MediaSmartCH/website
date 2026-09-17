/**
 * Time left before a product opens to the public.
 *
 * Kept free of React and of `Date.now()` so the arithmetic — including the
 * "already launched" edge — is directly testable: the caller passes `now`.
 */

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target date is reached, so the UI can swap the label. */
  launched: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ZERO: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  launched: true,
};

/**
 * Splits the remaining time into whole days, hours, minutes and seconds.
 *
 * An invalid or past date returns a zeroed, launched countdown rather than a
 * negative one, so a forgotten date degrades to "available" instead of showing
 * a timer running backwards.
 */
export function getCountdownParts(launchDate: string, now: Date): CountdownParts {
  const target = new Date(launchDate).getTime();

  if (Number.isNaN(target)) {
    return ZERO;
  }

  const remaining = target - now.getTime();

  if (remaining <= 0) {
    return ZERO;
  }

  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
    launched: false,
  };
}
