import React from "react";
import { ChevronDown, Check } from "lucide-react";
import { Checkbox } from "antd";
import { PhoneInput, removeDialCode, guessCountryByPartialPhoneNumber } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { getRecaptchaToken } from "@shared/lib/recaptcha";
import {
  getSubmissionLanguage,
  submitContactForm,
} from "@features/contact/lib/contact-api";
import {
  getLocalDigits,
  isDialCodeOnly,
  isValidEmailStrict,
} from "@features/contact/lib/contact-validation";
import { useIntentToggle } from "@features/contact/hooks/use-intent-toggle";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

import email from "@assets/icons/email.svg";
import address from "@assets/icons/address.svg";
import phone from "@assets/icons/phone.svg";
import insta from "@assets/icons/contactInsta.svg";
import linkedin from "@assets/icons/contactLinkedin.svg";
import telegram from "@assets/icons/telegram.svg";
import contactUser from "@assets/icons/contactUser.svg";
import contactEmail from "@assets/icons/contactEmail.svg";
import contactPhone from "@assets/icons/contactPhone.svg";
import contactMessage from "@assets/icons/contactMessage.svg";
import arrow from "@assets/icons/rightArrow.svg";

import { Link } from "react-router-dom";
import { useLangLink } from "@shared/hooks/use-localized-path";
import ScopedRecaptchaProvider from "@shared/components/scoped-recaptcha-provider";
import ProjectTypeDropdown from "@features/contact/components/project-type-dropdown";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_DISPLAY,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  OFFICE_MAP_URL,
  SOCIAL_LINKS,
} from "@shared/constants/contact";

const ContactInner = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { L } = useLangLink();

  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);

  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [error, setError] = React.useState("");
  const [intent, setIntent] = React.useState<"question" | "quote">("question");
  const [projectType, setProjectType] = React.useState("");
  const [projectTypeValid, setProjectTypeValid] = React.useState(true);

  // Listen for external "contact-intent" events so other components can pre-select
  // the question/quote toggle (e.g. a CTA button on another section).
  React.useEffect(() => {
    const handler = (e: CustomEvent) => {
      setIntent(e.detail.intent);
      if (e.detail.intent === "question") setProjectType("");
    };
    window.addEventListener("contact-intent", handler as EventListener);
    return () => window.removeEventListener("contact-intent", handler as EventListener);
  }, []);

  const [contact, setContact] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const [phoneValue, setPhoneValue] = React.useState("");
  const [phoneValid, setPhoneValid] = React.useState(true);

  const dialOnly = isDialCodeOnly(phoneValue);

  const { toggleRef, dragIntent, shouldIgnoreClick, handlers: toggleHandlers } =
    useIntentToggle({
      intent,
      onIntentChange: (next) => {
        setIntent(next);
        if (next === "question") {
          setProjectType("");
          setProjectTypeValid(true);
        }
      },
    });

  const [nameValid, setNameValid] = React.useState(true);
  const [messageValid, setMessageValid] = React.useState(true);
  const [emailValid, setEmailValid] = React.useState(true);


  const handleInvalid = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;

    if (target.name === "email") {
      if (!target.value) {
        target.setCustomValidity(t.text("home.contactRequiredEmailError"));
        setEmailValid(false);
      } else if (!isValidEmailStrict(target.value)) {
        target.setCustomValidity(t.text("home.contactInvalidEmailError"));
        setEmailValid(false);
      } else {
        target.setCustomValidity("");
        setEmailValid(true);
      }
    }

    if (target.name === "message") {
      if (!target.value) {
        target.setCustomValidity(t.text("home.contactRequiredMsgError"));
      } else {
        target.setCustomValidity("");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setContact((c) => ({ ...c, email: value }));
      // Show valid state when the field is empty so the error doesn't flash on first keystroke.
      setEmailValid(value === "" ? true : isValidEmailStrict(value));
      return;
    }

    setContact((c) => ({ ...c, [name]: value }));
  };

  /** Clears the form back to its pristine state after a successful send. */
  const resetForm = () => {
    setDone(true);
    setContact({ name: "", email: "", message: "" });
    setPhoneValue("");
    setIsChecked(false);
    setNameValid(true);
    setEmailValid(true);
    setPhoneValid(true);
    setMessageValid(true);
    setProjectType("");
    setProjectTypeValid(true);
  };


  const onCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
    setError("");
  };

  return (
    <div id="contact" className={`${themeReducer === "light" ? "bg-[#F7F7FF]" : "bg-[#2B284C]"} `}>
      <div className="md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[90px] mt-[32px] lg:mt-[42px] 2xl:mt-[54px]">
        <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto pt-[32px] pb-[45px] lg:pt-[62px] lg:pb-[75px] 2xl:pt-[87px] 2xl:pb-[103px]">
          <p
            className={`text-ink w-full mx-auto text-center mb-[18px] lg:mb-[32px] 2xl:mb-[47px] leading-[36px] lg:leading-[46px] xl:leading-[72px] font-redDisplay font-bold text-[24px] md:text-[28px] lg:text-[32px] xl:text-[34px] 2xl:text-[36px] `}
          >
            {t.text("home.contactTitle")}
          </p>

          <div
            className={`text-body-on-surface flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-y-[35px] `}
          >
            <div className="w-full lg:w-[50%]" data-aos="fade-right" data-aos-duration="1000">
              <div className="flex items-center gap-x-[18px]">
                <img src={email} alt="email"  loading="lazy" decoding="async" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className={`text-ink`}
                  >
                    {CONTACT_EMAIL_DISPLAY}
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-x-[18px] my-[15px] lg:my-[31px]">
                <img src={address} alt="address"  loading="lazy" decoding="async" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                  <a
                    href={OFFICE_MAP_URL}
                    className={`text-ink`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Valais – Vaud – Genève – Fribourg
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-x-[18px]">
                <img src={phone} alt="phone"  loading="lazy" decoding="async" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className={`text-ink`}
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </p>
              </div>

              <div className="
                flex flex-wrap
                justify-center lg:justify-start
                gap-x-[13px] gap-y-[12px]
                mt-[25px] lg:mt-[45px]
              ">
                <a
                  className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                  shrink-0 h-[58px] lg:h-[65px] xl:h-[71px] px-[24px] lg:px-[29px]
                  border-2 border-[#677DFF33] hover:border-[#5f75f5] transition
                  rounded-[11px] flex items-center justify-center gap-x-[8px] lg:gap-x-[13px]
                  font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]`}
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <img src={insta} alt="insta" className="w-[23px] h-[23px] lg:w-[27px] lg:h-[27px]"  loading="lazy" decoding="async" />
                  </span>
                  <span>Instagram</span>
                </a>
                <a
                  className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                  shrink-0 h-[58px] lg:h-[65px] xl:h-[71px] px-[24px] lg:px-[29px]
                  border-2 border-[#677DFF33] hover:border-[#5f75f5] transition
                  rounded-[11px] flex items-center justify-center gap-x-[8px] lg:gap-x-[13px]
                  font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]`}
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <img src={linkedin} alt="linkedin" className="w-[23px] h-[23px] lg:w-[27px] lg:h-[27px]"  loading="lazy" decoding="async" />
                  </span>
                  <span>Linkedin</span>
                </a>
                <a
                  className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                  shrink-0 h-[58px] lg:h-[65px] xl:h-[71px] px-[24px] lg:px-[29px]
                  border-2 border-[#677DFF33] hover:border-[#5f75f5] transition
                  rounded-[11px] flex items-center justify-center gap-x-[8px] lg:gap-x-[13px]
                  font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]`}
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <img src={telegram} alt="telegram" className="w-[23px] h-[23px] lg:w-[27px] lg:h-[27px]"  loading="lazy" decoding="async" />
                  </span>
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {done ? (
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
                  onClick={() => setDone(false)}
                  className="custom-btn rounded-[80px] text-white px-[40px] py-[11px] lg:py-[14px] mt-[8px]"
                >
                  <span className="custom-btn-inner">{t.text("home.contactSuccessNew")}</span>
                </button>
              </div>
            ) : (
            <form
              noValidate
              className="w-full"
              onSubmit={async (e) => {
                e.preventDefault();
                if (loading) return;

                const formElement = e.currentTarget;
                const honeypotValue = String(new FormData(formElement).get("website") ?? "");

                if (!contact.name.trim()) {
                  setNameValid(false);
                  return;
                }

                if (intent === "quote" && !projectType) {
                  setProjectTypeValid(false);
                  return;
                }

                if (!isChecked) {
                  setError(t.text("home.contactErrorText"));
                  return;
                }

                if (!isValidEmailStrict(contact.email)) {
                  setEmailValid(false);

                  const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
                  if (emailInput) {
                    emailInput.setCustomValidity(t.text("home.contactInvalidEmailError"));
                    emailInput.reportValidity();
                  }
                  return;
                }

                if (!contact.message.trim()) {
                  setMessageValid(false);
                  return;
                }

                const hasPhoneNumber = phoneValue && getLocalDigits(phoneValue).length > 0;

                if (hasPhoneNumber && !isValidPhoneNumber(phoneValue)) {
                  setPhoneValid(false);

                  const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;
                  if (phoneInput) {
                    phoneInput.setCustomValidity(t.text("home.contactInvalidMobileError"));
                    phoneInput.reportValidity();
                  }
                  return;
                }

                setLoading(true);

                try {
                  const recaptchaToken = await getRecaptchaToken(executeRecaptcha, "contact_form");

                  if (recaptchaToken === null) {
                    setError('Security verification failed');
                    return;
                  }

                  const result = await submitContactForm({
                    ...contact,
                    // Omit the phone entirely when only a dial code was selected.
                    phone: dialOnly ? "" : phoneValue,
                    lang: getSubmissionLanguage(),
                    intent,
                    projectType: intent === "quote" ? projectType : "",
                    recaptchaToken,
                    website: honeypotValue,
                  });

                  if (result.status === "sent") {
                    resetForm();
                    return;
                  }

                  setError(
                    result.status === "security-rejected"
                      ? 'Security verification failed'
                      : 'An error occurred while sending the message, please try again later.'
                  );
                } catch (error) {
                  // submitContactForm and getRecaptchaToken both swallow their own
                  // failures, so this only catches the genuinely unexpected.
                  console.error('Send error:', error);
                  setError('An error occurred while sending the message, please try again later.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              {/* Draggable intent toggle — supports both click and horizontal drag. */}
              <div
                ref={toggleRef}
                className={`${themeReducer === "light" ? "bg-white border-[#C8CAE4]" : "bg-[#685A9C] border-[#C8CAE4]"} flex border-2 rounded-[11px] p-[5px] gap-[5px] mb-[16px] lg:mb-[22px] cursor-grab active:cursor-grabbing select-none`}
                style={{ touchAction: "none" }}
                onPointerDown={toggleHandlers.onPointerDown}
                onPointerMove={toggleHandlers.onPointerMove}
                onPointerUp={toggleHandlers.onPointerEnd}
                onPointerCancel={toggleHandlers.onPointerEnd}
              >
                {(["question", "quote"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      if (shouldIgnoreClick()) return;
                      setIntent(v);
                      if (v === "question") { setProjectType(""); setProjectTypeValid(true); }
                    }}
                    className={`flex-1 py-[10px] lg:py-[13px] rounded-[8px] font-poppins font-medium text-[14px] transition-all
                      ${(dragIntent ?? intent) === v
                        ? themeReducer === "light"
                          ? "bg-[#F4F4FF] border border-[#677DFF33] text-[#14172D] shadow-sm"
                          : "bg-[#3D2E6B] border border-[#677DFF55] text-white shadow-sm"
                        : themeReducer === "light"
                          ? "text-[#8B8FA8] hover:text-[#14172D]"
                          : "text-[#B0A8CC] hover:text-[#E5E5E5]"
                      }`}
                  >
                    {v === "question" ? t.text("home.contactIntentQuestion") : t.text("home.contactIntentQuote")}
                  </button>
                ))}
              </div>

              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                  relative flex justify-between items-center border-2 rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px]
                  ${nameValid ? "border-[#C8CAE4]" : "border-red-500"}`}
              >
                <input
                  placeholder={t.text("home.contactName")}
                  className={`custom-contact-input ${nameValid ? "" : "text-red-500"}
                    ${themeReducer === "light" ? "text-[#222222] placeholder:text-[#222222]" : "text-[#E5E5E5] placeholder:text-[#E5E5E5]"}`}
                  type="text"
                  name="name"
                  onChange={(e) => { setNameValid(true); handleChange(e); }}
                  value={contact.name}
                  required
                />
                <img src={contactUser} alt="User"  loading="lazy" decoding="async" />
              </div>

              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                relative flex justify-between items-center border-2 rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px]
                ${emailValid ? "border-[#C8CAE4]" : "border-red-500"}`}
              >
                <input
                  placeholder={t.text("home.contactEmail")}
                  className={`custom-contact-input ${emailValid ? "" : "text-red-500"
                    } ${themeReducer === "light" ? "text-[#222222] placeholder:text-[#222222]" : "text-[#E5E5E5] placeholder:text-[#E5E5E5]"}`}
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onInvalid={handleInvalid}
                  onBlur={(e) => setEmailValid(isValidEmailStrict(e.target.value))}
                  value={contact.email}
                  required
                />
                <img src={contactEmail} alt="Email"  loading="lazy" decoding="async" />
              </div>

              <div
                className={`font-poppins
                  ${themeReducer === "light" ? "text-[#222222] rip-light" : "text-[#E5E5E5] rip-dark"}
                  ${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                  relative flex items-center border-2 rounded-[11px]
                  px-[16px] lg:px-[18px] py-[12px] lg:py-[16px] mb-[16px]
                  ${!dialOnly && !phoneValid ? "border-red-500 invalid-phone" : "border-[#C8CAE4]"}
                `}
              >
                <PhoneInput
                  defaultCountry="ch"
                  value={phoneValue}
                  onChange={(value) => {
                    setPhoneValue(value);
                    // Clear any native validity message set by a previous failed attempt.
                    const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;
                    if (phoneInput) {
                      phoneInput.setCustomValidity("");
                    }
                    const local = getLocalDigits(value);
                    const isDialOnly = local.length === 0;
                    setPhoneValid(isDialOnly ? true : isValidPhoneNumber(value));
                  }}
                  preferredCountries={["ch", "fr", "de", "it", "gb"]}
                  inputProps={{
                    name: "phone",
                    placeholder: t.text("home.contactMobile"),
                    "aria-label": t.text("home.contactMobile"),
                  }}
                  className="w-full"
                  inputClassName="custom-contact-input bg-transparent outline-none w-full pr-[110px]"
                  countrySelectorStyleProps={{
                    buttonStyle: {
                      borderRadius: '8px',
                      transition: 'all 0.15s ease',
                    },
                    dropdownStyleProps: {
                      style: {
                        marginTop: '4px',
                      }
                    }
                  }}
                />

                {/* Overlay showing the placeholder text and phone icon; hidden once the user starts typing. */}
                <div className="pointer-events-none absolute inset-y-0 right-[16px] flex items-center gap-3">
                  {dialOnly && (
                    <span
                      className={`whitespace-nowrap leading-none
                        ${themeReducer === "light" ? "text-[#6B6E80]" : "text-[#C8CADE]"}
                        text-[14px] md:text-[15px] lg:text-[16px]
                      `}
                    >
                      {t.text("home.contactMobile")}
                    </span>
                  )}
                  <img src={contactPhone} alt="Phone"  loading="lazy" decoding="async" />
                </div>
              </div>

              {/* Project type dropdown — only visible when the quote intent is selected. */}
              {intent === "quote" && (() => {
                const projectOptions = [
                  { value: "vitrine", label: t.text("home.contactProjectVitrine") },
                  { value: "business", label: t.text("home.contactProjectBusiness") },
                  { value: "refonte", label: t.text("home.contactProjectRefonte") },
                  { value: "app", label: t.text("home.contactProjectApp") },
                  { value: "other", label: t.text("home.contactProjectOther") },
                ];
                const selectedLabel = projectOptions.find(o => o.value === projectType)?.label;
                return (
                  <ProjectTypeDropdown
                    options={projectOptions}
                    value={projectType}
                    onChange={(v) => { setProjectType(v); setProjectTypeValid(true); }}
                    placeholder={t.text("home.contactProjectTypeLabel")}
                    selectedLabel={selectedLabel}
                    isLight={themeReducer === "light"}
                    isValid={projectTypeValid}
                  />
                );
              })()}

              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                  relative flex justify-between items-center border-2 rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px]
                  ${messageValid ? "border-[#C8CAE4]" : "border-red-500"}`}
              >
                <textarea
                  placeholder={t.text("home.contactMsg")}
                  className={`custom-contact-input ${messageValid ? "" : "text-red-500"}
                    ${themeReducer === "light" ? "text-[#222222] placeholder:text-[#222222]" : "text-[#E5E5E5] placeholder:text-[#E5E5E5]"}`}
                  rows={4}
                  style={{ resize: "none" }}
                  name="message"
                  onChange={(e) => { setMessageValid(true); handleChange(e); }}
                  onInvalid={handleInvalid}
                  value={contact.message}
                  required
                />
                <img src={contactMessage} alt="help" className="absolute right-[24px] top-[24px]"  loading="lazy" decoding="async" />
              </div>

              <div className="contact-checkbox">
                <Checkbox onChange={onCheckboxChange} checked={isChecked}>
                  <p className={`text-body-on-surface font-poppins font-light text-[14px] md:text-[15px] 2xl:text-[16px] ml-[6px]`}>
                    {t.text("home.contactCheckboxTxt")}{" "}
                    <Link
                      to={L("/privacy-policy")}
                      className="underline hover:opacity-75 transition"
                    >
                      {t.text("home.contactCheckboxPrivacyLink")}
                    </Link>
                    . {t.text("home.contactCheckboxSuffix")}
                  </p>
                </Checkbox>
              </div>

              <div className="required-text mt-[16px] lg:mt-[22px]">
                <p
                  className={`text-body-on-surface font-poppins font-light text-[14px] md:text-[15px] 2xl:text-[16px] `}
                >
                  {t.text("home.contactRequired")}
                </p>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <div className="mt-[16px] lg:mt-[22px] flex justify-center lg:justify-start">
                <button
                  type="submit"
                  className="custom-btn rounded-[80px] text-white px-[50px] lg:px-[54px] py-[11px] lg:py-[16px]"
                >
                  {loading ? (
                    <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">{t.text("home.contactLoading")}</span>
                  ) : (
                    <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">
                      {t.text("home.contactBtn")}
                      <span>
                        <img src={arrow} alt="arrow"  loading="lazy" decoding="async" />
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => (
  <ScopedRecaptchaProvider>
    <ContactInner />
  </ScopedRecaptchaProvider>
);

export default Contact;
