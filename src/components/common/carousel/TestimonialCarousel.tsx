import React from "react";
import Slider from "react-slick";
import "./slick.css";
import "./slick-theme.css";

import TicketCard from "../testimonials/TestimonialCard";
import TestimonialCard from "../testimonials/TestimonialCard";
import testimonial1 from "assets/images/testimonial1.png";
import testimonial2 from "assets/images/testimonial2.png";
import rating1 from "assets/icons/rating.svg";

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
            name={dictionary["home"][languageReducer]["author1"]}
            company={dictionary["home"][languageReducer]["author1title"]}
            message={dictionary["home"][languageReducer]["testimonial1"]}
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
            name={dictionary["home"][languageReducer]["author2"]}
            company={dictionary["home"][languageReducer]["author2title"]}
            message={dictionary["home"][languageReducer]["testimonial2"]}
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
            name={dictionary["home"][languageReducer]["author3"]}
            company={dictionary["home"][languageReducer]["author3title"]}
            message={dictionary["home"][languageReducer]["testimonial3"]}
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
            name={dictionary["home"][languageReducer]["author4"]}
            company={dictionary["home"][languageReducer]["author4title"]}
            message={dictionary["home"][languageReducer]["testimonial4"]}
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
            name={dictionary["home"][languageReducer]["author5"]}
            company={dictionary["home"][languageReducer]["author5title"]}
            message={dictionary["home"][languageReducer]["testimonial5"]}
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
            name={dictionary["home"][languageReducer]["author6"]}
            company={dictionary["home"][languageReducer]["author6title"]}
            message={dictionary["home"][languageReducer]["testimonial6"]}
          />
        </div>
      </Slider>
    </div>
  );
};

export default TestimonialSlider;
