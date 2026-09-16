/**
 * Homepage teaser for the three MediaSmart products.
 *
 * Deliberately short: the names, the one-line pitches and a link into the full
 * section on the services page. The product copy itself is not duplicated here
 * — it is read from the same `it.saasProducts` bundle the full section uses, so
 * a wording change lands in both places at once.
 */

import { Link } from "react-router-dom";

import { getPortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";

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

  if (products.length === 0) return null;

  return (
    <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[20px] pb-[50px]">
      <h2 className="text-heading-strong w-full text-center mx-auto font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]">
        {t.text("home.saasTitle")}
      </h2>
      <p className="text-body mx-auto mt-2 max-w-[820px] text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px]">
        {t.text("home.saasDescription")}
      </p>

      <div
        className="mt-[34px] grid justify-center gap-5"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 360px))",
        }}
      >
        {products.map((product, index) => (
          <Link
            key={product.id}
            to={`${L("/it-services")}#saas`}
            onMouseEnter={preloadITServices}
            className={`flex h-full flex-col rounded-[20px] border p-5 transition duration-300 hover:-translate-y-1 ${classes.card}`}
            data-aos="fade-up"
            data-aos-delay={index * 120}
          >
            <h3 className={`${classes.strongText} font-redDisplay text-[19px] font-bold leading-6`}>
              {product.name}
            </h3>
            <p className={`${classes.mutedText} mt-2 font-helvetica text-[13px] font-light leading-6`}>
              {product.tagline}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-[34px] flex justify-center w-full">
        <Link to={`${L("/it-services")}#saas`} onMouseEnter={preloadITServices}>
          <button className="hero-btn custom-btn w-full sm:w-auto min-w-[180px] h-[38px] lg:min-w-[200px] lg:h-[45px] xl:min-w-[212px] xl:h-[49px] flex items-center justify-center rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2 md:px-4">
            <span className="custom-btn-inner">{t.text("home.saasCta")}</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
