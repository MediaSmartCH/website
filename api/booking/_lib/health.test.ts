/**
 * Pins what "healthy" means, independently of how the result is reported.
 *
 * The probes are wired to the real collaborators, so these tests stand in for
 * the failures we cannot reproduce on demand: an expired refresh token, an
 * unreachable database, a blank mail key.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const getBusyIntervals = vi.fn();
const queryFirst = vi.fn();
const runtimeEnv: Record<string, string> = { resendApiKey: 're_test' };

vi.mock('./google-calendar.js', () => ({
  getBusyIntervals: (...args: unknown[]) => getBusyIntervals(...args),
}));

vi.mock('./d1.js', () => ({
  queryFirst: (...args: unknown[]) => queryFirst(...args),
}));

vi.mock('./config.js', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('./config.js');
  return { ...actual, getRuntimeEnv: () => runtimeEnv };
});

const { runHealthChecks } = await import('./health.js');

type Report = Awaited<ReturnType<typeof runHealthChecks>>;

function checkNamed(report: Report, name: string) {
  return report.checks.find((check) => check.name === name);
}

beforeEach(() => {
  vi.clearAllMocks();
  getBusyIntervals.mockResolvedValue([]);
  queryFirst.mockResolvedValue({ ok: 1 });
  runtimeEnv.resendApiKey = 're_test';
});

describe('runHealthChecks, all dependencies up', () => {
  it("reports every probe as passing", async () => {
    const report = await runHealthChecks();

    expect(report.ok).toBe(true);
    expect(report.checks).toHaveLength(3);
    expect(report.checks.every((check) => check.ok)).toBe(true);
  });

  it("carries no failure detail when nothing failed", async () => {
    const report = await runHealthChecks();

    expect(report.checks.every((check) => check.detail === undefined)).toBe(true);
  });

  it("timestamps the run", async () => {
    const report = await runHealthChecks();

    expect(Number.isNaN(Date.parse(report.checkedAt))).toBe(false);
  });

  it("asks the calendar for a window starting now", async () => {
    await runHealthChecks();

    const [from, to] = getBusyIntervals.mock.calls[0];
    expect(to.getTime() - from.getTime()).toBe(24 * 60 * 60 * 1000);
  });
});

describe("runHealthChecks, a dependency down", () => {
  it("fails the report and names the expired Google grant", async () => {
    getBusyIntervals.mockRejectedValue(
      new Error('Google OAuth refresh failed (400): {"error": "invalid_grant"}')
    );

    const report = await runHealthChecks();

    expect(report.ok).toBe(false);
    expect(checkNamed(report, 'google-calendar')).toMatchObject({
      ok: false,
      detail: expect.stringContaining('invalid_grant'),
    });
  });

  it("keeps probing the others when one fails", async () => {
    getBusyIntervals.mockRejectedValue(new Error('down'));

    const report = await runHealthChecks();

    expect(checkNamed(report, 'database')?.ok).toBe(true);
    expect(checkNamed(report, 'mailer')?.ok).toBe(true);
    expect(queryFirst).toHaveBeenCalled();
  });

  it("reports an unreachable database", async () => {
    queryFirst.mockRejectedValue(new Error('D1 request failed (401)'));

    const report = await runHealthChecks();

    expect(report.ok).toBe(false);
    expect(checkNamed(report, 'database')).toMatchObject({ ok: false, detail: 'D1 request failed (401)' });
  });

  it("reports a blank mail key without sending anything", async () => {
    runtimeEnv.resendApiKey = '';

    const report = await runHealthChecks();

    expect(report.ok).toBe(false);
    expect(checkNamed(report, 'mailer')?.detail).toBe('RESEND_API_KEY is empty');
  });

  it("survives a collaborator that throws a non-Error", async () => {
    getBusyIntervals.mockRejectedValue('boom');

    const report = await runHealthChecks();

    expect(checkNamed(report, 'google-calendar')).toMatchObject({ ok: false, detail: 'boom' });
  });

  it("fails the report when everything is down at once", async () => {
    getBusyIntervals.mockRejectedValue(new Error('a'));
    queryFirst.mockRejectedValue(new Error('b'));
    runtimeEnv.resendApiKey = '';

    const report = await runHealthChecks();

    expect(report.ok).toBe(false);
    expect(report.checks.filter((check) => !check.ok)).toHaveLength(3);
  });
});

describe("runHealthChecks, a dependency that hangs", () => {
  it("gives up on a probe that never settles", async () => {
    vi.useFakeTimers();
    getBusyIntervals.mockImplementation(() => new Promise(() => {}));

    const pending = runHealthChecks();
    await vi.advanceTimersByTimeAsync(8_000);
    const report = await pending;

    expect(report.ok).toBe(false);
    expect(checkNamed(report, "google-calendar")).toMatchObject({
      ok: false,
      detail: expect.stringContaining("timed out"),
    });
    vi.useRealTimers();
  });
});
