import React from "react";
import { Helmet } from "react-helmet-async";
import {
  buildLocalizedPath,
  stripLanguageFromPath,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from "config/languages";
import { resolveRouteSeo, SITE_NAME, SITE_URL } from "services/seo/routeMeta";

type RouteSeoProps = {
  language: AppLanguage;
  pathname: string;
};

const RouteSeo: React.FC<RouteSeoProps> = ({ language, pathname }) => {
  const seo = resolveRouteSeo(pathname, language);
  const strippedPath = stripLanguageFromPath(pathname) || "/";
  const jsonLd = seo.structuredData
    ? JSON.stringify(seo.structuredData).replace(/</g, "\\u003c")
    : null;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={seo.robots} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="author" content={SITE_NAME} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={seo.imageUrl} />
      <meta property="og:image:alt" content={seo.shareImageAlt} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:locale" content={seo.openGraphLocale} />
      {seo.alternateLocales.map((locale) => (
        <meta
          key={locale}
          property="og:locale:alternate"
          content={locale}
        />
      ))}

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.imageUrl} />

      {seo.indexable &&
        SUPPORTED_LANGUAGES.map((supportedLanguage) => (
          <link
            key={supportedLanguage.code}
            rel="alternate"
            hrefLang={supportedLanguage.code}
            href={`${SITE_URL}${buildLocalizedPath(
              supportedLanguage.code,
              strippedPath
            )}`}
          />
        ))}
      {seo.indexable && (
        <link rel="alternate" hrefLang="x-default" href={seo.xDefaultUrl} />
      )}
      {seo.indexable && <link rel="canonical" href={seo.canonicalUrl} />}

      {jsonLd && (
        <script type="application/ld+json">{jsonLd}</script>
      )}
    </Helmet>
  );
};

export default RouteSeo;
