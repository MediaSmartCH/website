import { counterKey, recordHit, releaseHit } from './security-counters.js';

/**
 * Budgets for the e-mails this site sends to addresses a visitor chose.
 *
 * Any form that mails a copy of its content back to the address typed into it
 * is, mechanically, an open relay: an attacker puts a victim's address in the
 * e-mail field and their payload in the message field, and our verified domain
 * delivers it. reCAPTCHA and the IP rate limit raise the cost of that, but
 * neither bounds it — scores can be farmed and IPs rotate.
 *
 * So the recipient is budgeted directly, on two axes:
 *
 *   - **per recipient** — one address can only be mailed a handful of times a
 *     day no matter who asks or from where. This is what makes the site
 *     useless as a way to hammer a single victim.
 *   - **site-wide per day** — a ceiling on visitor-facing mail overall, so a
 *     distributed attempt hits a wall long before it burns the Resend quota or
 *     the sending domain's reputation.
 *
 * Mail to our own fixed addresses is never budgeted here: it cannot be aimed
 * at anyone, and losing it would mean losing a real enquiry.
 */

export interface MailBudgetPolicy {
  /** Counter namespace, e.g. `contact-confirmation`. */
  flow: string;
  perRecipient: { limit: number; windowMs: number };
  siteWide: { limit: number; windowMs: number };
}

export type MailBudgetRefusal = 'recipient' | 'site-wide';

export interface MailBudgetReservation {
  allowed: boolean;
  /** Which ceiling refused the send. Absent when allowed. */
  refusedBy?: MailBudgetRefusal;
  /**
   * True when the shared store answered.
   *
   * False means D1 was unreachable and nothing was counted: the send goes
   * ahead (an outage must not silently swallow a visitor's confirmation) but
   * this one is not covered by the ceiling.
   */
  enforced: boolean;
  /**
   * Hands the reserved allowance back.
   *
   * The reservation is taken before the send because a refusal has to be known
   * before we call Resend; if the send then fails, the visitor should not have
   * paid for a mail they never received.
   */
  release: () => Promise<void>;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Reads a positive integer override, ignoring values that are not one.
 *
 * A typo in the dashboard must not silently turn a ceiling into `NaN`, which
 * compares false against everything and would disable the control.
 */
function readLimit(envVar: string, fallback: number): number {
  const raw = process.env[envVar];
  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    console.warn(`${envVar} is not a positive integer; using ${fallback}`);
    return fallback;
  }

  return parsed;
}

/**
 * Collapses the addresses that reach the same inbox into one budget subject.
 *
 * Sub-addressing (`name+anything@`) and, at the big providers, dots in the
 * local part are ignored during delivery. Counting them separately would hand
 * an attacker an unlimited supply of "distinct" recipients that all land in
 * the same mailbox.
 */
export function canonicalizeRecipient(email: string): string {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf('@');
  if (at <= 0) return normalized;

  const domain = normalized.slice(at + 1);
  let local = normalized.slice(0, at);

  const plus = local.indexOf('+');
  if (plus > 0) {
    local = local.slice(0, plus);
  }

  const dotsAreIgnored =
    domain === 'gmail.com' || domain === 'googlemail.com';
  if (dotsAreIgnored) {
    local = local.replace(/\./g, '');
  }

  return `${local}@${domain}`;
}

/** The ceilings applied to the contact form's confirmation copy. */
export const CONTACT_CONFIRMATION_POLICY: MailBudgetPolicy = {
  flow: 'contact-confirmation',
  perRecipient: {
    limit: readLimit('CONTACT_CONFIRMATION_RECIPIENT_LIMIT', 3),
    windowMs: DAY_MS,
  },
  siteWide: {
    limit: readLimit('CONTACT_CONFIRMATION_DAILY_LIMIT', 150),
    windowMs: DAY_MS,
  },
};

/** The ceilings applied to booking confirmation / cancellation mail. */
export const BOOKING_MAIL_POLICY: MailBudgetPolicy = {
  flow: 'booking-mail',
  perRecipient: {
    limit: readLimit('BOOKING_MAIL_RECIPIENT_LIMIT', 8),
    windowMs: DAY_MS,
  },
  siteWide: {
    limit: readLimit('BOOKING_MAIL_DAILY_LIMIT', 100),
    windowMs: DAY_MS,
  },
};

const noopRelease = async () => {};

/**
 * Claims one unit of budget for mailing `recipient`.
 *
 * Both ceilings are claimed up front. If the site-wide one refuses, the
 * recipient claim is handed straight back so a visitor is not charged for a
 * send that a global limit — nothing to do with them — blocked.
 */
export async function reserveOutboundMail(
  policy: MailBudgetPolicy,
  recipient: string,
): Promise<MailBudgetReservation> {
  const recipientKey = counterKey(
    `mail:${policy.flow}:rcpt`,
    canonicalizeRecipient(recipient),
  );

  const perRecipient = await recordHit(recipientKey, policy.perRecipient.windowMs);

  if (!perRecipient) {
    return { allowed: true, enforced: false, release: noopRelease };
  }

  if (perRecipient.hits > policy.perRecipient.limit) {
    return {
      allowed: false,
      refusedBy: 'recipient',
      enforced: true,
      release: noopRelease,
    };
  }

  // The site-wide counter is one fixed key, so it is hashed with a constant
  // subject rather than a visitor-derived one.
  const siteWideKey = counterKey(`mail:${policy.flow}:global`, 'all');
  const siteWide = await recordHit(siteWideKey, policy.siteWide.windowMs);

  if (!siteWide) {
    return {
      allowed: true,
      enforced: false,
      release: () => releaseHit(recipientKey),
    };
  }

  if (siteWide.hits > policy.siteWide.limit) {
    await releaseHit(recipientKey);
    return {
      allowed: false,
      refusedBy: 'site-wide',
      enforced: true,
      release: noopRelease,
    };
  }

  return {
    allowed: true,
    enforced: true,
    release: async () => {
      await Promise.all([releaseHit(recipientKey), releaseHit(siteWideKey)]);
    },
  };
}
