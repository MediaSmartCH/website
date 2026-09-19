import { describe, it, expect } from "vitest";

import {
  formatImageCount,
  formatPreviewCount,
  formatProjectsCount,
  formatRemainingProjects,
  getInlineGalleryClassName,
  getItemCategory,
  getItemImages,
  getPreviewDimClass,
  groupItemsByCategory,
  portfolioCategoryKey,
  sortItemsForPreview,
  getSafeExternalUrl,
  PORTFOLIO_CATEGORY_ORDER,
  resolveLocalizedField,
  resolveScreenshotUrl,
  truncateText,
} from "./portfolio-helpers";

// These rules used to be buried in a 656-line component. getSafeExternalUrl in
// particular guards every outbound link in the gallery against a hostile URL in
// the portfolio JSON, so it is worth pinning properly.

describe("getSafeExternalUrl", () => {
  it("accepts http and https", () => {
    expect(getSafeExternalUrl("https://example.com/")).toBe("https://example.com/");
    expect(getSafeExternalUrl("http://example.com/")).toBe("http://example.com/");
  });

  const refused = [
    ["javascript: URLs", "javascript:alert(1)"],
    ["data: URLs", "data:text/html,<script>alert(1)</script>"],
    ["file: URLs", "file:///etc/passwd"],
    ["a relative path", "/somewhere"],
    ["nonsense", "not a url"],
  ];

  it.each(refused)("refuses %s", (_label, value) => {
    expect(getSafeExternalUrl(value)).toBeNull();
  });

  it("returns null for a missing value", () => {
    expect(getSafeExternalUrl(undefined)).toBeNull();
    expect(getSafeExternalUrl("")).toBeNull();
  });
});

describe("resolveScreenshotUrl", () => {
  it("passes an absolute URL through the safety check", () => {
    expect(resolveScreenshotUrl("https://cdn.example/a.png")).toBe("https://cdn.example/a.png");
    expect(resolveScreenshotUrl("javascript:alert(1)")).toBeNull();
  });

  it("resolves a relative path against the item's origin", () => {
    expect(resolveScreenshotUrl("shot.png", "https://example.com/some/page")).toBe(
      "https://example.com/shot.png"
    );
    expect(resolveScreenshotUrl("/shot.png", "https://example.com/")).toBe(
      "https://example.com/shot.png"
    );
  });

  it("returns null when there is no usable base URL", () => {
    expect(resolveScreenshotUrl("shot.png")).toBeNull();
    expect(resolveScreenshotUrl("shot.png", "not a url")).toBeNull();
  });
});

describe("getItemImages", () => {
  it("prefers the generated screenshot paths, named by item id and index", () => {
    expect(
      getItemImages({
        id: "demo",
        title: "t",
        description: "d",
        screenshotUrls: ["https://a", "https://b"],
        images: ["/ignored.png"],
      })
    ).toEqual(["/screenshots/demo-0.jpg", "/screenshots/demo-1.jpg"]);
  });

  it("falls back to the declared images, then to nothing", () => {
    const base = { id: "x", title: "t", description: "d" };
    expect(getItemImages({ ...base, images: ["/a.png"] })).toEqual(["/a.png"]);
    expect(getItemImages(base)).toEqual([]);
  });

  it("resolves the dark twin only for items that declare one", () => {
    const withDark = {
      id: "demo",
      title: "t",
      description: "d",
      hasDarkPreview: true,
      screenshotUrls: ["https://a"],
    };
    expect(getItemImages(withDark, { dark: true })).toEqual([
      "/screenshots/demo-0-dark.jpg",
    ]);
    expect(getItemImages(withDark)).toEqual(["/screenshots/demo-0.jpg"]);

    // No dark twin captured: the light preview is what the visitor lands on.
    expect(
      getItemImages(
        { id: "x", title: "t", description: "d", images: ["/a.png"] },
        { dark: true }
      )
    ).toEqual(["/a.png"]);
  });

  it("marks the dark twin before the extension for declared images", () => {
    expect(
      getItemImages(
        {
          id: "x",
          title: "t",
          description: "d",
          hasDarkPreview: true,
          images: ["/portfolio/x-0.jpg"],
        },
        { dark: true }
      )
    ).toEqual(["/portfolio/x-0-dark.jpg"]);
  });
});

describe("getPreviewDimClass", () => {
  const base = { id: "x", title: "t", description: "d" };

  it("dims a light-only preview in the dark theme only", () => {
    expect(getPreviewDimClass(base, false)).toBe("brightness-90");
    expect(getPreviewDimClass(base, true)).toBe("");
  });

  it("leaves a preview that follows the theme alone", () => {
    expect(getPreviewDimClass({ ...base, hasDarkPreview: true }, false)).toBe("");
  });

  it("treats a missing item as light-only", () => {
    expect(getPreviewDimClass(undefined, false)).toBe("brightness-90");
    expect(getPreviewDimClass(undefined, true)).toBe("");
  });
});

describe("resolveLocalizedField", () => {
  it("returns a plain string untouched", () => {
    expect(resolveLocalizedField("hello", "fr")).toBe("hello");
  });

  it("picks the requested language", () => {
    expect(resolveLocalizedField({ fr: "bonjour", en: "hello" }, "en")).toBe("hello");
  });

  it("falls back to French, then English, then an empty string", () => {
    expect(resolveLocalizedField({ fr: "bonjour" }, "de")).toBe("bonjour");
    expect(resolveLocalizedField({ en: "hello" }, "de")).toBe("hello");
    expect(resolveLocalizedField({}, "de")).toBe("");
  });
});

describe("truncateText", () => {
  it("leaves a short value alone", () => {
    expect(truncateText("short", 10)).toBe("short");
    expect(truncateText("exactly10!", 10)).toBe("exactly10!");
  });

  it("cuts at the limit and trims before the ellipsis", () => {
    expect(truncateText("abcdefghijk", 5)).toBe("abcde...");
    expect(truncateText("abcd efghij", 5)).toBe("abcd...");
  });
});

describe("counter formatting", () => {
  it("agrees on singular and plural in both languages", () => {
    expect(formatProjectsCount(1, "fr")).toBe("1 projet");
    expect(formatProjectsCount(2, "fr")).toBe("2 projets");
    expect(formatProjectsCount(1, "en")).toBe("1 project");
    expect(formatProjectsCount(2, "en")).toBe("2 projects");
    expect(formatImageCount(1, "en")).toBe("1 preview");
    expect(formatImageCount(3, "en")).toBe("3 previews");
    expect(formatRemainingProjects(1, "en")).toBe("1 more project");
    expect(formatRemainingProjects(4, "en")).toBe("4 more projects");
  });

  it("falls back to English for an unknown language", () => {
    expect(formatProjectsCount(2, "de")).toBe("2 projects");
  });

  it("reports how many previews of the total are shown", () => {
    expect(formatPreviewCount(4, 9, "en")).toBe("Showing 4 of 9");
    expect(formatPreviewCount(4, 9, "fr")).toBe("Aperçu de 4 sur 9");
  });
});

describe("getInlineGalleryClassName", () => {
  it("widens the grid as the image count grows", () => {
    expect(getInlineGalleryClassName(0)).toBe("grid grid-cols-1 gap-3");
    expect(getInlineGalleryClassName(1)).toBe("grid grid-cols-1 gap-3");
    expect(getInlineGalleryClassName(2)).toBe("grid grid-cols-1 gap-3 sm:grid-cols-2");
    expect(getInlineGalleryClassName(5)).toBe(
      "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    );
  });
});


// Gallery sections: the JSON drives which group an entry lands in, so an
// unknown or missing value must not silently drop a project from the page.

const item = (id: string, category?: string) =>
  ({ id, title: id, description: id, ...(category ? { category } : {}) }) as const;

describe("getItemCategory", () => {
  it("reads a known category", () => {
    expect(getItemCategory(item("a", "saas"))).toBe("saas");
    expect(getItemCategory(item("b", "free"))).toBe("free");
  });

  it("falls back to client for a missing or unknown value", () => {
    expect(getItemCategory(item("c"))).toBe("client");
    expect(getItemCategory(item("d", "not-a-category"))).toBe("client");
  });
});

describe("groupItemsByCategory", () => {
  it("returns the sections in display order", () => {
    const groups = groupItemsByCategory([
      item("free-1", "free"),
      item("saas-1", "saas"),
      item("client-1", "client"),
      item("wip-1", "in-progress"),
    ]);

    expect(groups.map((group) => group.category)).toEqual(PORTFOLIO_CATEGORY_ORDER);
  });

  it("drops empty sections", () => {
    const groups = groupItemsByCategory([item("saas-1", "saas")]);

    expect(groups).toHaveLength(1);
    expect(groups[0].category).toBe("saas");
  });

  it("keeps every item exactly once", () => {
    const items = [item("a", "saas"), item("b"), item("c", "free"), item("d", "saas")];
    const grouped = groupItemsByCategory(items).flatMap((group) => group.items);

    expect(grouped.map((entry) => entry.id).sort()).toEqual(["a", "b", "c", "d"]);
  });
});

describe("sortItemsForPreview", () => {
  it("follows the section order and keeps the original order inside a category", () => {
    const preview = sortItemsForPreview([
      item("client-1", "client"),
      item("free-1", "free"),
      item("saas-1", "saas"),
      item("client-2", "client"),
      item("saas-2", "saas"),
    ]);

    expect(preview.map((entry) => entry.id)).toEqual([
      "saas-1",
      "saas-2",
      "free-1",
      "client-1",
      "client-2",
    ]);
  });

  it("treats an entry with no category as client work", () => {
    const preview = sortItemsForPreview([item("legacy"), item("saas-1", "saas")]);

    expect(preview.map((entry) => entry.id)).toEqual(["saas-1", "legacy"]);
  });

  it("does not mutate its input", () => {
    const items = [item("client-1", "client"), item("saas-1", "saas")];
    sortItemsForPreview(items);

    expect(items.map((entry) => entry.id)).toEqual(["client-1", "saas-1"]);
  });
});

describe("portfolioCategoryKey", () => {
  it("builds the i18n key prefix for each section", () => {
    expect(portfolioCategoryKey("client")).toBe("portfolioCategoryClient");
    expect(portfolioCategoryKey("saas")).toBe("portfolioCategorySaas");
    expect(portfolioCategoryKey("free")).toBe("portfolioCategoryFree");
  });
});
