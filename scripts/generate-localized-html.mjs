import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "generated-pages");
const seoDataPath = path.join(rootDir, "src", "services", "seo", "routeSeoData.json");

const SITE_NAME = "MediaSmart";
const SITE_URL = "https://mediasmart.ch";
const DEFAULT_LANGUAGE = "fr";
const SUPPORTED_LANGUAGES = ["fr", "en"];

const OPEN_GRAPH_LOCALE = {
  fr: "fr_CH",
  en: "en_CH",
};

const SHARE_IMAGE_URL = {
  fr: `${SITE_URL}/og-image-fr.png`,
  en: `${SITE_URL}/og-image-en.png`,
};

const seoData = JSON.parse(fs.readFileSync(seoDataPath, "utf8"));

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const buildLocalizedPath = (language, pathname) => {
  const normalizedPath = pathname === "/" ? "" : pathname;
  return `/${language}${normalizedPath}`;
};

const buildOutputFilename = (language, pathname) => {
  const slug = pathname === "/" ? "" : pathname.replace(/^\//, "").replace(/\//g, "-");
  return slug ? `${language}-${slug}.html` : `${language}.html`;
};

const resolveSeo = (language, pathname) => {
  const routeKey = seoData.routeKeyByPath[pathname] ?? "not-found";
  const seo = seoData.routeSeoByLanguage[language][routeKey];
  const canonicalUrl = `${SITE_URL}${buildLocalizedPath(language, pathname)}`;
  const alternateLocales = SUPPORTED_LANGUAGES
    .map((supportedLanguage) => OPEN_GRAPH_LOCALE[supportedLanguage])
    .filter((locale) => locale !== OPEN_GRAPH_LOCALE[language]);
  const indexable = !seo.robots.startsWith("noindex");

  return {
    ...seo,
    canonicalUrl,
    xDefaultUrl: `${SITE_URL}${buildLocalizedPath(DEFAULT_LANGUAGE, pathname)}`,
    imageUrl: SHARE_IMAGE_URL[language],
    openGraphLocale: OPEN_GRAPH_LOCALE[language],
    alternateLocales,
    indexable,
  };
};

const renderAlternateLinks = (pathname, indexable) => {
  if (!indexable) {
    return "";
  }

  const alternates = SUPPORTED_LANGUAGES.map(
    (language) =>
      `  <link rel="alternate" hrefLang="${language}" href="${SITE_URL}${buildLocalizedPath(language, pathname)}" />`
  );

  alternates.push(
    `  <link rel="alternate" hrefLang="x-default" href="${SITE_URL}${buildLocalizedPath(DEFAULT_LANGUAGE, pathname)}" />`
  );

  return `${alternates.join("\n")}\n`;
};

const renderHtml = (language, pathname) => {
  const seo = resolveSeo(language, pathname);
  const alternateLinks = renderAlternateLinks(pathname, seo.indexable);
  const canonicalLink = seo.indexable
    ? `  <link rel="canonical" href="${seo.canonicalUrl}" />\n`
    : "";
  const alternateLocaleMeta = seo.alternateLocales
    .map(
      (locale) =>
        `  <meta data-rh="true" property="og:locale:alternate" content="${escapeHtml(locale)}" />`
    )
    .join("\n");
  const alternateLocaleBlock = alternateLocaleMeta ? `${alternateLocaleMeta}\n` : "";

  return `<!doctype html>
<html lang="${language}">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(seo.title)}</title>
  <meta data-rh="true" name="description" content="${escapeHtml(seo.description)}" />
  <meta data-rh="true" name="robots" content="${escapeHtml(seo.robots)}" />
  <meta data-rh="true" name="application-name" content="${escapeHtml(SITE_NAME)}" />
  <meta data-rh="true" name="author" content="${escapeHtml(SITE_NAME)}" />
  <meta data-rh="true" property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
  <meta data-rh="true" property="og:type" content="website" />
  <meta data-rh="true" property="og:title" content="${escapeHtml(seo.title)}" />
  <meta data-rh="true" property="og:description" content="${escapeHtml(seo.description)}" />
  <meta data-rh="true" property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />
  <meta data-rh="true" property="og:image" content="${escapeHtml(seo.imageUrl)}" />
  <meta data-rh="true" property="og:image:type" content="image/png" />
  <meta data-rh="true" property="og:image:alt" content="${escapeHtml(seo.shareImageAlt)}" />
  <meta data-rh="true" property="og:image:width" content="1200" />
  <meta data-rh="true" property="og:image:height" content="630" />
  <meta data-rh="true" property="og:locale" content="${escapeHtml(seo.openGraphLocale)}" />
${alternateLocaleBlock}  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta data-rh="true" name="twitter:title" content="${escapeHtml(seo.title)}" />
  <meta data-rh="true" name="twitter:description" content="${escapeHtml(seo.description)}" />
  <meta data-rh="true" name="twitter:image" content="${escapeHtml(seo.imageUrl)}" />
  <meta data-rh="true" name="twitter:image:alt" content="${escapeHtml(seo.shareImageAlt)}" />
${alternateLinks}${canonicalLink}  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Red+Hat+Display:wght@300..900&family=Mulish:wght@200..1000&display=swap" rel="stylesheet" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/logo192.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#0f0e1a" />
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/index.tsx"></script>
</body>

</html>
`;
};

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const language of SUPPORTED_LANGUAGES) {
  for (const pathname of Object.keys(seoData.routeKeyByPath)) {
    const filename = buildOutputFilename(language, pathname);
    fs.writeFileSync(
      path.join(outputDir, filename),
      renderHtml(language, pathname),
      "utf8"
    );
  }
}
