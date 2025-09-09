import React from "react";
import { Collapse } from "antd";

import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";

import "assets/styles/faqCss.css";
import bg from "assets/images/faq-bg.png";

const { Panel } = Collapse;

const Faq = () => {

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);


  return (
    <div
      id="faq"
      className="md:pt-[120px] lg:pt-[140px] xl:pt-[200px] 2xl:pt-[240px] relative"
    >
      <img
        src={bg}
        className="absolute left-0 top-[100px] md:top-[-20px] lg:top-[-50px] xl:top-[-50px] 2xl:top-[-70px]"
      />
      <div className="w-full flex flex-row justify-center homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto">
        <div className="w-full md:w-[90%] lg:w-full lg:px-[40px] xl:px-[50px] 2xl::px-[60px]  flex flex-col items-start">
          <p
            className={`${
              themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
            } w-full text-center font-helvetica font-bold text-[28px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mt-[40px] md:mt-[50px] lg:mt-[60px] 2xl:mt-[70px] mb-[100px] md:mb-[50px] lg:mb-[30px] xl:mb-[36px] 2xl:mb-[46px] `}
          >
            {dictionary["faq"][languageReducer]["title"]}
          </p>
          <div className="w-full"
           data-aos="fade-up"
           data-aos-duration="1200"
           data-aos-easing="ease-in-sine"
          >
            <div>
              <div>
                <Collapse
                  className={`min-w-full ${
                    themeReducer === "light" ? "light" : "dark"
                  }`}
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
                            fill-rule="evenodd"
                            clip-rule="evenodd"
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
                            fill-rule="evenodd"
                            clip-rule="evenodd"
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
                              <stop stop-color="#B514FD" />
                              <stop offset="1" stop-color="#5F75F5" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )
                  }
                  //   key={"1"}
                >
                  <Panel
                    header={
                      dictionary["faq"][languageReducer]["tile1"]["faqTitle"]
                    }
                    className={`${
                      themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
                    } mb-[13px] lg:mb-[17px] rounded-[10px] `}
                    style={{ borderRadius: "10px" }}
                    key="1"
                  >
                    <div className="flex flex-row items-start">
                      <div
                        className={`${
                          themeReducer === "light"
                            ? "text-[#413C58]"
                            : "text-[#E5E5E5]"
                        } pt-[0px] pb-[15px] lg:pt-[0px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light `}
                      >
                        {
                          dictionary["faq"][languageReducer]["tile1"][
                            "faqDescription"
                          ]
                        }
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      dictionary["faq"][languageReducer]["tile2"]["faqTitle"]
                    }
                    key="2"
                    className={`${
                      themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
                    } mb-[13px] lg:mb-[17px] rounded-[10px] `}
                    style={{ borderRadius: "10px" }}
                  >
                    <div className="flex flex-row items-start">
                      <div
                        className={`${
                          themeReducer === "light"
                            ? "text-[#413C58]"
                            : "text-[#E5E5E5]"
                        } pt-[0px] pb-[15px] lg:pt-[0px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light `}
                      >
                        {
                          dictionary["faq"][languageReducer]["tile2"][
                            "faqDescription"
                          ]
                        }
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      dictionary["faq"][languageReducer]["tile3"]["faqTitle"]
                    }
                    key="3"
                    className={`${
                      themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
                    } ] mb-[13px] lg:mb-[17px] rounded-[10px] `}
                    style={{ borderRadius: "10px" }}
                  >
                    <div className="flex flex-row items-start">
                      <div
                        className={`${
                          themeReducer === "light"
                            ? "text-[#413C58]"
                            : "text-[#E5E5E5]"
                        } pt-[0px] pb-[15px] lg:pt-[0px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light `}
                      >
                        {
                          dictionary["faq"][languageReducer]["tile3"][
                            "faqDescription"
                          ]
                        }
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      dictionary["faq"][languageReducer]["tile4"]["faqTitle"]
                    }
                    key="4"
                    className={`${
                      themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
                    } mb-[13px] lg:mb-[17px] rounded-[10px] `}
                    style={{ borderRadius: "10px" }}
                  >
                    <div className="flex flex-row items-start">
                      <div
                        className={`${
                          themeReducer === "light"
                            ? "text-[#413C58]"
                            : "text-[#E5E5E5]"
                        } pt-[0px] pb-[15px] lg:pt-[0px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light `}
                      >
                        {
                          dictionary["faq"][languageReducer]["tile4"][
                            "faqDescription"
                          ]
                        }
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      dictionary["faq"][languageReducer]["tile5"]["faqTitle"]
                    }
                    key="5"
                    className={`${
                      themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
                    }  mb-[13px] lg:mb-[17px] rounded-[10px] `}
                    style={{ borderRadius: "10px" }}
                  >
                    <div className="flex flex-row items-start">
                      <div
                        className={`${
                          themeReducer === "light"
                            ? "text-[#413C58]"
                            : "text-[#E5E5E5]"
                        } pt-[0px] pb-[15px] lg:pt-[0px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light `}
                      >
                        {
                          dictionary["faq"][languageReducer]["tile5"][
                            "faqDescription"
                          ]
                        }
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      dictionary["faq"][languageReducer]["tile6"]["faqTitle"]
                    }
                    key="6"
                    className={`${
                      themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
                    } mb-[13px] lg:mb-[17px] rounded-[10px] `}
                    style={{ borderRadius: "10px" }}
                  >
                    <div className="flex flex-row items-start">
                      <div
                        className={`${
                          themeReducer === "light"
                            ? "text-[#413C58]"
                            : "text-[#E5E5E5]"
                        } pt-[0px] pb-[15px] lg:pt-[0px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light `}
                      >
                        {
                          dictionary["faq"][languageReducer]["tile6"][
                            "faqDescription"
                          ]
                        }
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
