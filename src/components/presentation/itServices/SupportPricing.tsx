import React from "react";
import { CheckCircle2, Clock, Zap, Shield, Star } from "lucide-react";
import RichText from "components/common/RichText";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";

const SupportPricing = () => {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);
  const isLight = themeReducer === "light";

  const plans = [
    {
      key: "essential",
      icon: Shield,
      name: t.text("it.supportEssentialName"),
      price: "190",
      extraRate: "120",
      hours: "3",
      sla: [
        { priority: "P1", delay: t.text("it.supportSlaP1Essential") },
        { priority: "P2", delay: t.text("it.supportSlaP2Essential") },
        { priority: "P3", delay: t.text("it.supportSlaP3Essential") },
      ],
      note: t.text("it.supportEssentialNote"),
      weekendIncluded: null,
      afterHours: null,
    },
    {
      key: "business",
      icon: Zap,
      name: t.text("it.supportBusinessName"),
      price: "490",
      extraRate: "100",
      hours: "5",
      sla: [
        { priority: "P1", delay: t.text("it.supportSlaP1Business") },
        { priority: "P2", delay: t.text("it.supportSlaP2Business") },
        { priority: "P3", delay: t.text("it.supportSlaP3Business") },
      ],
      note: t.text("it.supportBusinessNote"),
      weekendIncluded: null,
      afterHours: [
        { label: t.text("it.supportAfterHoursUrgent"), rate: "190" },
        { label: t.text("it.supportAfterHoursWeekend"), rate: "220" },
      ],
    },
    {
      key: "premium",
      icon: Star,
      name: t.text("it.supportPremiumName"),
      price: "890",
      extraRate: "90",
      hours: "12",
      sla: [
        { priority: "P1", delay: t.text("it.supportSlaP1Premium") },
        { priority: "P2", delay: t.text("it.supportSlaP2Premium") },
        { priority: "P3", delay: t.text("it.supportSlaP3Premium") },
      ],
      note: t.text("it.supportPremiumNote"),
      weekendIncluded: t.text("it.supportPremiumWeekendIncluded"),
      afterHours: [
        { label: t.text("it.supportAfterHoursUrgent"), rate: "190" },
        { label: t.text("it.supportAfterHoursWeekend"), rate: "220" },
      ],
    },
  ];

  return (
    <div id="support-pricing" className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[20px] pb-[40px] md:pb-[50px] mx-auto">
      <div className="mb-[30px]">
        <RichText
          as="h2"
          className={`${isLight ? "text-[#1F2326]" : "text-[#F6F6F6]"} w-full text-center font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
          html={t.text("it.supportPricingTitle")}
        />
        <p
          className={`${isLight ? "text-[#413C58]" : "text-[#E5E5E5]"} w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] mt-2`}
        >
          {t.text("it.supportPricingDescription")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(({ key, icon: Icon, name, price, extraRate, hours, sla, note, weekendIncluded, afterHours }) => {
          const isBusiness = key === "business";
          return (
          <div
            key={key}
            className={`${isBusiness
              ? isLight
                ? "border-[#7A6BFF] bg-[linear-gradient(135deg,#FFFFFF_0%,#F4F2FF_50%,#EDF6FF_100%)] shadow-[0_0_40px_rgba(122,107,255,0.18)]"
                : "border-[#7A6BFF]/70 bg-[linear-gradient(135deg,#211C42_0%,#2F2A56_52%,#1A223C_100%)] shadow-[0_0_40px_rgba(122,107,255,0.2)]"
              : isLight
                ? "border-[#E8E4F7] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7F5FF_50%,#EDF6FF_100%)]"
                : "border-white/10 bg-[linear-gradient(135deg,#1F1B38_0%,#2B284C_52%,#1A223C_100%)]"
              } relative overflow-hidden rounded-[24px] border p-6 md:p-7`}
            data-aos="fade-up"
            data-aos-duration="1100"
          >
            <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-[#7A6BFF]/10 blur-3xl" />

            {isBusiness && (
              <div className="absolute top-4 right-4">
                <span className={`${isLight ? "bg-[#7A6BFF] text-white" : "bg-[#7A6BFF] text-white"} font-poppins text-[11px] font-semibold px-2.5 py-1 rounded-full`}>
                  {t.text("it.supportMostPopular")}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-5">
              <div className={`${isLight ? "bg-[#EEF4FF] text-[#2E4D8D]" : "bg-white/10 text-[#A8E1FF]"} flex h-10 w-10 items-center justify-center rounded-full shrink-0`}>
                <Icon size={18} />
              </div>
              <h3 className={`${isLight ? "text-[#14172D]" : "text-[#F6F6F6]"} font-redDisplay text-[22px] font-bold leading-tight`}>
                {name}
              </h3>
            </div>

            <div className={`${isLight ? "border-[#E6ECFA] bg-white/80" : "border-white/10 bg-[#10162A]/40"} rounded-[18px] border p-4 mb-5`}>
              <div className="flex items-baseline gap-1">
                <span className={`${isLight ? "text-[#14172D]" : "text-white"} font-redDisplay text-[40px] font-bold leading-none`}>
                  {price}
                </span>
                <span className={`${isLight ? "text-[#413C58]" : "text-[#E5E5E5]"} font-poppins text-[15px]`}>
                  CHF / {t.text("it.supportPerYear")}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Clock size={14} className={isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} />
                <span className={`${isLight ? "text-[#413C58]" : "text-[#D8D8E9]"} font-poppins text-[13px]`}>
                  <span className="font-semibold">{hours}h</span> {t.text("it.supportIncluded")} — {t.text("it.supportExtra")}: <span className="font-semibold">{extraRate} CHF / h</span>
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className={`${isLight ? "text-[#677089]" : "text-[#AEB8D8]"} font-poppins text-[11px] uppercase tracking-[0.18em] mb-3`}>
                SLA
              </p>
              <div className="space-y-2">
                {sla.map(({ priority, delay }) => (
                  <div key={priority} className="flex items-center justify-between">
                    <span className={`${isLight ? "bg-[#EEF4FF] text-[#2E4D8D]" : "bg-white/10 text-[#A8E1FF]"} font-poppins text-[12px] font-semibold px-2 py-0.5 rounded-full`}>
                      {priority}
                    </span>
                    <span className={`${isLight ? "text-[#413C58]" : "text-[#D8D8E9]"} font-poppins text-[13px]`}>
                      {delay}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {afterHours && (
              <div className={`${isLight ? "border-[#D9E8FF] bg-[#F4F9FF]" : "border-white/10 bg-[#11182D]/65"} rounded-[16px] border p-4 mb-4`}>
                <p className={`${isLight ? "text-[#677089]" : "text-[#AEB8D8]"} font-poppins text-[11px] uppercase tracking-[0.18em] mb-2`}>
                  {t.text("it.supportAfterHoursLabel")}
                </p>
                {/* Premium plan includes some weekend hours; show the notice before listing rates */}
                {weekendIncluded && (
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 size={14} className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} mt-0.5 shrink-0`} />
                    <span className={`${isLight ? "text-[#413C58]" : "text-[#D8D8E9]"} font-poppins text-[13px]`}>
                      {weekendIncluded}
                    </span>
                  </div>
                )}
                {weekendIncluded && (
                  <p className={`${isLight ? "text-[#677089]" : "text-[#AEB8D8]"} font-poppins text-[11px] mb-2`}>
                    {t.text("it.supportPremiumBeyond")}
                  </p>
                )}
                {afterHours.map(({ label, rate }) => (
                  <div key={label} className="flex items-start gap-2 mt-1">
                    <CheckCircle2 size={14} className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} mt-0.5 shrink-0`} />
                    <span className={`${isLight ? "text-[#413C58]" : "text-[#D8D8E9]"} font-poppins text-[13px]`}>
                      {label}: <span className="font-semibold">{rate} CHF / h</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className={`${isLight ? "text-[#677089]" : "text-[#AEB8D8]"} font-poppins text-[12px] leading-5 italic`}>
              {note}
            </p>
          </div>
        ); })}
      </div>
    </div>
  );
};

export default SupportPricing;
