import { useEffect, useState } from "react";

/**
 * Tracks the current pathname from outside the router.
 *
 * ConstructionWrapper and the cookie banner both render above RouterProvider,
 * so `useLocation` is not available to them. They each patch the History API to
 * notice client-side navigation; this hook is that logic, written once.
 *
 * Patching is restored on unmount, and several mounted consumers chain
 * correctly because each wraps whatever `pushState` it found.
 *
 * Prefer react-router's `useLocation` anywhere inside the router.
 */
export function useLocationPath(fallback = "/"): string {
  const [path, setPath] = useState(() =>
    typeof window !== "undefined" && window.location ? window.location.pathname : fallback
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncPath = () => setPath(window.location.pathname);

    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    window.history.pushState = function (...args) {
      originalPushState(...args);
      syncPath();
    };
    window.history.replaceState = function (...args) {
      originalReplaceState(...args);
      syncPath();
    };

    window.addEventListener("popstate", syncPath);
    window.addEventListener("hashchange", syncPath);
    syncPath();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", syncPath);
      window.removeEventListener("hashchange", syncPath);
    };
  }, []);

  return path;
}
