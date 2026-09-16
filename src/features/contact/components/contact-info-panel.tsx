/**
 * Left column of the contact section: how to reach the company, and where.
 *
 * Purely presentational — it holds no form state and never submits anything.
 */

import ObfuscatedEmail from "@shared/components/obfuscated-email";
import {
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  getContactEmail,
  OFFICE_MAP_URL,
  SOCIAL_LINKS,
} from "@shared/constants/contact";

import address from "@assets/icons/address.svg";
import email from "@assets/icons/email.svg";
import insta from "@assets/icons/contactInsta.svg";
import linkedin from "@assets/icons/contactLinkedin.svg";
import phone from "@assets/icons/phone.svg";
import telegram from "@assets/icons/telegram.svg";

export interface ContactInfoPanelProps {
  theme: string;
}

export default function ContactInfoPanel({ theme }: ContactInfoPanelProps) {
  const themeReducer = theme;

  return (
    <div className="w-full lg:w-[50%]" data-aos="fade-right" data-aos-duration="1000">
      <div className="flex items-center gap-x-[18px]">
        <img src={email} alt="email"  loading="lazy" decoding="async" />
        <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
          <ObfuscatedEmail address={getContactEmail()} className="text-ink" />
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
  );
}
