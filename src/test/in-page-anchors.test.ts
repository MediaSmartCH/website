/**
 * Every in-page anchor the site links to must exist as an element id.
 *
 * The homepage absorbed the services page, so `#services` is now the target of
 * links from the project pages, from both regional pages and from the hero —
 * and a section id is exactly the kind of thing a refactor renames without
 * noticing, because nothing fails to compile and nothing throws. The link just
 * quietly stops going anywhere.
 *
 * This reads the source rather than a rendered page on purpose: the ids live in
 * components behind Redux, i18n and lazy boundaries, and the contract worth
 * guarding — "this href has somewhere to land" — is visible without any of
 * that.
 */

import { describe, expect, it } from "vitest";

// Vite's own file reader rather than node:fs: this file is compiled under the
// browser tsconfig, which has no Node types.
const sources = import.meta.glob("../**/*.{ts,tsx}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const allSource = Object.entries(sources)
  .filter(([file]) => !/\.test\.tsx?$/.test(file))
  .map(([, contents]) => contents)
  .join("\n");

/** Every `id="..."` the components render. */
const declaredIds = new Set(
  [...allSource.matchAll(/\bid="([a-z][\w-]*)"/g)].map((match) => match[1])
);

/**
 * Anchors reached through the localisation helpers, which is how every
 * cross-page anchor on the site is written: `L("#services")`,
 * `Lhash("#about")`, or a `to="#services"` handed to a component that
 * localises it.
 */
const linkedAnchors = new Set(
  [
    ...allSource.matchAll(/\b(?:L|Lhash)\(\s*["'`]#([\w-]+)["'`]/g),
    ...allSource.matchAll(/\bto=["']#([\w-]+)["']/g),
  ].map((match) => match[1])
);

describe("in-page anchors", () => {
  it("finds the sections the site links to", () => {
    // A guard that asserted nothing would pass silently once the links moved.
    expect(linkedAnchors.size).toBeGreaterThan(0);
    expect(linkedAnchors).toContain("services");

    for (const anchor of linkedAnchors) {
      expect(declaredIds, `nothing renders id="${anchor}"`).toContain(anchor);
    }
  });

  it("keeps the homepage sections the merged services content introduced", () => {
    // /web-development was folded into the homepage; these are the ids its
    // sections brought with them and that other pages now point at.
    expect(declaredIds).toContain("services");
    expect(declaredIds).toContain("saas");
  });
});
