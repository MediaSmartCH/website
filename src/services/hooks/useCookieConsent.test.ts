import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCookieConsent } from "./useCookieConsent";
import {
  DEFAULT_CONSENT_PREFERENCES,
  saveConsentData,
} from "store/slices/common/cookieUtils";

describe("useCookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns default preferences when no consent data is stored", () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current).toEqual(DEFAULT_CONSENT_PREFERENCES);
  });

  it("reads existing consent data from localStorage on mount", () => {
    localStorage.setItem(
      "cookie_consent",
      JSON.stringify({ googleAnalytics: true })
    );
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.googleAnalytics).toBe(true);
  });

  it("updates when COOKIE_CONSENT_UPDATED_EVENT is dispatched", () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.googleAnalytics).toBe(false);

    act(() => {
      saveConsentData({ googleAnalytics: true });
    });

    expect(result.current.googleAnalytics).toBe(true);
  });

  it("updates when localStorage changes in another tab (storage event)", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      localStorage.setItem(
        "cookie_consent",
        JSON.stringify({ languagePreference: true })
      );
      // Simulate the browser's cross-tab storage event.
      window.dispatchEvent(new Event("storage"));
    });

    expect(result.current.languagePreference).toBe(true);
  });

  it("removes event listeners on unmount (no memory leak)", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useCookieConsent());
    unmount();

    const addedEvents = addSpy.mock.calls.map((c) => c[0]);
    const removedEvents = removeSpy.mock.calls.map((c) => c[0]);

    // Every event type that was added must also have been removed.
    addedEvents.forEach((event) => {
      expect(removedEvents).toContain(event);
    });
  });
});
