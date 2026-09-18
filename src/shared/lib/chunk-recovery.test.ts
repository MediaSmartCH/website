import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { withChunkRecovery } from "./chunk-recovery";

// The property that matters most here is the one that cannot be observed from
// a happy-path test: this must never reload more than once. A loop would turn
// one broken chunk into a page that flickers forever.

let reloads: number;
let originalLocation: Location;
let originalSessionStorage: PropertyDescriptor | undefined;

/** Replaces sessionStorage with one that throws, as a private window does. */
function breakSessionStorage() {
  originalSessionStorage = Object.getOwnPropertyDescriptor(window, "sessionStorage");
  Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    value: {
      getItem: () => {
        throw new DOMException("denied");
      },
      setItem: () => {
        throw new DOMException("denied");
      },
      removeItem: () => {
        throw new DOMException("denied");
      },
    },
  });
}

beforeEach(() => {
  reloads = 0;
  originalSessionStorage = undefined;
  window.sessionStorage.clear();
  originalLocation = window.location;
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...originalLocation, reload: () => { reloads += 1; } },
  });
});

afterEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation,
  });
  // Put the real storage back before touching it: a case that broke it on
  // purpose would otherwise make the cleanup throw instead of the assertion.
  if (originalSessionStorage) {
    Object.defineProperty(window, "sessionStorage", originalSessionStorage);
  }
  window.sessionStorage.clear();
});

describe("withChunkRecovery", () => {
  it("passes a successful import straight through", async () => {
    const load = withChunkRecovery(async () => ({ default: "page" }));

    await expect(load()).resolves.toEqual({ default: "page" });
    expect(reloads).toBe(0);
  });

  it("reloads once when the chunk cannot be fetched", async () => {
    const load = withChunkRecovery(() =>
      Promise.reject(new TypeError("Failed to fetch dynamically imported module")),
    );

    // Deliberately not awaited: the returned promise never settles, because the
    // document is being replaced.
    let settled = false;
    void load().then(
      () => { settled = true; },
      () => { settled = true; },
    );
    await Promise.resolve();

    expect(reloads).toBe(1);
    expect(settled).toBe(false);
  });

  it("surfaces the error instead of reloading again", async () => {
    const error = new TypeError("Failed to fetch dynamically imported module");
    const load = withChunkRecovery(() => Promise.reject(error));

    void load().catch(() => {});
    await Promise.resolve();
    expect(reloads).toBe(1);

    // What the page does after the reload: the same chunk, still missing.
    await expect(load()).rejects.toBe(error);
    expect(reloads).toBe(1);
  });

  it("clears the mark on success, so a later deployment gets its own attempt", async () => {
    const failing = withChunkRecovery(() => Promise.reject(new Error("gone")));
    void failing().catch(() => {});
    await Promise.resolve();
    expect(reloads).toBe(1);

    await withChunkRecovery(async () => "ok")();

    void failing().catch(() => {});
    await Promise.resolve();
    expect(reloads).toBe(2);
  });

  it("refuses to reload when nothing can record the attempt", async () => {
    // No storage means no loop guard, and an unstoppable reload loop is worse
    // than the error page it would be trying to avoid.
    breakSessionStorage();
    const error = new Error("gone");
    const load = withChunkRecovery(() => Promise.reject(error));

    await expect(load()).rejects.toBe(error);
    expect(reloads).toBe(0);
  });
});
