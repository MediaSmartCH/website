import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import ObfuscatedEmail from "./obfuscated-email";

// The component has to be invisible to the visitor and awkward for a crawler:
// the address reads and behaves like a normal mail link, but the `mailto:` is
// only in the DOM once someone has reached for it.

const ADDRESS = "ada@example.ch";

let navigatedTo: string;
let originalLocation: Location;

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

describe("ObfuscatedEmail", () => {
  it("shows the address and carries no mailto until the visitor reaches for it", () => {
    render(<ObfuscatedEmail address={ADDRESS} />);

    const link = screen.getByRole("link", { name: ADDRESS });

    expect(link).not.toHaveAttribute("href");
    expect(document.body.innerHTML).not.toContain("mailto:");
  });

  it("attaches the real href on hover", async () => {
    const user = userEvent.setup();
    render(<ObfuscatedEmail address={ADDRESS} />);

    await user.hover(screen.getByRole("link", { name: ADDRESS }));

    expect(screen.getByRole("link", { name: ADDRESS })).toHaveAttribute(
      "href",
      `mailto:${ADDRESS}`,
    );
  });

  it("attaches the real href on keyboard focus", async () => {
    const user = userEvent.setup();
    render(<ObfuscatedEmail address={ADDRESS} />);

    await user.tab();

    expect(screen.getByRole("link", { name: ADDRESS })).toHaveAttribute(
      "href",
      `mailto:${ADDRESS}`,
    );
  });

  it("opens the mail client on a click that never hovered", () => {
    render(<ObfuscatedEmail address={ADDRESS} />);

    // A bare click, with none of the pointer events a real cursor would have
    // produced first — the shape a synthetic click takes.
    fireEvent.click(screen.getByRole("link", { name: ADDRESS }));

    expect(navigatedTo).toBe(`mailto:${ADDRESS}`);
  });

  it("opens the mail client on Enter before any reveal", () => {
    render(<ObfuscatedEmail address={ADDRESS} />);

    fireEvent.keyDown(screen.getByRole("link", { name: ADDRESS }), { key: "Enter" });

    expect(navigatedTo).toBe(`mailto:${ADDRESS}`);
  });

  it("renders a custom label instead of the address when asked", () => {
    render(<ObfuscatedEmail address={ADDRESS} label="Write to us" />);

    expect(screen.getByRole("link", { name: "Write to us" })).toBeInTheDocument();
    expect(screen.queryByText(ADDRESS)).not.toBeInTheDocument();
  });
});
