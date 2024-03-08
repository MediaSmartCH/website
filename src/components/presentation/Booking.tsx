import React from "react";
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";
import bookLine from "../../assets/icons/bookLine.svg";
import { PopupButton } from "react-calendly";

const Booking = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const rootElement = document.getElementById("root");

  return (
    <div className="md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[90px]">
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] pt-[52px] lg:pt-[70px] 2xl:pt-[80px] mx-auto">
        <div
          className="px-[20px] md:px-[40px] lg:px-0 flex flex-col items-center text-center booking-bg rounded-[20px] 2xl:rounded-[20px]  pt-[27px] pb-[32px] lg:pt-[42px] lg:pb-[28px]"
          data-aos="fade-right"
          data-aos-duration="700"
        >
          <p
            className={`${
              themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
            } w-full lg:w-[75%] 2xl:w-[50%] mb-[15px] 2xl:mb-[20px] leading-[36px] lg:leading-[52px] xl:leading-[72px] font-redDisplay font-bold text-[28px] md:text-[36px] lg:text-[42px] xl:text-[54px] 2xl:text-[60px] `}
            data-aos="fade-left"
            data-aos-duration="900"
          >
            {dictionary["booking"][languageReducer]["title"]}
          </p>
          <img
            src={bookLine}
            alt="book-line"
            className="w-[70%] md:w-auto"
            data-aos="zoom-in"
            data-aos-duration="1000"
          />
          <p
            className={`${
              themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
            } w-full lg:w-[75%] 2xl:w-[50%] my-[15px] lg:my-[20px] leading-[20px] lg:leading-[32px] font-redDisplay font-light text-[15px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] `}
            data-aos="fade-left"
            data-aos-duration="1200"
          >
            {dictionary["booking"][languageReducer]["description"]}
          </p>
          <div>
            {/* <button
              className="custom-btn2 middle-out px-[25px] lg:px-[22px] h-[43px] lg:h-[46px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]"
              data-aos="fade-up"
              data-aos-duration="1300"
            >
              {dictionary["booking"][languageReducer]["bookingBtn"]}
            </button> */}
            <PopupButton
              className="custom-btn2 middle-out px-[25px] lg:px-[22px] h-[43px] lg:h-[46px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]"
              url="https://calendly.com/mediasmartch/30min"
              rootElement={rootElement as HTMLElement}
              text={
                dictionary["navbarHomepage"][languageReducer]["navbarButton"]
              }
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
