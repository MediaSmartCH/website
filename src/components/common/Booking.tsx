import React, { useState, useEffect } from "react";
// import CustomBooking from "./CustomBooking";
import { PopupButton } from "react-calendly";

import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import bookLine from "assets/icons/bookLine.svg";

const Booking = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const rootElement = document.getElementById("root");

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  // Bloquer le scroll quand le modal est ouvert
  useEffect(() => {
    if (showBookingModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBookingModal]);

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
            <PopupButton
              className="custom-btn2 middle-out px-[25px] lg:px-[22px] h-[43px] lg:h-[46px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center"
              url="https://calendly.com/mediasmartch/30min?hide_gdpr_banner=1"
              rootElement={rootElement as HTMLElement}
              // text={
              //   dictionary["home"][languageReducer]["bookingBtn"]
              // }
              text={t.text("home.bookingBtn")}
              pageSettings={{
                backgroundColor: themeReducer === "light" ? "#fff" : "#14172d",
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
                textColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
              }}
            />
            {/* <button
              onClick={() => setShowBookingModal(true)}
              className="custom-btn2 middle-out px-[25px] lg:px-[22px] h-[43px] lg:h-[46px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center"
            >
              {t.text("home.bookingBtn")}
            </button> */}
          </div>
        </div>
      </div>

      {/* Modal pour CustomBooking */}
      {/* {showBookingModal && (
        <div className="calendly-overlay fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <button
            onClick={() => setShowBookingModal(false)}
            className="fixed top-4 right-4 z-[10000] w-10 h-10 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
              <path d="M1 1L13 13M13 1L1 13" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div
            className="calendly-close-overlay absolute inset-0 bg-black/40"
            onClick={() => setShowBookingModal(false)}
          />

          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="max-h-[90vh] overflow-y-auto">
              <CustomBooking themeReducer={themeReducer} />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Booking;