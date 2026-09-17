import React from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";
import { useLangLink } from "@shared/hooks/use-localized-path";
import {
  SOCIAL_LINKS,
} from "@shared/constants/contact";

import logo from "@assets/images/logo-footer.webp";
import linkedin from "@assets/icons/linkedin.svg";
import insta from "@assets/icons/insta.svg";
import telegram from "@assets/icons/telegram.svg";

const Footer = () => {
  const { L, Lhash } = useLangLink();
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = useTranslations(languageReducer);

  return (
    <div className="bg-[#14172D] md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[90px]">
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] py-[45px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between gap-y-[41px]">
          <div className="" data-aos="fade-right" data-aos-duration="1200">
            <img
              src={logo}
              alt="MediaSmart"
              className="h-[36px] lg:h-[30px] xl:h-[36px] w-auto"
              width="560"
              height="72"
              loading="lazy"
              decoding="async"
            />
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-y-[17px] gap-x-[50px] xl:gap-x-[60px] 2xl:gap-x-[70px] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-[20px] lg:px-0">
            <li className="" data-aos="fade-down" data-aos-duration="700">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to={L("/")}
              >
                {t.text("footer.navItem1")}
              </Link>
            </li>
            <li className="" data-aos="fade-down" data-aos-duration="900">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to={L("/web-development")}
              >
                {t.text("footer.navItem2")}
              </Link>
            </li>
            {/* ================================================================
                VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
                Lien vidéo du footer mis en pause (site 100% informatique).
                Décommenter pour réactiver l'offre vidéo.
                ================================================================ */}
            {/*
            <li className="" data-aos="fade-down" data-aos-duration="1000">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to={L("/video-services")}
              >
                {t.text("footer.navItem3")}
              </Link>
            </li>
            */}
            <li className="" data-aos="fade-down" data-aos-duration="1200">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to={Lhash("#about")}
              >
                {t.text("footer.navItem4")}
              </Link>
            </li>
            <li className="" data-aos="fade-down" data-aos-duration="1400">
              <Link
                to={L("/privacy-policy")}
                className="text-[#fff] hover:text-[#5f75f5]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {t.text("footer.navItem6")}
              </Link>
            </li>
            <li className="" data-aos="fade-down" data-aos-duration="1500">
              <Link
                to={L("/legal-notice")}
                className="text-[#fff] hover:text-[#5f75f5]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {t.text("footer.navItem7")}
              </Link>
            </li>
            <li className="" data-aos="fade-down" data-aos-duration="1600">
              <Link
                to={L("/terms")}
                className="text-[#fff] hover:text-[#5f75f5]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {t.text("footer.navItem8")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between gap-y-[41px] mt-[41px] lg:mt-[60px] 2xl:mt-[77px]">
          <p
            className="text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]"
            data-aos="zoom-in"
            data-aos-duration="1200"
          >
            © 2026 MediaSmart
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-[24px]">
            <a
              className="bg-[#F6F3FD] rounded-full w-[40px] h-[40px] flex justify-center items-center"
              data-aos="fade-down"
              data-aos-duration="1000"
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={linkedin}
                alt={t.text("footer.linkedinAlt")}
                className="w-[14px] h-[14px]"
                width="14"
                height="14"
                loading="lazy"
                decoding="async"
                data-aos="fade-up"
                data-aos-duration="1300"
              />
            </a>
            <a
              className="bg-[#F6F3FD] rounded-full w-[40px] h-[40px] flex justify-center items-center"
              data-aos="fade-down"
              data-aos-duration="1000"
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={insta}
                alt={t.text("footer.instagramAlt")}
                className="w-[17px] h-[17px]"
                width="17"
                height="17"
                loading="lazy"
                decoding="async"
                data-aos="fade-up"
                data-aos-duration="1300"
              />
            </a>
            <a
              className="bg-[#F6F3FD] rounded-full w-[40px] h-[40px] flex justify-center items-center"
              data-aos="fade-down"
              data-aos-duration="1000"
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={telegram}
                alt={t.text("footer.telegramAlt")}
                className="w-[17px] h-[17px]"
                width="17"
                height="17"
                loading="lazy"
                decoding="async"
                data-aos="fade-up"
                data-aos-duration="1300"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
