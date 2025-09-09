import React from "react";
import Slider from "react-slick";
import { useAppSelector } from "services/hooks/hooks";
import "./slick.css";
import "./slick-theme.css";

import airbnb from "assets/images/Airbnb.png";
import google from "assets/images/Google.png";
import microsoft from "assets/images/Microsoft.png";
import oyo from "assets/images/OYO.png";
import fedex from "assets/images/FedEx.png";
import amazon from "assets/images/Amazon.png";
import amazonDark from "assets/images/AmazonDark.png";
import ola from "assets/images/OLA.png";
import olaDark from "assets/images/OLADark.png";
import walmart from "assets/images/Walmart.png";
import walmartDark from "assets/images/WalmartDark.png";

const PartnerSlider = () => {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1735,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 1535,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 1251,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 1,
          infinite: true,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings} className="w-[100%] lg:w-[100%] mx-auto z-50">
        <div
          className="px-[20px] lg:px-[30px] xl:px-[35px] 2xl:px-[48px]"
          data-aos="fade-down"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <div
            className={`${
              themeReducer === "light" ? "bg-[#F6F5FF]" : "bg-[#2B284C]"
            }  w-[100px] md:w-[170px] h-[55px] md:h-[96px] rounded-[8px] lg:rounded-[12px] 2xl:rounded-[16px] flex justify-center items-center`}
          >
            <img
              src={airbnb}
              alt="airbnb"
              className="w-auto h-[18px] md:h-[32px]"
            />
          </div>
        </div>
        <div
          className="px-[20px] lg:px-[30px] xl:px-[35px] 2xl:px-[48px]"
          data-aos="fade-up"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <div
            className={`${
              themeReducer === "light" ? "bg-[#F6F5FF]" : "bg-[#2B284C]"
            } w-[100px] md:w-[170px] h-[55px] md:h-[96px] rounded-[8px] lg:rounded-[12px] 2xl:rounded-[16px] flex justify-center items-center`}
          >
            <img
              src={google}
              alt="airbnb"
              className="w-auto h-[18px] md:h-[32px]"
            />
          </div>
        </div>
        <div
          className="px-[20px] lg:px-[30px] xl:px-[35px] 2xl:px-[48px]"
          data-aos="fade-down"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <div
            className={`${
              themeReducer === "light" ? "bg-[#F6F5FF]" : "bg-[#2B284C]"
            } w-[100px] md:w-[170px] h-[55px] md:h-[96px] rounded-[8px] lg:rounded-[12px] 2xl:rounded-[16px] flex justify-center items-center`}
          >
            <img
              src={microsoft}
              alt="airbnb"
              className="w-auto h-[18px] md:h-[28px]"
            />
          </div>
        </div>
        <div
          className="px-[20px] lg:px-[30px] xl:px-[35px] 2xl:px-[48px]"
          data-aos="fade-up"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <div
            className={`${
              themeReducer === "light" ? "bg-[#F6F5FF]" : "bg-[#2B284C]"
            } w-[100px] md:w-[170px] h-[55px] md:h-[96px] rounded-[8px] lg:rounded-[12px] 2xl:rounded-[16px] flex justify-center items-center`}
          >
            <img
              src={oyo}
              alt="airbnb"
              className="w-auto h-[18px] md:h-[32px]"
            />
          </div>
        </div>
        <div
          className="px-[20px] lg:px-[30px] xl:px-[35px] 2xl:px-[48px]"
          data-aos="fade-down"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <div
            className={`${
              themeReducer === "light" ? "bg-[#F6F5FF]" : "bg-[#2B284C]"
            } w-[100px] md:w-[170px] h-[55px] md:h-[96px] rounded-[8px] lg:rounded-[12px] 2xl:rounded-[16px] flex justify-center items-center`}
          >
            <img
              src={fedex}
              alt="airbnb"
              className="w-auto h-[18px] md:h-[30px]"
            />
          </div>
        </div>
        <div
          className="px-[20px] lg:px-[30px] xl:px-[35px] 2xl:px-[48px]"
          data-aos="fade-up"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <div
            className={`${
              themeReducer === "light" ? "bg-[#F6F5FF]" : "bg-[#2B284C]"
            } w-[100px] md:w-[170px] h-[55px] md:h-[96px] rounded-[8px] lg:rounded-[12px] 2xl:rounded-[16px] flex justify-center items-center`}
          >
            <img
              src={themeReducer === "light" ? amazon : amazonDark}
              alt="airbnb"
              className="w-auto h-[18px] md:h-[32px]"
            />
          </div>
        </div>
        <div
          className="px-[20px] lg:px-[30px] xl:px-[35px] 2xl:px-[48px]"
          data-aos="fade-down"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <div
            className={`${
              themeReducer === "light" ? "bg-[#F6F5FF]" : "bg-[#2B284C]"
            } w-[100px] md:w-[170px] h-[55px] md:h-[96px] rounded-[8px] lg:rounded-[12px] 2xl:rounded-[16px] flex justify-center items-center`}
          >
            <img
              src={themeReducer === "light" ? ola : olaDark}
              alt="airbnb"
              className="w-auto h-[18px] md:h-[34px]"
            />
          </div>
        </div>
        <div
          className="px-[20px] lg:px-[30px] xl:px-[35px] 2xl:px-[48px]"
          data-aos="fade-down"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <div
            className={`${
              themeReducer === "light" ? "bg-[#F6F5FF]" : "bg-[#2B284C]"
            } w-[100px] md:w-[170px] h-[55px] md:h-[96px] rounded-[8px] lg:rounded-[12px] 2xl:rounded-[16px] flex justify-center items-center`}
          >
            <img
              src={themeReducer === "light" ? walmart : walmartDark}
              alt="airbnb"
              className="w-auto h-[18px] md:h-[28px]"
            />
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default PartnerSlider;
