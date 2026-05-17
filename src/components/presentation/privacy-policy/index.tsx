import React, { useEffect, useState } from "react";

import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import { refreshAosAnimations } from "services/aos/timing";

export default function PrivacyPolicy() {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);

  const [formattedDate, setFormattedDate] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const currentDate = new Date("2026-03-26");
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const locale = languageReducer === "en" ? "en-US" : "fr-FR";
    setFormattedDate(currentDate.toLocaleDateString(locale, options));
  }, [languageReducer]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      refreshAosAnimations();
      setHasAnimated(true);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Freeze AOS animations on theme change to prevent re-triggering entrance effects
  useEffect(() => {
    if (!hasAnimated) return;
    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.classList.add("aos-animate");
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "none";
    });
  }, [themeReducer, hasAnimated]);

  const tc = (light: string, dark: string) => (themeReducer === "light" ? light : dark);
  const textPrimary = tc("text-[#14172D]", "text-[#F6F6F6]");
  const textBody = tc("text-[#413C58]", "text-[#E5E5E5]");

  const h2Class = `text-xl font-semibold mt-8 mb-4 font-redDisplay ${textPrimary}`;
  const h3Class = `font-semibold mt-4 ${textBody}`;
  const pClass = textBody;
  const ulClass = `list-disc list-inside mt-2 mb-4 ml-4 ${textBody}`;
  const linkClass = "text-blue-600 underline";

  const googlePrivacyUrl = "https://policies.google.com/privacy";
  const recaptchaUrl = "https://www.google.com/recaptcha/about";
  const analyticsUrl =
    languageReducer === "en"
      ? "https://support.google.com/analytics/answer/6004245?hl=en"
      : "https://support.google.com/analytics/answer/6004245?hl=fr";
  const fadpUrl = "https://www.fedlex.admin.ch/eli/cc/2022/491/" + (languageReducer === "en" ? "en" : "fr");
  const gdprUrl = "https://eur-lex.europa.eu/eli/reg/2016/679/oj";
  const commissionerUrl =
    languageReducer === "en"
      ? "https://www.edoeb.admin.ch/edoeb/en/home.html"
      : "https://www.edoeb.admin.ch/edoeb/fr/home.html";

  const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );

  return (
    <div className="w-full pt-[73px] md:pt-[130px] lg:pt-[100px]">
      <div className="relative z-10 px-[20px] pt-[28px] md:pt-[40px] lg:pt-[52px] xl:pt-[60px] 2xl:pt-[72px] flex justify-center items-start">
        <div>
          <h1
            className={`${textPrimary} w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px]`}
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-easing="ease-in-sine"
          >
            {t.text("privacy.pageTitle")} <span>-</span>{" "}
            <span className="gradient-text">MediaSmart</span>
          </h1>
          <p
            className={`${textBody} w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] lg:w-[80%] 2xl:w-[65%]`}
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-easing="ease-in-sine"
          >
            {t.text("privacy.lastUpdated")} {formattedDate}
          </p>
        </div>
      </div>

      <div className="relative z-10 font-poppins font-light text-sm w-full flex justify-center homepage-container px-[25px] md:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[18px] md:pt-[30px] lg:pt-[24px] pb-[70px]">
        <div className="max-w-3xl mx-auto">
          <p className={pClass}>{t.text("privacy.intro")}</p>

          {/* 1 */}
          <h2 className={h2Class}>{t.text("privacy.s1Title")}</h2>
          <p className={pClass}>
            <span className="font-medium">{t.text("privacy.s1Name")}</span>
            <br />
            {t.text("privacy.s1LegalForm")}
            <br />
            {t.text("privacy.s1Address")}
            <br />
            {t.text("privacy.s1Email")}{" "}
            <a href="mailto:hello@mediasmart.ch" className={linkClass}>
              hello[at]mediasmart.ch
            </a>
            <br />
            {t.text("privacy.s1Phone")}{" "}
            <a href="tel:+41796578612" className={linkClass}>
              +41 79 657 86 12
            </a>
          </p>

          {/* 2 */}
          <h2 className={h2Class}>{t.text("privacy.s2Title")}</h2>

          <h3 className={h3Class}>{t.text("privacy.s2aTitle")}</h3>
          <ul className={ulClass}>
            <li>{t.text("privacy.s2aItem1")}</li>
            <li>{t.text("privacy.s2aItem2")}</li>
            <li>{t.text("privacy.s2aItem3")}</li>
            <li>{t.text("privacy.s2aItem4")}</li>
          </ul>
          <p className={pClass}>
            <span className="font-medium">{t.text("privacy.s2aPurposeLabel")}</span>{" "}
            {t.text("privacy.s2aPurpose")}
            <br />
            <span className="font-medium">{t.text("privacy.s2aLegalLabel")}</span>{" "}
            {t.text("privacy.s2aLegal")}
          </p>

          <h3 className={h3Class}>{t.text("privacy.s2bTitle")}</h3>
          <ul className={ulClass}>
            <li>{t.text("privacy.s2bItem1")}</li>
            <li>{t.text("privacy.s2bItem2")}</li>
            <li>{t.text("privacy.s2bItem3")}</li>
            <li>{t.text("privacy.s2bItem4")}</li>
          </ul>
          <p className={pClass}>
            <span className="font-medium">{t.text("privacy.s2bPurposeLabel")}</span>{" "}
            {t.text("privacy.s2bPurpose")}
            <br />
            <span className="font-medium">{t.text("privacy.s2bLegalLabel")}</span>{" "}
            {t.text("privacy.s2bLegal")}
            <br />
            <span className="font-medium">{t.text("privacy.s2bToolLabel")}</span>{" "}
            {t.text("privacy.s2bTool")}
          </p>

          <h3 className={h3Class}>{t.text("privacy.s2cTitle")}</h3>
          <p className={`mt-2 mb-4 ${pClass}`}>
            {t.text("privacy.s2cDesc")}
            <br />
            <span className="font-medium">{t.text("privacy.s2cGoogleLabel")}</span>{" "}
            <ExternalLink href={googlePrivacyUrl}>
              {languageReducer === "en"
                ? "Google Privacy Policy"
                : "Politique de confidentialité Google"}
            </ExternalLink>{" "}
            •{" "}
            <ExternalLink href={recaptchaUrl}>
              {t.text("privacy.s2cRecaptchaLabel")}
            </ExternalLink>
          </p>
          <p className={pClass}>
            <span className="font-medium">
              {languageReducer === "en" ? "Purpose:" : "Utilisation :"}
            </span>{" "}
            {languageReducer === "en" ? "security of the site." : "sécurité du site."}
            <br />
            <span className="font-medium">
              {languageReducer === "en" ? "Legal basis:" : "Base légale :"}
            </span>{" "}
            {languageReducer === "en" ? "legitimate interest." : "intérêt légitime."}
          </p>

          <h3 className={h3Class}>{t.text("privacy.s2dTitle")}</h3>
          <ul className={ulClass}>
            <li>{t.text("privacy.s2dItem1")}</li>
            <li>{t.text("privacy.s2dItem2")}</li>
            <li>{t.text("privacy.s2dItem3")}</li>
            <li>{t.text("privacy.s2dItem4")}</li>
          </ul>
          <p className={pClass}>
            <span className="font-medium">{t.text("privacy.s2dPurposeLabel")}</span>{" "}
            {t.text("privacy.s2dPurpose")}
            <br />
            <span className="font-medium">{t.text("privacy.s2dLegalLabel")}</span>{" "}
            {t.text("privacy.s2dLegal")}
            <br />
            <span className="font-medium">
              {languageReducer === "en" ? "Google Analytics Policy:" : "Liens :"}
            </span>{" "}
            <ExternalLink href={analyticsUrl}>
              {t.text("privacy.s2dAnalyticsLabel")}
            </ExternalLink>
          </p>

          {/* 3 */}
          <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${textPrimary}`}>
            {t.text("privacy.s3Title")}
          </h2>
          <p className={pClass}>
            {t.text("privacy.s3Intro")}
            <br />
            <span className="font-medium">{t.text("privacy.s3NecessaryLabel")}</span>{" "}
            {t.text("privacy.s3Necessary")}
            <br />
            <span className="font-medium">{t.text("privacy.s3FunctionalityLabel")}</span>{" "}
            {t.text("privacy.s3Functionality")}
            <br />
            <span className="font-medium">{t.text("privacy.s3PerformanceLabel")}</span>{" "}
            {t.text("privacy.s3Performance")}
          </p>
          <p className={pClass}>
            {languageReducer === "en" ? (
              <>
                You can change your preferences at any time by clicking the{" "}
                <span className="font-medium">{t.text("privacy.s3ManageBold")}</span>{" "}
                ("Manage my cookies").
              </>
            ) : (
              <>
                Vous pouvez modifier vos préférences à tout moment en cliquant sur l'icône{" "}
                <span className="font-medium">{t.text("privacy.s3ManageBold")}</span> de la page
                (« Gérer mes cookies »).
              </>
            )}
          </p>

          {/* 4 */}
          <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${textPrimary}`}>
            {t.text("privacy.s4Title")}
          </h2>
          <p className={pClass}>
            {t.text("privacy.s4Desc")}{" "}
            <ExternalLink href="https://vercel.com/legal/dpa">
              {t.text("privacy.s4DpaLink")}
            </ExternalLink>
            {t.text("privacy.s4DpaTrailing")}
          </p>
          <p className={`${pClass} mt-3`}>
            {t.text("privacy.s4Details")}{" "}
            <ExternalLink href="https://vercel.com/legal/privacy-policy">
              <span className="font-medium">{t.text("privacy.s4PrivacyLink")}</span>
            </ExternalLink>
            .
          </p>

          {/* 5 */}
          <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${textPrimary}`}>
            {t.text("privacy.s5Title")}
          </h2>
          <ul className={`list-disc list-inside ml-4 ${textBody}`}>
            <li>{t.text("privacy.s5Item1")}</li>
            <li>{t.text("privacy.s5Item2")}</li>
            <li>{t.text("privacy.s5Item3")}</li>
            <li>{t.text("privacy.s5Item4")}</li>
          </ul>

          {/* 6 */}
          <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${textPrimary}`}>
            {t.text("privacy.s6Title")}
          </h2>
          <p className={pClass}>{t.text("privacy.s6Desc")}</p>

          {/* 7 */}
          <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${textPrimary}`}>
            {t.text("privacy.s7Title")}
          </h2>
          <p className={pClass}>{t.text("privacy.s7Desc")}</p>

          {/* 8 */}
          <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${textPrimary}`}>
            {t.text("privacy.s8Title")}
          </h2>
          <p className={pClass}>
            {t.text("privacy.s8Desc1")}{" "}
            <ExternalLink href={fadpUrl}>{t.text("privacy.s8FadpLink")}</ExternalLink>{" "}
            {t.text("privacy.s8Desc2")}{" "}
            <ExternalLink href={gdprUrl}>{t.text("privacy.s8GdprLink")}</ExternalLink>
            {t.text("privacy.s8Desc3")}
          </p>
          <p className={`${pClass} mt-2`}>
            {t.text("privacy.s8Contact")}{" "}
            <a href="mailto:privacy@mediasmart.ch" className={linkClass}>
              privacy[at]mediasmart.ch
            </a>
            {". "}
            {t.text("privacy.s8Complaint")}{" "}
            <ExternalLink href={commissionerUrl}>
              {t.text("privacy.s8CommissionerLink")}
            </ExternalLink>
            .
          </p>

          {/* 9 */}
          <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${textPrimary}`}>
            {t.text("privacy.s9Title")}
          </h2>
          <p className={pClass}>{t.text("privacy.s9Desc")}</p>

          {/* 10 */}
          <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${textPrimary}`}>
            {t.text("privacy.s10Title")}
          </h2>
          <p className={pClass}>{t.text("privacy.s10Desc")}</p>
        </div>
      </div>
    </div>
  );
}
