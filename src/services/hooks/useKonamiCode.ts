import { useEffect } from "react";

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
 * Easter egg : ↑↑↓↓←→←→BA redirige vers `targetUrl`.
 *
 * Aucun indicateur visuel — l'utilisateur doit deviner ou le découvrir par hasard.
 * Marche sur desktop uniquement (clavier physique requis).
 */
export function useKonamiCode(targetUrl: string): void {
  useEffect(() => {
    let buffer: string[] = [];

    const handleKey = (event: KeyboardEvent) => {
      // Normalise : les flèches gardent leur nom complet, les lettres → lowercase.
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      buffer.push(key);
      if (buffer.length > KONAMI.length) buffer.shift();
      if (
        buffer.length === KONAMI.length &&
        buffer.every((k, i) => k === KONAMI[i])
      ) {
        buffer = [];
        window.location.href = targetUrl;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [targetUrl]);
}
