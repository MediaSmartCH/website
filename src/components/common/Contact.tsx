import React from "react";
import { Checkbox } from "antd";
import emailjs from "@emailjs/browser";
import { PhoneInput, removeDialCode, guessCountryByPartialPhoneNumber } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { verifyRecaptchaToken } from "services/api/recaptcha";

import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";

import email from "assets/icons/email.svg";
import address from "assets/icons/address.svg";
import phone from "assets/icons/phone.svg";
import insta from "assets/icons/contactInsta.svg";
import linkedin from "assets/icons/contactLinkedin.svg";
import telegram from "assets/icons/telegram.svg";
import contactUser from "assets/icons/contactUser.svg";
import contactEmail from "assets/icons/contactEmail.svg";
import contactPhone from "assets/icons/contactPhone.svg";
import contactMessage from "assets/icons/contactMessage.svg";
import arrow from "assets/icons/rightArrow.svg";

const Contact = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);

  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [error, setError] = React.useState("");

  // ---- Form state
  const [contact, setContact] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  // ---- Phone (E.164)
  const [phoneValue, setPhoneValue] = React.useState(""); // ex: +41796341212
  const [phoneValid, setPhoneValid] = React.useState(true);
  // const dialOnly = /^\+\d{1,4}\s*$/.test(phoneValue) || phoneValue === "";

  // Renvoie uniquement les chiffres "locaux" (après l'indicatif)
  const getLocalDigits = (phone: string) => {
    const { country } = guessCountryByPartialPhoneNumber({ phone }); // <- objet, pas string
    const dial = country?.dialCode || "";                            // <- dialCode via country
    try {
      return removeDialCode({ phone, dialCode: dial }).replace(/\D/g, "");
    } catch {
      return phone.replace(/^\+\d{1,4}\s*/, "").replace(/\D/g, "");
    }
  };

  const localDigits = getLocalDigits(phoneValue);
  const dialOnly = localDigits.length === 0;

  // ---- Email validation
  const [emailValid, setEmailValid] = React.useState(true);

  // Regex “raisonnable” + garde-fous (TLD >=2, pas de '..', labels corrects)
  const emailBase = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}$/i;
  const isValidEmailStrict = (value: string) => {
    if (!emailBase.test(value)) return false;
    if (value.includes("..")) return false;
    const [local, domain] = value.split("@");
    if (!local || !domain) return false;
    if (local.startsWith(".") || local.endsWith(".")) return false;
    const labels = domain.split(".");
    if (labels.some((l) => l.startsWith("-") || l.endsWith("-") || l.length === 0)) return false;
    return true;
  };

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

    // target.reportValidity();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setContact((c) => ({ ...c, email: value }));
      setEmailValid(value === "" ? true : isValidEmailStrict(value));
      return;
    }

    setContact((c) => ({ ...c, [name]: value }));
  };

  const handleClick = () => {
    setTimeout(() => setDone(false), 3000);
  };

  const onCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
    setError("");
  };

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div id="contact" className={`${themeReducer === "light" ? "bg-[#F7F7FF]" : "bg-[#2B284C]"} `}>
      <div className="md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[90px] mt-[32px] lg:mt-[42px] 2xl:mt-[54px]">
        <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto pt-[32px] pb-[45px] lg:pt-[62px] lg:pb-[75px] 2xl:pt-[87px] 2xl:pb-[103px]">
          <p
            className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#F6F6F6]"
              } w-full mx-auto text-center mb-[18px] lg:mb-[32px] 2xl:mb-[47px] leading-[36px] lg:leading-[46px] xl:leading-[72px] font-redDisplay font-bold text-[24px] md:text-[28px] lg:text-[32px] xl:text-[34px] 2xl:text-[36px] `}
          >
            {t.text("home.contactTitle")}
          </p>

          <div
            className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#E5E5E5]"
              } flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-y-[35px] `}
          >
            {/* Bloc gauche */}
            <div className="w-full lg:w-[50%]" data-aos="fade-right" data-aos-duration="1000">
              <div className="flex items-center gap-x-[18px]">
                <img src={email} alt="email" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                  <a
                    href="mailto:hello@mediasmart.ch"
                    className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#F6F6F6]"}`}
                  >
                    hello[at]mediasmart.ch
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-x-[18px] my-[15px] lg:my-[31px]">
                <img src={address} alt="address" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                  <a
                    href="https://maps.app.goo.gl/CthoJ9r99naTzbTA9"
                    className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#F6F6F6]"}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Valais – Vaud – Genève – Fribourg
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-x-[18px]">
                <img src={phone} alt="phone" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                  <a
                    href="tel:+41796578612"
                    className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#F6F6F6]"}`}
                  >
                    +41 79 657 86 12
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
                  href="https://www.instagram.com/MediaSmartCH"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <img src={insta} alt="insta" className="w-[23px] h-[23px] lg:w-[27px] lg:h-[27px]" />
                  </span>
                  <span>Instagram</span>
                </a>
                <a
                  className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                  shrink-0 h-[58px] lg:h-[65px] xl:h-[71px] px-[24px] lg:px-[29px]
                  border-2 border-[#677DFF33] hover:border-[#5f75f5] transition
                  rounded-[11px] flex items-center justify-center gap-x-[8px] lg:gap-x-[13px]
                  font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]`}
                  href="https://www.linkedin.com/company/MediaSmartCH"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <img src={linkedin} alt="linkedin" className="w-[23px] h-[23px] lg:w-[27px] lg:h-[27px]" />
                  </span>
                  <span>Linkedin</span>
                </a>
                <a
                  className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"}
                  shrink-0 h-[58px] lg:h-[65px] xl:h-[71px] px-[24px] lg:px-[29px]
                  border-2 border-[#677DFF33] hover:border-[#5f75f5] transition
                  rounded-[11px] flex items-center justify-center gap-x-[8px] lg:gap-x-[13px]
                  font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]`}
                  href="https://t.me/MediaSmartCH"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <img src={telegram} alt="telegram" className="w-[23px] h-[23px] lg:w-[27px] lg:h-[27px]" />
                  </span>
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {/* Formulaire */}
            <form
              // ref={(form) => {
              //   if (form) {
              //     const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
              //     if (phoneInput && phoneValue && !dialOnly && !isValidPhoneNumber(phoneValue)) {
              //       phoneInput.setCustomValidity(t.text("home.contactInvalidMobileError"));
              //     }
              //   }
              // }}
              className="w-full lg:w-[50%]"
              data-aos="fade-up"
              data-aos-duration="1200"
              onSubmit={async (e) => {
                e.preventDefault();
                console.log('📝 Form submit triggered');

                // Validations basiques
                if (!isChecked) {
                  console.log('❌ Checkbox non cochée');
                  setError(t.text("home.contactErrorText"));
                  return;
                }

                if (!isValidEmailStrict(contact.email)) {
                  console.log('❌ Email invalide:', contact.email);
                  setEmailValid(false);
                  return;
                }

                const hasPhoneNumber = phoneValue && getLocalDigits(phoneValue).length > 0;

                if (hasPhoneNumber && !isValidPhoneNumber(phoneValue)) {
                  console.log('❌ Téléphone invalide:', phoneValue);
                  setPhoneValid(false);

                  const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;
                  if (phoneInput) {
                    phoneInput.setCustomValidity(t.text("home.contactInvalidMobileError"));
                    phoneInput.reportValidity();
                  }
                  return;
                }

                console.log('✅ Validations passées, début traitement...');
                setLoading(true);

                try {
                  const isLocalHost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1';

                  console.log('🔍 Environnement:', {
                    hostname: window.location.hostname,
                    isLocalHost,
                    executeRecaptchaExists: !!executeRecaptcha,
                    isDev: process.env.NODE_ENV
                  });

                  if (!isLocalHost) {
                    if (!executeRecaptcha) {
                      console.warn('⚠️ executeRecaptcha non disponible, bypass forcé');
                    } else {
                      console.log('🔐 Lancement ReCAPTCHA...');
                      const token = await executeRecaptcha('contact_form');
                      console.log('🎟️ Token reçu:', token.substring(0, 20) + '...');

                      const verification = await verifyRecaptchaToken(token);
                      console.log('📊 Vérification:', verification);

                      if (!verification.success) {
                        console.error('❌ ReCAPTCHA échec:', verification);
                        setError('Échec de la vérification de sécurité');
                        setLoading(false);
                        return;
                      }
                      console.log('✅ ReCAPTCHA validé avec score:', verification.score);
                    }
                  } else {
                    console.log('🏠 Mode local : ReCAPTCHA bypassed');
                  }

                  const payload = { ...contact, phone: phoneValue };
                  console.log('📧 Envoi email avec payload:', payload);

                  const result = await emailjs.send(
                    "REMOVED_EMAILJS_SERVICE_ID",
                    "REMOVED_EMAILJS_TEMPLATE_ID",
                    payload,
                    "REMOVED_EMAILJS_PUBLIC_KEY"
                  );

                  console.log('✅ Email envoyé, résultat:', result);

                  setLoading(false);
                  setDone(true);
                  setContact({ name: "", email: "", message: "" });
                  setPhoneValue("");
                  setIsChecked(false);
                  setEmailValid(true);
                  setPhoneValid(true);
                  handleClick();

                } catch (error) {
                  console.error('💥 ERREUR CRITIQUE:', error);
                  if (error instanceof Error) {
                    console.error('Message:', error.message);
                    console.error('Stack:', error.stack);
                  }
                  setError('Une erreur est survenue : ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
                  setLoading(false);
                }
              }}
            // onSubmit={async (e) => {
            //   e.preventDefault();

            //   if (!isChecked) {
            //     setError(t.text("home.contactErrorText"));
            //     return;
            //   }

            //   if (!isValidEmailStrict(contact.email)) {
            //     setEmailValid(false);
            //     return;
            //   }

            //   if (phoneValue && !isValidPhoneNumber(phoneValue)) {
            //     setPhoneValid(false);
            //     return;
            //   }

            //   setLoading(true);

            //   try {
            //     // Vérifier si on est réellement en local
            //     const isLocalHost = window.location.hostname === 'localhost' ||
            //       window.location.hostname === '127.0.0.1';

            //     console.log('🔍 Debug:', {
            //       hostname: window.location.hostname,
            //       isLocalHost,
            //       hasExecuteRecaptcha: !!executeRecaptcha,
            //       NODE_ENV: process.env.NODE_ENV
            //     });

            //     // ReCAPTCHA uniquement si on n'est PAS en local ET que executeRecaptcha existe
            //     if (!isLocalHost && executeRecaptcha) {
            //       console.log('🔐 Exécution ReCAPTCHA...');
            //       const token = await executeRecaptcha('contact_form');
            //       const verification = await verifyRecaptchaToken(token);

            //       if (!verification.success) {
            //         setError('Échec de la vérification de sécurité');
            //         setLoading(false);
            //         return;
            //       }
            //       console.log('✅ ReCAPTCHA validé');
            //     } else {
            //       console.log('⚠️ ReCAPTCHA bypassed (local ou non disponible)');
            //     }

            //     // Envoi email
            //     const payload = { ...contact, phone: phoneValue };
            //     console.log('📧 Envoi email...');

            //     await emailjs.send(
            //       "REMOVED_EMAILJS_SERVICE_ID",
            //       "REMOVED_EMAILJS_TEMPLATE_ID",
            //       payload,
            //       "REMOVED_EMAILJS_PUBLIC_KEY"
            //     );

            //     console.log('✅ Email envoyé');
            //     setLoading(false);
            //     setDone(true);
            //     setContact({ name: "", email: "", message: "" });
            //     setPhoneValue("");
            //     setIsChecked(false);
            //     setEmailValid(true);
            //     setPhoneValid(true);
            //     handleClick();

            //   } catch (error) {
            //     console.error('❌ Erreur:', error);
            //     setError('Une erreur est survenue');
            //     setLoading(false);
            //   }
            // }}
            >
              {/* Nom */}
              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                  } relative flex justify-between items-center border-2 border-[#C8CAE4] rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px] `}
              >
                <input
                  placeholder={t.text("home.contactName")}
                  className={`custom-contact-input ${themeReducer === "light"
                    ? "text-[#222222] placeholder:text-[#222222]"
                    : "text-[#E5E5E5] placeholder:text-[#E5E5E5]"
                    } `}
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={contact.name}
                  required
                />
                <img src={contactUser} alt="User" />
              </div>

              {/* Email */}
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
                // Empêche la validation HTML trop permissive
                // pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,24}"
                />
                <img src={contactEmail} alt="Email" />
              </div>

              {/* Téléphone : PhoneInput */}
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
                    // indicatif seul = champ "vide" (optionnel)
                    const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;
                    if (phoneInput) {
                      phoneInput.setCustomValidity("");
                    }
                    const local = getLocalDigits(value);
                    const isDialOnly = local.length === 0;
                    setPhoneValid(isDialOnly ? true : isValidPhoneNumber(value));
                  }}
                  // forceDialCode
                  preferredCountries={["ch", "fr", "de", "it", "gb"]}
                  inputProps={{
                    name: "phone",
                    placeholder: t.text("home.contactMobile"),
                    "aria-label": t.text("home.contactMobile"),
                  }}
                  className="w-full"
                  // réserve la place pour le libellé + l'icône à droite
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

                {/* Zone droite : libellé inline (disparaît dès qu’on tape un chiffre local) + icône */}
                < div className="pointer-events-none absolute inset-y-0 right-[16px] flex items-center gap-3" >
                  {dialOnly && (
                    <span
                      className={`whitespace-nowrap leading-none
                        ${themeReducer === "light" ? "text-[#6B6E80]" : "text-[#C8CADE]"}
                        text-[14px] md:text-[15px] lg:text-[16px]
                      `}
                    >
                      {t.text("home.contactMobile")}
                    </span>
                  )
                  }
                  < img src={contactPhone} alt="Phone" />
                </div>
              </div>

              {/* Message */}
              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                  } relative flex justify-between items-center border-2 border-[#C8CAE4] rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px] `}
              >
                <textarea
                  placeholder={t.text("home.contactMsg")}
                  className={`custom-contact-input ${themeReducer === "light"
                    ? "text-[#222222] placeholder:text-[#222222]"
                    : "text-[#E5E5E5] placeholder:text-[#E5E5E5]"
                    } `}
                  rows={4}
                  style={{ resize: "none" }}
                  name="message"
                  onChange={handleChange}
                  onInvalid={handleInvalid}
                  value={contact.message}
                  required
                />
                <img src={contactMessage} alt="help" className="absolute right-[24px] top-[24px]" />
              </div>

              {/* Consent */}
              <div className="contact-checkbox">
                <Checkbox onChange={onCheckboxChange} checked={isChecked}>
                  <p
                    className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#E5E5E5]"
                      } font-poppins font-light text-[14px] md:text-[15px] 2xl:text-[16px] ml-[6px]`}
                  >
                    {t.text("home.contactCheckboxTxt")}
                  </p>
                </Checkbox>
              </div>

              <div className="required-text mt-[16px] lg:mt-[22px]">
                <p
                  className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#E5E5E5]"
                    } font-poppins font-light text-[14px] md:text-[15px] 2xl:text-[16px] `}
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
                  {done ? (
                    <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">Done</span>
                  ) : loading ? (
                    <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">Loading...</span>
                  ) : (
                    <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">
                      {t.text("home.contactBtn")}
                      <span>
                        <img src={arrow} alt="arrow" />
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div >
    </div >
  );
};

export default Contact;
