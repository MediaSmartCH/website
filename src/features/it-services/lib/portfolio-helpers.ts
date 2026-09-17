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

/**
 * How a portfolio entry is grouped in the gallery.
 *
 * - "client"  — sites and applications built for a client
 * - "saas"    — MediaSmart's own products, sold and hosted by us
 * - "free"    — tools we publish freely (no account, no invoicing)
 *
 * Entries without an explicit category fall back to "client", which keeps
 * older JSON rows valid.
 */
export type PortfolioCategory = "client" | "saas" | "free";

/** Display order of the gallery sections. */
export const PORTFOLIO_CATEGORY_ORDER: PortfolioCategory[] = ["saas", "free", "client"];

const KNOWN_CATEGORIES = new Set<string>(PORTFOLIO_CATEGORY_ORDER);
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
  /** Gallery section this entry belongs to. Defaults to "client". */
  category?: string;
  /**
   * ISO date the product opens to the public. Present only while a product is
   * still in early access; the UI shows a countdown until then.
   */
  launchDate?: string;
}

/** A gallery section: one category and the entries that belong to it. */
export interface PortfolioGroup {
  category: PortfolioCategory;
  items: PortfolioItem[];
}

export interface PortfolioData {
  items: PortfolioItem[];
}

/**
 * Builds the i18n key prefix for a category, e.g. "client" ->
 * "portfolioCategoryClient", read as `it.portfolioCategoryClientLabel`.
 */
export function portfolioCategoryKey(category: PortfolioCategory): string {
  return `portfolioCategory${category.charAt(0).toUpperCase()}${category.slice(1)}`;
}

/** Reads an item's category, falling back to "client" for unknown values. */
export function getItemCategory(item: PortfolioItem): PortfolioCategory {
  return KNOWN_CATEGORIES.has(item.category ?? "")
    ? (item.category as PortfolioCategory)
    : "client";
}

/**
 * Splits the portfolio into ordered sections, dropping the ones with no entry
 * so the gallery never renders an empty heading.
 */
export function groupItemsByCategory(items: PortfolioItem[]): PortfolioGroup[] {
  return PORTFOLIO_CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => getItemCategory(item) === category),
  })).filter((group) => group.items.length > 0);
}

/**
 * Picks what the preview strip shows.
 *
 * Client work only, while the full gallery keeps the product-first order. Our
 * own products and free tools already have their own section further down the
 * same page, with a fuller pitch and their own buttons; showing them here too
 * meant a visitor met the same four cards twice in one scroll. Client
 * references are the one thing the strip can show that is not repeated
 * anywhere else.
 *
 * Falls back to the full list when there is no client entry, so the strip
 * never renders empty.
 */
export function sortItemsForPreview(items: PortfolioItem[]): PortfolioItem[] {
  const clientWork = items.filter((item) => getItemCategory(item) === "client");

  return clientWork.length > 0 ? clientWork : [...items];
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
    return `${count} ${count > 1 ? "aperçus" : "aperçu"}`;
  }

  return `${count} ${count > 1 ? "previews" : "preview"}`;
}

export function formatPreviewCount(
  shownCount: number,
  totalCount: number,
  language: string
): string {
  if (language === "fr") {
    return `Aperçu de ${shownCount} sur ${totalCount}`;
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
