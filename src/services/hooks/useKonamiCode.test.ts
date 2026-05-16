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

function pressKeys(keys: string[]) {
  act(() => {
    keys.forEach((key) => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key }));
    });
  });
}

describe("useKonamiCode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("evaluates the target URL when the full sequence is entered", () => {
    const urlMock = vi.fn(function (this: URL, input: string, base?: string) {
      return {
        protocol: "javascript:",
        toString: () => String(input),
      } as unknown as URL;
    });
    vi.stubGlobal("URL", urlMock as unknown as typeof URL);
    renderHook(() => useKonamiCode("/secret"));

    pressKeys(KONAMI_SEQUENCE);

    expect(urlMock).toHaveBeenCalledWith("/secret", window.location.origin);
  });

  it("accepts uppercase letters in the sequence", () => {
    const urlMock = vi.fn(function (this: URL, input: string, base?: string) {
      return {
        protocol: "javascript:",
        toString: () => String(input),
      } as unknown as URL;
    });
    vi.stubGlobal("URL", urlMock as unknown as typeof URL);
    renderHook(() => useKonamiCode("/secret"));

    pressKeys([...KONAMI_SEQUENCE.slice(0, 8), "B", "A"]);

    expect(urlMock).toHaveBeenCalledWith("/secret", window.location.origin);
  });

  it("keeps sequence progress when targetUrl changes mid-sequence", () => {
    const urlMock = vi.fn(function (this: URL, input: string, base?: string) {
      return {
        protocol: "javascript:",
        toString: () => String(input),
      } as unknown as URL;
    });
    vi.stubGlobal("URL", urlMock as unknown as typeof URL);
    const { rerender } = renderHook(({ targetUrl }) => useKonamiCode(targetUrl), {
      initialProps: { targetUrl: "/first" },
    });

    pressKeys(KONAMI_SEQUENCE.slice(0, 5));
    rerender({ targetUrl: "/second" });
    pressKeys(KONAMI_SEQUENCE.slice(5));

    expect(urlMock).toHaveBeenCalledWith("/second", window.location.origin);
  });
});
