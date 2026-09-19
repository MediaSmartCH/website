/**
 * Site footer.
 *
 * It used to repeat the header's navigation — Accueil, Web & apps, À propos —
 * next to the legal links, seven items in one row. On a phone that row wrapped
 * into a ragged 3 + 1 + 1 + 1 pile, and the duplicated navigation earned none
 * of that space: a visitor who has reached the bottom of the page has the same
 * menu pinned at the top. What is left is what only lives here — the legal
 * pages — so the footer is now two bands: the brand and where to find us, then
 * the legal line and the copyright.
 *
 * The navigation keys stay in the i18n bundles, as the video ones do: unused
 * copy is cheap, and putting a link back is then a one-line change.
 */

import React from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { SOCIAL_LINKS } from "@shared/constants/contact";

import logo from "@assets/images/logo-footer.webp";
import linkedin from "@assets/icons/linkedin.svg";
import insta from "@assets/icons/insta.svg";
import telegram from "@assets/icons/telegram.svg";

const Footer = () => {
  const { L } = useLangLink();
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = useTranslations(languageReducer);

  const legalLinks = [
    { to: "/privacy-policy", label: t.text("footer.navItem6") },
    { to: "/legal-notice", label: t.text("footer.navItem7") },
    { to: "/terms", label: t.text("footer.navItem8") },
  ];

  const socials = [
    {
      href: SOCIAL_LINKS.linkedin,
      icon: linkedin,
      alt: t.text("footer.linkedinAlt"),
      size: 16,
    },
    {
      href: SOCIAL_LINKS.instagram,
      icon: insta,
      alt: t.text("footer.instagramAlt"),
      size: 18,
    },
    {
      href: SOCIAL_LINKS.telegram,
      icon: telegram,
      alt: t.text("footer.telegramAlt"),
      size: 18,
    },
  ];

  return (
    <footer className="bg-[#14172D] md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[90px]">
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] py-[40px] lg:py-[48px] mx-auto">
        {/* Brand and where to find us. Stacked and centred on a phone, pushed
            to the two edges once there is room for it. */}
        <div className="flex flex-col items-center gap-[28px] lg:flex-row lg:justify-between">
          <img
            src={logo}
            alt="MediaSmart"
            className="h-[32px] lg:h-[34px] xl:h-[36px] w-auto"
            width="560"
            height="72"
            loading="lazy"
            decoding="async"
            data-aos="fade-right"
            data-aos-duration="1000"
          />

          <div className="flex items-center gap-[14px]">
            {socials.map(({ href, icon, alt, size }) => (
              <a
                key={href}
                className="bg-[#F6F3FD] hover:bg-white transition rounded-full w-[44px] h-[44px] flex justify-center items-center"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={icon}
                  alt={alt}
                  style={{ width: size, height: size }}
                  width={size}
                  height={size}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        </div>

        <div
          className="my-[28px] lg:my-[32px] h-px w-full bg-white/10"
          aria-hidden="true"
        />

        {/* Legal line and copyright. Reversed on a phone so the copyright
            closes the page, as it does on the wide layout. */}
        <div className="flex flex-col-reverse items-center gap-[10px] lg:flex-row lg:justify-between lg:gap-[24px]">
          <p className="text-white/60 font-helvetica font-light text-[13px] xl:text-[14px]">
            © 2026 MediaSmart
          </p>

          <nav aria-label={t.text("footer.legalNavLabel")}>
            <ul className="flex flex-wrap items-center justify-center gap-x-[24px] xl:gap-x-[32px] font-helvetica font-light text-[13px] xl:text-[14px]">
              {legalLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={L(to)}
                    // Padding rather than height: a 13px line is a 18px tap
                    // target, which is half the 44px minimum. The wide layout
                    // sits in a single row and does not need it.
                    className="block py-[13px] lg:py-0 text-white/75 hover:text-[#5f75f5] transition"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
