import React from "react";
import { Collapse } from "antd";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import WaveBackdrop from "components/common/WaveBackdrop";

import "assets/styles/faqCss.css";

type FaqTile = { faqQuestion: string; faqAnswer: string };

const Faq: React.FC = () => {
  const languageReducer = useAppSelector((s) => s.language.currentLanguage);
  const themeReducer = useAppSelector((s) => s.theme.currentTheme);
  const t = useTranslations(languageReducer);

  const items = [
    {
      key: "1",
      label: t.object<FaqTile>("home.tile1").faqQuestion,
      children: (
        <div
          className={`${
            themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } pt-[0px] pb-[15px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light`}
        >
          {t.object<FaqTile>("home.tile1").faqAnswer}
        </div>
      ),
      className: `${
        themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
      } mb-[13px] lg:mb-[17px] rounded-[10px]`,
    },
    {
      key: "2",
      label: t.object<FaqTile>("home.tile2").faqQuestion,
      children: (
        <div
          className={`${
            themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } pt-[0px] pb-[15px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light`}
        >
          {t.object<FaqTile>("home.tile2").faqAnswer}
        </div>
      ),
      className: `${
        themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
      } mb-[13px] lg:mb-[17px] rounded-[10px]`,
    },
    {
      key: "3",
      label: t.object<FaqTile>("home.tile3").faqQuestion,
      children: (
        <div
          className={`${
            themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } pt-[0px] pb-[15px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light`}
        >
          {t.object<FaqTile>("home.tile3").faqAnswer}
        </div>
      ),
      className: `${
        themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
      } mb-[13px] lg:mb-[17px] rounded-[10px]`,
    },
    {
      key: "4",
      label: t.object<FaqTile>("home.tile4").faqQuestion,
      children: (
        <div
          className={`${
            themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } pt-[0px] pb-[15px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light`}
        >
          {t.object<FaqTile>("home.tile4").faqAnswer}
        </div>
      ),
      className: `${
        themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
      } mb-[13px] lg:mb-[17px] rounded-[10px]`,
    },
    {
      key: "5",
      label: t.object<FaqTile>("home.tile5").faqQuestion,
      children: (
        <div
          className={`${
            themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } pt-[0px] pb-[15px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light`}
        >
          {t.object<FaqTile>("home.tile5").faqAnswer}
        </div>
      ),
      className: `${
        themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
      } mb-[13px] lg:mb-[17px] rounded-[10px]`,
    },
    {
      key: "6",
      label: t.object<FaqTile>("home.tile6").faqQuestion,
      children: (
        <div
          className={`${
            themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } pt-[0px] pb-[15px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light`}
        >
          {t.object<FaqTile>("home.tile6").faqAnswer}
        </div>
      ),
      className: `${
        themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
      } mb-[13px] lg:mb-[17px] rounded-[10px]`,
    },
  ];

  return (
    <div id="faq" className="relative overflow-hidden md:pt-[120px] lg:pt-[140px] xl:pt-[200px] 2xl:pt-[240px]">
      <WaveBackdrop
        theme={themeReducer}
        className="top-[116px] h-[620px] md:top-[12px] md:h-[700px] lg:top-[-12px] lg:h-[760px] xl:top-[-18px] xl:h-[790px]"
      />
      <div className="relative z-10 w-full flex flex-row justify-center homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto">
        <div className="w-full md:w-[90%] lg:w-full lg:px-[40px] xl:px-[50px] 2xl::px-[60px] flex flex-col items-start">
          <p
            className={`${
              themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
            } w-full text-center font-helvetica font-bold text-[28px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mt-[40px] md:mt-[50px] lg:mt-[60px] 2xl:mt-[70px] mb-[100px] md:mb-[50px] lg:mb-[30px] xl:mb-[36px] 2xl:mb-[46px]`}
          >
            {t.text("home.faqTitle")}
          </p>

          <div
            className="w-full"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-easing="ease-in-sine"
          >
            <Collapse
              className={`min-w-full ${themeReducer === "light" ? "light" : "dark"}`}
              ghost
              accordion
              defaultActiveKey={["1"]}
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? (
                  <div className="pr-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[22px] h-[22px] lg:w-[32px] lg:h-[32px]"
                    >
                      <rect
                        width="31"
                        height="31"
                        rx="15.5"
                        transform="matrix(-1 0 0 1 31.9448 0.696777)"
                        fill="#E20052"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.788 11.9541L12.2022 10.5399L16.4448 14.7825L20.6875 10.5399L22.1017 11.9541L17.859 16.1967L22.1017 20.4394L20.6875 21.8536L16.4448 17.6109L12.2022 21.8536L10.788 20.4394L15.0306 16.1967L10.788 11.9541Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="pr-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[22px] h-[22px] lg:w-[32px] lg:h-[32px]"
                    >
                      <rect
                        width="31"
                        height="31"
                        rx="15.5"
                        transform="matrix(-1 0 0 1 31.9448 0.482422)"
                        fill="url(#paint0_linear_1_134)"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.4448 8.98242H17.4448V14.9824H23.4448V16.9824H17.4448V22.9824H15.4448V16.9824H9.44482V14.9824H15.4448V8.98242Z"
                        fill="white"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_1_134"
                          x1="0.441727"
                          y1="15.5"
                          x2="30.3183"
                          y2="15.5"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#B514FD" />
                          <stop offset="1" stopColor="#5F75F5" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )
              }
              items={items}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
