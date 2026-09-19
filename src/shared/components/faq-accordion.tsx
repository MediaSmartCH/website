/**
 * The site's FAQ accordion.
 *
 * Extracted from the services page when the regional pages needed the same
 * thing. The expand icons are inline SVG rather than an icon component because
 * the open state uses a flat fill and the closed state a gradient, and the
 * gradient needs its own `<defs>`; `idPrefix` keeps two accordions on one page
 * from sharing a gradient id.
 */

import React from "react";
import { Collapse } from "antd";

import { useAppSelector } from "@shared/hooks/store-hooks";

import "@styles/components/faq-accordion.css";

export interface FaqItem {
  faqQuestion: string;
  faqAnswer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  /** Disambiguates the gradient id when a page renders more than one. */
  idPrefix: string;
}

export default function FaqAccordion({ items, idPrefix }: FaqAccordionProps) {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const gradientId = `${idPrefix}-faq-expand`;

  const answerClass =
    "text-body pt-[0px] pb-[15px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light";

  const itemClass = `${
    themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]"
  } mb-[13px] lg:mb-[17px] rounded-[10px]`;

  const collapseItems = items.map((item, index) => ({
    key: String(index + 1),
    label: item.faqQuestion,
    children: <div className={answerClass}>{item.faqAnswer}</div>,
    className: itemClass,
  }));

  return (
    <Collapse
      className={`min-w-full ${themeReducer === "light" ? "light" : "dark"}`}
      ghost
      accordion
      defaultActiveKey={["1"]}
      expandIconPosition="end"
      expandIcon={({ isActive }) =>
        isActive ? (
          <div className="pr-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] lg:w-[32px] lg:h-[32px]">
              <rect width="31" height="31" rx="15.5" transform="matrix(-1 0 0 1 31.9448 0.696777)" fill="#E20052" />
              <path fillRule="evenodd" clipRule="evenodd" d="M10.788 11.9541L12.2022 10.5399L16.4448 14.7825L20.6875 10.5399L22.1017 11.9541L17.859 16.1967L22.1017 20.4394L20.6875 21.8536L16.4448 17.6109L12.2022 21.8536L10.788 20.4394L15.0306 16.1967L10.788 11.9541Z" fill="white" />
            </svg>
          </div>
        ) : (
          <div className="pr-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] lg:w-[32px] lg:h-[32px]">
              <rect width="31" height="31" rx="15.5" transform="matrix(-1 0 0 1 31.9448 0.482422)" fill={`url(#${gradientId})`} />
              <path fillRule="evenodd" clipRule="evenodd" d="M15.4448 8.98242H17.4448V14.9824H23.4448V16.9824H17.4448V22.9824H15.4448V16.9824H9.44482V14.9824H15.4448V8.98242Z" fill="white" />
              <defs>
                <linearGradient id={gradientId} x1="0.441727" y1="15.5" x2="30.3183" y2="15.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#B514FD" />
                  <stop offset="1" stopColor="#5F75F5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )
      }
      items={collapseItems}
    />
  );
}
