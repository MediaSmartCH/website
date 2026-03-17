import React from "react";
import { Link } from "react-router-dom";
import { Globe, ShoppingCart, Wrench, Code2, ArrowRight, Clock, Shield, Zap, Star } from "lucide-react";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import { useLangLink } from "services/router/langPath";

const ProjectEstimates = () => {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);
  const { L } = useLangLink();
  const isLight = themeReducer === "light";

  const scrollToContact = (intent: "quote" | "question") => {
    window.dispatchEvent(new CustomEvent("contact-intent", { detail: { intent } }));
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const tiers = [
    {
      key: "vitrine",
      icon: Globe,
      name: t.text("it.estimateVitrineTitle"),
      subtitle: t.text("it.estimateVitrineSubtitle"),
      price: "1'500",
      priceMax: "3'500",
      deliveryTime: t.text("it.estimateVitrineDelivery"),
      badge: null,
      items: t.array<string>("it.estimateVitrineItems", []),
    },
    {
      key: "business",
      icon: ShoppingCart,
      name: t.text("it.estimateBusinessTitle"),
      subtitle: t.text("it.estimateBusinessSubtitle"),
      price: "3'500",
      priceMax: "9'000",
      deliveryTime: t.text("it.estimateBusinessDelivery"),
      badge: t.text("it.estimatePopular"),
      items: t.array<string>("it.estimateBusinessItems", []),
    },
    {
      key: "refonte",
      icon: Wrench,
      name: t.text("it.estimateRefonteTitle"),
      subtitle: t.text("it.estimateRefonteSubtitle"),
      price: "1'200",
      priceMax: "4'000",
      deliveryTime: t.text("it.estimateRefonteDelivery"),
      badge: null,
      items: t.array<string>("it.estimateRefonteItems", []),
    },
    {
      key: "app",
      icon: Code2,
      name: t.text("it.estimateAppTitle"),
      subtitle: t.text("it.estimateAppSubtitle"),
      price: null,
      priceMax: null,
      deliveryTime: t.text("it.estimateAppDelivery"),
      badge: null,
      items: t.array<string>("it.estimateAppItems", []),
    },
  ];

  const cardBase = (highlighted: boolean) =>
    highlighted
      ? isLight
        ? "border-[#2E4D8D] bg-[linear-gradient(135deg,#EEF4FF_0%,#E8F0FF_50%,#DCF0FF_100%)]"
        : "border-[#A8E1FF]/40 bg-[linear-gradient(135deg,#1A2440_0%,#1F3060_52%,#152040_100%)]"
      : isLight
        ? "border-[#E8E4F7] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7F5FF_50%,#EDF6FF_100%)]"
        : "border-white/10 bg-[linear-gradient(135deg,#1F1B38_0%,#2B284C_52%,#1A223C_100%)]";

  const iconBox = isLight ? "bg-[#EEF4FF] text-[#2E4D8D]" : "bg-white/10 text-[#A8E1FF]";
  const titleColor = isLight ? "text-[#14172D]" : "text-[#F6F6F6]";
  const subtitleColor = isLight ? "text-[#677089]" : "text-[#AEB8D8]";
  const textColor = isLight ? "text-[#413C58]" : "text-[#D8D8E9]";
  const innerCard = isLight ? "border-[#E6ECFA] bg-white/80" : "border-white/10 bg-[#10162A]/40";
  const noteBox = isLight ? "border-[#D9E8FF] bg-[#F4F9FF]" : "border-white/10 bg-[#11182D]/65";

  return (
    <div id="project-estimates" className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[20px] pb-[40px] md:pb-[50px] mx-auto">
      {/* Title */}
      <div className="mb-[30px]">
        <p
          className={`${isLight ? "text-[#1F2326]" : "text-[#F6F6F6]"} w-full text-center font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
          dangerouslySetInnerHTML={{ __html: t.text("it.estimatesTitle") }}
        />
        <p className={`${isLight ? "text-[#413C58]" : "text-[#E5E5E5]"} w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] mt-2`}>
          {t.text("it.estimatesDescription")}
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {tiers.map(({ key, icon: Icon, name, subtitle, price, priceMax, deliveryTime, badge, items }) => {
          const highlighted = key === "business";
          return (
            <div
              key={key}
              className={`${cardBase(highlighted)} relative overflow-hidden rounded-[24px] border p-6 md:p-7`}
              data-aos="fade-up"
              data-aos-duration="1100"
            >
              <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-[#7A6BFF]/10 blur-3xl" />

              {badge && (
                <div className="absolute top-5 right-5">
                  <span className={`${isLight ? "bg-[#2E4D8D] text-white" : "bg-[#A8E1FF] text-[#14172D]"} font-poppins text-[11px] font-semibold px-3 py-1 rounded-full`}>
                    {badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`${iconBox} flex h-10 w-10 items-center justify-center rounded-full shrink-0`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className={`${titleColor} font-redDisplay text-[20px] font-bold leading-tight`}>{name}</h3>
                  <p className={`${subtitleColor} font-poppins text-[12px] mt-0.5`}>{subtitle}</p>
                </div>
              </div>

              {/* Price + delivery */}
              <div className={`${innerCard} rounded-[16px] border p-4 mb-5`}>
                {price ? (
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className={`${subtitleColor} font-poppins text-[13px]`}>{t.text("it.estimateFrom")}</span>
                    <span className={`${titleColor} font-redDisplay text-[32px] font-bold leading-none`}>CHF {price}</span>
                    {priceMax && (
                      <>
                        <span className={`${subtitleColor} font-poppins text-[13px]`}>–</span>
                        <span className={`${titleColor} font-redDisplay text-[32px] font-bold leading-none`}>{priceMax}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className={`${titleColor} font-redDisplay text-[28px] font-bold leading-none`}>{t.text("it.estimateOnQuote")}</span>
                )}
                <div className={`${subtitleColor} font-poppins text-[12px] mt-2 flex items-center gap-1.5`}>
                  <Clock size={12} />
                  <span>{t.text("it.estimateDeliveryLabel")} :</span>
                  <span className="font-semibold">{deliveryTime}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item} className={`${noteBox} flex items-start gap-2 rounded-[12px] border px-3 py-2`}>
                    <span className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} font-bold text-[14px] leading-5 shrink-0`}>·</span>
                    <span className={`${textColor} font-poppins text-[13px] leading-5`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Support plans compact band */}
      <div className={`${isLight ? "border-[#E8E4F7] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7F5FF_50%,#EDF6FF_100%)]" : "border-white/10 bg-[linear-gradient(135deg,#1F1B38_0%,#2B284C_52%,#1A223C_100%)]"} rounded-[24px] border p-6 mb-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className={`${titleColor} font-redDisplay text-[18px] font-bold leading-tight`}>{t.text("it.supportBandTitle")}</p>
            <p className={`${subtitleColor} font-poppins text-[12px] mt-0.5`}>{t.text("it.supportBandSubtitle")}</p>
            <Link to={L("/support-contract")} className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} font-poppins text-[12px] font-semibold underline hover:opacity-75 transition mt-1 inline-block`}>
              {t.text("it.supportPageMoreInfo")} →
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Shield, name: t.text("it.supportEssentialName"), price: "190", hours: "3",  extraRate: "120", p1: t.text("it.supportSlaP1Essential") },
            { icon: Zap,    name: t.text("it.supportBusinessName"),  price: "490", hours: "5",  extraRate: "100", p1: t.text("it.supportSlaP1Business")  },
            { icon: Star,   name: t.text("it.supportPremiumName"),   price: "890", hours: "12", extraRate: "90",  p1: t.text("it.supportSlaP1Premium")   },
          ].map(({ icon: Icon, name, price, hours, extraRate, p1 }) => (
            <div key={name} className={`${innerCard} rounded-[16px] border p-4 flex flex-col gap-2`}>
              <div className="flex items-center gap-2">
                <div className={`${iconBox} flex h-7 w-7 items-center justify-center rounded-full shrink-0`}>
                  <Icon size={13} />
                </div>
                <span className={`${titleColor} font-poppins text-[13px] font-semibold`}>{name}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`${titleColor} font-redDisplay text-[22px] font-bold leading-none`}>{price}</span>
                <span className={`${subtitleColor} font-poppins text-[11px]`}>CHF / {t.text("it.supportPerYear")}</span>
              </div>
              <div className={`${subtitleColor} font-poppins text-[11px] flex flex-col gap-0.5`}>
                <span><span className="font-semibold">{hours}h</span> {t.text("it.supportBandHours")}</span>
                <span>{t.text("it.supportBandP1")} <span className="font-semibold">{p1}</span></span>
              </div>
              <div className={`${isLight ? "border-[#D9E8FF] bg-[#F4F9FF]" : "border-white/10 bg-[#11182D]/65"} rounded-[10px] border px-3 py-1.5 flex items-center justify-between mt-1`}>
                <span className={`${subtitleColor} font-poppins text-[11px]`}>{t.text("it.supportBandExtra")}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`${titleColor} font-poppins text-[12px] font-semibold`}>{extraRate} CHF/h</span>
                  <span className={`${isLight ? "text-[#9B6B6B] line-through" : "text-[#FFAAAA] line-through"} font-poppins text-[11px]`}>140</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer + CTAs */}
      <div className={`${noteBox} rounded-[20px] border p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <p className={`${textColor} font-poppins text-[13px] leading-6`}>
          {t.text("it.estimatesDisclaimer")}
        </p>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => scrollToContact("quote")}
            className="custom-btn flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-full"
          >
            <span className="custom-btn-inner flex items-center gap-2">
              {t.text("it.estimateCtaQuote")}
              <ArrowRight size={15} />
            </span>
          </button>
          <button
            onClick={() => scrollToContact("question")}
            className="custom-btn flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-full"
          >
            <span className="custom-btn-inner">{t.text("it.estimateCtaQuestion")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectEstimates;
