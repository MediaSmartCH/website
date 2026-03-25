import React from "react";

import ConsentAwareCalendlyButton from "components/common/ConsentAwareCalendlyButton";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import bookLine from "assets/icons/bookLine.svg";

const Booking = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  return (
    <div className="md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[90px]">
      <div className="w-full">
        <div className="flex flex-col items-center text-center">
          <p
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full lg:w-[85%] 2xl:w-[75%] mb-[15px] 2xl:mb-[20px] leading-[36px] lg:leading-[52px] xl:leading-[72px] font-redDisplay font-bold text-[28px] md:text-[36px] lg:text-[42px] xl:text-[54px] 2xl:text-[60px] `}
            data-aos="zoom-out"
            data-aos-duration="1100"
            data-aos-easing="ease-in-sine"
          >
            {t.text("home.bookingTitle")}
          </p>
          <img
            src={bookLine}
            alt="book-line"
            className="w-[70%] md:w-auto"
            data-aos="zoom-out"
            data-aos-duration="1100"
            data-aos-easing="ease-in-sine"
          />
          <p
            className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
              } w-full lg:w-[85%] 2xl:w-[75%] my-[15px] lg:my-[20px] leading-[20px] lg:leading-[32px] font-redDisplay font-light text-[15px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] `}
            data-aos="zoom-out"
            data-aos-duration="1300"
            data-aos-easing="ease-in-sine"
          >
            {t.text("home.bookingDescription")}
          </p>
          <div
            data-aos="zoom-out"
            data-aos-duration="1500"
            data-aos-easing="ease-in-sine"
          >
            <ConsentAwareCalendlyButton
              className="custom-btn2 middle-out px-[25px] lg:px-[22px] h-[43px] lg:h-[46px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center"
              blockedTitle={t.text("cookies.manageCookies")}
              text={t.text("home.bookingBtn")}
              pageSettings={{
                backgroundColor: themeReducer === "light" ? "#fff" : "#14172d",
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
                textColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
