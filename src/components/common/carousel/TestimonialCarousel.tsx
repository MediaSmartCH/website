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
            name={dictionary["testimonial"][languageReducer]["author1"]}
            company={dictionary["testimonial"][languageReducer]["author1title"]}
            message={dictionary["testimonial"][languageReducer]["testimonial1"]}
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
            name={dictionary["testimonial"][languageReducer]["author2"]}
            company={dictionary["testimonial"][languageReducer]["author2title"]}
            message={dictionary["testimonial"][languageReducer]["testimonial2"]}
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
            name={dictionary["testimonial"][languageReducer]["author3"]}
            company={dictionary["testimonial"][languageReducer]["author3title"]}
            message={dictionary["testimonial"][languageReducer]["testimonial3"]}
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
            name={dictionary["testimonial"][languageReducer]["author4"]}
            company={dictionary["testimonial"][languageReducer]["author4title"]}
            message={dictionary["testimonial"][languageReducer]["testimonial4"]}
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
            name={dictionary["testimonial"][languageReducer]["author5"]}
            company={dictionary["testimonial"][languageReducer]["author5title"]}
            message={dictionary["testimonial"][languageReducer]["testimonial5"]}
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
            name={dictionary["testimonial"][languageReducer]["author6"]}
            company={dictionary["testimonial"][languageReducer]["author6title"]}
            message={dictionary["testimonial"][languageReducer]["testimonial6"]}
          />
        </div>
      </Slider>
    </div>
  );
};

export default TestimonialSlider;
