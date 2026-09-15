/**
 * Replaces the form once a message has been sent, with a way back to a blank
 * form so a visitor can send a second one without reloading.
 */

import { useTranslations } from "@shared/i18n/translator";

export interface ContactSuccessProps {
  language: string;
  theme: string;
  onSendAnother: () => void;
}

export default function ContactSuccess({ language, theme, onSendAnother }: ContactSuccessProps) {
  const t = useTranslations(language);
  const themeReducer = theme;

  return (
    <div className="w-full lg:w-[50%] flex flex-col items-center justify-center text-center gap-y-[20px] py-[40px]">
      <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #5b4fcf, #a855f7)" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className={`font-redDisplay font-bold text-[22px] md:text-[26px] text-ink`}>
        {t.text("home.contactSuccessTitle")}
      </h3>
      <p className={`font-poppins font-light text-[14px] md:text-[16px] max-w-[380px] leading-relaxed ${themeReducer === "light" ? "text-[#555555]" : "text-[#C8CADE]"}`}>
        {t.text("home.contactSuccessBody")}
      </p>
      <button
        type="button"
        onClick={() => onSendAnother()}
        className="custom-btn rounded-[80px] text-white px-[40px] py-[11px] lg:py-[14px] mt-[8px]"
      >
        <span className="custom-btn-inner">{t.text("home.contactSuccessNew")}</span>
      </button>
    </div>
  );
}
