/**
 * Pure helpers for the IT portfolio gallery: shaping the JSON entries, keeping
 * outbound links safe, and formatting the counters.
 *
 * No React and no I/O, so every rule here is directly testable.
 *
 * NOTE: the format* functions carry their French and English wording inline
 * instead of going through the i18n bundles. That predates this refactoring and
 * is left as-is — changing it would move user-visible copy.
 */

export type SupportedLanguage = "fr" | "en";
export type LocalizedField = string | Partial<Record<SupportedLanguage, string>>;

export interface PortfolioItem {
  id: string;
  title: LocalizedField;
  description: LocalizedField;
  url?: string;
  images?: string[];
  screenshotUrls?: string[];
  /**
   * Optional short note shown as a non-clickable badge when the project is
   * not freely accessible (private / bespoke / restricted-access). Renders
   * either alongside or instead of the Visit Site button depending on
   * whether a public URL is also provided.
   */
  accessNote?: LocalizedField;
}

export interface PortfolioData {
  items: PortfolioItem[];
}

export const PREVIEW_LIMIT = 4;
export const SCROLLABLE_GALLERY_THRESHOLD = 3;

// Returns the resolved image paths for a portfolio item, preferring generated screenshot paths
export function getItemImages(item: PortfolioItem): string[] {
  if (item.screenshotUrls && item.screenshotUrls.length > 0) {
    return item.screenshotUrls.map((_, i) => `/screenshots/${item.id}-${i}.jpg`);
  }

  return item.images ?? [];
}

/** Accepts a URL only when it is http(s), so a javascript: entry cannot reach an href. */
export function getSafeExternalUrl(value?: string): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

// Resolves a relative screenshot URL against the item's base URL
export function resolveScreenshotUrl(
  screenshotUrl: string,
  baseUrl?: string
): string | null {
  if (screenshotUrl.startsWith("http://") || screenshotUrl.startsWith("https://")) {
    return getSafeExternalUrl(screenshotUrl);
  }

  try {
    const base = new URL(baseUrl ?? "");
    const path = screenshotUrl.startsWith("/") ? screenshotUrl : `/${screenshotUrl}`;
    return getSafeExternalUrl(`${base.origin}${path}`);
  } catch {
    return null;
  }
}

// Returns the string value for the current language, falling back to fr then en
export function resolveLocalizedField(
  field: LocalizedField,
  language: string
): string {
  if (typeof field === "string") {
    return field;
  }

  return field[language as SupportedLanguage] ?? field.fr ?? field.en ?? "";
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

export function formatProjectsCount(count: number, language: string): string {
  if (language === "fr") {
    return `${count} ${count > 1 ? "projets" : "projet"}`;
  }

  return `${count} ${count > 1 ? "projects" : "project"}`;
}

export function formatImageCount(count: number, language: string): string {
  if (language === "fr") {
    return `${count} ${count > 1 ? "apercus" : "apercu"}`;
  }

  return `${count} ${count > 1 ? "previews" : "preview"}`;
}

export function formatPreviewCount(
  shownCount: number,
  totalCount: number,
  language: string
): string {
  if (language === "fr") {
    return `Apercu de ${shownCount} sur ${totalCount}`;
  }

  return `Showing ${shownCount} of ${totalCount}`;
}

export function formatRemainingProjects(count: number, language: string): string {
  if (language === "fr") {
    return `${count} ${count > 1 ? "autres projets" : "autre projet"}`;
  }

  return `${count} ${count > 1 ? "more projects" : "more project"}`;
}

export function formatRemainingProjectsCta(count: number, language: string): string {
  if (language === "fr") {
    return `Voir les ${count} autres`;
  }

  return `View ${count} more`;
}

// Returns Tailwind grid class based on how many images a card holds
export function getInlineGalleryClassName(imageCount: number): string {
  if (imageCount <= 1) {
    return "grid grid-cols-1 gap-3";
  }

  if (imageCount === 2) {
    return "grid grid-cols-1 gap-3 sm:grid-cols-2";
  }

  return "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";
}

export interface LightboxImage {
  src: string;
  alt: string;
}
