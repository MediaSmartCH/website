/**
 * Guards the claims the structured data makes.
 *
 * Every one of them is checkable against something the site already says out
 * loud — the address on the legal-notice page, the cantons in the FAQ, the
 * profiles in the footer. Structured data that drifts from the visible page is
 * not a cosmetic problem: it is what search engines take manual action over.
 */

import { describe, expect, it } from "vitest";

import { AREAS_SERVED, OFFICE_ADDRESS, SOCIAL_LINKS } from "@shared/constants/contact";
import { registerLocale } from "@shared/i18n/registry";
import * as frMessages from "@shared/i18n/fr";
import { resolveRouteSeo } from "@shared/seo/route-meta";

registerLocale("fr", frMessages as never);

const graphOf = (pathname: string) => {
  const { structuredData } = resolveRouteSeo(pathname, "fr");
  return (structuredData?.["@graph"] ?? []) as Record<string, never>[];
};

const nodeOf = (pathname: string, type: string) =>
  graphOf(pathname).find((node) => node["@type"] === type);

describe("organization node", () => {
  const organization = nodeOf("/fr", "Organization") as Record<string, never>;

  it("carries the address the legal notice publishes", () => {
    expect(organization.address).toMatchObject({
      streetAddress: OFFICE_ADDRESS.street,
      postalCode: OFFICE_ADDRESS.postalCode,
      addressRegion: OFFICE_ADDRESS.region,
    });
  });

  it("names the country and every canton the FAQ names", () => {
    const names = (organization.areaServed as unknown as { name: string }[]).map(
      (area) => area.name
    );

    expect(names).toEqual([AREAS_SERVED.country, ...AREAS_SERVED.cantons]);
  });

  it("links only to profiles the footer already links to", () => {
    expect(organization.sameAs).toEqual(Object.values(SOCIAL_LINKS));
  });
});

describe("faq node", () => {
  it("quotes the questions the page actually renders", () => {
    const faq = nodeOf("/fr/web-development", "FAQPage") as Record<string, never>;
    const questions = (faq.mainEntity as unknown as { name: string }[]).map(
      (entry) => entry.name
    );

    expect(questions).toHaveLength(6);
    expect(questions[0]).toBe(frMessages.it.itFaq1.faqQuestion);
  });

  it("is absent from pages with no FAQ", () => {
    expect(nodeOf("/fr", "FAQPage")).toBeUndefined();
    expect(nodeOf("/fr/terms", "FAQPage")).toBeUndefined();
  });
});

describe("non-indexable pages", () => {
  it("publish no structured data at all", () => {
    expect(resolveRouteSeo("/fr/404", "fr").structuredData).toBeNull();
  });
});
