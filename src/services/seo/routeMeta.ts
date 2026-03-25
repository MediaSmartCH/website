import {
  buildLocalizedPath,
  DEFAULT_LANGUAGE,
  stripLanguageFromPath,
  type AppLanguage,
} from "config/languages";

export const SITE_NAME = "MediaSmart";
export const SITE_URL = "https://mediasmart.ch";
export const DEFAULT_SHARE_IMAGE_URL = `${SITE_URL}/logo512.png`;
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

const OPEN_GRAPH_LOCALE: Record<AppLanguage, string> = {
  fr: "fr_CH",
  en: "en_CH",
};

const routeKeyByPath: Record<string, RouteSeoKey> = {
  "/": "home",
  "/it-services": "it-services",
  "/video-services": "video-services",
  "/privacy-policy": "privacy-policy",
  "/support-contract": "support-contract",
  "/404": "not-found",
};

const routeSeoByLanguage: Record<AppLanguage, Record<RouteSeoKey, RouteSeoDefinition>> = {
  fr: {
    home: {
      pageName: "Accueil",
      title: "MediaSmart | Solutions informatiques et production vidéo en Suisse romande",
      description:
        "MediaSmart accompagne entreprises, indépendants et associations avec des services informatiques, création de sites web et production vidéo en Suisse romande.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "Logo MediaSmart",
    },
    "it-services": {
      pageName: "Services informatiques",
      title: "Services informatiques en Suisse romande | MediaSmart",
      description:
        "Création de sites web, maintenance, cybersécurité, sauvegarde et support IT pour PME, indépendants et associations en Suisse romande.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart - services informatiques",
      serviceType: "Services informatiques, création de sites web et support IT",
    },
    "video-services": {
      pageName: "Services vidéo",
      title: "Production vidéo et captation d'événements | MediaSmart",
      description:
        "Production vidéo, captation multicaméra, montage, photographie et diffusion en direct pour entreprises, institutions et événements en Suisse romande.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart - services vidéo",
      serviceType:
        "Production vidéo, captation d'événements, montage et diffusion en direct",
    },
    "privacy-policy": {
      pageName: "Politique de confidentialité",
      title: "Politique de confidentialité | MediaSmart",
      description:
        "Consultez la politique de confidentialité de MediaSmart: données collectées, cookies, finalités de traitement, conservation et droits des utilisateurs.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart - politique de confidentialité",
    },
    "support-contract": {
      pageName: "Contrat de support",
      title: "Contrat de support IT et SLA | MediaSmart",
      description:
        "Découvrez les contrats de support MediaSmart avec heures incluses, SLA et niveaux Essentiel, Business et Premium pour sécuriser vos projets.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart - contrat de support IT",
      serviceType: "Contrats de support IT avec SLA",
    },
    "not-found": {
      pageName: "Page introuvable",
      title: "Page introuvable | MediaSmart",
      description:
        "La page demandée est introuvable. Retrouvez les services informatiques et vidéo de MediaSmart.",
      robots: NOINDEX_ROBOTS,
      shareImageAlt: "MediaSmart - page introuvable",
    },
  },
  en: {
    home: {
      pageName: "Home",
      title: "MediaSmart | IT solutions and video production in Switzerland",
      description:
        "MediaSmart supports businesses, freelancers and associations with IT services, website creation and video production across French-speaking Switzerland.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart logo",
    },
    "it-services": {
      pageName: "IT Services",
      title: "IT Services in Switzerland | MediaSmart",
      description:
        "Website creation, maintenance, cybersecurity, backup strategies and IT support for SMEs, freelancers and associations in French-speaking Switzerland.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart IT services",
      serviceType: "IT services, website creation and ongoing support",
    },
    "video-services": {
      pageName: "Video Services",
      title: "Video Production and Event Capture | MediaSmart",
      description:
        "Video production, multicamera capture, editing, photography and live streaming for businesses, institutions and events in Switzerland.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart video services",
      serviceType: "Video production, event capture, editing and live streaming",
    },
    "privacy-policy": {
      pageName: "Privacy Policy",
      title: "Privacy Policy | MediaSmart",
      description:
        "Read MediaSmart's privacy policy covering collected data, cookies, processing purposes, retention periods and user rights.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart privacy policy",
    },
    "support-contract": {
      pageName: "Support Contract",
      title: "IT Support Contract and SLA | MediaSmart",
      description:
        "Explore MediaSmart support contracts with included hours, SLAs and Essential, Business and Premium plans to protect your projects.",
      robots: DEFAULT_ROBOTS,
      shareImageAlt: "MediaSmart IT support contract",
      serviceType: "Managed IT support contracts with SLA",
    },
    "not-found": {
      pageName: "Page not found",
      title: "Page not found | MediaSmart",
      description:
        "The requested page could not be found. Browse MediaSmart IT and video services instead.",
      robots: NOINDEX_ROBOTS,
      shareImageAlt: "MediaSmart page not found",
    },
  },
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
      name: routeSeoByLanguage[language].home.pageName,
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

const buildStructuredData = (
  language: AppLanguage,
  seo: RouteSeoDefinition,
  canonicalUrl: string
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
        url: DEFAULT_SHARE_IMAGE_URL,
        contentUrl: DEFAULT_SHARE_IMAGE_URL,
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
        url: DEFAULT_SHARE_IMAGE_URL,
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

export const resolveRouteSeo = (
  pathname: string,
  language: AppLanguage
): ResolvedRouteSeo => {
  const strippedPath = stripLanguageFromPath(pathname) || "/";
  const routeKey = routeKeyByPath[strippedPath] ?? "not-found";
  const seo = routeSeoByLanguage[language][routeKey];
  const canonicalUrl = `${SITE_URL}${buildLocalizedPath(language, strippedPath)}`;
  const xDefaultUrl = `${SITE_URL}${buildLocalizedPath(
    DEFAULT_LANGUAGE,
    strippedPath
  )}`;
  const indexable = seo.robots !== NOINDEX_ROBOTS;

  return {
    ...seo,
    canonicalUrl,
    xDefaultUrl,
    imageUrl: DEFAULT_SHARE_IMAGE_URL,
    indexable,
    openGraphLocale: OPEN_GRAPH_LOCALE[language],
    alternateLocales: Object.values(OPEN_GRAPH_LOCALE).filter(
      (locale) => locale !== OPEN_GRAPH_LOCALE[language]
    ),
    structuredData: indexable
      ? buildStructuredData(language, seo, canonicalUrl)
      : null,
  };
};
