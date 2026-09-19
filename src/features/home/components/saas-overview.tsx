/**
 * Homepage teaser for the three MediaSmart products.
 *
 * Deliberately short: the names, the one-line pitches and a link into the full
 * section on the services page. The product copy itself is not duplicated here
 * — it is read from the same `it.saasProducts` bundle the full section uses, so
 * a wording change lands in both places at once.
 */

import { Link } from "react-router-dom";

import portfolioContent from "@features/it-services/data/it-portfolio.json";
import {
  getItemImages,
  getPreviewDimClass,
  resolveLocalizedField,
  type PortfolioData,
} from "@features/it-services/lib/portfolio-helpers";
import { getPortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";

import RichText from "@shared/components/rich-text";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";

type SaasProductCopy = { id: string; name: string; tagline: string };

/** Prefetches the services route so the jump to the full section is instant. */
const preloadITServices = () => {
  import("@features/it-services/it-services-page");
};

export default function SaasOverview() {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);
  const classes = getPortfolioThemeClasses(themeReducer);
  const { L } = useLangLink();

  const products = t.array<SaasProductCopy>("it.saasProducts");
  // Screenshot and access badge come from the portfolio data, the same source
  // the full section on the services page reads.
  const portfolioItems = (portfolioContent as PortfolioData).items ?? [];

  if (products.length === 0) return null;

  return (
    /* Same surface card as the "About MediaSmart" section: the teaser used to
       sit flat on the page between two gradient buttons, which read as a gap
       rather than a section. */
    <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] py-[40px] mx-auto">
      <div className="bg-surface rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] px-[25px] md:px-[40px] lg:px-[50px] py-[40px] lg:py-[50px]">
      <RichText
        as="h2"
        className="text-heading-strong it-service-title w-full text-center mx-auto font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]"
        html={t.text("home.saasTitle")}
      />
      <p className="text-body mx-auto mt-2 max-w-[820px] text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px]">
        {t.text("home.saasDescription")}
      </p>

      {/* Cards carry their screenshot, like every other card grid on the site:
          as plain bordered text boxes they read as placeholders sitting between
          two gradient buttons. */}
      <div
        className="mt-[34px] grid justify-center gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 420px))",
        }}
      >
        {products.map((product, index) => {
          const source = portfolioItems.find((item) => item.id === product.id);
          const image = source
            ? getItemImages(source, { dark: !classes.isLight })[0]
            : undefined;
          const badge = source?.accessNote
            ? resolveLocalizedField(source.accessNote, languageReducer)
            : null;

          return (
            <Link
              key={product.id}
              to={`${L("/web-development")}#saas`}
              onMouseEnter={preloadITServices}
              className={`group flex h-full flex-col overflow-hidden rounded-[24px] border transition duration-300 hover:-translate-y-1 ${classes.card}`}
              data-aos="fade-up"
              data-aos-delay={index * 120}
            >
              {image && (
                <div className={`aspect-[16/10] w-full overflow-hidden border-b ${classes.imageShell}`}>
                  <img
                    src={image}
                    alt={product.name}
                    className={`h-full w-full object-cover object-top transition duration-500 group-hover:scale-105 ${getPreviewDimClass(source, classes.isLight)}`}
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                {badge && (
                  <span
                    className={`mb-3 inline-block w-fit rounded-full border px-3 py-1 text-[11px] font-medium leading-tight ${classes.isLight ? "border-[#D9DCF2] bg-[#EEF0FF] text-[#2C3A87]" : "border-white/10 bg-white/5 text-[#DAD7FF]"}`}
                  >
                    {badge}
                  </span>
                )}
                <h3 className={`${classes.strongText} font-redDisplay text-[20px] font-bold leading-6`}>
                  {product.name}
                </h3>
                <p className={`${classes.mutedText} mt-2 font-helvetica text-[14px] font-light leading-6`}>
                  {product.tagline}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-[34px] flex justify-center w-full">
        <Link to={`${L("/web-development")}#saas`} onMouseEnter={preloadITServices}>
          <button className="hero-btn custom-btn w-full sm:w-auto min-w-[180px] h-[38px] lg:min-w-[200px] lg:h-[45px] xl:min-w-[212px] xl:h-[49px] flex items-center justify-center rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2 md:px-4">
            <span className="custom-btn-inner">{t.text("home.saasCta")}</span>
          </button>
        </Link>
      </div>
      </div>
    </div>
  );
}
