import React from "react";

/**
 * Pointer handling for the question/quote toggle.
 *
 * The control answers to both a plain click and a horizontal drag, which is the
 * whole reason this is not a pair of radio buttons. The drag has to survive the
 * cursor leaving the element, and the click that the browser fires at the end of
 * a drag has to be swallowed — otherwise finishing a drag on the far half would
 * immediately toggle back.
 *
 * Owns gesture state only. The selected intent stays with the caller.
 */

export type ContactIntent = "question" | "quote";

/** Pointer travel, in px, before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD_PX = 4;

interface UseIntentToggleOptions {
  intent: ContactIntent;
  onIntentChange: (intent: ContactIntent) => void;
}

export function useIntentToggle({ intent, onIntentChange }: UseIntentToggleOptions) {
  const toggleRef = React.useRef<HTMLDivElement>(null);
  const suppressClickRef = React.useRef(false);
  const dragState = React.useRef({
    pointerId: null as number | null,
    startX: 0,
    hasMoved: false,
  });

  /** Intent the pointer is currently over, by halves of the track. */
  const [dragIntent, setDragIntent] = React.useState<ContactIntent | null>(null);

  const intentAt = (clientX: number): ContactIntent => {
    const rect = toggleRef.current?.getBoundingClientRect();
    if (!rect) return intent;
    return clientX < rect.left + rect.width / 2 ? "question" : "quote";
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = { pointerId: event.pointerId, startX: event.clientX, hasMoved: false };
    setDragIntent(intent);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== event.pointerId) return;

    if (Math.abs(event.clientX - dragState.current.startX) > DRAG_THRESHOLD_PX) {
      // Capture on the first real move so the drag survives leaving the element.
      if (!dragState.current.hasMoved) event.currentTarget.setPointerCapture(event.pointerId);
      dragState.current.hasMoved = true;
    }

    if (dragState.current.hasMoved) setDragIntent(intentAt(event.clientX));
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (dragState.current.hasMoved && dragIntent !== null) {
      // Swallow the click the browser fires right after the drag.
      suppressClickRef.current = true;
      onIntentChange(dragIntent);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    dragState.current.pointerId = null;
    dragState.current.hasMoved = false;
    setDragIntent(null);
  };

  /** True when the click that just fired is the tail of a drag and must be ignored. */
  const shouldIgnoreClick = () => suppressClickRef.current;

  return {
    toggleRef,
    dragIntent,
    shouldIgnoreClick,
    handlers: { onPointerDown, onPointerMove, onPointerEnd },
  };
}
