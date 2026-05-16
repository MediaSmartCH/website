import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useKonamiCode } from "./useKonamiCode";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function enterKeys(keys: string[]) {
  keys.forEach((key) => {
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key }));
    });
  });
}

describe("useKonamiCode", () => {
  let assignSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    assignSpy = vi.fn();
    vi.stubGlobal("location", {
      origin: "http://localhost",
      assign: assignSpy,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("redirects to the provided HTTP(S) target URL after entering the sequence", () => {
    renderHook(() => useKonamiCode("/easter-egg"));

    enterKeys(KONAMI_SEQUENCE);

    expect(assignSpy).toHaveBeenCalledWith("http://localhost/easter-egg");
  });

  it("does not redirect when targetUrl uses a non-http(s) protocol", () => {
    renderHook(() => useKonamiCode("javascript:alert(1)"));

    enterKeys(KONAMI_SEQUENCE);

    expect(assignSpy).not.toHaveBeenCalled();
  });

  it("keeps in-progress sequence when targetUrl changes and uses the latest URL", () => {
    const { rerender } = renderHook(
      ({ targetUrl }) => useKonamiCode(targetUrl),
      { initialProps: { targetUrl: "/old-target" } }
    );

    enterKeys(KONAMI_SEQUENCE.slice(0, -1));
    rerender({ targetUrl: "/new-target" });
    enterKeys(["a"]);

    expect(assignSpy).toHaveBeenCalledWith("http://localhost/new-target");
  });
});
