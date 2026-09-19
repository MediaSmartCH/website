/**
 * One project, as a card.
 *
 * The preview is the screenshot the capture script already generates for the
 * gallery, at the same paths — nothing new is stored for these pages. The dark
 * variant is used only where a dark twin was actually captured, which is what
 * `getItemImages` decides; the others are dimmed rather than faked, so the card
 * shows the site as a visitor would find it.
 */

import React from "react";
import { Link } from "react-router-dom";

import {
  getItemImages,
  getPreviewDimClass,
  resolveLocalizedField,
  type PortfolioItem,
} from "@features/it-services/lib/portfolio-helpers";
import { caseStudyPath } from "@features/work/lib/work-routes";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";

export default function WorkCard({
  item,
  linkToDetail,
}: {
  item: PortfolioItem;
  /** Our own products and the free tools have no page of their own. */
  linkToDetail: boolean;
}) {
  const language = useAppSelector((state) => state.language.currentLanguage);
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(language);
  const { L } = useLangLink();

  const isLight = theme === "light";
  const title = resolveLocalizedField(item.title, language);
  const description = resolveLocalizedField(item.description, language);
  const [preview] = getItemImages(item, { dark: !isLight });

  const body = (
    <>
      {preview && (
        <img
          src={preview}
          // The card's own title says what the project is, so a preview that
          // repeated it would be read out twice. What the image adds is what it
          // looks like, which is what this describes.
          alt={`${t.text("work.previewAlt")} — ${title}`}
          width="1440"
          height="900"
          loading="lazy"
          decoding="async"
          className={`w-full aspect-[16/10] object-cover object-top rounded-[12px] mb-[16px] ${getPreviewDimClass(item, isLight)}`}
        />
      )}
      <h3 className="text-heading-strong font-redDisplay font-bold text-[17px] lg:text-[18px] xl:text-[20px] mb-[8px]">
        {title}
      </h3>
      <p className="text-body font-poppins font-light text-[13px] xl:text-[14px] leading-relaxed">
        {description}
      </p>
    </>
  );

  const shell =
    "bg-surface rounded-[15px] xl:rounded-[20px] p-4 md:p-5 h-full block transition hover:-translate-y-[2px]";

  return (
    <div data-aos="fade-up" data-aos-duration="1200" data-aos-easing="ease-in-sine">
      {linkToDetail ? (
        <Link to={L(caseStudyPath(item.id))} className={shell}>
          {body}
          <span className="gradient-text font-poppins font-medium text-[13px] xl:text-[14px] inline-block mt-[14px] underline underline-offset-4">
            {t.text("work.cardCta")}
          </span>
        </Link>
      ) : (
        <div className={shell}>{body}</div>
      )}
    </div>
  );
}
