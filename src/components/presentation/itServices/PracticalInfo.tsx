import React from "react";
import { Link } from "react-router-dom";
import { Clock, CreditCard, ShieldCheck, CalendarClock, Check, X } from "lucide-react";
import RichText from "components/common/RichText";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import { useLangLink } from "services/router/langPath";

const PracticalInfo = () => {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);
  const { L } = useLangLink();
  const isLight = themeReducer === "light";

  const excludedItems = t.array<string>("it.practicalExcludedItems", []);
  const includedItems = t.array<string>("it.practicalIncludedItems", []);

  // Shared class strings extracted to avoid repeating long conditional expressions
  const cardBase = isLight
    ? "border-[#E8E4F7] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7F5FF_50%,#EDF6FF_100%)]"
    : "border-white/10 bg-[linear-gradient(135deg,#1F1B38_0%,#2B284C_52%,#1A223C_100%)]";

  const iconBox = isLight
    ? "bg-[#EEF4FF] text-[#2E4D8D]"
    : "bg-white/10 text-[#A8E1FF]";

  const titleColor = isLight ? "text-[#14172D]" : "text-[#F6F6F6]";
  const subtitleColor = isLight ? "text-[#677089]" : "text-[#AEB8D8]";
  const textColor = isLight ? "text-[#413C58]" : "text-[#D8D8E9]";
  const innerCard = isLight ? "border-[#E6ECFA] bg-white/80" : "border-white/10 bg-[#10162A]/40";
  const noteBox = isLight ? "border-[#D9E8FF] bg-[#F4F9FF]" : "border-white/10 bg-[#11182D]/65";

  return (
    <div id="practical-info" className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[20px] pb-[40px] md:pb-[50px] mx-auto">
      <div className="mb-[30px]">
        <RichText
          as="p"
          className={`${isLight ? "text-[#1F2326]" : "text-[#F6F6F6]"} w-full text-center font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
          html={t.text("it.practicalInfoTitle")}
        />
        <p className={`${isLight ? "text-[#413C58]" : "text-[#E5E5E5]"} w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] mt-2`}>
          {t.text("it.practicalInfoDescription")}
        </p>
      </div>

      {/* Row 1: hourly rate, payment conditions, warranty + hours */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">

        {/* Hourly rate card */}
        <div className={`${cardBase} relative overflow-hidden rounded-[24px] border p-6 md:p-7`} data-aos="fade-up" data-aos-duration="1100">
          <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-[#7A6BFF]/10 blur-3xl" />
          <div className="flex items-center gap-3 mb-5">
            <div className={`${iconBox} flex h-10 w-10 items-center justify-center rounded-full shrink-0`}>
              <Clock size={18} />
            </div>
            <h3 className={`${titleColor} font-redDisplay text-[20px] font-bold leading-tight`}>
              {t.text("it.hourlyRateTitle")}
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { label: t.text("it.hourlyRateStandard"), rate: "140" },
              { label: t.text("it.hourlyRateUrgent"), rate: "190" },
              { label: t.text("it.hourlyRateWeekend"), rate: "220" },
            ].map(({ label, rate }) => (
              <div key={label} className={`${innerCard} flex items-center justify-between rounded-[14px] border px-4 py-3`}>
                <span className={`${textColor} font-poppins text-[13px] leading-5`}>{label}</span>
                <span className={`${titleColor} font-redDisplay text-[18px] font-bold shrink-0 ml-2`}>
                  {rate} <span className={`${subtitleColor} font-poppins text-[12px] font-normal`}>CHF/h</span>
                </span>
              </div>
            ))}
          </div>
          <div className={`${noteBox} rounded-[14px] border p-3 mt-4`}>
            <p className={`${subtitleColor} font-poppins text-[12px] leading-5 italic`}>
              {t.text("it.hourlyRateMinBilling")}
            </p>
          </div>
          <div className={`${isLight ? "border-[#D9E8FF] bg-[#EEF4FF]" : "border-white/10 bg-[#10162A]/40"} rounded-[14px] border p-3 mt-3`}>
            <p className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} font-poppins text-[12px] leading-5`}>
              {t.text("it.hourlyRateContractNote")}{" "}
              <Link to={L("/support-contract")} className="underline hover:opacity-75 transition font-semibold">
                {t.text("it.supportPageMoreInfo")}
              </Link>
            </p>
          </div>
        </div>

        {/* Payment conditions card */}
        <div className={`${cardBase} relative overflow-hidden rounded-[24px] border p-6 md:p-7`} data-aos="fade-up" data-aos-duration="1200">
          <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-[#59C3FF]/10 blur-3xl" />
          <div className="flex items-center gap-3 mb-5">
            <div className={`${iconBox} flex h-10 w-10 items-center justify-center rounded-full shrink-0`}>
              <CreditCard size={18} />
            </div>
            <h3 className={`${titleColor} font-redDisplay text-[20px] font-bold leading-tight`}>
              {t.text("it.paymentTitle")}
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { step: "1", label: t.text("it.paymentStep1"), sub: t.text("it.paymentStep1Sub") },
              { step: "2", label: t.text("it.paymentStep2"), sub: t.text("it.paymentStep2Sub") },
            ].map(({ step, label, sub }) => (
              <div key={step} className={`${innerCard} flex items-start gap-4 rounded-[14px] border px-4 py-4`}>
                <div className={`${iconBox} flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-redDisplay text-[15px] font-bold`}>
                  {step}
                </div>
                <div>
                  <p className={`${titleColor} font-redDisplay text-[22px] font-bold leading-tight`}>{label}</p>
                  <p className={`${subtitleColor} font-poppins text-[12px] mt-0.5`}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`${noteBox} rounded-[14px] border p-3 mt-4`}>
            <p className={`${subtitleColor} font-poppins text-[12px] leading-5 italic`}>
              {t.text("it.paymentNote")}
            </p>
          </div>
        </div>

        {/* Warranty + business hours card — spans 2 columns on md, 1 on lg */}
        <div className={`${cardBase} relative overflow-hidden rounded-[24px] border p-6 md:p-7 md:col-span-2 lg:col-span-1`} data-aos="fade-up" data-aos-duration="1300">
          <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-[#7A6BFF]/10 blur-3xl" />

          <div className="flex items-center gap-3 mb-4">
            <div className={`${iconBox} flex h-10 w-10 items-center justify-center rounded-full shrink-0`}>
              <ShieldCheck size={18} />
            </div>
            <h3 className={`${titleColor} font-redDisplay text-[20px] font-bold leading-tight`}>
              {t.text("it.warrantyTitle")}
            </h3>
          </div>
          <div className={`${innerCard} rounded-[14px] border p-4 mb-3`}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`${titleColor} font-redDisplay text-[36px] font-bold leading-none`}>14</span>
              <span className={`${textColor} font-poppins text-[15px]`}>{t.text("it.warrantyDays")}</span>
            </div>
            <p className={`${textColor} font-poppins text-[13px] leading-5`}>{t.text("it.warrantyDescription")}</p>
          </div>
          <div className={`${noteBox} rounded-[14px] border p-3 mb-6`}>
            <p className={`${subtitleColor} font-poppins text-[12px] leading-5 italic`}>{t.text("it.warrantyExclusion")}</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className={`${iconBox} flex h-10 w-10 items-center justify-center rounded-full shrink-0`}>
              <CalendarClock size={18} />
            </div>
            <h3 className={`${titleColor} font-redDisplay text-[20px] font-bold leading-tight`}>
              {t.text("it.hoursTitle")}
            </h3>
          </div>
          <div className={`${innerCard} rounded-[14px] border p-4`}>
            <p className={`${titleColor} font-poppins text-[14px] font-semibold`}>{t.text("it.hoursSchedule")}</p>
            <p className={`${subtitleColor} font-poppins text-[12px] mt-1`}>{t.text("it.hoursNote")}</p>
          </div>
        </div>
      </div>

      {/* Row 2: included vs excluded scope */}
      <div className={`${cardBase} relative overflow-hidden rounded-[24px] border p-6 md:p-8`} data-aos="fade-up" data-aos-duration="1100">
        <div className="absolute -top-16 right-0 h-44 w-44 rounded-full bg-[#59C3FF]/10 blur-3xl" />
        <h3 className={`${titleColor} font-redDisplay text-[22px] font-bold mb-6`}>
          {t.text("it.scopeTitle")}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className={`${subtitleColor} font-poppins text-[11px] uppercase tracking-[0.18em] mb-3`}>
              {t.text("it.includedTitle")}
            </p>
            <div className="space-y-2">
              {includedItems.map((item) => (
                <div key={item} className={`${innerCard} flex items-start gap-3 rounded-[14px] border p-3`}>
                  <Check size={15} className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} mt-0.5 shrink-0`} />
                  <span className={`${textColor} font-poppins text-[13px] leading-5`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className={`${subtitleColor} font-poppins text-[11px] uppercase tracking-[0.18em] mb-3`}>
              {t.text("it.excludedTitle")}
            </p>
            <div className="space-y-2">
              {excludedItems.map((item) => (
                <div key={item} className={`${noteBox} flex items-start gap-3 rounded-[14px] border p-3`}>
                  <X size={15} className={`${isLight ? "text-[#9B6B6B]" : "text-[#FFAAAA]"} mt-0.5 shrink-0`} />
                  <span className={`${textColor} font-poppins text-[13px] leading-5`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticalInfo;
