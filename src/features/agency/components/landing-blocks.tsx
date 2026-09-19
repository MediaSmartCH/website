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
            className="w-full flex flex-wrap items-center justify-center gap-[14px] mt-[24px] lg:mt-[30px]"
            data-aos="fade-up"
            data-aos-duration="1400"
            data-aos-easing="ease-in-sine"
          >
            {actions}
          </div>
        )}

        {anim && (
          <div
            className="w-full md:w-[80%] lg:w-[72%] xl:w-[68%] mx-auto mt-[24px] lg:mt-[30px]"
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
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  const inner = (
    <section
      id={id}
      className={`${CONTAINER} pt-[30px] md:pt-[40px] lg:pt-[56px] pb-[10px] md:pb-[20px]`}
    >
      <h2
        className="text-heading w-full text-center font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[46px] mb-[10px]"
        data-aos="fade-up"
        data-aos-duration="900"
        data-aos-easing="ease-in-sine"
      >
        {title}
      </h2>
      {description && (
        <RichText
          as="div"
          className="text-body w-full lg:w-[70%] 2xl:w-[60%] mx-auto text-center font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mb-[26px] lg:mb-[36px]"
          html={description}
          data-aos="fade-up"
          data-aos-duration="1100"
          data-aos-easing="ease-in-sine"
        />
      )}
      <div className={description ? "" : "mt-[26px] lg:mt-[36px]"}>{children}</div>
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
      <div className="relative z-10 pt-[90px] md:pt-[120px] lg:pt-[150px] xl:pt-[170px]">
        {children}
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

/** Numbered steps, for the "how a project runs" section. */
export function LandingSteps({ steps }: { steps: LandingCard[] }) {
  return (
    <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-[18px] lg:gap-[20px]">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="bg-surface rounded-[15px] xl:rounded-[20px] px-5 py-6 transition duration-300 hover:-translate-y-[3px]"
          data-aos="fade-up"
          data-aos-duration="1200"
          data-aos-delay={index * 70}
          data-aos-easing="ease-in-sine"
        >
          <span className="gradient-text font-redDisplay font-bold text-[22px] xl:text-[26px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-heading-strong font-redDisplay font-bold text-[17px] xl:text-[19px] mt-[6px] mb-[8px]">
            {step.title}
          </h3>
          <p className="text-body font-poppins font-light text-[13px] xl:text-[14px] leading-relaxed">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * An internal link written as a sentence rather than "En savoir plus".
 *
 * The anchor text is the only thing telling a search engine what sits at the
 * other end, so every one of these names its destination.
 */
export function LandingLink({
  to,
  children,
  inline = false,
}: {
  to: string;
  children: React.ReactNode;
  /** Drops the centring wrapper, for use inside a column that sets its own. */
  inline?: boolean;
}) {
  const { L } = useLangLink();

  if (inline) {
    return (
      <Link
        to={L(to)}
        className="gradient-text font-poppins font-medium text-[14px] xl:text-[15px] 2xl:text-[16px] underline underline-offset-4 py-[10px]"
      >
        {children}
      </Link>
    );
  }

  return (
    <div className="w-full flex justify-center mt-[26px] lg:mt-[34px]">
      <Link
        to={L(to)}
        className="gradient-text font-poppins font-medium text-[14px] xl:text-[15px] 2xl:text-[16px] underline underline-offset-4 py-[10px]"
      >
        {children}
      </Link>
    </div>
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
