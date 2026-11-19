import React, { lazy, Suspense } from "react";

const Contact = lazy(() => import("@features/contact/components/contact-section"));

/**
 * The contact section, mounted once the reader is near it.
 *
 * It is the heaviest thing on any page that carries it: its own chunk is the
 * largest in the build, and the phone field's country list alone renders 218
 * options — 873 elements, roughly half the homepage's DOM — which are in the
 * document whether or not the selector has ever been opened. All of it sits
 * below a full page of content, so a visitor who never scrolls that far used
 * to pay for it anyway.
 *
 * The homepage already did this on phones and slow connections. Everything
 * else rendered it on load, including four pages that imported it statically
 * and so pulled the chunk into their own — which is also what stopped the
 * homepage's dynamic import from splitting it properly.
 *
 * Three ways in, so it is never missing when someone asks for it:
 *   - the sentinel comes within 600px of the viewport,
 *   - the URL already carries #contact,
 *   - the hash changes to #contact while the page is open.
 *
 * At build time it renders straight away, so the served HTML still carries the
 * address, the phone number, the form and the rest for anything reading the
 * page without running it. That test is `import.meta.env.SSR` and not the
 * absence of `window`: the prerenderer installs a JSDOM one before it imports
 * the bundle, so a `typeof window` check answers as if there were a viewport
 * and quietly drops the whole section out of every page.
 */
export default function DeferredContact() {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const [show, setShow] = React.useState(
    () =>
      import.meta.env.SSR ||
      typeof window === "undefined" ||
      window.location.hash === "#contact"
  );

  React.useEffect(() => {
    if (show) return undefined;

    const onHashChange = () => {
      if (window.location.hash === "#contact") setShow(true);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [show]);

  React.useEffect(() => {
    if (show) return undefined;

    const target = sentinelRef.current;
    if (!target || !("IntersectionObserver" in window)) {
      // Nothing to observe with: show it rather than hide it for good.
      setShow(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShow(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [show]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      {show && (
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      )}
    </>
  );
}
