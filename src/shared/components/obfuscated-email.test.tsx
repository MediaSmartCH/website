import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The component has to be invisible to the visitor and useless to a scraper.
// Both halves are checked here with the tool a harvester actually uses: the
// pattern it runs over whatever text it managed to extract.

// Deliberately free of palindromes: reversal cannot hide one, so a fixture
// like "ada@…" would fail the fragment assertion below for a reason that has
// nothing to do with the component. Real addresses here are not palindromes.
const ADDRESS = "contact@example.ch";

/** The same shape an address harvester looks for. */
const HARVESTER = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

let navigatedTo: string;
let originalLocation: Location;

/**
 * Renders with a fresh presence singleton.
 *
 * That flag lives at module scope and latches on first interaction, so without
 * resetting the registry every case after the first would start "revealed".
 */
async function renderFresh(props: Record<string, unknown> = {}) {
  vi.resetModules();
  const { default: ObfuscatedEmail } = await import("./obfuscated-email");
  return render(<ObfuscatedEmail address={ADDRESS} {...props} />);
}

/** What a person does within a second of the page appearing. */
function actLikeAHuman() {
  fireEvent.scroll(window);
}

beforeEach(() => {
  navigatedTo = "";
  originalLocation = window.location;
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      ...originalLocation,
      set href(value: string) {
        navigatedTo = value;
      },
      get href() {
        return navigatedTo;
      },
    },
  });
});

afterEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation,
  });
});

describe("before any human signal", () => {
  it("puts nothing address-shaped in the DOM", async () => {
    await renderFresh();

    expect(document.body.textContent).not.toMatch(HARVESTER);
    expect(document.body.textContent).not.toContain(ADDRESS);
  });

  it("carries no mailto: either", async () => {
    await renderFresh();

    expect(document.body.innerHTML).not.toContain("mailto:");
  });

  it("holds the address backwards, for CSS to put back in reading order", async () => {
    await renderFresh();

    const text = document.querySelector("a")?.textContent ?? "";

    expect([...text].reverse().join("")).toBe(ADDRESS);
  });

  it("leaves no searchable fragment of the domain or the local part", async () => {
    await renderFresh();

    const [local, domain] = ADDRESS.split("@");
    expect(document.body.textContent).not.toContain(domain);
    expect(document.body.textContent).not.toContain(local);
  });
});

describe("after a human signal", () => {
  it("becomes ordinary text a person can select and copy", async () => {
    await renderFresh();
    actLikeAHuman();

    expect(await screen.findByText(ADDRESS)).toBeInTheDocument();
    expect(document.querySelector("a")?.textContent).toBe(ADDRESS);
  });

  it("still withholds the mailto: until the link itself is reached for", async () => {
    await renderFresh();
    actLikeAHuman();

    expect(document.body.innerHTML).not.toContain("mailto:");

    await userEvent.hover(screen.getByRole("link"));

    expect(screen.getByRole("link")).toHaveAttribute("href", `mailto:${ADDRESS}`);
  });

  it("reveals on keyboard focus, for keyboard and screen-reader users", async () => {
    await renderFresh();

    await userEvent.tab();

    expect(screen.getByRole("link")).toHaveAttribute("href", `mailto:${ADDRESS}`);
    expect(screen.getByRole("link").textContent).toBe(ADDRESS);
  });
});

describe("activation", () => {
  it("opens the mail client on a click that never hovered", async () => {
    await renderFresh();

    // A bare click, with none of the pointer events a real cursor would have
    // produced first — the shape a synthetic click takes.
    fireEvent.click(screen.getByRole("link"));

    expect(navigatedTo).toBe(`mailto:${ADDRESS}`);
  });

  it("opens the mail client on Enter before any reveal", async () => {
    await renderFresh();

    fireEvent.keyDown(screen.getByRole("link"), { key: "Enter" });

    expect(navigatedTo).toBe(`mailto:${ADDRESS}`);
  });
});

describe("with a label instead of the address", () => {
  it("never renders the address at all, so there is nothing to scramble", async () => {
    await renderFresh({ label: "Write to us" });

    expect(screen.getByRole("link", { name: "Write to us" })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(HARVESTER);
  });
});
