import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * In dark mode the header, the backdrop behind it and the wave behind a section
 * are meant to be one continuous surface. They are declared in three different
 * places and three different languages — a Tailwind class, an SVG data URI in
 * CSS, and an SVG gradient stop in TSX — so nothing but a test keeps them in
 * step.
 *
 * They drifted twice: the wave sat at 0.92 against the backdrop's 0.90, and
 * once aligned, both still landed two points per channel off the header,
 * because an alpha composites over the page background while the header paints
 * opaque. Hence the two assertions: same colour, and no alpha.
 */

const read = (path: string) => readFileSync(resolve(__dirname, "../..", path), "utf8");

/** The one dark surface colour, as declared in the design tokens. */
function darkSurfaceToken(): string {
  const tokens = read("styles/tokens.css");
  const match = tokens.match(/--palette-night-900:\s*(#[0-9a-fA-F]{6})/);
  if (!match) throw new Error("--palette-night-900 not found in tokens.css");
  return match[1].toLowerCase();
}

describe("dark surface colour", () => {
  const token = darkSurfaceToken();

  it("is what the header paints with", () => {
    const navbar = read("shared/components/navbar.tsx");
    expect(navbar.toLowerCase()).toContain(`bg-[${token}]`);
  });

  it("is what the backdrop behind the header paints with, at full opacity", () => {
    const css = read("styles/sections.css");
    const rule = css.slice(css.indexOf(".hero-bg-dark"));
    const fill = rule.match(/fill='%23([0-9a-fA-F]{6})'/);
    const opacity = rule.match(/fill-opacity='([0-9.]+)'/);

    expect(`#${fill?.[1]}`.toLowerCase()).toBe(token);
    // An alpha here composites over the page background and misses the header.
    expect(Number(opacity?.[1])).toBe(1);
  });

  it("is what the wave's first stop paints with, at full opacity", () => {
    const wave = read("shared/components/wave-backdrop.tsx");
    const firstStop = wave.slice(wave.indexOf('offset="0%"'));
    const colour = firstStop.match(/stopColor=\{isLight \? "[^"]+" : "(#[0-9a-fA-F]{6})"\}/);
    const opacity = firstStop.match(/stopOpacity=\{isLight \? "[^"]+" : "([0-9.]+)"\}/);

    expect(colour?.[1].toLowerCase()).toBe(token);
    expect(Number(opacity?.[1])).toBe(1);
  });
});
