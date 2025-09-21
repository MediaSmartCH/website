import React from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/locales";
import logo from "assets/images/logo-footer.png";
import linkedin from "assets/icons/linkedin.svg";
// import twitter from "assets/icons/twitter.svg";
import insta from "assets/icons/insta.svg";
import telegram from "assets/icons/telegram.svg";
// import fb from "assets/icons/fb.svg";
import { useLangLink } from "services/router/langPath"; 

const Footer = () => {
  const { L, Lhash } = useLangLink();
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  return (
    <div className="bg-[#14172D] md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[90px]">
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] py-[45px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between gap-y-[41px]">
          <div className="" data-aos="fade-right" data-aos-duration="1200">
            <img
              src={logo}
              alt="logo"
              className="h-[36px] lg:h-[30px] xl:h-[36px] w-auto"
            />
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-y-[17px] gap-x-[50px] xl:gap-x-[60px] 2xl:gap-x-[70px] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-[20px] lg:px-0">
            <li className="" data-aos="fade-down" data-aos-duration="700">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to={L("/")}
              >
                {dictionary["footer"][languageReducer]["navItem1"]}
              </Link>
            </li>
            <li className="" data-aos="fade-down" data-aos-duration="900">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to={L("/it-services")}
              >
                {dictionary["footer"][languageReducer]["navItem2"]}
              </Link>
            </li>
            <li className="" data-aos="fade-down" data-aos-duration="1000">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to={L("/video-services")}
              >
                {dictionary["footer"][languageReducer]["navItem3"]}
              </Link>
            </li>
            <li className="" data-aos="fade-down" data-aos-duration="1200">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to={Lhash("#about")}
              >
                {dictionary["footer"][languageReducer]["navItem4"]}
              </Link>
            </li>
            {/* <li className="" data-aos="fade-down" data-aos-duration="1300">
              <Link
                className="text-[#fff] hover:text-[#5f75f5]"
                to="{Lhash(#testimonials")}
              >
                {dictionary["footer"][languageReducer]["navItem5"]}
              </Link>
            </li> */}
            <li className="" data-aos="fade-down" data-aos-duration="1400">
              <Link
                to={L("/privacy-policy")}
                className="text-[#fff] hover:text-[#5f75f5]"
              >
                {dictionary["footer"][languageReducer]["navItem6"]}
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
            © 2025 MediaSmart
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-[24px]">
            <a
              className="bg-[#F6F3FD] rounded-full w-[40px] h-[40px] flex justify-center items-center"
              data-aos="fade-down"
              data-aos-duration="1000"
              href="https://www.linkedin.com/company/MediaSmartCH"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={linkedin}
                alt="linkedin"
                className="w-[14px] h-[14px]"
                data-aos="fade-up"
                data-aos-duration="1300"
              />
            </a>
            {/* <a
              className="bg-[#F6F3FD] rounded-full w-[40px] h-[40px] flex justify-center items-center"
              data-aos="fade-down"
              data-aos-duration="1000"
              href="https://twitter.com/MediaSmartCH"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={twitter}
                alt="twitter"
                className="w-[17px] h-[17px]"
                data-aos="fade-up"
                data-aos-duration="1300"
              />
            </a> */}
            <a
              className="bg-[#F6F3FD] rounded-full w-[40px] h-[40px] flex justify-center items-center"
              data-aos="fade-down"
              data-aos-duration="1000"
              href="https://www.instagram.com/MediaSmartCH"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={insta}
                alt="insta"
                className="w-[17px] h-[17px]"
                data-aos="fade-up"
                data-aos-duration="1300"
              />
            </a>
            <a
              className="bg-[#F6F3FD] rounded-full w-[40px] h-[40px] flex justify-center items-center"
              data-aos="fade-down"
              data-aos-duration="1000"
              href="https:/t.me/MediaSmartCH"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={telegram}
                alt="telegram"
                className="w-[17px] h-[17px]"
                data-aos="fade-up"
                data-aos-duration="1300"
              />
            </a>
            {/* <a
              className="bg-[#F6F3FD] rounded-full w-[40px] h-[40px] flex justify-center items-center"
              data-aos="fade-down"
              data-aos-duration="1000"
              href="https://www.facebook.com/MediaSmartCH"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={fb}
                alt="fb"
                className="w-[17px] h-[17px]"
                data-aos="fade-up"
                data-aos-duration="1300"
              />
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
