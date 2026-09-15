import { describe, it, expect } from "vitest";

import {
  formatImageCount,
  formatPreviewCount,
  formatProjectsCount,
  formatRemainingProjects,
  getInlineGalleryClassName,
  getItemImages,
  getSafeExternalUrl,
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
    expect(formatPreviewCount(4, 9, "fr")).toBe("Apercu de 4 sur 9");
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
