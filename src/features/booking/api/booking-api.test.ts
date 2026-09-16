/**
 * Covers the deadline around the availability lookup.
 *
 * The distinction the modal depends on is the point of these tests: a caller
 * abort has to stay an `AbortError` (it means "the visitor closed the modal",
 * and is swallowed silently), while our own timeout has to surface as a real
 * failure so the error message is shown instead of an empty calendar.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchWithDeployment = vi.hoisted(() => vi.fn());

vi.mock("@shared/lib/fetch-with-deployment", () => ({ fetchWithDeployment }));

const { fetchAvailability } = await import("./booking-api");

const FROM = new Date("2026-01-01T00:00:00.000Z");
const TO = new Date("2026-01-31T00:00:00.000Z");

/** Never answers on its own, and rejects on abort exactly as fetch does. */
function pendingUntilAborted(init?: { signal?: AbortSignal }): Promise<never> {
  const abortError = () => Object.assign(new Error("aborted"), { name: "AbortError" });

  return new Promise((_resolve, reject) => {
    // An already-spent signal never emits "abort", so check it first — real
    // fetch rejects synchronously in that case.
    if (init?.signal?.aborted) {
      reject(abortError());
      return;
    }
    init?.signal?.addEventListener("abort", () => reject(abortError()));
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  fetchWithDeployment.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("fetchAvailability", () => {
  it("returns the parsed payload when the request answers in time", async () => {
    const payload = { success: true, slots: [], generatedAt: "2026-01-01" };
    fetchWithDeployment.mockResolvedValue({
      ok: true,
      json: async () => payload,
    });

    await expect(fetchAvailability(FROM, TO)).resolves.toEqual(payload);
  });

  it("sends the range as plain ISO dates", async () => {
    fetchWithDeployment.mockResolvedValue({ ok: true, json: async () => ({}) });

    await fetchAvailability(FROM, TO);

    expect(fetchWithDeployment).toHaveBeenCalledWith(
      "/api/booking/availability?from=2026-01-01&to=2026-01-31",
      expect.objectContaining({ signal: expect.anything() })
    );
  });

  it("rejects with the status code when the endpoint refuses", async () => {
    fetchWithDeployment.mockResolvedValue({ ok: false, status: 502 });

    await expect(fetchAvailability(FROM, TO)).rejects.toThrow("availability_502");
  });

  it("gives up after the deadline rather than waiting indefinitely", async () => {
    fetchWithDeployment.mockImplementation((_url, init) => pendingUntilAborted(init));

    const pending = fetchAvailability(FROM, TO);
    const assertion = expect(pending).rejects.toThrow("availability_timeout");

    await vi.advanceTimersByTimeAsync(10_000);
    await assertion;
  });

  it("keeps waiting while the deadline has not passed", async () => {
    fetchWithDeployment.mockImplementation((_url, init) => pendingUntilAborted(init));

    const pending = fetchAvailability(FROM, TO);
    const settled = vi.fn();
    void pending.then(settled, settled);

    await vi.advanceTimersByTimeAsync(9_000);

    expect(settled).not.toHaveBeenCalled();

    // Let the pending rejection be observed so the test does not leak it.
    await vi.advanceTimersByTimeAsync(2_000);
    await expect(pending).rejects.toThrow("availability_timeout");
  });

  it("surfaces a caller abort as an AbortError, not as a timeout", async () => {
    fetchWithDeployment.mockImplementation((_url, init) => pendingUntilAborted(init));

    const controller = new AbortController();
    const pending = fetchAvailability(FROM, TO, controller.signal);
    const assertion = expect(pending).rejects.toMatchObject({ name: "AbortError" });

    controller.abort();
    await assertion;
  });

  it("aborts straight away when the caller's signal is already spent", async () => {
    fetchWithDeployment.mockImplementation((_url, init) => pendingUntilAborted(init));

    const controller = new AbortController();
    controller.abort();

    await expect(
      fetchAvailability(FROM, TO, controller.signal)
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
