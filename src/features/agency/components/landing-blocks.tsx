/**
 * The building blocks the two regional pages are made of.
 *
 * They exist so those pages read as a list of sections rather than a wall of
 * Tailwind, and so the two cannot drift apart visually. Every class here comes
 * from a section already on the site — the services hero, the homepage
 * overview cards, the FAQ — so the new pages inherit the design rather than
 * proposing one.
 */

import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import RichText from "@shared/components/rich-text";
import WaveBackdrop from "@shared/components/wave-backdrop";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { getLottieAspectRatio, type LottieKey } from "@shared/config/lotties";
import ArrowIcon from "@shared/components/arrow-icon";

// Hoisted to module scope: declaring lazy() inside a component body creates a
// new component type on every render, which remounts the Lottie player. Same
// reason the homepage and the services page do it this way.
const DotAnim = lazy(() => import("@shared/components/dot-anim"));

const CONTAINER =
  "w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto";

/**
 * Page heading, opening paragraph, and the animation under it.
 *
 * Laid out like the homepage hero — centred copy, then a wide animation — so
 * these pages open the way the rest of the site opens. `anim` is optional: the
 * work pages lead with a project screenshot instead, and putting an animation
 * above it as well would be two heavy visuals above the fold.
 *
 * The animation sits below the copy in the DOM as well as on screen, so the
 * pre-rendered HTML still opens with the h1 and the lead.
 */
export function LandingHero({
  title,
  lead,
  intro,
  anim,
  actions,
}: {
  title: string;
  lead: string;
  intro: string;
  anim?: LottieKey;
  actions?: React.ReactNode;
}) {
  return (
    <div className="pt-[73px] md:pt-[130px] lg:pt-[100px]">
      <div className={`${CONTAINER} pt-[24px] lg:pt-[36px] xl:pt-[40px] pb-[10px]`}>
        {/* The copy and the call to action own the higher stacking context, as
            they do on the homepage hero. Without it the animation below —
            which needs a z-index of its own to sit above the wave — painted
            over the bottom of the button on narrow screens. */}
        <div className="relative" style={{ zIndex: 100 }}>
        <h1
          className="text-heading w-full lg:w-[80%] 2xl:w-[70%] mx-auto text-center mb-[18px] lg:mb-[26px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px] leading-[40px] lg:leading-[50px] xl:leading-[64px]"
          data-aos="fade-up"
          data-aos-duration="900"
          data-aos-easing="ease-in-sine"
        >
          {title}
        </h1>
        <p
          className="text-body-alt w-full lg:w-[72%] 2xl:w-[62%] mx-auto text-center mb-[18px] font-poppins font-normal text-[13px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] leading-relaxed"
          data-aos="fade-up"
          data-aos-duration="1100"
          data-aos-easing="ease-in-sine"
        >
          {lead}
        </p>
        <RichText
          as="div"
          className="text-body w-full lg:w-[72%] 2xl:w-[62%] mx-auto text-center font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]"
          html={intro}
          data-aos="fade-up"
          data-aos-duration="1300"
          data-aos-easing="ease-in-sine"
        />

        {actions && (
          <div
            // Below sm the two hero actions stack, so they stack as a
            // pair: one width, one height, centred. Released at sm, where
            // the row has always sized each button to its own label.
            className="w-full flex flex-col items-stretch gap-[14px] mx-auto max-w-[320px] sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center mt-[26px] lg:mt-[34px]"
            data-aos="fade-up"
            data-aos-duration="1400"
            data-aos-easing="ease-in-sine"
          >
            {actions}
          </div>
        )}
        </div>

        {anim && (
          // Capped at the width the homepage hero animation occupies, so a
          // 2:1 illustration does not grow to fill a 1920 viewport.
          <div
            className="relative w-full md:w-[80%] lg:w-[72%] xl:w-[68%] max-w-[860px] mx-auto mt-[26px] lg:mt-[34px]"
            style={{ zIndex: 50 }}
          >
            <Suspense
              fallback={
                // Exactly the box the animation will occupy, taken from the
                // same table DotAnim sizes itself from — a guessed ratio here
                // is a layout shift the moment the real thing arrives.
                <div
                  className="w-full"
                  style={{ aspectRatio: getLottieAspectRatio(anim) }}
                  aria-hidden="true"
                />
              }
            >
              <DotAnim
                anim={anim}
                style={{ width: "100%", height: "auto" }}
                crisp
                protect
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A titled section. `id` gives it an anchor the navigation can point at.
 *
 * `tinted` paints the full width behind it, which is how the rest of the site
 * breaks up a long page: the services page alternates a plain background with
 * the tinted process block, and without that alternation these pages read as
 * one uninterrupted sheet of white. The colour is the same `bg-surface` token
 * the cards use, so a tinted band and the cards on it stay distinguishable in
 * both themes.
 */
export function LandingSection({
  id,
  title,
  description,
  children,
  tinted = false,
  compact = false,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tinted?: boolean;
  /**
   * Closes the gaps between the heading, the paragraph and what follows.
   *
   * For a short section — a two-line lead over a pair of cards — the default
   * rhythm leaves it stretched down the page with the title floating alone at
   * the top. The type scale does not change, only the air around it.
   */
  compact?: boolean;
}) {
  const inner = (
    <section
      id={id}
      className={`${CONTAINER} ${
        compact
          ? "pt-[24px] md:pt-[30px] lg:pt-[40px]"
          : "pt-[30px] md:pt-[40px] lg:pt-[56px]"
      } pb-[10px] md:pb-[20px]`}
    >
      <h2
        className={`text-heading w-full text-center font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[46px] ${
          compact ? "mb-[8px]" : "mb-[10px]"
        }`}
        data-aos="fade-up"
        data-aos-duration="900"
        data-aos-easing="ease-in-sine"
      >
        {title}
      </h2>
      {description && (
        <RichText
          as="div"
          className={`text-body w-full lg:w-[70%] 2xl:w-[60%] mx-auto text-center font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] ${
            compact ? "mb-[18px] lg:mb-[24px]" : "mb-[26px] lg:mb-[36px]"
          }`}
          html={description}
          data-aos="fade-up"
          data-aos-duration="1100"
          data-aos-easing="ease-in-sine"
        />
      )}
      <div
        className={
          description ? "" : compact ? "mt-[18px] lg:mt-[24px]" : "mt-[26px] lg:mt-[36px]"
        }
      >
        {children}
      </div>
    </section>
  );

  if (!tinted) return inner;

  return (
    <div className="relative w-full section-band py-[20px] md:py-[30px] lg:py-[40px] my-[30px] lg:my-[50px]">
      {inner}
    </div>
  );
}

/**
 * The wave that closes a page, before the last call to action.
 *
 * The same component and the same proportions the services page uses above its
 * booking block — one per page, at the point where the page stops explaining
 * and starts asking. Putting one between every section would turn a signature
 * into wallpaper.
 */
export function LandingWave({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div className="relative overflow-hidden pt-[40px] md:pt-[50px]">
      <WaveBackdrop
        theme={theme}
        className="top-[52px] h-[460px] md:top-[18px] md:h-[500px] lg:top-[8px] lg:h-[540px] xl:top-[-8px] xl:h-[580px]"
      />
      {/* The exact spacing the services page puts between this wave and its
          booking block. It was shorter here, which pulled the call to action
          up into the crest of the wave. */}
      <div className="relative z-10 w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto">
        <div className="pt-[130px] md:pt-[170px] lg:pt-[220px] xl:pt-[250px] 2xl:pt-[250px] pb-[40px]">
          {children}
        </div>
      </div>
    </div>
  );
}

export interface LandingCard {
  title: string;
  description: string;
}

/**
 * The card grid.
 *
 * `as` sets the heading level of each card title: the cards sit under the
 * section's h2, so they are h3 — a level that has to stay right for the
 * outline a screen reader and a crawler both read.
 */
export function LandingCards({
  cards,
  columns = 3,
}: {
  cards: LandingCard[];
  columns?: 2 | 3;
}) {
  const grid =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-[18px] lg:gap-[24px]"
      : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[18px] lg:gap-[24px]";

  return (
    <div className={grid}>
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="bg-surface rounded-[15px] xl:rounded-[20px] 2xl:rounded-[25px] px-5 py-6 md:px-6 md:py-7 transition duration-300 hover:-translate-y-[3px]"
          data-aos="fade-up"
          data-aos-duration="1200"
          // Staggered by row rather than by card: a delay per card walks a
          // six-card grid in visibly and reads as a loading sequence. The
          // animation layer caps and rescales these delays anyway
          // (see tuneAosElements), so this stays a nudge.
          data-aos-delay={(index % 3) * 90}
          data-aos-easing="ease-in-sine"
        >
          <h3 className="text-heading-strong font-redDisplay font-bold text-[18px] lg:text-[19px] xl:text-[21px] 2xl:text-[22px] mb-[10px]">
            {card.title}
          </h3>
          <p className="text-body font-poppins font-light text-[13px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] leading-relaxed">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * A secondary way on to another page.
 *
 * Written as a sentence naming its destination — "Notre activité en Valais"
 * rather than "En savoir plus" — because the anchor text is the only
 * description a search engine gets of what sits at the other end.
 *
 * It is `custom-btn-outline`, the site's existing secondary button, with the
 * site's existing arrow. An earlier version of this invented its own border,
 * radius, padding and hover, which is one more button style than the site
 * needs; `buttons.css` already owns all four, and owns the
 * `prefers-reduced-motion` rule that stills them.
 */
export function LandingLink({
  to,
  children,
  inline = false,
  size = "default",
}: {
  to: string;
  children: React.ReactNode;
  /** Drops the centring wrapper, for use inside a column that sets its own. */
  inline?: boolean;
  /**
   * "hero" matches the booking button it stands next to in a hero, which is
   * taller and set in Helvetica. Side by side at the default size the two were
   * 44px against 48px in two different typefaces, which is exactly the kind of
   * near-miss that reads as a mistake.
   */
  size?: "default" | "hero";
}) {
  const { L } = useLangLink();

  const sizing =
    size === "hero"
      ? "hero-btn h-[48px] px-[24px] font-helvetica font-light text-[14px] xl:text-[15px] 2xl:text-[16px] rounded-[5px]"
      : "min-h-[44px] px-[18px] font-poppins text-[14px] font-medium";

  const link = (
    <Link
      to={L(to)}
      className={`custom-btn-outline inline-flex items-center justify-center gap-2 ${sizing}`}
    >
      {children}
      <ArrowIcon />
    </Link>
  );

  if (inline) return link;

  return (
    <div className="w-full flex justify-center mt-[30px] lg:mt-[40px]">{link}</div>
  );
}

/**
 * An animation beside a block of copy, alternating sides.
 *
 * The composition the homepage and the services page both use for their
 * "about" sections, down to the `flex-col-reverse` that puts the animation
 * first in the DOM and second on screen — so a narrow screen reads the words
 * before the picture, and a wide one sees them side by side.
 *
 * `reverse` swaps which side the animation sits on, which is what gives a long
 * page a rhythm instead of a column.
 */
export function LandingFeature({
  anim,
  title,
  children,
  reverse = false,
}: {
  anim: LottieKey;
  title: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`${CONTAINER} pt-[20px] md:pt-[30px] lg:pt-[50px] pb-[20px] md:pb-[30px]`}>
      <div
        className={`flex flex-col-reverse ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        } justify-center items-center lg:justify-between gap-y-[40px]`}
      >
        <div
          className="w-full lg:w-[46%] flex justify-center items-center"
          data-aos={reverse ? "fade-right" : "fade-left"}
          data-aos-duration="1200"
          data-aos-easing="ease-in-sine"
        >
          <Suspense
            fallback={
              <div
                className="w-full"
                style={{ aspectRatio: getLottieAspectRatio(anim) }}
                aria-hidden="true"
              />
            }
          >
            <DotAnim
              anim={anim}
              style={{ width: "100%", height: "auto" }}
              crisp
              protect
            />
          </Suspense>
        </div>

        <div
          className="w-full lg:w-[48%] lg:px-[30px] 2xl:px-[60px]"
          data-aos={reverse ? "fade-left" : "fade-right"}
          data-aos-duration="1300"
          data-aos-easing="ease-in-sine"
        >
          <h2 className="text-heading w-full text-center lg:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[34px] xl:text-[40px] 2xl:text-[44px] mb-[16px] leading-[38px] lg:leading-[46px] xl:leading-[56px]">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}

export interface LandingServiceRow extends LandingCard {
  /**
   * The row's animation. No page uses the same one twice — a picture repeated
   * two rows apart reads as an oversight.
   */
  visual: { anim: LottieKey };
}

/**
 * Services as alternating rows of copy and illustration.
 *
 * The composition the services page uses: the first row inside a `bg-surface`
 * panel, the rest on the page itself, sides swapping as you go down. It
 * replaced a grid of six identical cards, which said the same thing six times
 * in the same rectangle and read as a specification rather than a page.
 *
 * Each row keeps its own `h3`, so the heading outline — and what a crawler
 * reads — is exactly what it was.
 */
export function LandingServiceRows({ rows }: { rows: LandingServiceRow[] }) {
  return (
    <div className="w-full">
      {rows.map((row, index) => {
        const reverse = index % 2 === 1;

        const body = (
          <div
            className={`flex flex-col-reverse ${
              reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            } justify-center items-center lg:justify-between gap-y-[40px] py-[30px]`}
          >
            <div
              className="w-full lg:w-[48%] lg:px-[20px] 2xl:px-[50px]"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-easing="ease-in-sine"
            >
              <h3 className="text-heading w-full text-center lg:text-left font-redDisplay font-bold text-[22px] md:text-[26px] lg:text-[30px] xl:text-[36px] 2xl:text-[40px] mb-[10px] leading-[32px] lg:leading-[40px] xl:leading-[48px]">
                {row.title}
              </h3>
              <p className="text-body text-justify lg:text-left font-helvetica font-light leading-8 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                {row.description}
              </p>
            </div>

            <div
              className="w-full lg:w-[44%] flex justify-center items-center"
              data-aos={reverse ? "fade-right" : "fade-left"}
              data-aos-duration="1200"
              data-aos-easing="ease-in-sine"
            >
              {/* Capped rather than full-bleed: at 1440 an uncapped animation
                  in a half-width column grew past the height of the copy
                  beside it and became the subject of the row. */}
              <div className="w-full max-w-[420px] xl:max-w-[460px] text-heading">
                <Suspense
                  fallback={
                    <div
                      className="w-full"
                      style={{ aspectRatio: getLottieAspectRatio(row.visual.anim) }}
                      aria-hidden="true"
                    />
                  }
                >
                  <DotAnim
                    anim={row.visual.anim}
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </Suspense>
              </div>
            </div>
          </div>
        );

        // The first row sits on a panel, as the services page's first service
        // does; the others sit on the page.
        return index === 0 ? (
          <div
            key={row.title}
            className="bg-surface my-[30px] rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] py-[20px] px-[20px] md:px-[30px] lg:px-[40px] 2xl:px-[70px]"
          >
            {body}
          </div>
        ) : (
          <div key={row.title} className="xl:px-[30px] 2xl:px-[60px]">
            {body}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Local facts, as a list rather than a wall of cards.
 *
 * This section used to be four large filled rectangles, one per fact, which
 * gave four short sentences the weight of four services. They are now plain
 * entries in a two-column list.
 *
 * Nothing draws a box around them: an earlier version put a short gradient
 * rule above each title and a tinted band behind the lot, which added a motif
 * the site does not otherwise use and a rectangle with visible edges. What is
 * left is the wave, which is how every other section of the site separates
 * itself from the one above.
 */
export function LandingLocalFacts({
  id,
  title,
  facts,
  link,
}: {
  id: string;
  title: string;
  facts: LandingCard[];
  link?: React.ReactNode;
}) {
  const theme = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div className="relative w-full py-[60px] md:py-[80px] lg:py-[100px] overflow-hidden">
      {/* The site's own wave, at the size and strength it has above a closing
          call to action. At 60% and two-thirds the height it was there to be
          found rather than seen, which is not what a wave is for. */}
      <WaveBackdrop
        theme={theme}
        className="top-[20px] h-[460px] md:top-[0px] md:h-[500px] lg:h-[540px] xl:h-[580px]"
      />
      <section id={id} className={`${CONTAINER} relative z-10`}>
        <h2
          className="text-heading w-full text-center font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[46px] mb-[34px] lg:mb-[48px]"
          data-aos="fade-up"
          data-aos-duration="900"
          data-aos-easing="ease-in-sine"
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] xl:gap-x-[70px] gap-y-[34px] lg:gap-y-[44px]">
          {facts.map((fact, index) => (
            <div
              key={fact.title}
              data-aos="fade-up"
              data-aos-duration="1100"
              data-aos-delay={(index % 2) * 80}
              data-aos-easing="ease-in-sine"
            >
              <h3 className="text-heading-strong font-redDisplay font-bold text-[18px] lg:text-[20px] xl:text-[22px] mb-[8px]">
                {fact.title}
              </h3>
              <p className="text-body font-poppins font-light text-[13px] md:text-[14px] xl:text-[15px] leading-relaxed">
                {fact.description}
              </p>
            </div>
          ))}
        </div>

        {link && <div className="w-full flex justify-center mt-[38px] lg:mt-[48px]">{link}</div>}
      </section>
    </div>
  );
}
