import { useCallback, useState, type KeyboardEvent, type MouseEvent } from "react";

import { useHumanPresence } from "@shared/hooks/use-human-presence";

/**
 * An e-mail address that reads normally and resists being collected.
 *
 * Three things have to hold at once, and the first two fight the third:
 *
 *   1. a visitor sees the real address, always;
 *   2. they can select and copy it, and the link opens their mail client;
 *   3. an automated reader gets nothing usable.
 *
 * The tension is that copying *is* text extraction — the thing a scraper does.
 * Anything that permanently scrambles the DOM to defeat (3) also breaks (2).
 *
 * So the scrambling is temporary rather than permanent. What the visitor sees
 * never changes; what sits in the DOM does:
 *
 *   - **Before any human signal** the DOM holds the address backwards, put
 *     back in reading order by the bidi override. `textContent` gives
 *     `hc.tramsaidem@olleh`: no address pattern matches it, and neither the
 *     domain nor the local part survives as a searchable substring. The
 *     `mailto:` is absent entirely. This is the state a render-and-dump
 *     scraper finds, because extracting text needs none of the events below.
 *   - **After the first pointer move, scroll, tap or keypress anywhere on the
 *     page** the address is written as ordinary text. Selection, double-click,
 *     copy, find-in-page and assistive technology all behave normally, because
 *     by then it is ordinary text. Selecting requires a pointer or a key, so
 *     the swap has always happened before a visitor could copy anything.
 *
 * Reversing one text node rather than splitting it into pieces matters: pieces
 * are separate inline boxes, which lose sub-pixel glyph positioning at every
 * seam and stop text-decoration from propagating into them. Measured on the
 * privacy page, this version reports zero differing pixels and an identical
 * bounding box across the swap; a four-piece split differed on 2.8% of them
 * and rendered 8px taller.
 *
 * What this does not do: stop something that emulates a mouse move, or reads
 * the rendered pixels. An address a person can read is an address a determined
 * program can read. This raises the cost from "free, at scale" to "deliberate,
 * per site", which is the whole of what client-side obfuscation can buy.
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
  const revealed = useHumanPresence();

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

  const content = label ?? address;
  const scramble = !label && !revealed;

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
      {scramble ? (
        // One text node, reversed, put back in reading order by the bidi
        // override. No split means no seam: the glyphs land exactly where they
        // land after the swap.
        <span style={{ unicodeBidi: "bidi-override", direction: "rtl" }}>
          {[...address].reverse().join("")}
        </span>
      ) : (
        content
      )}
    </a>
  );
}
