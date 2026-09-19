/**
 * Keeps the build-time renderer and the SEO route table in step.
 *
 * `src/app/prerender.tsx` has to name its page components statically — the
 * live router builds them with `lazy()` and `createBrowserRouter`, neither of
 * which runs without a DOM — so the two tables are written twice. A route
 * added to `route-seo-data.json` and forgotten here would get a shell with no
 * content, silently, which is the exact failure the pre-render exists to fix.
 */

import { describe, expect, it } from "vitest";

import seoData from "@shared/seo/route-seo-data.json";
import { PRERENDERED_PATHS } from "@app/prerender";

describe("prerendered routes", () => {
  it("covers every path the SEO table declares", () => {
    expect([...PRERENDERED_PATHS].sort()).toEqual(
      Object.keys(seoData.routeKeyByPath).sort()
    );
  });
});
