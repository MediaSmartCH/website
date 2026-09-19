/**
 * The full-screen image viewer.
 *
 * Lifted, unchanged in appearance, out of `portfolio-gallery.tsx`, which had
 * grown it inline: same 85% black backdrop and blur, same 2xl radius, same
 * drop shadow, same round close button top-right, same "click the backdrop to
 * dismiss" rule, same portal, same z-index above `ModalShell`. The project
 * pages open the same viewer the portfolio has always opened rather than a
 * fifth popup of their own.
 *
 * What it gained in becoming shared, because a project page shows several
 * screenshots rather than one:
 *
 *   - previous / next, by button and by arrow key, with a "2 / 4" counter;
 *   - its own Escape handling, so the caller no longer has to wire it;
 *   - focus moved into the dialog on open and returned to whatever opened it
 *     on close, and Tab kept inside while it is up;
 *   - the body scroll lock the portfolio modal already used.
 *
 * Navigation is hidden for a single image, so the one-image case looks exactly
 * as it did before.
 */

import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { useModalScrollLock } from "@features/it-services/hooks/use-modal-scroll-lock";
import type { LightboxImage } from "@features/it-services/lib/portfolio-helpers";

export interface ImageLightboxProps {
  images: LightboxImage[];
  /** Index into `images`; the caller owns it so the state survives a re-render. */
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
}

export default function ImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
  closeLabel,
  previousLabel,
  nextLabel,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  // Whatever had focus when this opened, so it can be handed back on close.
  const openerRef = useRef<HTMLElement | null>(null);

  const hasMany = images.length > 1;
  const image = images[index];

  useModalScrollLock(true);

  const goTo = useCallback(
    (next: number) => onIndexChange((next + images.length) % images.length),
    [images.length, onIndexChange]
  );

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      // Returning focus matters more than it looks: without it the next Tab
      // starts from the top of the document, and a keyboard visitor loses the
      // screenshot they were on.
      openerRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // stopImmediatePropagation, not stopPropagation: the portfolio gallery
        // listens for Escape on `window` too, and stopPropagation does not
        // stop other listeners bound to the same target — so one press closed
        // the viewer and the modal underneath it at once.
        event.stopImmediatePropagation();
        onClose();
        return;
      }

      if (hasMany && event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
        return;
      }

      if (hasMany && event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
        return;
      }

      if (event.key !== "Tab") return;

      // Keep Tab inside the dialog.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [goTo, hasMany, index, onClose]);

  if (typeof document === "undefined" || !image) return null;

  const navButtonClass =
    "absolute top-1/2 z-[100001] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={(event) => {
        // Backdrop click closes; clicks bubbled from the image or the buttons
        // do not, thanks to the target === currentTarget check. The same
        // pattern the booking modal and the portfolio lightbox already use.
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute top-4 right-4 z-[100001] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label={previousLabel}
            className={`${navButtonClass} left-2 sm:left-6`}
          >
            <ChevronLeft size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label={nextLabel}
            className={`${navButtonClass} right-2 sm:right-6`}
          >
            <ChevronRight size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </>
      )}

      <img
        src={image.src}
        alt={image.alt}
        className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
      />

      {hasMany && (
        <p
          className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 font-poppins text-[13px] text-white"
          aria-live="polite"
        >
          {index + 1} / {images.length}
        </p>
      )}
    </div>,
    document.body
  );
}
