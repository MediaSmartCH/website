/**
 * Build-time renderer.
 *
 * ## Why this exists
 *
 * The site is a single-page app: what the server sends is a `<head>` and an
 * empty `<div id="root">`, and every word a visitor reads is written by
 * JavaScript afterwards. Googlebot runs that JavaScript, so the site indexes.
 * The crawlers behind the answer engines — PerplexityBot, ChatGPT-User, and
 * most of Bing's fetches — do not. They were being served a title, a
 * description, and a blank page. Allowing them in robots.txt bought nothing as
 * long as there was nothing for them to read.
 *
 * So the pages are rendered here, at build time, with the same components and
 * the same dictionaries the browser uses. The HTML a crawler receives is the
 * HTML a visitor sees: not a parallel copy written for robots, which is what
 * search engines call cloaking and penalise, but the page itself.
 *
 * ## What the browser does with it
 *
 * React hydrates over this markup rather than replacing it, so the visitor sees
 * the page painted before the bundle has finished evaluating — the pre-rendered
 * content is the first paint, not an extra one.
 *
 * ## Why the routes are declared again here
 *
 * `src/app/router.tsx` builds a browser router out of `lazy()` components and
 * `createBrowserRouter`, neither of which can run without a DOM. Rather than
 * refactor the live router around a build-time concern, this module walks the
 * same paths with a MemoryRouter and static imports. The route table below is
 * the one place the two have to agree; `route-seo-data.json` keys them both,
 * and `src/test/prerender-routes.test.ts` fails if they drift apart.
 */

import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import Layout from "@app/layout/site-layout";

import Homepage from "@features/home/home-page";
import PrivacyPolicyPage from "@features/privacy-policy/privacy-policy-page";
import LegalNoticePage from "@features/legal/legal-notice-page";
import TermsPage from "@features/legal/terms-page";
import Error404Page from "@features/error/error-404-page";
import SuisseRomandePage from "@features/agency/suisse-romande-page";
import ValaisPage from "@features/agency/valais-page";
import WorkIndexPage from "@features/work/work-index-page";
import WorkDetailPage from "@features/work/work-detail-page";
import { caseStudyPath, CASE_STUDY_SLUGS, WORK_BASE_PATH } from "@features/work/lib/work-routes";

import { store } from "@store/store";
import { setLanguage } from "@store/slices/common/languageSlice";
import { registerLocale } from "@shared/i18n/registry";
import * as frMessages from "@shared/i18n/fr";
import * as enMessages from "@shared/i18n/en";
import { resolveRouteSeo } from "@shared/seo/route-meta";
import type { AppLanguage } from "@shared/config/languages";

// Both dictionaries are registered up front: one process renders every page of
// both locales, and there is no bundle size to protect here.
registerLocale("fr", frMessages as never);
registerLocale("en", enMessages as never);

/**
 * The page component behind each path, keyed exactly as `routeKeyByPath` in
 * `src/shared/seo/route-seo-data.json`.
 *
 * Routes the live router only redirects (`/it-services`, `/video-services`,
 * `/support-contract`) are absent on purpose: Vercel answers those with a 301
 * and there is no page to render.
 */
const PAGE_BY_PATH: Record<string, React.ComponentType> = {
  "/": Homepage,
  "/web-agency-switzerland": SuisseRomandePage,
  "/web-agency-valais": ValaisPage,
  [WORK_BASE_PATH]: WorkIndexPage,
  "/privacy-policy": PrivacyPolicyPage,
  "/legal-notice": LegalNoticePage,
  "/terms": TermsPage,
  "/404": Error404Page,
  // One entry per client project. The same component renders them all; which
  // project it shows comes from the URL, which the MemoryRouter below supplies.
  ...Object.fromEntries(
    CASE_STUDY_SLUGS.map((slug) => [caseStudyPath(slug), WorkDetailPage])
  ),
};

export const PRERENDERED_PATHS = Object.keys(PAGE_BY_PATH);

/**
 * The source module behind each path, as Vite's build manifest keys it.
 *
 * The build uses this to preload the route's own chunk from the HTML. Without
 * it the browser cannot discover that chunk until the entry has run and the
 * router has asked for it — and until it arrives, the Suspense fallback
 * replaces the pre-rendered page with a full-page loader. On a fast connection
 * that window is a few milliseconds; on a slow one it is long enough to read
 * as a flash of content, then a spinner, then the content again.
 *
 * Written out rather than derived: a bundler cannot tell us the source path of
 * a component it has already compiled.
 */
export const PAGE_MODULE_BY_PATH: Record<string, string> = {
  "/": "src/features/home/home-page.tsx",
  "/web-agency-switzerland": "src/features/agency/suisse-romande-page.tsx",
  "/web-agency-valais": "src/features/agency/valais-page.tsx",
  [WORK_BASE_PATH]: "src/features/work/work-index-page.tsx",
  "/privacy-policy": "src/features/privacy-policy/privacy-policy-page.tsx",
  "/legal-notice": "src/features/legal/legal-notice-page.tsx",
  "/terms": "src/features/legal/terms-page.tsx",
  "/404": "src/features/error/error-404-page.tsx",
  ...Object.fromEntries(
    CASE_STUDY_SLUGS.map((slug) => [
      caseStudyPath(slug),
      "src/features/work/work-detail-page.tsx",
    ])
  ),
};

/**
 * The page's JSON-LD, as a ready-to-write `<script>` tag, or "" for a page that
 * carries none (the 404, which is noindex).
 *
 * Built straight from `resolveRouteSeo` rather than by rendering `RouteSeo`
 * into the tree. React 19 hoists `<title>`, `<meta>` and `<link>` into the
 * document head on its own, but a build-time render produces a fragment with
 * no head to hoist into — so those tags came out inside `<div id="root">`,
 * where they duplicated the head this build already writes and, worse, made
 * the markup disagree with what the browser renders, which cost the hydration.
 *
 * The head itself is written by generate-localized-html.mjs from the same
 * `route-seo-data.json`, so nothing is lost by leaving it out here.
 */
export function renderJsonLd(language: AppLanguage, pathname: string): string {
  const localizedPath = pathname === "/" ? `/${language}` : `/${language}${pathname}`;
  const { structuredData } = resolveRouteSeo(localizedPath, language);

  if (!structuredData) return "";

  const json = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return `<script type="application/ld+json">${json}</script>`;
}

/**
 * Builds the tree for one route of one locale.
 *
 * The actual rendering happens in `scripts/prerender.mjs`, which streams it and
 * waits for every Suspense boundary to settle. That has to live there rather
 * than here: it needs Node's stream types, and this file is compiled under the
 * browser tsconfig.
 *
 * The 404 sits outside `Layout`, as it does in the live router: it is a dead
 * end, not a page of the site, and it carries neither header nor footer.
 */
export function createRouteElement(
  language: AppLanguage,
  pathname: string
): React.ReactElement {
  const Page = PAGE_BY_PATH[pathname];

  if (!Page) {
    throw new Error(`No page component registered for "${pathname}"`);
  }

  // The store is a module singleton, so the language has to be set per render
  // rather than per process.
  store.dispatch(setLanguage(language));

  const localizedPath = pathname === "/" ? `/${language}` : `/${language}${pathname}`;

  const body =
    pathname === "/404" ? (
      <Page />
    ) : (
      <Layout>
        <Page />
      </Layout>
    );

  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[localizedPath]}>
        <Routes>
          {/* The project pages read their slug from the URL, so the route has
              to declare the parameter rather than swallow it in the splat. */}
          <Route path={`/:lang${WORK_BASE_PATH}/:slug`} element={body} />
          <Route path="/:lang/*" element={body} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}
