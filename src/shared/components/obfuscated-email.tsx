import { useCallback, useState, type KeyboardEvent, type MouseEvent } from "react";

/**
 * An e-mail link whose `mailto:` only exists once a visitor reaches for it.
 *
 * The address itself is assembled at runtime (see `@shared/constants/contact`),
 * which keeps it out of the served HTML and the JavaScript bundle. What remains
 * is the rendered DOM: a headless browser that executes our code and dumps the
 * page would still find `href="mailto:…"` sitting there, and collecting those
 * is a one-selector job.
 *
 * So the `href` is attached on the first hover, focus or touch — the gestures
 * that precede any real use of the link, and none of which a crawler that only
 * renders a page performs. Clicking without ever having hovered (a keyboard
 * "Enter", a synthetic click) still works: the handler opens the mail client
 * itself. The visitor cannot tell the difference; they hover, the link is a
 * link, right-click and "copy address" behave normally.
 */

export interface ObfuscatedEmailProps {
  /** The full address. Callers pass the assembled value, never a literal. */
  address: string;
  className?: string;
  /** What to show instead of the address itself. */
  label?: string;
}

export default function ObfuscatedEmail({
  address,
  className,
  label,
}: ObfuscatedEmailProps) {
  const [href, setHref] = useState<string | undefined>(undefined);

  const reveal = useCallback(() => {
    setHref(`mailto:${address}`);
  }, [address]);

  const openMailClient = useCallback(() => {
    window.location.href = `mailto:${address}`;
  }, [address]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // Once revealed this is an ordinary link; let the browser do its job so
      // modifier-clicks and context menus keep working.
      if (href) return;

      event.preventDefault();
      openMailClient();
    },
    [href, openMailClient],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      // An anchor without an href is not activated by the browser, so until it
      // is revealed the keyboard path has to be handled here.
      if (href || (event.key !== "Enter" && event.key !== " ")) return;

      event.preventDefault();
      openMailClient();
    },
    [href, openMailClient],
  );

  return (
    <a
      className={className}
      href={href}
      // Without an href an anchor is neither focusable nor announced as a
      // link, so both are restored explicitly for the pre-reveal state.
      role={href ? undefined : "link"}
      tabIndex={0}
      onFocus={reveal}
      onPointerEnter={reveal}
      onTouchStart={reveal}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {label ?? address}
    </a>
  );
}
