import { useEffect, useRef } from "react";

const KONAMI: ReadonlyArray<string> = [
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

/**
 * Easter egg: ↑↑↓↓←→←→BA redirects to `targetUrl`.
 *
 * No visual indicator — the user must guess it or discover it by chance.
 * Works on desktop only (physical keyboard required).
 */
export function useKonamiCode(targetUrl: string): void {
  const bufferRef = useRef<string[]>([]);
  const targetUrlRef = useRef(targetUrl);

  useEffect(() => {
    targetUrlRef.current = targetUrl;
  }, [targetUrl]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      // Normalize: arrow keys keep their full names, letters are lowercased.
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const buffer = bufferRef.current;
      buffer.push(key);
      if (buffer.length > KONAMI.length) buffer.shift();
      if (
        buffer.length === KONAMI.length &&
        buffer.every((k, i) => k === KONAMI[i])
      ) {
        bufferRef.current = [];
        try {
          const parsedUrl = new URL(targetUrlRef.current, window.location.origin);
          if (
            parsedUrl.protocol === "http:" ||
            parsedUrl.protocol === "https:"
          ) {
            window.location.assign(parsedUrl.toString());
          }
        } catch {
          // Ignore invalid URLs.
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
}
