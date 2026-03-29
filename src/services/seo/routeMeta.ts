import {
  buildLocalizedPath,
  DEFAULT_LANGUAGE,
  stripLanguageFromPath,
  type AppLanguage,
} from "config/languages";
import routeSeoData from "./routeSeoData.json";

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
  | "it-services"
  | "video-services"
  | "privacy-policy"
  | "support-contract"
  | "not-found";

type RouteSeoDefinition = {
  pageName: string;
  title: string;
  description: string;
  robots: string;
  shareImageAlt: string;
  serviceType?: string;
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
      email: "contact@mediasmart.ch",
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: LOGO_URL,
        contentUrl: LOGO_URL,
      },
      areaServed: {
        "@type": "Country",
        name: "Switzerland",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@mediasmart.ch",
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
      areaServed: {
        "@type": "Country",
        name: "Switzerland",
      },
      availableLanguage: ["fr", "en"],
      url: canonicalUrl,
      description: seo.description,
    });
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
// "/fr/it-services" and "/en/it-services" both resolve to "it-services".
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
