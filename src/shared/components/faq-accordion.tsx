/**
 * The site's FAQ accordion.
 *
 * Built on buttons and `aria-expanded` rather than Ant Design's Collapse.
 * Collapse's `accordion` mode marks the container `role="tablist"`, each
 * question `role="tab"` and each answer `role="tabpanel"` — a tabs pattern,
 * which requires the panels to be *siblings* of the tablist rather than inside
 * it. Every checker says so: the homepage failed `aria-required-children`
 * ("Element has children which are not allowed: [role=tabpanel]"), which cost
 * the accessibility score and the agent-accessibility-tree audit behind
 * PageSpeed's agentic-browsing result.
 *
 * A FAQ is a set of disclosures, not a tab strip, and that is what this is:
 * a heading carrying a button, and the answer it controls. Same markup the
 * WAI-ARIA accordion pattern describes, and nothing left for a checker to
 * object to.
 *
 * The expand icons are inline SVG rather than an icon component because the
 * open state uses a flat fill and the closed state a gradient, and the
 * gradient needs its own `<defs>`; `idPrefix` keeps two accordions on one page
 * from sharing a gradient id.
 */

import React from "react";

import { useAppSelector } from "@shared/hooks/store-hooks";

import "@styles/components/faq-accordion.css";

export interface FaqItem {
  faqQuestion: string;
  faqAnswer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  /** Disambiguates the gradient id, and the ids tying buttons to answers. */
  idPrefix: string;
}

function CloseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="faq-accordion__icon-svg" aria-hidden="true" focusable="false">
      <rect width="31" height="31" rx="15.5" transform="matrix(-1 0 0 1 31.9448 0.696777)" fill="#E20052" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.788 11.9541L12.2022 10.5399L16.4448 14.7825L20.6875 10.5399L22.1017 11.9541L17.859 16.1967L22.1017 20.4394L20.6875 21.8536L16.4448 17.6109L12.2022 21.8536L10.788 20.4394L15.0306 16.1967L10.788 11.9541Z" fill="white" />
    </svg>
  );
}

function OpenIcon({ gradientId }: { gradientId: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="faq-accordion__icon-svg" aria-hidden="true" focusable="false">
      <rect width="31" height="31" rx="15.5" transform="matrix(-1 0 0 1 31.9448 0.482422)" fill={`url(#${gradientId})`} />
      <path fillRule="evenodd" clipRule="evenodd" d="M15.4448 8.98242H17.4448V14.9824H23.4448V16.9824H17.4448V22.9824H15.4448V16.9824H9.44482V14.9824H15.4448V8.98242Z" fill="white" />
      <defs>
        <linearGradient id={gradientId} x1="0.441727" y1="15.5" x2="30.3183" y2="15.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B514FD" />
          <stop offset="1" stopColor="#5F75F5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function FaqAccordion({ items, idPrefix }: FaqAccordionProps) {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const gradientId = `${idPrefix}-faq-expand`;

  // One at a time, first one open — the behaviour Collapse's `accordion` and
  // `defaultActiveKey` gave.
  const [openIndex, setOpenIndex] = React.useState(0);

  const answerClass =
    "text-body pt-[0px] pb-[15px] lg:pb-[33px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-helvetica font-light";

  const itemSurface = themeReducer === "light" ? "bg-[#F6F6F6]" : "bg-[#2B284C]";

  return (
    <div className={`faq-accordion ${themeReducer === "light" ? "light" : "dark"}`}>
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        const buttonId = `${idPrefix}-faq-q${index + 1}`;
        const panelId = `${idPrefix}-faq-a${index + 1}`;

        return (
          <div
            key={buttonId}
            className={`faq-accordion__item ${itemSurface} mb-[13px] lg:mb-[17px] rounded-[10px]`}
          >
            {/* h3 because the section's own title is the h2. Collapse rendered
                a bare div, so the questions were invisible to anything reading
                the page by its outline — a crawler, an answer engine, or a
                screen reader's heading list. */}
            <h3 className="faq-accordion__heading">
              <button
                type="button"
                id={buttonId}
                className="faq-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                // Clicking the open one closes it, as Collapse did.
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="faq-accordion__question">{item.faqQuestion}</span>
                <span className="faq-accordion__icon">
                  {isOpen ? <CloseIcon /> : <OpenIcon gradientId={`${gradientId}-${index + 1}`} />}
                </span>
              </button>
            </h3>

            {/* Every answer is in the served HTML, open or not.
                The FAQPage structured data must quote what the page shows and
                not more, and the answer engines this FAQ is largely written
                for read the markup and do not click anything. `inert` keeps a
                closed answer out of the accessibility tree and out of the tab
                order, so a reader still meets exactly one answer at a time —
                which is what an accordion is, not content hidden from people
                and shown to crawlers. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="faq-accordion__panel"
              data-open={isOpen ? "true" : "false"}
              inert={!isOpen}
            >
              <div className="faq-accordion__panel-inner">
                <div className="faq-accordion__body">
                  <div className={answerClass}>{item.faqAnswer}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
