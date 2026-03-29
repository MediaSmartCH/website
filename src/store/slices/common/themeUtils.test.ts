import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isThemePreference,
  getSystemTheme,
  resolveThemePreference,
  getThemeMediaQuery,
} from "./themeUtils";

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: prefersDark && query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("isThemePreference", () => {
  it.each(["light", "dark", "system"])("accepts '%s'", (value) => {
    expect(isThemePreference(value)).toBe(true);
  });

  it.each(["", "auto", "Light", null])("rejects '%s'", (value) => {
    expect(isThemePreference(value)).toBe(false);
  });
});

describe("getThemeMediaQuery", () => {
  it("returns a MediaQueryList when matchMedia is available", () => {
    mockMatchMedia(false);
    expect(getThemeMediaQuery()).not.toBeNull();
  });
});

describe("getSystemTheme", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 'dark' when the OS prefers dark mode", () => {
    mockMatchMedia(true);
    expect(getSystemTheme()).toBe("dark");
  });

  it("returns 'light' when the OS does not prefer dark mode", () => {
    mockMatchMedia(false);
    expect(getSystemTheme()).toBe("light");
  });
});

describe("resolveThemePreference", () => {
  it("returns 'light' directly for 'light' preference", () => {
    expect(resolveThemePreference("light")).toBe("light");
  });

  it("returns 'dark' directly for 'dark' preference", () => {
    expect(resolveThemePreference("dark")).toBe("dark");
  });

  it("delegates to system theme for 'system' preference", () => {
    mockMatchMedia(true);
    expect(resolveThemePreference("system")).toBe("dark");

    mockMatchMedia(false);
    expect(resolveThemePreference("system")).toBe("light");
  });
});
