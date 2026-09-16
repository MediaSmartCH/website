import { beforeEach, describe, expect, it, vi } from 'vitest';

// `enforceRateLimit` is the check the endpoints actually run. What matters here
// is the combination: the per-instance bucket and the shared counters both get
// a say, the stricter one wins, and an unreachable store degrades rather than
// closes the door.

const recordHit = vi.fn();

vi.mock('./security-counters.js', () => ({
  counterKey: (namespace: string, subject: string) => `${namespace}|${subject}`,
  recordHit: (...args: unknown[]) => recordHit(...args),
  releaseHit: vi.fn(),
}));

const { enforceRateLimit } = await import('./rate-limit.js');

let namespaceCounter = 0;
const freshNamespace = () => `durable-test-${namespaceCounter++}`;

const state = (hits: number) => ({ hits, resetAt: Date.now() + 60_000 });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('enforceRateLimit', () => {
  it('consults the shared store and reports a durable verdict', async () => {
    recordHit.mockResolvedValue(state(1));

    const result = await enforceRateLimit({
      namespace: freshNamespace(),
      identifier: '203.0.113.1',
      limit: 5,
      windowMs: 60_000,
    });

    expect(result).toMatchObject({ ok: true, durable: true, hits: 1 });
    expect(recordHit).toHaveBeenCalledTimes(1);
  });

  it('refuses on the shared count even when this instance has seen one request', async () => {
    // What a flood spread across parallel instances looks like: locally the
    // first request, globally well past the limit.
    recordHit.mockResolvedValue(state(42));

    const result = await enforceRateLimit({
      namespace: freshNamespace(),
      identifier: '203.0.113.2',
      limit: 5,
      windowMs: 60_000,
    });

    expect(result).toMatchObject({ ok: false, durable: true, remaining: 0 });
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('refuses locally without spending a round-trip on the shared store', async () => {
    const namespace = freshNamespace();
    recordHit.mockResolvedValue(state(1));

    for (let i = 0; i < 2; i += 1) {
      await enforceRateLimit({
        namespace,
        identifier: '203.0.113.3',
        limit: 2,
        windowMs: 60_000,
      });
    }
    recordHit.mockClear();

    const blocked = await enforceRateLimit({
      namespace,
      identifier: '203.0.113.3',
      limit: 2,
      windowMs: 60_000,
    });

    expect(blocked).toMatchObject({ ok: false, durable: false });
    expect(recordHit).not.toHaveBeenCalled();
  });

  it('keeps the local verdict when the shared store is unavailable', async () => {
    recordHit.mockResolvedValue(null);

    const result = await enforceRateLimit({
      namespace: freshNamespace(),
      identifier: '203.0.113.4',
      limit: 5,
      windowMs: 60_000,
    });

    expect(result).toMatchObject({ ok: true, durable: false });
  });

  it('stays local until durableAfter is passed, then escalates', async () => {
    const namespace = freshNamespace();
    recordHit.mockResolvedValue(state(3));
    const call = () =>
      enforceRateLimit({
        namespace,
        identifier: '203.0.113.5',
        limit: 10,
        windowMs: 60_000,
        durableAfter: 2,
      });

    expect(await call()).toMatchObject({ durable: false });
    expect(await call()).toMatchObject({ durable: false });
    expect(recordHit).not.toHaveBeenCalled();

    expect(await call()).toMatchObject({ durable: true });
    expect(recordHit).toHaveBeenCalledTimes(1);
  });
});
