import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// D1 is replaced by a double: these tests pin what the counters ask the
// database for and how they behave when it is missing or broken, which is the
// part every abuse control depends on.

const queryFirst = vi.fn();
const exec = vi.fn();
const isD1Configured = vi.fn();

vi.mock('./d1.js', () => ({
  exec: (...args: unknown[]) => exec(...args),
  queryFirst: (...args: unknown[]) => queryFirst(...args),
  isD1Configured: () => isD1Configured(),
}));

const { counterKey, purgeExpiredCounters, recordHit, releaseHit } = await import(
  './security-counters.js'
);

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.clearAllMocks();
  isD1Configured.mockReturnValue(true);
  process.env.SECURITY_COUNTER_SALT = 'test-salt';
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('counterKey', () => {
  it('keeps the namespace readable and the subject opaque', () => {
    const key = counterKey('rl:contact', '203.0.113.7');

    expect(key.startsWith('rl:contact:')).toBe(true);
    expect(key).not.toContain('203.0.113.7');
  });

  it('is stable for the same namespace and subject', () => {
    expect(counterKey('rl:contact', '203.0.113.7')).toBe(
      counterKey('rl:contact', '203.0.113.7'),
    );
  });

  it('gives the same subject unrelated keys under different namespaces', () => {
    expect(counterKey('rl:contact', 'ada@example.ch')).not.toBe(
      counterKey('rl:newsletter', 'ada@example.ch'),
    );
  });

  it('changes with the salt, so a leaked table cannot be replayed elsewhere', () => {
    const withSalt = counterKey('rl:contact', '203.0.113.7');
    process.env.SECURITY_COUNTER_SALT = 'other-salt';

    expect(counterKey('rl:contact', '203.0.113.7')).not.toBe(withSalt);
  });
});

describe('recordHit', () => {
  it('returns the post-write window state', async () => {
    const resetAt = Date.now() + 60_000;
    queryFirst.mockResolvedValue({ hits: 3, reset_at: resetAt });

    await expect(recordHit('k', 60_000)).resolves.toEqual({ hits: 3, resetAt });
  });

  it('counts and reads in a single statement', async () => {
    queryFirst.mockResolvedValue({ hits: 1, reset_at: Date.now() });

    await recordHit('k', 60_000);

    const [sql] = queryFirst.mock.calls[0];
    expect(sql).toMatch(/INSERT INTO security_counters/);
    expect(sql).toMatch(/ON CONFLICT\(key\) DO UPDATE/);
    expect(sql).toMatch(/RETURNING hits, reset_at/);
  });

  it('does not query at all when D1 is not configured', async () => {
    isD1Configured.mockReturnValue(false);

    await expect(recordHit('k', 60_000)).resolves.toBeNull();
    expect(queryFirst).not.toHaveBeenCalled();
  });

  it('degrades to null instead of throwing when the query fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    queryFirst.mockRejectedValue(new Error('D1 down'));

    await expect(recordHit('k', 60_000)).resolves.toBeNull();
  });
});

describe('releaseHit', () => {
  it('decrements without dropping below zero or reviving a closed window', async () => {
    exec.mockResolvedValue({ changes: 1 });

    await releaseHit('k');

    const [sql] = exec.mock.calls[0];
    expect(sql).toMatch(/hits = MAX\(hits - 1, 0\)/);
    expect(sql).toMatch(/reset_at > \?/);
  });

  it('swallows a failure: giving an allowance back is best effort', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    exec.mockRejectedValue(new Error('D1 down'));

    await expect(releaseHit('k')).resolves.toBeUndefined();
  });
});

describe('purgeExpiredCounters', () => {
  it('deletes only windows that have already closed', async () => {
    exec.mockResolvedValue({ changes: 12 });

    await expect(purgeExpiredCounters()).resolves.toBe(12);

    const [sql] = exec.mock.calls[0];
    expect(sql).toMatch(/DELETE FROM security_counters WHERE reset_at <= \?/);
  });

  it('is a no-op when D1 is not configured', async () => {
    isD1Configured.mockReturnValue(false);

    await expect(purgeExpiredCounters()).resolves.toBe(0);
    expect(exec).not.toHaveBeenCalled();
  });
});
