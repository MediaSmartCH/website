import {
  buildLocalizedPath,
  DEFAULT_LANGUAGE,
  stripLanguageFromPath,
  type AppLanguage,
} from "@shared/config/languages";
import {
  AREAS_SERVED,
  CONTACT_PHONE,
  OFFICE_ADDRESS,
  SOCIAL_LINKS,
} from "@shared/constants/contact";
import { dictionary } from "@shared/i18n/registry";
import routeSeoData from "@shared/seo/route-seo-data.json";

export const SITE_NAME = "MediaSmart";
export const SITE_URL = "https://mediasmart.ch";
export const LOGO_URL = `${SITE_URL}/logo512.png`;
export const DEFAULT_SHARE_IMAGE_URL = `${SITE_URL}/og-image-fr.png`;

const SHARE_IMAGE_URL: Record<AppLanguage, string> = {
  fr: `${SITE_URL}/og-image-fr.png`,
  en: `${SITE_URL}/og-image-en.png`,
};
export const DEFAULT_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
export const NOINDEX_ROBOTS =
  "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

type RouteSeoKey =
  | "home"
  | "web-development"
  | "video-services"
  | "privacy-policy"
  | "legal-notice"
  | "terms"
  | "support-contract"
  | "not-found";

type RouteSeoDefinition = {
  pageName: string;
  title: string;
  description: string;
  robots: string;
  shareImageAlt: string;
  serviceType?: string;
  /**
   * Dictionary keys of the FAQ this page renders, in `it`. Present only on
   * pages that actually show those questions.
   */
  faqKeys?: string[];
};

type StructuredDataNode = Record<string, unknown>;

type ResolvedRouteSeo = RouteSeoDefinition & {
  canonicalUrl: string;
  xDefaultUrl: string;
  imageUrl: string;
  indexable: boolean;
  openGraphLocale: string;
  alternateLocales: string[];
  structuredData: StructuredDataNode | null;
};

type RouteSeoDataFile = {
  routeKeyByPath: Record<string, RouteSeoKey>;
  routeSeoByLanguage: Record<AppLanguage, Record<RouteSeoKey, RouteSeoDefinition>>;
};

// Cast needed because JSON imports are typed as `any` by default in TypeScript.
const typedRouteSeoData = routeSeoData as RouteSeoDataFile;

// OG locale tags follow the Facebook convention: language_REGION (e.g. "fr_CH").
const OPEN_GRAPH_LOCALE: Record<AppLanguage, string> = {
  fr: "fr_CH",
  en: "en_CH",
};

/**
 * The places MediaSmart works, for `areaServed`.
 *
 * The country and the four cantons both, rather than one or the other: the
 * country alone told a search engine nothing a visitor searching "agence web
 * Valais" would match on, and the cantons alone would contradict the FAQ,
 * which says the work is done remotely for clients anywhere in Switzerland.
 */
const buildAreaServed = (): StructuredDataNode[] => [
  { "@type": "Country", name: AREAS_SERVED.country },
  ...AREAS_SERVED.cantons.map((canton) => ({
    "@type": "AdministrativeArea",
    name: canton,
  })),
];

/**
 * The FAQ of a page, as `Question`/`Answer` pairs, or null when it has none.
 *
 * Read from the live dictionary rather than copied here, so the markup cannot
 * say something the page does not. That is not only good manners: structured
 * data that does not match the visible content is a manual-action offence.
 *
 * A note on FAQPage itself. Google stopped showing FAQ rich results for most
 * sites in 2023, so this buys no stars in the search listing and is not added
 * hoping for any. It is here for the answer engines, which read the markup to
 * find a question already answered in a citable, self-contained form — which
 * is exactly what these six answers are.
 */
const buildFaqPage = (
  language: AppLanguage,
  canonicalUrl: string,
  faqKeys: string[]
): StructuredDataNode | null => {
  const section = dictionary.it?.[language] as
    | Record<string, { faqQuestion?: string; faqAnswer?: string }>
    | undefined;

  if (!section) return null;

  const entries = faqKeys
    .map((key) => section[key])
    .filter(
      (entry): entry is { faqQuestion: string; faqAnswer: string } =>
        !!entry?.faqQuestion && !!entry?.faqAnswer
    );

  if (!entries.length) return null;

  return {
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.faqQuestion,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.faqAnswer,
      },
    })),
  };
};

const buildBreadcrumbList = (
  language: AppLanguage,
  currentPageName: string,
  currentPageUrl: string
): StructuredDataNode => ({
  "@type": "BreadcrumbList",
  "@id": `${currentPageUrl}#breadcrumb`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: typedRouteSeoData.routeSeoByLanguage[language].home.pageName,
      item: `${SITE_URL}${buildLocalizedPath(language, "/")}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: currentPageName,
      item: currentPageUrl,
    },
  ],
});

// Builds the JSON-LD @graph array for a given page.
// Always includes Organization, WebSite, and WebPage nodes.
// A Service node is added for pages that define a serviceType.
// A BreadcrumbList node is added for all pages except the homepage.
const buildStructuredData = (
  language: AppLanguage,
  seo: RouteSeoDefinition,
  canonicalUrl: string,
  shareImageUrl: string
): StructuredDataNode => {
  const graph: StructuredDataNode[] = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      // No `email` here on purpose. Structured data is published on every page
      // and is, by design, machine-readable: an address in it is the easiest
      // one on the site to harvest, and it buys nothing in search results that
      // the contact page and the phone number do not already provide.
      telephone: CONTACT_PHONE,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: LOGO_URL,
        contentUrl: LOGO_URL,
      },
      // The same address the legal-notice page publishes. Without it the
      // organisation had no place at all in the graph: a search engine reading
      // this could tell what MediaSmart does, but not where it is — which is
      // half of what someone searching for a local supplier is asking.
      address: {
        "@type": "PostalAddress",
        streetAddress: OFFICE_ADDRESS.street,
        postalCode: OFFICE_ADDRESS.postalCode,
        addressLocality: OFFICE_ADDRESS.locality,
        addressRegion: OFFICE_ADDRESS.region,
        addressCountry: OFFICE_ADDRESS.country,
      },
      // Only profiles the site itself links to, from the footer.
      sameAs: [
        SOCIAL_LINKS.linkedin,
        SOCIAL_LINKS.instagram,
        SOCIAL_LINKS.telegram,
      ],
      founder: {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        name: "Raphael Rouiller",
      },
      areaServed: buildAreaServed(),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: CONTACT_PHONE,
        url: `${SITE_URL}/${language}#contact`,
        areaServed: "CH",
        availableLanguage: ["fr", "en"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: language,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: seo.title,
      description: seo.description,
      inLanguage: language,
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#organization`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: shareImageUrl,
      },
    },
  ];

  if (seo.serviceType) {
    graph.push({
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: seo.pageName,
      serviceType: seo.serviceType,
      provider: {
        "@id": `${SITE_URL}/#organization`,
      },
      areaServed: buildAreaServed(),
      availableLanguage: ["fr", "en"],
      url: canonicalUrl,
      description: seo.description,
    });
  }

  if (seo.faqKeys?.length) {
    const faq = buildFaqPage(language, canonicalUrl, seo.faqKeys);
    if (faq) graph.push(faq);
  }

  if (canonicalUrl !== `${SITE_URL}${buildLocalizedPath(language, "/")}`) {
    graph.push(buildBreadcrumbList(language, seo.pageName, canonicalUrl));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};

// Resolves the full SEO metadata for a given URL path and language.
// Strips the language prefix before looking up the route key so that
// "/fr/web-development" and "/en/web-development" both resolve to "web-development".
// Structured data is omitted entirely for non-indexable pages (e.g. 404).
export const resolveRouteSeo = (
  pathname: string,
  language: AppLanguage
): ResolvedRouteSeo => {
  const strippedPath = stripLanguageFromPath(pathname) || "/";
  // Unknown paths fall back to "not-found" so missing routes never throw.
  const routeKey = typedRouteSeoData.routeKeyByPath[strippedPath] ?? "not-found";
  const seo = typedRouteSeoData.routeSeoByLanguage[language][routeKey];
  const canonicalUrl = `${SITE_URL}${buildLocalizedPath(language, strippedPath)}`;
  const xDefaultUrl = `${SITE_URL}${buildLocalizedPath(
    DEFAULT_LANGUAGE,
    strippedPath
  )}`;
  const indexable = seo.robots !== NOINDEX_ROBOTS;
  const imageUrl = SHARE_IMAGE_URL[language];

  return {
    ...seo,
    canonicalUrl,
    xDefaultUrl,
    imageUrl,
    indexable,
    openGraphLocale: OPEN_GRAPH_LOCALE[language],
    alternateLocales: Object.values(OPEN_GRAPH_LOCALE).filter(
      (locale) => locale !== OPEN_GRAPH_LOCALE[language]
    ),
    structuredData: indexable
      ? buildStructuredData(language, seo, canonicalUrl, imageUrl)
      : null,
  };
};
