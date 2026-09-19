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
import ArrowIcon from "@shared/components/arrow-icon";

export default function WorkCard({
  item,
  linkToDetail,
  index = 0,
  status,
}: {
  item: PortfolioItem;
  /** Our own products and the free tools have no page of their own. */
  linkToDetail: boolean;
  /** Position in its grid, used to stagger the entrance by row. */
  index?: number;
  /**
   * A state to show instead of the "view the project" action — "En cours" for
   * work under way. It is a statement of fact, not a progress bar: nothing
   * here claims a stage or a date.
   */
  status?: string;
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
        // The frame keeps the scale-on-hover inside the card's rounded corners.
        <div className="overflow-hidden rounded-[12px] mb-[16px]">
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
          className={`w-full aspect-[16/10] object-cover object-top transition duration-500 group-hover:scale-[1.02] ${getPreviewDimClass(item, isLight)}`}
        />
        </div>
      )}
      <h3 className="text-heading-strong font-redDisplay font-bold text-[17px] lg:text-[18px] xl:text-[20px] mb-[8px]">
        {title}
      </h3>
      <p className="text-body font-poppins font-light text-[13px] xl:text-[14px] leading-relaxed">
        {description}
      </p>
    </>
  );

  // The lift on hover is the one the homepage overview cards use; the preview
  // scaling under it is what makes a card of screenshots feel like a link to a
  // site rather than a tile.
  const shell =
    "group bg-surface rounded-[15px] xl:rounded-[20px] p-4 md:p-5 h-full block transition duration-300 hover:-translate-y-[3px]";


  return (
    <div
      data-aos="fade-up"
      data-aos-duration="1200"
      data-aos-delay={(index % 3) * 90}
      data-aos-easing="ease-in-sine"
    >
      {linkToDetail ? (
        <Link to={L(caseStudyPath(item.id))} className={shell}>
          {body}
          {/* A span, not a link: the whole card is already the link. That is
              exactly what `custom-btn-in-card` exists for — the card's hover
              drives the button's lift and the arrow's nudge, because the
              button's own :hover never fires when the pointer is elsewhere on
              the card. */}
          <span className="custom-btn custom-btn-in-card mt-[14px] flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-[5px] px-[18px] font-poppins text-[14px] font-medium text-white">
            {t.text("work.cardCta")}
            <ArrowIcon />
          </span>
        </Link>
      ) : (
        <div className={shell}>
          {body}
          {status && (
            <span className="mt-[14px] inline-flex items-center gap-[7px] rounded-[999px] border border-current/20 px-[12px] py-[6px] font-poppins text-[12px] xl:text-[13px] text-body">
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #b514fd 1.42%, #5f75f5 97.8%)",
                }}
                aria-hidden="true"
              />
              {status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
