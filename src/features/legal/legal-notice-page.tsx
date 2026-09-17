/**
 * Legal notice (mentions légales / impressum).
 *
 * Identifies who publishes the site and under what conditions its content may
 * be reused. Every detail is read from the same constants the privacy policy
 * uses, so the identity block cannot go out of sync between the two pages.
 */

import React from "react";
import { Link } from "react-router-dom";

import LegalPageShell from "@features/legal/components/legal-page-shell";

import ObfuscatedEmail from "@shared/components/obfuscated-email";
import {
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  getContactEmail,
} from "@shared/constants/contact";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";

/** Date this page was last reviewed. */
const LAST_REVIEWED = "2026-09-17";

export default function LegalNoticePage() {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(languageReducer);
  const { L } = useLangLink();

  return (
    <LegalPageShell
      title={t.text("legal.pageTitle")}
      lastUpdatedLabel={t.text("legal.lastUpdated")}
      lastUpdatedOn={LAST_REVIEWED}
    >
      {(c) => (
        <>
          <p className={c.body}>{t.text("legal.intro")}</p>

          <h2 className={c.h2}>{t.text("legal.s1Title")}</h2>
          <p className={c.body}>
            <span className="font-medium">{t.text("legal.s1Name")}</span>
            <br />
            {t.text("legal.s1LegalForm")}
            <br />
            {t.text("legal.s1Address")}
            <br />
            {t.text("legal.s1Email")}{" "}
            <ObfuscatedEmail address={getContactEmail()} className={c.link} />
            <br />
            {t.text("legal.s1Phone")}{" "}
            <a href={`tel:${CONTACT_PHONE}`} className={c.link}>
              {CONTACT_PHONE_DISPLAY}
            </a>
            <br />
            {t.text("legal.s1Publisher")}
          </p>

          <h2 className={c.h2}>{t.text("legal.s2Title")}</h2>
          <p className={c.body}>
            {t.text("legal.s2Desc")}{" "}
            <Link to={L("/privacy-policy")} className={c.link}>
              {t.text("legal.s2PrivacyLink")}
            </Link>
            .{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className={c.link}
            >
              {t.text("legal.s2VercelLink")}
            </a>
          </p>

          <h2 className={c.h2}>{t.text("legal.s3Title")}</h2>
          <p className={c.body}>{t.text("legal.s3Desc")}</p>
          <p className={`${c.body} mt-2`}>{t.text("legal.s3Reuse")}</p>

          <h2 className={c.h2}>{t.text("legal.s4Title")}</h2>
          <p className={c.body}>{t.text("legal.s4Desc")}</p>

          <h2 className={c.h2}>{t.text("legal.s5Title")}</h2>
          <p className={c.body}>
            {t.text("legal.s5Desc")}{" "}
            <Link to={L("/privacy-policy")} className={c.link}>
              {t.text("legal.s5PrivacyLink")}
            </Link>
            .
          </p>
          <p className={`${c.body} mt-2`}>{t.text("legal.s5Cookies")}</p>

          <h2 className={c.h2}>{t.text("legal.s6Title")}</h2>
          <p className={c.body}>
            {t.text("legal.s6Desc")}{" "}
            <Link to={L("/terms")} className={c.link}>
              {t.text("legal.s6TermsLink")}
            </Link>
            .
          </p>

          <h2 className={c.h2}>{t.text("legal.s7Title")}</h2>
          <p className={c.body}>
            {t.text("legal.s7Desc")}{" "}
            <ObfuscatedEmail address={getContactEmail()} className={c.link} />
          </p>
        </>
      )}
    </LegalPageShell>
  );
}
