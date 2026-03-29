import React from "react";
import { Link } from "react-router-dom";
import { Shield, Zap, Star, AlertTriangle, Clock, CheckCircle2, Info, ArrowLeft } from "lucide-react";
import RichText from "components/common/RichText";
import { useAppSelector } from "services/hooks/hooks";
import { refreshAosAnimations } from "services/aos/timing";
import { useTranslations } from "services/locales/safe";
import { useLangLink } from "services/router/langPath";
import Contact from "components/common/Contact";

const STANDARD_HOURLY_RATE = 140;

export default function SupportContractPage() {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);
  const { L } = useLangLink();
  const isLight = themeReducer === "light";

  const [hasAnimated, setHasAnimated] = React.useState(false);
  React.useEffect(() => { refreshAosAnimations(); setHasAnimated(true); }, []);

  // Freeze AOS animations on theme change to prevent re-triggering entrance effects
  React.useEffect(() => {
    if (hasAnimated) {
      document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
    }
  }, [themeReducer, hasAnimated]);

  const titleColor = isLight ? "text-[#14172D]" : "text-[#F6F6F6]";
  const subtitleColor = isLight ? "text-[#677089]" : "text-[#AEB8D8]";
  const textColor = isLight ? "text-[#413C58]" : "text-[#D8D8E9]";
  const cardBase = isLight
    ? "border-[#E8E4F7] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7F5FF_50%,#EDF6FF_100%)]"
    : "border-white/10 bg-[linear-gradient(135deg,#1F1B38_0%,#2B284C_52%,#1A223C_100%)]";
  const innerCard = isLight ? "border-[#E6ECFA] bg-white/80" : "border-white/10 bg-[#10162A]/40";
  const noteBox = isLight ? "border-[#D9E8FF] bg-[#F4F9FF]" : "border-white/10 bg-[#11182D]/65";
  const iconBox = isLight ? "bg-[#EEF4FF] text-[#2E4D8D]" : "bg-white/10 text-[#A8E1FF]";

  const priorities = [
    { label: "P1", color: isLight ? "border-red-200 bg-red-50 text-red-700" : "border-red-500/30 bg-red-900/20 text-red-300", desc: t.text("it.supportPageP1Desc") },
    { label: "P2", color: isLight ? "border-orange-200 bg-orange-50 text-orange-700" : "border-orange-500/30 bg-orange-900/20 text-orange-300", desc: t.text("it.supportPageP2Desc") },
    { label: "P3", color: isLight ? "border-blue-200 bg-blue-50 text-blue-700" : "border-blue-500/30 bg-blue-900/20 text-blue-300", desc: t.text("it.supportPageP3Desc") },
  ];

  const plans = [
    {
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
      afterHours: t.text("it.supportPageAfterHoursEssential"),
      note: t.text("it.supportEssentialNote"),
      weekendIncluded: null,
    },
    {
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
      afterHours: t.text("it.supportPageAfterHoursBusiness"),
      note: t.text("it.supportBusinessNote"),
      weekendIncluded: null,
      afterHoursRates: [
        { label: t.text("it.supportAfterHoursUrgent"), rate: "190" },
        { label: t.text("it.supportAfterHoursWeekend"), rate: "220" },
      ],
    },
    {
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
      afterHours: t.text("it.supportPageAfterHoursPremium"),
      note: t.text("it.supportPremiumNote"),
      weekendIncluded: t.text("it.supportPremiumWeekendIncluded"),
      afterHoursRates: [
        { label: t.text("it.supportAfterHoursUrgent"), rate: "190" },
        { label: t.text("it.supportAfterHoursWeekend"), rate: "220" },
      ],
    },
  ];

  const limits = t.array<string>("it.supportPageLimits", []);
  const terms = t.array<string>("it.supportPageTerms", []);

  const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => (
    <div id={id} className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[20px] pb-[10px] mx-auto">
      <h2 className={`${titleColor} font-redDisplay font-bold text-[22px] md:text-[26px] xl:text-[30px] mb-6`}>{title}</h2>
      {children}
    </div>
  );

  return (
    <>
      <div className="fixed top-[73px] md:top-[100px] left-0 right-0 z-40 pointer-events-none">
        <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] mx-auto pt-[10px]">
          <Link
            to={L("/it-services")}
            className={`pointer-events-auto group inline-flex items-center gap-[6px] font-poppins text-[13px] font-medium px-[14px] py-[7px] rounded-full backdrop-blur-sm transition-all duration-200 -translate-x-[10px]
              ${isLight
                ? "bg-[#EEE9FF]/80 text-[#5f75f5] border border-[#c4b8ff]/60 hover:bg-[#E4DCFF]/90"
                : "bg-[#2B284C]/80 text-[#A89FFF] border border-[#6B5FBB]/50 hover:bg-[#332E5C]/90"
              }`}
          >
            <ArrowLeft size={13} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            {/* Strip any leading arrow character that may exist in the translation string */}
            {t.text("it.supportPageBackLink").replace(/^←\s*/, "")}
          </Link>
        </div>
      </div>

      <div className="pt-[150px] pb-[50px]">
        <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] mx-auto">
          <RichText
            as="p"
            className={`${titleColor} font-redDisplay font-bold text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] leading-tight mb-4`}
            html={t.text("it.supportPageTitle")}
          />
          <p className={`${textColor} font-poppins font-light text-[15px] md:text-[16px] leading-7 max-w-[680px]`}>
            {t.text("it.supportPageSubtitle")}
          </p>
          <div className={`${noteBox} rounded-[16px] border p-4 mt-6 max-w-[680px] flex gap-3`}>
            <Info size={16} className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} shrink-0 mt-0.5`} />
            <p className={`${textColor} font-poppins text-[13px] leading-6`}>{t.text("it.supportPageIntro")}</p>
          </div>
        </div>

        <div className="pt-[30px]">
          <Section title={t.text("it.supportPagePriorityTitle")}>
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              {priorities.map(({ label, color, desc }) => (
                <div key={label} className={`${color} rounded-[16px] border p-4 flex gap-3 items-start`} data-aos="fade-up" data-aos-duration="1100">
                  <span className="font-redDisplay text-[20px] font-bold shrink-0">{label}</span>
                  <p className="font-poppins text-[13px] leading-5 mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <div className={`${innerCard} rounded-[16px] border p-4 flex gap-3 items-start`}>
              <Clock size={15} className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} shrink-0 mt-0.5`} />
              <div>
                <p className={`${titleColor} font-poppins text-[13px] font-semibold`}>{t.text("it.supportPageHoursTitle")}</p>
                <p className={`${textColor} font-poppins text-[13px] leading-5 mt-1`}>{t.text("it.supportPageHoursDesc")}</p>
              </div>
            </div>
            <p className={`${subtitleColor} font-poppins text-[12px] italic mt-3`}>{t.text("it.supportPagePriorityDescription")}</p>
          </Section>
        </div>
      </div>

        <Section title={t.text("it.supportPagePlansTitle")}>
          <p className={`${textColor} font-poppins text-[14px] leading-6 mb-6 -mt-2`}>{t.text("it.supportPagePlansDescription")}</p>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map(({ icon: Icon, name, price, extraRate, hours, sla, afterHours, afterHoursRates, weekendIncluded, note }) => (
              <div key={name} className={`${cardBase} relative overflow-hidden rounded-[24px] border p-6`} data-aos="fade-up" data-aos-duration="1100">
                <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-[#7A6BFF]/10 blur-3xl" />
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${iconBox} flex h-10 w-10 items-center justify-center rounded-full shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <h3 className={`${titleColor} font-redDisplay text-[20px] font-bold`}>{name}</h3>
                </div>

                <div className={`${innerCard} rounded-[16px] border p-4 mb-4`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`${titleColor} font-redDisplay text-[36px] font-bold leading-none`}>{price}</span>
                    <span className={`${subtitleColor} font-poppins text-[13px]`}>CHF / {t.text("it.supportPerYear")}</span>
                  </div>
                  <div className={`${subtitleColor} font-poppins text-[12px] mt-2`}>
                    <span className="font-semibold">{hours}h</span> {t.text("it.supportIncluded")} — {t.text("it.supportExtra")}: <span className="font-semibold">{extraRate} CHF/h</span>
                    {/* Strikethrough shows the standard hourly rate before the contract discount */}
                    <span className={`${isLight ? "text-[#9B6B6B]" : "text-[#FFAAAA]"} line-through ml-1`}>{STANDARD_HOURLY_RATE}</span>
                  </div>
                </div>

                <p className={`${subtitleColor} font-poppins text-[11px] uppercase tracking-[0.18em] mb-2`}>SLA</p>
                <div className="space-y-1.5 mb-4">
                  {sla.map(({ priority, delay }) => (
                    <div key={priority} className="flex items-center justify-between">
                      <span className={`${iconBox} font-poppins text-[12px] font-semibold px-2 py-0.5 rounded-full`}>{priority}</span>
                      <span className={`${textColor} font-poppins text-[13px]`}>{delay}</span>
                    </div>
                  ))}
                </div>

                <div className={`${noteBox} rounded-[14px] border p-3 mb-3`}>
                  <p className={`${subtitleColor} font-poppins text-[11px] uppercase tracking-[0.15em] mb-1.5`}>{t.text("it.supportPageAfterHoursTitle")}</p>
                  {weekendIncluded && (
                    <div className="flex items-start gap-2 mb-1">
                      <CheckCircle2 size={13} className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} mt-0.5 shrink-0`} />
                      <p className={`${textColor} font-poppins text-[12px] leading-5`}>{weekendIncluded}</p>
                    </div>
                  )}
                  <p className={`${textColor} font-poppins text-[12px] leading-5`}>{afterHours}</p>
                  {afterHoursRates && (
                    <div className="mt-2 space-y-1">
                      {afterHoursRates.map(({ label, rate }) => (
                        <div key={label} className="flex justify-between">
                          <span className={`${subtitleColor} font-poppins text-[11px]`}>{label}</span>
                          <span className={`${textColor} font-poppins text-[11px] font-semibold`}>{rate} CHF/h</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className={`${subtitleColor} font-poppins text-[11px] leading-5 italic`}>{note}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t.text("it.supportPageLimitTitle")}>
          <div className="grid gap-3 md:grid-cols-2">
            {limits.map((item) => (
              <div key={item} className={`${noteBox} flex items-start gap-3 rounded-[16px] border p-4`} data-aos="fade-up" data-aos-duration="1100">
                <AlertTriangle size={15} className={`${isLight ? "text-[#8B6914]" : "text-[#FFD580]"} shrink-0 mt-0.5`} />
                <p className={`${textColor} font-poppins text-[13px] leading-5`}>{item}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t.text("it.supportPageTermsTitle")}>
          <div className="grid gap-3 md:grid-cols-2">
            {terms.map((item) => (
              <div key={item} className={`${innerCard} flex items-start gap-3 rounded-[16px] border p-4`} data-aos="fade-up" data-aos-duration="1100">
                <CheckCircle2 size={15} className={`${isLight ? "text-[#2E4D8D]" : "text-[#9EDCFF]"} shrink-0 mt-0.5`} />
                <p className={`${textColor} font-poppins text-[13px] leading-5`}>{item}</p>
              </div>
            ))}
          </div>
        </Section>

      <Contact />
    </>
  );
}
