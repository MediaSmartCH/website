import { describe, it, expect, vi } from "vitest";
import { makeTranslator } from "./safe";

// ---------------------------------------------------------------------------
// Minimal dictionary mock — avoids importing the real translation files.
// ---------------------------------------------------------------------------

vi.mock("./index", () => ({
  dictionary: {
    navbar: {
      fr: { languageSelector: "Langue", themeSelector: "Thème" },
      en: { languageSelector: "Language", themeSelector: "Theme" },
    },
    section: {
      fr: {
        nested: { key: "Valeur" },
        list: ["a", "b", "c"],
        obj: { foo: "bar" },
      },
      en: {
        nested: { key: "Value" },
        list: ["x", "y", "z"],
        obj: { foo: "baz" },
      },
    },
  },
}));

describe("makeTranslator — text()", () => {
  it("returns the correct translation for a known path", () => {
    const t = makeTranslator("fr");
    expect(t.text("navbar.languageSelector")).toBe("Langue");
  });

  it("returns the correct translation for a different language", () => {
    const t = makeTranslator("en");
    expect(t.text("navbar.languageSelector")).toBe("Language");
  });

  it("resolves a nested dot-path", () => {
    const t = makeTranslator("fr");
    expect(t.text("section.nested.key")).toBe("Valeur");
  });

  it("returns the bracketed fallback for a missing key", () => {
    const t = makeTranslator("en");
    expect(t.text("navbar.nonexistent")).toBe("⟪navbar.nonexistent⟫");
  });

  it("returns a custom fallback when provided", () => {
    const t = makeTranslator("en");
    expect(t.text("navbar.missing", "fallback text")).toBe("fallback text");
  });

  it("returns the bracketed fallback for a missing section", () => {
    const t = makeTranslator("en");
    expect(t.text("ghost.key")).toBe("⟪ghost.key⟫");
  });
});

describe("makeTranslator — array()", () => {
  it("returns an array for a known path", () => {
    const t = makeTranslator("fr");
    expect(t.array("section.list")).toEqual(["a", "b", "c"]);
  });

  it("returns the empty-array fallback for a missing path", () => {
    const t = makeTranslator("en");
    expect(t.array("section.missing")).toEqual([]);
  });

  it("returns a custom fallback array when provided", () => {
    const t = makeTranslator("en");
    expect(t.array("section.missing", ["default"])).toEqual(["default"]);
  });
});

describe("makeTranslator — object()", () => {
  it("returns an object for a known path", () => {
    const t = makeTranslator("en");
    expect(t.object("section.obj")).toEqual({ foo: "baz" });
  });

  it("returns the empty-object fallback for a missing path", () => {
    const t = makeTranslator("en");
    expect(t.object("section.missing")).toEqual({});
  });
});

describe("makeTranslator — language fallback", () => {
  it("falls back to 'en' when the requested language has no section entry", () => {
    // 'de' is not in the dictionary; the translator should fall back to 'en'.
    const t = makeTranslator("de");
    expect(t.text("navbar.languageSelector")).toBe("Language");
  });
});
