import { describe, it, expect } from "vitest";

import * as en from "./en";
import * as fr from "./fr";

// Guard rail for the dictionaries: the two locales must expose the same key
// tree. Without this, moving or splitting translation files can silently drop
// a key, and the UI degrades to the ⟪section.path⟫ fallback only at runtime.

type Node = Record<string, unknown>;

/** Flattens a nested dictionary into dot-separated leaf paths. */
function leafPaths(node: unknown, prefix = ""): string[] {
  if (Array.isArray(node)) {
    return node.flatMap((item, index) => leafPaths(item, `${prefix}[${index}]`));
  }

  if (node && typeof node === "object") {
    return Object.entries(node as Node).flatMap(([key, value]) =>
      leafPaths(value, prefix ? `${prefix}.${key}` : key)
    );
  }

  return [prefix];
}

const SECTIONS = [
  "navbar",
  "footer",
  "home",
  "it",
  "video",
  "error404",
  "cookies",
  "underconstruction",
  "booking",
  "privacy",
] as const;

const frBundle = fr as unknown as Node;
const enBundle = en as unknown as Node;

describe("locale bundles", () => {
  it.each(SECTIONS)("exposes the '%s' section in both locales", (section) => {
    expect(frBundle[section]).toBeTypeOf("object");
    expect(enBundle[section]).toBeTypeOf("object");
  });

  it("exports exactly the expected set of sections", () => {
    const exported = (bundle: Node) => Object.keys(bundle).sort();

    expect(exported(frBundle)).toEqual([...SECTIONS].sort());
    expect(exported(enBundle)).toEqual([...SECTIONS].sort());
  });
});

describe("locale key parity", () => {
  it.each(SECTIONS)("'%s' has the same key tree in FR and EN", (section) => {
    const frKeys = new Set(leafPaths(frBundle[section]));
    const enKeys = new Set(leafPaths(enBundle[section]));

    const missingInEn = [...frKeys].filter((key) => !enKeys.has(key)).sort();
    const missingInFr = [...enKeys].filter((key) => !frKeys.has(key)).sort();

    expect({ missingInEn, missingInFr }).toEqual({ missingInEn: [], missingInFr: [] });
  });
});

describe("locale values", () => {
  it.each(SECTIONS)("'%s' has no empty string in either locale", (section) => {
    const empties = (bundle: Node, locale: string) =>
      leafPaths(bundle[section])
        .filter((path) => {
          const value = path
            .replace(/\[(\d+)\]/g, ".$1")
            .split(".")
            .reduce<any>((acc, key) => acc?.[key], bundle[section]);
          return typeof value === "string" && value.trim() === "";
        })
        .map((path) => `${locale}:${section}.${path}`);

    expect([...empties(frBundle, "fr"), ...empties(enBundle, "en")]).toEqual([]);
  });
});
