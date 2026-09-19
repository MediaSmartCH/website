/**
 * Keeps the build-time renderer, the SEO route table and the Vercel rewrites
 * in step with each other.
 *
 * `src/app/prerender.tsx` has to name its page components statically — the
 * live router builds them with `lazy()` and `createBrowserRouter`, neither of
 * which runs without a DOM — so the tables are written more than once. A route
 * added in one place and forgotten in another gets a shell with no content, or
 * a 404 in production, silently in both cases.
 */

import { describe, expect, it } from "vitest";

import seoData from "@shared/seo/route-seo-data.json";
import vercelConfig from "../../vercel.json";
import { PRERENDERED_PATHS } from "@app/prerender";
import { caseStudyPath, CASE_STUDY_SLUGS } from "@features/work/lib/work-routes";

const LANGUAGES = ["fr", "en"] as const;

/**
 * Every path that should be rendered: the ones the SEO table lists, plus one
 * per client project. The project pages are derived rather than listed, which
 * is the whole point of deriving them.
 */
const expectedPaths = [
  ...Object.keys(seoData.routeKeyByPath),
  ...CASE_STUDY_SLUGS.map(caseStudyPath),
];

describe("prerendered routes", () => {
  it("covers every path the site declares", () => {
    expect([...PRERENDERED_PATHS].sort()).toEqual([...expectedPaths].sort());
  });

  it("has a project page for every client project and nothing else", () => {
    expect(CASE_STUDY_SLUGS.length).toBeGreaterThan(0);
    expect(CASE_STUDY_SLUGS).not.toContain("cc-voice");
    expect(CASE_STUDY_SLUGS).not.toContain("ged-mediasmart");
  });

  it.each(LANGUAGES)("is served by a rewrite in %s", (language) => {
    const sources = vercelConfig.rewrites.map((rewrite) => rewrite.source);

    for (const pathname of expectedPaths) {
      // The 404 and the homepage are covered by src/test/vercel-routing.test.ts.
      if (pathname === "/") continue;

      expect(sources).toContain(`/${language}${pathname}`);
    }
  });
});
