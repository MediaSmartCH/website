/**
 * Guards the Vercel routing table against the soft-404 regression.
 *
 * `vercel.json` used to end with `/fr/(.*)` and `/en/(.*)` rewrites onto the
 * homepage shell, so every unknown URL answered 200 with the homepage title and
 * a canonical pointing at the homepage — a soft 404. Removing them means the
 * table is now exhaustive: any client route without its own rewrite falls
 * through to `dist/404.html`. These tests make that contract explicit, because
 * the failure mode is silent in development (the dev server resolves routes
 * itself) and only shows up in production.
 */

import { describe, expect, it } from "vitest";

import seoData from "@shared/seo/route-seo-data.json";
import vercelConfig from "../../vercel.json";

const LANGUAGES = ["fr", "en"] as const;

const sources = vercelConfig.rewrites.map((rewrite) => rewrite.source);

const destinationFor = (source: string) =>
  vercelConfig.rewrites.find((rewrite) => rewrite.source === source)?.destination;

describe("vercel rewrites", () => {
  it("has no catch-all falling back to a language shell", () => {
    const catchAll = vercelConfig.rewrites.filter((rewrite) =>
      rewrite.source.includes("(.*)")
    );

    expect(catchAll).toEqual([]);
  });

  it.each(LANGUAGES)("serves every prerendered route of %s", (language) => {
    for (const pathname of Object.keys(seoData.routeKeyByPath)) {
      const source = pathname === "/" ? `/${language}` : `/${language}${pathname}`;
      const slug = pathname === "/" ? "" : `-${pathname.slice(1).replace(/\//g, "-")}`;

      expect(sources).toContain(source);
      expect(destinationFor(source)).toBe(
        `/generated-pages/${language}${slug}.html`
      );
    }
  });

  it.each(LANGUAGES)("still serves the booking page of %s", (language) => {
    // No prerendered page of its own: it rode on the catch-all and would 404
    // without this entry.
    expect(destinationFor(`/${language}/booking/manage`)).toBe(
      `/generated-pages/${language}.html`
    );
  });
});

describe("404 route data", () => {
  it.each(LANGUAGES)("keeps the %s not-found page out of the index", (language) => {
    const seo = seoData.routeSeoByLanguage[language]["not-found"];

    expect(seo.robots.startsWith("noindex")).toBe(true);
  });

  it("maps /404 to the not-found key", () => {
    expect(seoData.routeKeyByPath["/404"]).toBe("not-found");
  });
});
