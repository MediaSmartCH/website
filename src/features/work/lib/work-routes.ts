/**
 * The URL of every project that gets its own page.
 *
 * Only client work does. Our own products and the free tools are presented on
 * the index and on /web-development, where they belong: a page per product
 * would say the same thing twice, and the free tools change too often to be
 * worth an indexed URL each.
 *
 * The slug is the portfolio id, which is already unique, already stable and
 * already the name of the screenshot files. Deriving it rather than declaring
 * a second list means a project cannot exist in one and not the other.
 */

import portfolioData from "@features/it-services/data/it-portfolio.json";
import {
  getItemCategory,
  type PortfolioData,
  type PortfolioItem,
} from "@features/it-services/lib/portfolio-helpers";

const data = portfolioData as PortfolioData;

/** Base path of the index, under the language prefix. */
export const WORK_BASE_PATH = "/realisations";

/** Client projects, in the order the JSON lists them. */
export const CASE_STUDY_ITEMS: PortfolioItem[] = data.items.filter(
  (item) => getItemCategory(item) === "client"
);

/** Every project id that has a page. */
export const CASE_STUDY_SLUGS: string[] = CASE_STUDY_ITEMS.map((item) => item.id);

/** Path of one project page, without the language prefix. */
export const caseStudyPath = (slug: string): string => `${WORK_BASE_PATH}/${slug}`;

/** Every path this feature owns, for the router and the build-time renderer. */
export const WORK_PATHS: string[] = [
  WORK_BASE_PATH,
  ...CASE_STUDY_SLUGS.map(caseStudyPath),
];

/** The project behind a slug, or undefined when the URL names none. */
export const findCaseStudy = (slug: string | undefined): PortfolioItem | undefined =>
  CASE_STUDY_ITEMS.find((item) => item.id === slug);
