/**
 * Terms and conditions.
 *
 * Restates the commercial conditions the project already documented — hourly
 * rates, payment schedule, late-payment interest, corrective warranty, business
 * hours and the included / excluded scope — in one place a quote can point at.
 *
 * The rates are written here rather than read from the `it` bundle on purpose:
 * that bundle drives the marketing sections, which are reworded freely, and a
 * contractual page must not change wording as a side effect. When a rate
 * changes it has to change in both, which is the intended friction.
 */

import React from "react";

import LegalPageShell from "@features/legal/components/legal-page-shell";

import ObfuscatedEmail from "@shared/components/obfuscated-email";
import { getContactEmail } from "@shared/constants/contact";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

/** Date this page was last reviewed. */
const LAST_REVIEWED = "2026-09-17";

/** Hourly rates, in CHF, as published in the practical-information section. */
const RATES = {
  standard: "140",
  urgent: "190",
  weekend: "220",
} as const;

export default function TermsPage() {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);
  const isLight = themeReducer === "light";

  const rateRows = [
    { label: t.text("terms.s3RateStandard"), rate: RATES.standard },
    { label: t.text("terms.s3RateUrgent"), rate: RATES.urgent },
    { label: t.text("terms.s3RateWeekend"), rate: RATES.weekend },
  ];

  return (
    <LegalPageShell
      title={t.text("terms.pageTitle")}
      lastUpdatedLabel={t.text("terms.lastUpdated")}
      lastUpdatedOn={LAST_REVIEWED}
    >
      {(c) => (
        <>
          <p className={c.body}>{t.text("terms.intro")}</p>

          {/* The page is honest about being incomplete rather than implying a
              full legal review has happened. */}
          <div
            className={`${isLight ? "border-[#D9E8FF] bg-[#F4F9FF]" : "border-white/10 bg-[#11182D]/65"} mt-6 rounded-[16px] border p-4`}
          >
            <p className={`${c.heading} font-medium`}>{t.text("terms.draftNoticeTitle")}</p>
            <p className={`${c.body} mt-1`}>{t.text("terms.draftNotice")}</p>
          </div>

          <h2 className={c.h2}>{t.text("terms.s1Title")}</h2>
          <p className={c.body}>{t.text("terms.s1Desc")}</p>
          <p className={`${c.body} mt-2`}>{t.text("terms.s1Quote")}</p>

          <h2 className={c.h2}>{t.text("terms.s2Title")}</h2>
          <p className={c.body}>{t.text("terms.s2Desc")}</p>
          <p className={`${c.body} mt-2`}>{t.text("terms.s2Order")}</p>

          <h2 className={c.h2}>{t.text("terms.s3Title")}</h2>
          <p className={c.body}>{t.text("terms.s3Desc")}</p>
          <ul className={c.list}>
            {rateRows.map(({ label, rate }) => (
              <li key={label}>
                {label} : <span className="font-medium">{rate} CHF/h</span>
              </li>
            ))}
          </ul>
          <p className={c.body}>{t.text("terms.s3MinBilling")}</p>
          <p className={`${c.body} mt-2`}>{t.text("terms.s3Currency")}</p>

          <h2 className={c.h2}>{t.text("terms.s4Title")}</h2>
          <p className={c.body}>{t.text("terms.s4Schedule")}</p>
          <p className={`${c.body} mt-2`}>{t.text("terms.s4Holidays")}</p>

          <h2 className={c.h2}>{t.text("terms.s5Title")}</h2>
          <ul className={c.list}>
            <li>{t.text("terms.s5Step1")}</li>
            <li>{t.text("terms.s5Step2")}</li>
          </ul>
          <p className={c.body}>{t.text("terms.s5Late")}</p>

          <h2 className={c.h2}>{t.text("terms.s6Title")}</h2>
          <h3 className={c.h3}>{t.text("terms.s6IncludedTitle")}</h3>
          <ul className={c.list}>
            {t.array<string>("terms.s6Included", []).map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
          <h3 className={c.h3}>{t.text("terms.s6ExcludedTitle")}</h3>
          <ul className={c.list}>
            {t.array<string>("terms.s6Excluded", []).map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
          <p className={c.body}>{t.text("terms.s6Note")}</p>

          <h2 className={c.h2}>{t.text("terms.s7Title")}</h2>
          <p className={c.body}>{t.text("terms.s7Desc")}</p>

          <h2 className={c.h2}>{t.text("terms.s8Title")}</h2>
          <p className={c.body}>{t.text("terms.s8Desc")}</p>
          <h3 className={c.h3}>{t.text("terms.s8ExclusionsTitle")}</h3>
          <ul className={c.list}>
            {t.array<string>("terms.s8Exclusions", []).map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
          <p className={c.body}>{t.text("terms.s8After")}</p>

          <h2 className={c.h2}>{t.text("terms.s9Title")}</h2>
          <p className={c.body}>{t.text("terms.s9Desc")}</p>

          <h2 className={c.h2}>{t.text("terms.s10Title")}</h2>
          <p className={c.body}>
            {t.text("terms.s10Desc")}{" "}
            <ObfuscatedEmail address={getContactEmail()} className={c.link} />
          </p>
        </>
      )}
    </LegalPageShell>
  );
}
