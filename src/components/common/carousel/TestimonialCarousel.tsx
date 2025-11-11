import React from "react";
import Slider from "react-slick";
// import "./slick.css";
// import "./slick-theme.css";

import TicketCard from "../testimonials/TestimonialCard";
import TestimonialCard from "../testimonials/TestimonialCard";
import testimonial1 from "assets/images/testimonial1.png";
import testimonial2 from "assets/images/testimonial2.png";
import rating1 from "assets/icons/rating.svg";
import { useTranslations } from "services/locales/safe";

const TestimonialSlider = ({ dictionary, languageReducer }: any) => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 1251,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 1,
          infinite: true,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  const t = useTranslations(languageReducer);

  return (
    <div>
      <Slider
        {...settings}
        className="w-[100%] lg:w-[100%] mx-auto z-50 mb-[50px]"
      >
        <div
          className="px-[20px] lg:px-[10px] xl:px-[10px] 2xl:px-[15px]"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <TestimonialCard
            id={1}
            src={testimonial2}
            rating={rating1}
            name={t.text("home.author1")}
            company={t.text("home.author1title")}
            message={t.text("home.testimonial1")}
          />
        </div>
        <div
          className="px-[20px] lg:px-[10px] xl:px-[10px] 2xl:px-[15px]"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <TestimonialCard
            id={2}
            src={testimonial2}
            rating={rating1}
            name={t.text("home.author2")}
            company={t.text("home.author2title")}
            message={t.text("home.testimonial2")}
          />
        </div>
        <div
          className="px-[20px] lg:px-[10px] xl:px-[10px] 2xl:px-[15px]"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <TestimonialCard
            id={1}
            src={testimonial2}
            rating={rating1}
            name={t.text("home.author3")}
            company={t.text("home.author3title")}
            message={t.text("home.testimonial3")}
          />
        </div>
        <div
          className="px-[20px] lg:px-[10px] xl:px-[10px] 2xl:px-[15px]"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <TestimonialCard
            id={2}
            src={testimonial2}
            rating={rating1}
            name={t.text("home.author4")}
            company={t.text("home.author4title")}
            message={t.text("home.testimonial4")}
          />
        </div>
        <div
          className="px-[20px] lg:px-[10px] xl:px-[10px] 2xl:px-[15px]"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <TestimonialCard
            id={1}
            src={testimonial2}
            rating={rating1}
            name={t.text("home.author5")}
            company={t.text("home.author5title")}
            message={t.text("home.testimonial5")}
          />
        </div>
        <div
          className="px-[20px] lg:px-[10px] xl:px-[10px] 2xl:px-[15px]"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <TestimonialCard
            id={2}
            src={testimonial2}
            rating={rating1}
            name={t.text("home.author6")}
            company={t.text("home.author6title")}
            message={t.text("home.testimonial6")}
          />
        </div>
      </Slider>
    </div>
  );
};

export default TestimonialSlider;
