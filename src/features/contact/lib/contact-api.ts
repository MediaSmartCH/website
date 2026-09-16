/**
 * Transport for the contact form.
 *
 * Owns the request shape, the abort timeout and the mapping from HTTP outcome
 * to a result the UI can render. It does not touch React state and does not
 * decide what to display — callers pick the message for each outcome.
 */

import { fetchWithDeployment } from "@shared/lib/fetch-with-deployment";
import { logger } from "@shared/lib/logger";

/** Aborts a submission that has not answered in time, so the button unsticks. */
const REQUEST_TIMEOUT_MS = 10_000;

/** Server messages that mean the reCAPTCHA check, not the payload, was refused. */
const SECURITY_FAILURE_MESSAGES = [
  "Security verification failed",
  "Security token missing",
];

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  phone: string;
  lang: "fr" | "en";
  intent: "question" | "quote";
  projectType: string;
  recaptchaToken: string;
  /** Honeypot field: bots fill it, humans never see it. */
  website: string;
}

export type ContactSubmitResult =
  | { status: "sent" }
  | { status: "security-rejected" }
  | { status: "failed" };

/**
 * Posts the form to /api/send.
 *
 * Never throws: a network error, an abort and a 5xx all collapse to "failed",
 * because the form shows the same message for all three.
 */
export async function submitContactForm(
  submission: ContactSubmission
): Promise<ContactSubmitResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetchWithDeployment("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (response.ok) return { status: "sent" };

    return SECURITY_FAILURE_MESSAGES.includes(payload?.message)
      ? { status: "security-rejected" }
      : { status: "failed" };
  } catch (error) {
    logger.error("Send error:", error);
    return { status: "failed" };
  } finally {
    window.clearTimeout(timeout);
  }
}

/**
 * The language the confirmation e-mail should use.
 *
 * Read from the URL rather than the Redux store: the store can still hold the
 * previous locale for a frame after a language switch, and the e-mail template
 * is rendered server-side from whatever we send.
 */
export function getSubmissionLanguage(): "fr" | "en" {
  return window.location.pathname.startsWith("/en") ? "en" : "fr";
}
