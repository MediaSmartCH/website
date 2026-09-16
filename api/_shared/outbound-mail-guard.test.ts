import { beforeEach, describe, expect, it, vi } from 'vitest';

// The counters themselves are exercised against D1 in production; here they
// are a controllable double so the tests pin the budget policy — which ceiling
// refuses, what is handed back, and what happens when the store is down.

const recordHit = vi.fn();
const releaseHit = vi.fn();

vi.mock('./security-counters.js', () => ({
  counterKey: (namespace: string, subject: string) => `${namespace}|${subject}`,
  recordHit: (...args: unknown[]) => recordHit(...args),
  releaseHit: (...args: unknown[]) => releaseHit(...args),
}));

const { canonicalizeRecipient, reserveOutboundMail } = await import(
  './outbound-mail-guard.js'
);

const POLICY = {
  flow: 'test-flow',
  perRecipient: { limit: 2, windowMs: 60_000 },
  siteWide: { limit: 5, windowMs: 60_000 },
};

/** Counter state for a window that has `hits` recorded. */
const state = (hits: number) => ({ hits, resetAt: Date.now() + 60_000 });

beforeEach(() => {
  vi.clearAllMocks();
  releaseHit.mockResolvedValue(undefined);
});

describe('canonicalizeRecipient', () => {
  it('lowercases and trims', () => {
    expect(canonicalizeRecipient('  Ada@Example.CH ')).toBe('ada@example.ch');
  });

  it('collapses sub-addressed variants onto the same subject', () => {
    expect(canonicalizeRecipient('ada+one@example.ch')).toBe('ada@example.ch');
    expect(canonicalizeRecipient('ada+two@example.ch')).toBe('ada@example.ch');
  });

  it('ignores dots only where the provider does', () => {
    expect(canonicalizeRecipient('a.d.a@gmail.com')).toBe('ada@gmail.com');
    expect(canonicalizeRecipient('a.d.a@example.ch')).toBe('a.d.a@example.ch');
  });

  it('leaves a value that is not an address alone', () => {
    expect(canonicalizeRecipient('not-an-address')).toBe('not-an-address');
  });
});

describe('reserveOutboundMail', () => {
  it('allows a send within both ceilings', async () => {
    recordHit.mockResolvedValueOnce(state(1)).mockResolvedValueOnce(state(1));

    const reservation = await reserveOutboundMail(POLICY, 'ada@example.ch');

    expect(reservation).toMatchObject({ allowed: true, enforced: true });
    expect(releaseHit).not.toHaveBeenCalled();
  });

  it('refuses once the recipient ceiling is passed, without touching the site budget', async () => {
    recordHit.mockResolvedValueOnce(state(3));

    const reservation = await reserveOutboundMail(POLICY, 'ada@example.ch');

    expect(reservation).toMatchObject({
      allowed: false,
      refusedBy: 'recipient',
      enforced: true,
    });
    expect(recordHit).toHaveBeenCalledTimes(1);
  });

  it('counts sub-addressed variants against the same recipient key', async () => {
    recordHit.mockResolvedValue(state(1));

    await reserveOutboundMail(POLICY, 'ada+one@example.ch');
    await reserveOutboundMail(POLICY, 'ada+two@example.ch');

    const [firstKey] = recordHit.mock.calls[0];
    const [thirdKey] = recordHit.mock.calls[2];
    expect(firstKey).toBe(thirdKey);
  });

  it('refuses on the site-wide ceiling and gives the recipient claim back', async () => {
    recordHit.mockResolvedValueOnce(state(1)).mockResolvedValueOnce(state(6));

    const reservation = await reserveOutboundMail(POLICY, 'ada@example.ch');

    expect(reservation).toMatchObject({
      allowed: false,
      refusedBy: 'site-wide',
      enforced: true,
    });
    expect(releaseHit).toHaveBeenCalledWith('mail:test-flow:rcpt|ada@example.ch');
  });

  it('lets the mail through unenforced when the store is unavailable', async () => {
    recordHit.mockResolvedValueOnce(null);

    const reservation = await reserveOutboundMail(POLICY, 'ada@example.ch');

    expect(reservation).toMatchObject({ allowed: true, enforced: false });
  });

  it('releases both claims when the caller reports the send never happened', async () => {
    recordHit.mockResolvedValueOnce(state(1)).mockResolvedValueOnce(state(1));

    const reservation = await reserveOutboundMail(POLICY, 'ada@example.ch');
    await reservation.release();

    expect(releaseHit).toHaveBeenCalledWith('mail:test-flow:rcpt|ada@example.ch');
    expect(releaseHit).toHaveBeenCalledWith('mail:test-flow:global|all');
  });

  it('releases nothing after a refusal', async () => {
    recordHit.mockResolvedValueOnce(state(9));

    const reservation = await reserveOutboundMail(POLICY, 'ada@example.ch');
    await reservation.release();

    expect(releaseHit).not.toHaveBeenCalled();
  });
});
