import { describe, it, expect, beforeEach, vi } from 'vitest';

import { createRequest, createResponse, uniqueClientHeaders } from './http-fixtures.js';

// Characterisation tests for GET /api/booking/availability. The slot algorithm
// itself is covered by _lib/slots.test.ts; what is pinned here is the handler
// contract: method, caching, rate limit, query parsing and calendar failures.

const getBusyIntervals = vi.fn();
const buildAvailableSlots = vi.fn();

vi.mock('../booking/_lib/google-calendar.js', () => ({
  getBusyIntervals: (...args: unknown[]) => getBusyIntervals(...args),
}));

vi.mock('../booking/_lib/slots.js', async () => {
  const actual = await vi.importActual<any>('../booking/_lib/slots.js');
  return { ...actual, buildAvailableSlots: (...args: unknown[]) => buildAvailableSlots(...args) };
});

const { default: handler } = await import('../booking/availability.js');

const SLOTS = [{ startUtc: '2027-02-15T08:00:00.000Z', endUtc: '2027-02-15T08:30:00.000Z' }];

function getAvailability(query: Record<string, string | string[]> = {}) {
  return createRequest({
    method: 'GET',
    headers: uniqueClientHeaders(),
    query: { from: '2027-02-15', to: '2027-02-16', ...query },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getBusyIntervals.mockResolvedValue([]);
  buildAvailableSlots.mockReturnValue(SLOTS);
});

describe('booking/availability — method and caching', () => {
  it('advertises GET-only and never caches', async () => {
    const res = createResponse();
    await handler(getAvailability(), res.res);

    expect(res.header('Allow')).toBe('GET');
    expect(res.header('Cache-Control')).toBe('no-store');
  });

  it('rejects a non-GET method with 405', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'POST', headers: uniqueClientHeaders() }), res.res);

    expect(res.statusCode()).toBe(405);
    expect(getBusyIntervals).not.toHaveBeenCalled();
  });
});

describe('booking/availability — query handling', () => {
  it('returns the computed slots with a generation timestamp', async () => {
    const res = createResponse();
    await handler(getAvailability(), res.res);

    expect(res.statusCode()).toBe(200);
    const body = res.body() as any;
    expect(body.success).toBe(true);
    expect(body.slots).toEqual(SLOTS);
    expect(Date.parse(body.generatedAt)).not.toBeNaN();
  });

  it('takes the first value when a query parameter is repeated', async () => {
    await handler(
      getAvailability({ from: ['2027-02-15', '2027-03-01'] }),
      createResponse().res,
    );

    const range = getBusyIntervals.mock.calls[0];
    expect((range[0] as Date).toISOString()).toBe('2027-02-15T00:00:00.000Z');
  });

  it('returns the structured error when the range is missing', async () => {
    const res = createResponse();
    await handler(
      createRequest({ method: 'GET', headers: uniqueClientHeaders(), query: {} }),
      res.res,
    );

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toMatchObject({ success: false, error: { field: 'from' } });
    expect(getBusyIntervals).not.toHaveBeenCalled();
  });

  it('returns the structured error when the range is inverted', async () => {
    const res = createResponse();
    await handler(getAvailability({ from: '2027-02-16', to: '2027-02-15' }), res.res);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toMatchObject({ success: false, error: { code: 'invalid' } });
  });
});

describe('booking/availability — failures and limits', () => {
  it('answers 502 when the calendar lookup fails', async () => {
    getBusyIntervals.mockRejectedValue(new Error('google down'));

    const res = createResponse();
    await handler(getAvailability(), res.res);

    expect(res.statusCode()).toBe(502);
    expect(res.body()).toEqual({ success: false, message: 'Calendar unavailable' });
  });

  it('advertises a 60-per-5-minutes budget and blocks past it', async () => {
    const headers = uniqueClientHeaders();
    const request = () =>
      createRequest({ method: 'GET', headers, query: { from: '2027-02-15', to: '2027-02-16' } });

    const first = createResponse();
    await handler(request(), first.res);
    expect(first.header('RateLimit-Policy')).toBe('60;w=300');

    for (let attempt = 1; attempt < 60; attempt += 1) {
      await handler(request(), createResponse().res);
    }

    const blocked = createResponse();
    await handler(request(), blocked.res);
    expect(blocked.statusCode()).toBe(429);
  });
});
