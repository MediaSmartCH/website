/**
 * Probes the three services the booking flow cannot work without.
 *
 * It exists because those services fail silently: when the Google refresh token
 * expires, nothing breaks at deploy time and no log is read — visitors simply
 * get "Une erreur s'est produite" and nobody is told. Each probe performs the
 * same call the booking flow performs, so a pass means the flow genuinely works
 * rather than that the configuration merely looks present.
 *
 * Reporting the result, alerting and authorising the caller are the handler's
 * job. This module only decides what "healthy" means.
 */

import { getRuntimeEnv } from './config.js';
import { queryFirst } from './d1.js';
import { getBusyIntervals } from './google-calendar.js';

export type HealthCheckName = 'google-calendar' | 'database' | 'mailer';

export interface HealthCheck {
  name: HealthCheckName;
  ok: boolean;
  /** Why it failed. Absent when the probe passed. */
  detail?: string;
}

export interface HealthReport {
  ok: boolean;
  checkedAt: string;
  checks: HealthCheck[];
}

/** Narrow window: the probe proves the call works, it does not need real data. */
const PROBE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Deadline per probe.
 *
 * The underlying fetches have none of their own, and the report waits for every
 * probe, so one hanging dependency would keep the endpoint from ever answering
 * 503 or sending its alert — the exact silence this module exists to break.
 */
const PROBE_TIMEOUT_MS = 8_000;

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Rejects if `work` has not settled within PROBE_TIMEOUT_MS. */
function withDeadline<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const deadline = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new Error(`timed out after ${PROBE_TIMEOUT_MS}ms`)),
      PROBE_TIMEOUT_MS,
    );
  });

  return Promise.race([work, deadline]).finally(() => clearTimeout(timer)) as Promise<T>;
}

async function probe(
  name: HealthCheckName,
  run: () => Promise<unknown> | unknown,
): Promise<HealthCheck> {
  try {
    await withDeadline(Promise.resolve(run()));
    return { name, ok: true };
  } catch (error) {
    return { name, ok: false, detail: describeError(error) };
  }
}

/** Exercises the OAuth refresh and the freeBusy query in one call. */
async function checkGoogleCalendar(): Promise<void> {
  const from = new Date();
  await getBusyIntervals(from, new Date(from.getTime() + PROBE_WINDOW_MS));
}

async function checkDatabase(): Promise<void> {
  await queryFirst('SELECT 1 AS ok');
}

/**
 * Checks the key is configured, without sending anything.
 *
 * A daily test e-mail would prove more and cost a daily e-mail; a missing or
 * blank key is the failure actually seen in practice.
 */
function checkMailer(): void {
  if (!getRuntimeEnv().resendApiKey) {
    throw new Error('RESEND_API_KEY is empty');
  }
}

/** Runs every probe, in parallel, and never throws. */
export async function runHealthChecks(): Promise<HealthReport> {
  const checks = await Promise.all([
    probe('google-calendar', checkGoogleCalendar),
    probe('database', checkDatabase),
    probe('mailer', checkMailer),
  ]);

  return {
    ok: checks.every((check) => check.ok),
    checkedAt: new Date().toISOString(),
    checks,
  };
}
