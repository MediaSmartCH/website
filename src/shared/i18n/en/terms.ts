// ============================================================================
// TERMS AND CONDITIONS
// Every clause restates a condition already written in the project: hourly
// rate and minimum billing, payment schedule, late-payment interest, the
// corrective warranty and its exclusions, business hours, and the included /
// excluded scope (see it.hourlyRate*, it.payment*, it.warranty*, it.hours*,
// it.practicalIncludedItems and it.practicalExcludedItems).
//
// The keys are duplicated on purpose rather than reused from "it": a
// contractual page must not change because a marketing string is reworded.
//
// TO BE COMPLETED BY A PROFESSIONAL — deliberately NOT covered here, because
// the project does not document them: VAT, intellectual property in the
// deliverables and its transfer, limitation of liability, termination,
// governing law and jurisdiction.
// ============================================================================
const terms = {
    pageTitle: "Terms and conditions",
    lastUpdated: "Last updated:",
    intro:
        "These terms apply to the website and web application work carried out by MediaSmart. They supplement the accepted quote, which remains the reference document: where the two differ, the quote prevails.",
    draftNoticeTitle: "Document still being completed",
    draftNotice:
        "This page sets out the conditions that already apply to our work. Some clauses (intellectual property in the deliverables, limitation of liability, governing law) will be added after legal review. In the meantime, please write to us with any question.",

    // 1. Scope
    s1Title: "1. Scope",
    s1Desc:
        "These terms govern the design, development and deployment of websites and web applications carried out by MediaSmart – Raphael Rouiller, a sole proprietorship based in Dorénaz, Valais, Switzerland.",
    s1Quote:
        "They are made available to the client before the quote is accepted and form part of the contract.",

    // 2. Quotes and orders
    s2Title: "2. Quotes and orders",
    s2Desc:
        "Every project is quoted in detail before any work begins. The quote sets out the agreed scope, the timeline and the price.",
    s2Order:
        "The order is firm once the client accepts the quote in writing. Any request outside the described scope is either quoted separately or billed at the hourly rate.",

    // 3. Rates
    s3Title: "3. Rates",
    s3Desc: "Work not covered by a fixed-price quote is billed at the following hourly rates:",
    s3RateStandard: "Standard rate",
    s3RateUrgent: "Urgent, outside business hours",
    s3RateWeekend: "Weekends and public holidays",
    s3MinBilling: "Minimum billing is 30 minutes. Every half-hour started is due.",
    s3Currency: "All amounts are in Swiss francs (CHF).",

    // 4. Business hours
    s4Title: "4. Business hours",
    s4Schedule: "Monday to Friday, 07:00 to 18:00.",
    s4Holidays:
        "Official public holidays in the canton of Valais are excluded. The urgent and weekend rates apply outside these hours.",

    // 5. Payment
    s5Title: "5. Payment terms",
    s5Step1: "50% on order, before work begins.",
    s5Step2: "50% before going live.",
    s5Late:
        "Late payment incurs interest of 5% per year from the due date, plus recovery costs.",

    // 6. Scope of a website project
    s6Title: "6. Scope of a website project",
    s6IncludedTitle: "Included by default",
    s6Included: [
        "Responsive design (desktop, tablet, mobile).",
        "Basic technical SEO optimisation.",
        "Contact forms and standard integrations.",
        "Go-live on the agreed hosting.",
        "A 14-day corrective warranty.",
    ],
    s6ExcludedTitle: "Not included by default",
    s6Excluded: [
        "Content writing, translation, photo or video creation.",
        "Advanced search optimisation, beyond the basic technical work.",
        "Legal compliance of the client's site (privacy policy, cookies, terms).",
        "Accessibility (WCAG) or specific compliance requirements.",
        "Maintenance, updates and monitoring after go-live.",
    ],
    s6Note:
        "Any of these can be added to the project; they then appear as a separate line on the quote.",

    // 7. Client input
    s7Title: "7. Client input",
    s7Desc:
        "Since content writing is not included by default, the agreed timeline assumes the client provides the necessary texts, visuals and access within the planned dates. A delay in providing them moves the go-live date accordingly.",

    // 8. Warranty
    s8Title: "8. Corrective warranty",
    s8Desc:
        "We fix, at no charge, any technical fault attributable to our own development work reported within 14 days of go-live.",
    s8ExclusionsTitle: "This warranty does not cover:",
    s8Exclusions: [
        "New requests and functional changes.",
        "Content changes.",
        "Incidents attributable to the host or to a third-party service.",
        "Work carried out on the delivered site by the client.",
    ],
    s8After:
        "After that period, fixes and changes are handled on request, either by quote or at the hourly rate.",

    // 9. After go-live
    s9Title: "9. After go-live",
    s9Desc:
        "Maintenance, updates and monitoring are not part of a creation project. An annual follow-up offering is in preparation; in the meantime, work carried out after the warranty period is billed at the hourly rate.",

    // 10. Questions
    s10Title: "10. Questions",
    s10Desc: "For any question about these terms, write to us at:",
};
export default terms;
