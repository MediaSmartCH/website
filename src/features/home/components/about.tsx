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
          className={`bg-surface rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] px-[30px] lg:px-[50px] 2xl:px-[80px] py-[35px] lg:py-[50px]`}
        >
          {/* Heading and intro run across the top, then the illustration and
              the person share one row underneath. Stacking them as two
              full-width rows made the section twice as tall for the same
              content. */}
          <div className="mx-auto max-w-[1180px]">
          <div
            className="max-w-[640px] mx-auto text-center lg:mx-0 lg:text-left"
            data-aos="fade-up"
            data-aos-duration="1100"
          >
            <h2
              className={`text-heading font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
            >
              {t.text("home.aboutTitle")}
              <span className="gradient-text">{t.text("home.aboutSubtitle")}</span>
            </h2>
            <RichText
              className={`text-body about-description font-poppins font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]`}
              html={t.text("home.aboutDescription")}
            />
          </div>

          <div className="mt-[30px] lg:mt-[40px] grid items-center gap-[30px] lg:grid-cols-2 lg:gap-[50px]">
            <div
              // Capped: left to fill its column, the illustration grew to the
              // height of the card and stranded the person block in whitespace.
              className="order-2 w-full max-w-[460px] mx-auto lg:order-1 xl:max-w-[520px]"
              data-aos="fade-right"
              data-aos-duration="1200"
            >
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

            {/* The person, as a compact row rather than a section: portrait,
                name, role, one sentence. */}
            <div
              // Row when the column is wide enough for it, stacked otherwise.
              // Between lg and xl this column is only about a third of the
              // viewport, where a portrait beside text squeezes the name onto
              // three lines.
              className="order-1 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left lg:flex-col lg:items-start lg:text-left xl:flex-row xl:items-center lg:order-2"
              data-aos="fade-left"
              data-aos-duration="1300"
            >
              <div className="w-[150px] shrink-0 sm:w-[170px] xl:w-[190px]">
                <div className="relative aspect-square w-full rounded-[28px] bg-[linear-gradient(135deg,#14172D_0%,#304C89_55%,#60B6FF_100%)] p-[2px] shadow-[0_25px_60px_-25px_rgba(20,23,45,0.55)]">
                  <img
                    src={raphaelPhoto}
                    alt={t.text("home.soloName")}
                    width={640}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-[26px] object-cover object-top select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Transparent overlay prevents right-click save on the photo */}
                  <div
                    className="absolute inset-0 rounded-[26px]"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-heading font-redDisplay text-[22px] font-bold leading-tight md:text-[26px]">
                  {t.text("home.soloName")}
                </h3>
                <p
                  className={`${isLight ? "text-[#6B7A99]" : "text-[#A8B4D0]"} mt-1 font-poppins text-[11px] font-medium uppercase tracking-[0.12em]`}
                >
                  {t.text("home.soloJobTitle")}
                </p>
                <p
                  className={`${isLight ? "text-[#1D2340]" : "text-white"} mt-3 font-poppins text-[14px] md:text-[15px] font-medium leading-6`}
                >
                  {t.text("home.soloLead")}
                </p>
                <a
                  href="https://linkedin.com/in/rphlr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isLight ? "text-[#2E4D8D] hover:text-[#1a3a7a]" : "text-[#9EDCFF] hover:text-white"} mt-3 inline-flex items-center gap-1.5 font-poppins text-[13px] transition-colors`}
                >
                  <ExternalLink size={14} />
                  linkedin.com/in/rphlr
                </a>
              </div>
            </div>
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
  );
};

export default About;
