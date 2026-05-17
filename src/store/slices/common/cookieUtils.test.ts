import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getCookie,
  setCookie,
  safeJSONParse,
  getSafeConsentData,
  getNormalizedConsentData,
  saveConsentData,
  DEFAULT_CONSENT_PREFERENCES,
  COOKIE_CONSENT_UPDATED_EVENT,
} from "./cookieUtils";

// ---------------------------------------------------------------------------
// setCookie / getCookie
// ---------------------------------------------------------------------------

describe("setCookie / getCookie", () => {
  beforeEach(() => {
    // Clear all cookies between tests by expiring them.
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
  });

  it("round-trips a simple string value", () => {
    setCookie("test_key", "hello", 1);
    expect(getCookie("test_key")).toBe("hello");
  });

  it("encodes and decodes special characters", () => {
    setCookie("special", "hello world & more=yes", 1);
    expect(getCookie("special")).toBe("hello world & more=yes");
  });

  it("returns null for a cookie that does not exist", () => {
    expect(getCookie("nonexistent_cookie_xyz")).toBeNull();
  });

  it("overwrites an existing value", () => {
    setCookie("overwrite", "first", 1);
    setCookie("overwrite", "second", 1);
    expect(getCookie("overwrite")).toBe("second");
  });
});

// ---------------------------------------------------------------------------
// safeJSONParse
// ---------------------------------------------------------------------------

describe("safeJSONParse", () => {
  it("parses a valid JSON object", () => {
    expect(safeJSONParse('{"a":1}', null)).toEqual({ a: 1 });
  });

  it("returns the fallback for invalid JSON", () => {
    expect(safeJSONParse("{bad json}", null)).toBeNull();
  });

  it("returns the fallback for a non-string input", () => {
    expect(safeJSONParse(42, null)).toBeNull();
  });

  it("returns the fallback for an empty string", () => {
    expect(safeJSONParse("", null)).toBeNull();
  });

  it("returns the fallback for a JSON primitive (not an object)", () => {
    // A top-level string or number is not the object/array shape we want.
    expect(safeJSONParse('"just a string"', null)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getSafeConsentData / getNormalizedConsentData
// ---------------------------------------------------------------------------

describe("getSafeConsentData", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when localStorage has no consent entry", () => {
    expect(getSafeConsentData()).toBeNull();
  });

  it("parses a valid consent JSON object", () => {
    localStorage.setItem("cookie_consent", JSON.stringify({ googleAnalytics: true }));
    expect(getSafeConsentData()).toEqual({ googleAnalytics: true });
  });

  it("removes the entry and returns null when the JSON is corrupted", () => {
    localStorage.setItem("cookie_consent", "not-json{{{");
    expect(getSafeConsentData()).toBeNull();
    expect(localStorage.getItem("cookie_consent")).toBeNull();
  });
});

describe("getNormalizedConsentData", () => {
  beforeEach(() => localStorage.clear());

  it("returns all-false defaults when no consent data is stored", () => {
    expect(getNormalizedConsentData()).toEqual(DEFAULT_CONSENT_PREFERENCES);
  });

  it("coerces truthy values to booleans", () => {
    localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ googleAnalytics: 1, languagePreference: "yes" })
    );
    const result = getNormalizedConsentData();
    expect(result.googleAnalytics).toBe(true);
    expect(result.languagePreference).toBe(true);
  });

  it("preserves a valid ISO timestamp", () => {
    const ts = "2024-01-01T00:00:00.000Z";
    localStorage.setItem("cookie_consent", JSON.stringify({ timestamp: ts }));
    expect(getNormalizedConsentData().timestamp).toBe(ts);
  });

  it("drops a non-string timestamp", () => {
    localStorage.setItem("cookie_consent", JSON.stringify({ timestamp: 12345 }));
    expect(getNormalizedConsentData().timestamp).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// saveConsentData
// ---------------------------------------------------------------------------

describe("saveConsentData", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("persists data to localStorage with an ISO timestamp", () => {
    saveConsentData({ googleAnalytics: true });
    const stored = JSON.parse(localStorage.getItem("cookie_consent") ?? "{}");
    expect(stored.googleAnalytics).toBe(true);
    expect(typeof stored.timestamp).toBe("string");
  });

  it("dispatches the COOKIE_CONSENT_UPDATED_EVENT custom event", () => {
    const listener = vi.fn();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, listener);
    saveConsentData({ googleAnalytics: false });
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, listener);
  });

  it("returns true on success", () => {
    expect(saveConsentData({})).toBe(true);
  });
});
