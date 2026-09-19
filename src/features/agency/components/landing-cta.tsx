/**
 * Closing call to action: the booking button, and a link to the contact form
 * for someone who would rather write than pick a slot.
 */

import React from "react";

import BookingButton from "@features/booking/components/booking-button";

export default function LandingCta({
  title,
  description,
  bookingLabel,
  secondaryLabel,
  secondaryTo,
}: {
  title: string;
  description: string;
  bookingLabel: string;
  secondaryLabel: string;
  /** In-page anchor, so the contact form is one scroll away rather than a page load. */
  secondaryTo: string;
}) {
  return (
    <section className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[50px] lg:pt-[70px] pb-[20px]">
      <div className="bg-surface rounded-[18px] xl:rounded-[25px] px-6 py-8 md:px-10 md:py-10 text-center">
        <h2 className="text-heading-strong font-redDisplay font-bold text-[22px] md:text-[26px] lg:text-[30px] xl:text-[34px] mb-[12px]">
          {title}
        </h2>
        <p className="text-body font-poppins font-light text-[13px] md:text-[15px] xl:text-[16px] leading-relaxed w-full lg:w-[70%] mx-auto mb-[24px]">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[14px]">
          <BookingButton
            className="custom-btn2 middle-out px-[25px] lg:px-[22px] h-[43px] lg:h-[46px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center"
            text={bookingLabel}
          />
          <a
            href={secondaryTo}
            className="gradient-text font-poppins font-medium text-[14px] xl:text-[15px] underline underline-offset-4 py-[10px]"
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
