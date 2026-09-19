/**
 * Guards the French slugs that were renamed to English.
 *
 * `/agence-web-suisse-romande`, `/agence-web-valais` and `/realisations` were
 * live before the rename. Anything already linking to them — a bookmark, a
 * client's site, a search result — has to land on the new address rather than
 * on a 404, and with a 301 so the new URL inherits the old one's standing.
 *
 * The rewrite table is exhaustive by design (see vercel-routing.test.ts), so a
 * missing redirect here is a silent 404 in production only.
 */

import { describe, expect, it } from "vitest";

import vercelConfig from "../../vercel.json";
import { CASE_STUDY_SLUGS } from "@features/work/lib/work-routes";

const LANGUAGES = ["fr", "en"] as const;

const RENAMED = [
  ["/agence-web-suisse-romande", "/web-agency-switzerland"],
  ["/agence-web-valais", "/web-agency-valais"],
  ["/realisations", "/projects"],
] as const;

const redirectFor = (source: string) =>
  vercelConfig.redirects.find((redirect) => redirect.source === source);

describe("renamed slugs", () => {
  it.each(LANGUAGES)("redirects every old page of %s, permanently", (language) => {
    for (const [oldPath, newPath] of RENAMED) {
      const redirect = redirectFor(`/${language}${oldPath}`);

      expect(redirect, `no redirect for /${language}${oldPath}`).toBeDefined();
      expect(redirect?.destination).toBe(`/${language}${newPath}`);
      expect(redirect).toMatchObject({ statusCode: 301 });
    }
  });

  it.each(LANGUAGES)("carries the project slug across in %s", (language) => {
    const redirect = redirectFor(`/${language}/realisations/:slug`);

    expect(redirect?.destination).toBe(`/${language}/projects/:slug`);
    expect(redirect).toMatchObject({ statusCode: 301 });
    // The parameterised rule stands in for one per project, so it only holds
    // while every project actually lives under /projects/<slug>.
    expect(CASE_STUDY_SLUGS.length).toBeGreaterThan(0);
  });

  it("does not still serve the old paths", () => {
    const sources = vercelConfig.rewrites.map((rewrite) => rewrite.source);

    for (const language of LANGUAGES) {
      for (const [oldPath] of RENAMED) {
        expect(sources).not.toContain(`/${language}${oldPath}`);
      }
    }
  });
});
