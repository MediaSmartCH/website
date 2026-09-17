import React, { lazy, Suspense } from "react";
// BLOC "CE QUE CELA CHANGE POUR VOUS" DÉSACTIVÉ — NE PAS SUPPRIMER
// Briefcase, CheckCircle2, MapPin et User n'illustraient que les trois vignettes
// de statistiques et le panneau des bénéfices, tous deux commentés plus bas.
// import { Briefcase, CheckCircle2, ExternalLink, MapPin, User } from "lucide-react";
import { ExternalLink } from "lucide-react";

import RichText from "@shared/components/rich-text";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

import raphaelPhoto from "@assets/images/raphael-rouiller.webp";

// Hoisted to module scope: declaring lazy() inside the component body creates a
// new component type on every render, which remounts the Lottie player.
const DotAnim = lazy(() => import("@shared/components/dot-anim"));

const About = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);
  const isLight = themeReducer === "light";
  /* ==========================================================================
   * BLOC "CE QUE CELA CHANGE POUR VOUS" DÉSACTIVÉ — NE PAS SUPPRIMER
   * La présentation disait cinq fois la même chose : le badge "Indépendant",
   * la ligne de rôle, le paragraphe "je travaille seul", la vignette
   * "1 interlocuteur unique" et le panneau des bénéfices répétaient tous
   * l'unicité de l'interlocuteur. Les vignettes et le panneau ne sont plus
   * rendus ; la photo prend la place gagnée.
   * Les clés (home.soloStat*, home.soloHighlights, home.soloWorkingTitle,
   * home.soloNote, home.soloBadge, home.soloRole) restent dans les deux
   * dictionnaires.
   * POUR RÉACTIVER : décommenter ces deux listes et les deux blocs de rendu
   * marqués plus bas.
   * ====================================================================== */
  // const soloStats = [
  //   {
  //     icon: User,
  //     label: t.text("home.soloStatDirectLabel"),
  //     value: t.text("home.soloStatDirectValue"),
  //   },
  //   {
  //     icon: Briefcase,
  //     label: t.text("home.soloStatExpertiseLabel"),
  //     value: t.text("home.soloStatExpertiseValue"),
  //   },
  //   {
  //     icon: MapPin,
  //     label: t.text("home.soloStatLocationLabel"),
  //     value: t.text("home.soloStatLocationValue"),
  //   },
  // ];
  // const soloHighlights = t.array<string>("home.soloHighlights", []);

  return (
    <div id="about" className="scroll-mt-[120px]">
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] py-[40px] mx-auto">
        <div
          className={`bg-surface rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] pt-[35px] lg:pt-[50px] 2xl:pt-[50px] pb-[35px] lg:pb-[50px] 2xl:pb-[50px]`}
        >
          <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-[30px] lg:gap-[50px] pl-[30px] 2xl:pl-[80px] pr-[30px] 2xl:pr-[50px]">
            <div className="w-full lg:w-[50%]">
              <div
                className="w-full md:w-[90%] mx-auto lg:mx-0 lg:w-[85%] 2xl:w-[70%]"
                data-aos="fade-right"
                data-aos-duration="1200"
              >
                <h2
                  className={`text-heading w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                >
                  {t.text("home.aboutTitle")}
                  <span className="gradient-text">
                    {t.text("home.aboutSubtitle")}
                  </span>

                </h2>
                <RichText
                  className={`text-body about-description w-full text-center lg:text-left font-poppins font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
                  html={t.text("home.aboutDescription")}
                />
              </div>
            </div>
            <div
              className="w-full md:w-[60%] lg:w-[50%] flex justify-center items-center"
              data-aos="fade-left"
              data-aos-duration="1300"
            >
              <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                <Suspense
                  fallback={
                    <div className="h-[220px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                    </div>
                  }
                >
                  <DotAnim
                    anim="home.about"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {/* The person belongs in "About MediaSmart", not in a block of its
              own: who answers is part of what the company is. Inside the same
              surface, separated by a rule rather than by a second panel.

              Portrait first and large: the point is that a person answers, so
              the person is what a visitor should see. The copy is two
              sentences — everything else repeated them. */}
          <div className="px-[30px] 2xl:px-[80px]">
            <div
              className={`${isLight ? "bg-[#E1E0F5]" : "bg-white/12"} mx-auto mt-[40px] mb-[40px] h-px w-full max-w-[880px]`}
              aria-hidden="true"
            />
          </div>

          <div className="px-[30px] 2xl:px-[80px]">
            <div className="mx-auto grid max-w-[880px] items-center gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-12">
            <div
              className="mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:mx-0"
              data-aos="fade-right"
              data-aos-duration="1100"
            >
              <div className="relative aspect-square w-full rounded-[36px] bg-[linear-gradient(135deg,#14172D_0%,#304C89_55%,#60B6FF_100%)] p-[2px] shadow-[0_35px_80px_-30px_rgba(20,23,45,0.6)]">
                <img
                  src={raphaelPhoto}
                  alt={t.text("home.soloName")}
                  width={640}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-[34px] object-cover object-top select-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                {/* Transparent overlay prevents right-click save on the photo */}
                <div className="absolute inset-0 rounded-[34px]" onContextMenu={(e) => e.preventDefault()} />
              </div>
            </div>

            <div
              className="text-center lg:text-left"
              data-aos="fade-left"
              data-aos-duration="1200"
            >
              <h3 className="text-heading font-redDisplay text-[30px] font-bold leading-tight md:text-[38px] 2xl:text-[42px]">
                {t.text("home.soloName")}
              </h3>
              <p className={`${isLight ? "text-[#6B7A99]" : "text-[#A8B4D0]"} mt-1 font-poppins text-[13px] font-medium uppercase tracking-[0.12em]`}>
                {t.text("home.soloJobTitle")}
              </p>

              <p className={`${isLight ? "text-[#1D2340]" : "text-white"} mt-5 font-poppins text-base md:text-lg font-medium leading-7`}>
                {t.text("home.soloLead")}
              </p>
              <p className={`${isLight ? "text-[#4C4966]" : "text-[#D8D8E9]"} mt-3 font-poppins text-sm md:text-base leading-7`}>
                {t.text("home.soloDescription")}
              </p>

              <a
                href="https://linkedin.com/in/rphlr"
                target="_blank"
                rel="noopener noreferrer"
                className={`${isLight ? "text-[#2E4D8D] hover:text-[#1a3a7a]" : "text-[#9EDCFF] hover:text-white"} mt-5 inline-flex items-center gap-1.5 font-poppins text-sm transition-colors`}
              >
                <ExternalLink size={15} />
                linkedin.com/in/rphlr
              </a>
              </div>
            </div>

          {/* ====================================================================
              BLOC "CE QUE CELA CHANGE POUR VOUS" DÉSACTIVÉ — NE PAS SUPPRIMER
              Les trois vignettes (Format / Domaines / Base) et le panneau des
              bénéfices redisaient ce que la photo et les deux phrases ci-dessus
              disent déjà. Leur balisage et leurs clés restent intacts.
              POUR RÉACTIVER : décommenter le bloc ci-dessous, lui rendre ses
              balises de commentaire JSX, et décommenter soloStats /
              soloHighlights en tête de composant.

              === Stats: Format / Domaines / Base ===
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {soloStats.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className={`${isLight ? "border-[#E6ECFA] bg-white/80" : "border-white/10 bg-[#10162A]/40"} rounded-[20px] border p-4`}
                  >
                    <div className={`${isLight ? "bg-[#EEF4FF] text-[#2E4D8D]" : "bg-white/10 text-[#A8E1FF]"} mb-4 flex h-9 w-9 items-center justify-center rounded-full`}>
                      <Icon size={17} />
                    </div>
                    <p className={`text-muted font-poppins text-[11px] uppercase tracking-[0.18em]`}>
                      {label}
                    </p>
                    <p className={`text-heading-invert mt-2 font-redDisplay text-lg font-bold leading-6`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              === Panel: "Ce que cela change pour vous" ===
              <div
                className={`${isLight ? "border-white bg-white/65" : "border-white/10 bg-[#0F1325]/25"} rounded-[24px] border p-5 md:p-7 backdrop-blur-sm`}
                data-aos="fade-up"
                data-aos-duration="1250"
              >
                <div className="flex items-center gap-3">
                  <div className={`${isLight ? "bg-[#EEF4FF] text-[#2E4D8D]" : "bg-white/10 text-[#A8E1FF]"} flex h-10 w-10 items-center justify-center rounded-full`}>
                    <Briefcase size={18} />
                  </div>
                  <h4 className={`text-heading font-redDisplay text-[24px] font-bold leading-tight`}>
                    {t.text("home.soloWorkingTitle")}
                  </h4>
                </div>

                <div className="mt-6 space-y-3">
                  {soloHighlights.map((highlight) => (
                    <div
                      key={highlight}
                      className={`${isLight ? "border-[#E9EDF8] bg-white/80" : "border-white/10 bg-white/5"} flex items-start gap-3 rounded-[18px] border p-4`}
                    >
                      <CheckCircle2 className={`text-accent mt-0.5 shrink-0`} size={18} />
                      <p className={`text-body font-poppins text-sm md:text-[15px] leading-6`}>
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={`${isLight ? "border-[#D9E8FF] bg-[#F4F9FF]" : "border-white/10 bg-[#11182D]/65"} mt-6 rounded-[20px] border p-5`}>
                  <p className={`${isLight ? "text-[#24304A]" : "text-[#F1F4FF]"} font-poppins text-sm md:text-base leading-6`}>
                    {t.text("home.soloNote")}
                  </p>
                </div>
              </div>
          ==================================================================== */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
