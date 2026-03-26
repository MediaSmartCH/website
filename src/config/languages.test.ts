import { describe, it, expect } from "vitest";
import {
  normalizeLanguage,
  isSupportedLanguage,
  getNextLanguage,
  stripLanguageFromPath,
  hasLanguagePrefix,
  buildLocalizedPath,
  LANGUAGE_PREFIX_REGEX,
  DEFAULT_LANGUAGE,
} from "./languages";

describe("isSupportedLanguage", () => {
  it.each(["fr", "en"])("recognises '%s' as supported", (lang) => {
    expect(isSupportedLanguage(lang)).toBe(true);
  });

  it.each(["de", "es", "", null, undefined])("rejects '%s'", (lang) => {
    expect(isSupportedLanguage(lang)).toBe(false);
  });
});

describe("normalizeLanguage", () => {
  it("returns the language as-is when already valid", () => {
    expect(normalizeLanguage("fr")).toBe("fr");
    expect(normalizeLanguage("en")).toBe("en");
  });

  it("lowercases before matching", () => {
    expect(normalizeLanguage("FR")).toBe("fr");
    expect(normalizeLanguage("EN")).toBe("en");
  });

  it("extracts the base language from a BCP-47 tag", () => {
    expect(normalizeLanguage("en-US")).toBe("en");
    expect(normalizeLanguage("fr-CH")).toBe("fr");
  });

  it(`falls back to DEFAULT_LANGUAGE ('${DEFAULT_LANGUAGE}') for unknown values`, () => {
    expect(normalizeLanguage("de")).toBe(DEFAULT_LANGUAGE);
    expect(normalizeLanguage(null)).toBe(DEFAULT_LANGUAGE);
    expect(normalizeLanguage(undefined)).toBe(DEFAULT_LANGUAGE);
    expect(normalizeLanguage("")).toBe(DEFAULT_LANGUAGE);
  });
});

describe("LANGUAGE_PREFIX_REGEX", () => {
  it.each(["/fr", "/en", "/fr/", "/en/about"])(
    "matches '%s'",
    (path) => {
      expect(LANGUAGE_PREFIX_REGEX.test(path)).toBe(true);
    }
  );

  it.each(["/", "/about", "/french", "fr"])("does not match '%s'", (path) => {
    expect(LANGUAGE_PREFIX_REGEX.test(path)).toBe(false);
  });
});

describe("stripLanguageFromPath", () => {
  it("removes the language prefix", () => {
    expect(stripLanguageFromPath("/fr/about")).toBe("/about");
    expect(stripLanguageFromPath("/en/it-services")).toBe("/it-services");
  });

  it("leaves paths without a prefix unchanged", () => {
    expect(stripLanguageFromPath("/about")).toBe("/about");
    expect(stripLanguageFromPath("/")).toBe("/");
  });

  it("strips a bare language prefix with no trailing path", () => {
    expect(stripLanguageFromPath("/fr")).toBe("");
  });
});

describe("hasLanguagePrefix", () => {
  it("returns true when the path starts with a language prefix", () => {
    expect(hasLanguagePrefix("/fr/contact")).toBe(true);
  });

  it("returns false when the path has no language prefix", () => {
    expect(hasLanguagePrefix("/contact")).toBe(false);
  });
});

describe("getNextLanguage", () => {
  it("cycles from fr to en", () => {
    expect(getNextLanguage("fr")).toBe("en");
  });

  it("cycles from en back to fr (wraps around)", () => {
    expect(getNextLanguage("en")).toBe("fr");
  });

  it("normalizes an unknown input to DEFAULT_LANGUAGE before cycling", () => {
    // "de" normalizes to DEFAULT_LANGUAGE ("fr"), whose next language is "en".
    expect(getNextLanguage("de")).toBe("en");
  });
});

describe("buildLocalizedPath", () => {
  it("prepends the language to a plain path", () => {
    expect(buildLocalizedPath("fr", "/about")).toBe("/fr/about");
    expect(buildLocalizedPath("en", "/contact")).toBe("/en/contact");
  });

  it("avoids a double slash for the root path", () => {
    expect(buildLocalizedPath("fr", "/")).toBe("/fr");
    expect(buildLocalizedPath("en", "")).toBe("/en");
  });

  it("strips an existing language prefix before adding the new one", () => {
    expect(buildLocalizedPath("en", "/fr/about")).toBe("/en/about");
  });

  it("appends search and hash when provided", () => {
    expect(buildLocalizedPath("fr", "/about", "?foo=1", "#section")).toBe(
      "/fr/about?foo=1#section"
    );
  });
});
