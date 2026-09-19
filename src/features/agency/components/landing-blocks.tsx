/**
 * The building blocks the two regional pages are made of.
 *
 * They exist so those pages read as a list of sections rather than a wall of
 * Tailwind, and so the two cannot drift apart visually. Every class here comes
 * from a section already on the site — the services hero, the homepage
 * overview cards, the FAQ — so the new pages inherit the design rather than
 * proposing one.
 */

import React from "react";
import { Link } from "react-router-dom";

import RichText from "@shared/components/rich-text";
import { useLangLink } from "@shared/hooks/use-localized-path";

const CONTAINER =
  "w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto";

/** Page heading and opening paragraph. The only h1 on the page. */
export function LandingHero({
  title,
  lead,
  intro,
}: {
  title: string;
  lead: string;
  intro: string;
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
      </div>
    </div>
  );
}

/** A titled section. `id` gives it an anchor the navigation can point at. */
export function LandingSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${CONTAINER} pt-[30px] md:pt-[40px] lg:pt-[60px] xl:pt-[70px] pb-[10px] md:pb-[20px]`}
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
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-surface rounded-[15px] xl:rounded-[20px] 2xl:rounded-[25px] px-5 py-6 md:px-6 md:py-7"
          data-aos="fade-up"
          data-aos-duration="1200"
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
          className="bg-surface rounded-[15px] xl:rounded-[20px] px-5 py-6"
          data-aos="fade-up"
          data-aos-duration="1200"
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
export function LandingLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { L } = useLangLink();

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
