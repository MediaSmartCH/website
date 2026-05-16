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

function makeURLConstructorMock() {
  return vi.fn(function (this: URL, input: string, base?: string) {
    const resolvedInput = String(input);
    const protocol = resolvedInput.match(/^[a-zA-Z][a-zA-Z\d+.-]*:/)?.[0] ?? "https:";
    return {
      protocol,
      toString: () => resolvedInput,
    } as unknown as URL;
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

  it("does not navigate for unsafe protocols", () => {
    const initialHref = window.location.href;
    renderHook(() => useKonamiCode("javascript:alert(1)"));

    pressKeys(KONAMI_SEQUENCE);

    expect(window.location.href).toBe(initialHref);
  });

  it("accepts uppercase letters in the sequence", () => {
    const initialHref = window.location.href;
    const URLConstructorMock = makeURLConstructorMock();
    vi.stubGlobal("URL", URLConstructorMock as unknown as typeof URL);
    renderHook(() => useKonamiCode("javascript:secret"));

    pressKeys([...KONAMI_SEQUENCE.slice(0, 8), "B", "A"]);

    expect(URLConstructorMock).toHaveBeenCalledWith(
      "javascript:secret",
      window.location.origin
    );
    expect(window.location.href).toBe(initialHref);
  });

  it("keeps sequence progress when targetUrl changes mid-sequence", () => {
    const initialHref = window.location.href;
    const URLConstructorMock = makeURLConstructorMock();
    vi.stubGlobal("URL", URLConstructorMock as unknown as typeof URL);
    const { rerender } = renderHook(({ targetUrl }) => useKonamiCode(targetUrl), {
      initialProps: { targetUrl: "javascript:first" },
    });

    pressKeys(KONAMI_SEQUENCE.slice(0, 5));
    rerender({ targetUrl: "javascript:second" });
    pressKeys(KONAMI_SEQUENCE.slice(5));

    expect(URLConstructorMock).toHaveBeenCalledWith(
      "javascript:second",
      window.location.origin
    );
    expect(window.location.href).toBe(initialHref);
  });
});
