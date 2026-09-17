const it = {
    itServicesHeroTitle: `
        <span> Websites and web applications </span> built for small businesses, freelancers and associations
        `,
    itServicesHeroDescription:
        "Design, development and maintenance of websites and web applications, with a single point of contact in French-speaking Switzerland.",
    itServicesHeroContactBtn: "Request a quote",

    itServicesAboutTitle: `How we <span> approach web projects </span>`,
    itServicesAboutDescription: `
        A website or an application should <b> serve your business, not complicate it. </b>
        <br />
        So we start from how you actually operate: what your visitors need to find, what your team needs to be able to do, and what has to stay easy to update. You get a written scope and a detailed quote before any development starts.
        `,

    itServicesTitle: `<span> Our </span> web services`,
    itServicesDescription: "Three services, depending on whether you start from scratch, from a business need, or from a site to take over.",

    // ------------------------------------------------------------------
    // MediaSmart SaaS products — highlighted outside the portfolio, because
    // these are products we sell rather than client references. The free
    // tools are deliberately kept separate below: they are showcase, not
    // lead generation.
    // ------------------------------------------------------------------
    saasTitle: `<span> Our business </span> applications`,
    saasDescription:
        "We also build and run our own applications, hosted in Switzerland and operational from the day they are installed.",
    saasDemoCta: "See the demo",
    saasBookCta: "Request a demo",
    saasProducts: [
        {
            id: "cc-factures-dashboard",
            name: "Supplier invoices dashboard",
            tagline: "Track your supplier spending, month by month and supplier by supplier",
            highlights: [
                "Monthly KPIs, top suppliers and period-over-period comparisons",
                "Microsoft 365 sign-in and direct ingestion from SharePoint",
                "Per-file drill-down and one-click CSV export",
            ],
        },
        {
            id: "ged-mediasmart",
            name: "MediaSmart GED",
            tagline: "Invoices and sensitive paperwork, filed automatically and kept on your premises",
            highlights: [
                "Automatic OCR with supplier, amount and due-date extraction",
                "Encrypted storage on your internal network: no data leaves your premises",
                "Password-protected web UI, installed and maintained by MediaSmart",
            ],
        },
    ],
    // Countdown shown on a tool that is not public yet. The target date lives
    // in it-portfolio.json (the "launchDate" field).
    launchCountdownLabel: "Public launch in",
    launchCountdownDays: "d",
    launchCountdownHours: "h",
    launchCountdownMinutes: "min",
    launchCountdownSeconds: "s",
    launchCountdownLive: "Open to everyone",
    saasFreeTitle: `<span>Freely</span> available`,
    saasFreeCta: "Open the tool",
    saasFreeDescription:
        "Tools we make available to everyone, with no account and no invoicing.",
    saasFreeTools: [
        {
            id: "cc-voice",
            name: "Voice Studio",
            tagline: "Voice cloning and synthesis, computed on our own hardware rather than in the cloud. A public release is in preparation.",
        },
        {
            id: "mediasmart-games",
            name: "MediaSmart Lab",
            tagline: "Our mini-games and web experiments, freely accessible.",
        },
    ],

    portfolioTxt: "Our work",
    portfolioBtn: "See more projects",

    portfolioModalHeading: "Our work",
    portfolioModalDescription: "A selection of the websites and applications we have designed, built and put online.",
    portfolioVisitSite: "Visit website",
    // Gallery sections. The keys follow the category name used in
    // it-portfolio.json (client / saas / free).
    portfolioCategoryClientLabel: "Client projects",
    portfolioCategoryClientDescription: "Websites and applications designed and delivered for our clients.",
    portfolioCategorySaasLabel: "Our business applications",
    portfolioCategorySaasDescription: "The business applications we build, host and sell ourselves.",
    portfolioCategoryFreeLabel: "Free tools",
    portfolioCategoryFreeDescription: "Tools we publish openly, with no account and no invoicing.",
    portfolioCloseImage: "Close image",

    service1: "Website creation and redesign",
    description1: `
        Your website is often the <b> first contact </b> between your organisation and your clients. We build it fast, secure and readable on desktop, tablet and mobile.
        <br />
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Showcase sites to present your activity and your services. </li>
        <li> Fuller sites: forms, blog, booking or online shop. </li>
        <li> Technical SEO work so you can be found on Google. </li>
        </ul>
        We hand over a site you can keep updated yourself, and stay available for later changes.
        `,
    // Active web services, rendered on /it-services right after "service1".
    // They cover the same scope already described in the estimates section
    // (custom application, redesign / migration).
    serviceApp: "Custom web applications",
    descriptionApp: `
        When a website is no longer enough, we build the tool that actually matches your organisation, instead of bending your processes around generic software.
        <br />
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Interface and business logic designed around your own processes. </li>
        <li> User authentication and access-rights management. </li>
        <li> Database design and administration. </li>
        <li> API development, or integration with the tools you already use. </li>
        </ul>
        Every project starts with a scoping analysis, followed by a detailed quote. The two applications we run today, supplier-invoice tracking and document management, both came out of that process.
        `,
    serviceRedesign: "Website redesign and migration",
    descriptionRedesign: `
        A site that still works but has aged does not need to be rebuilt from scratch. We keep what holds up and replace what gets in the way.
        <br />
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Visual redesign and a review of the navigation paths. </li>
        <li> Migration of the existing content. </li>
        <li> Load-time optimisation. </li>
        <li> Updated display on mobile and tablet. </li>
        </ul>
        We start with a review of the current site, so we can cost precisely what has to be rebuilt and what can be kept.
        `,

    // ==================================================================
    // SECONDARY IT SERVICES DISABLED — DO NOT DELETE
    // The site now leads with website and web application development.
    // Services "service2" through "service6" (Windows/macOS maintenance,
    // workstation optimisation, cybersecurity, backup, user support and
    // training) are no longer rendered: their blocks are commented out in
    // src/features/it-services/components/services.tsx. The keys stay for
    // FR/EN parity and for an immediate rollback, with nothing to rewrite.
    // ==================================================================
    service2: "Windows and macOS maintenance",
    description2: `
        A maintained workstation lasts longer and fails less often. We carry out <b> preventive maintenance </b> on your machines:
        <br />
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> System and software updates. </li>
        <li> Clean-up and review of settings. </li>
        <li> Checks on disk space, system errors and hardware health. </li>
        <li> Fast intervention when a workstation locks up. </li>
        </ul>
        The goal: a stable, up-to-date estate and as few interruptions to your work as possible.
        `,
    service3: "Performance optimisation",
    description3: `
        A slow workstation or server costs time every single day. We analyse the system to find the real cause of the slowdown, then act on it:
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Review of the hardware and software configuration. </li>
        <li> Clean-up of startup items and background applications. </li>
        <li> Removal of unnecessary files and processes. </li>
        </ul>
        A few adjustments are often enough to postpone replacing a machine by several years.
        `,
    service4: "Cybersecurity and audits",
    description4: `
        Intrusion attempts, ransomware and phishing do not only target large corporations: smaller organisations are often the least protected.
        <br />
        We secure your data and your equipment:
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Antivirus installation and configuration. </li>
        <li> Firewall setup and network hardening. </li>
        <li> Security audit to identify your weak points. </li>
        <li> Access and password management. </li>
        <li> Good-practice awareness for your staff. </li>
        </ul>
        Every finding comes with a clear recommendation and a priority order.
        `,
    service5: "Data backup and restore",
    description5: `
        A failed disk, a mishandled file or a ransomware infection can wipe out years of work.
        <br />
        We put a <b> regular backup </b> in place, local or in the cloud, sized for your activity, and we verify that a restore actually works. If files are deleted or damaged, we also attempt data recovery.
        `,
    service6: "User support and training",
    description6: `
        An IT problem quickly becomes a blocker. We provide <b>accessible and responsive support</b>:
        <br />
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Diagnosis and troubleshooting, remotely or on site. </li>
        <li> Answers you can actually understand, without unnecessary jargon. </li>
        <li> One-to-one or group training on your tools: Windows, macOS, Microsoft 365, security good practice. </li>
        </ul>
        The goal: make your users more self-sufficient, and stay reachable when they are not.
        `,

    estimatesTitle: `Project <span>cost estimates</span>`,
    estimatesDescription: "Indicative ranges to help you situate your budget. Every project gets a detailed quote before work begins.",
    estimateFrom: "from",
    estimateOnQuote: "On request",
    estimateDeliveryLabel: "Estimated delivery",
    estimateVitrineDelivery: "~2 weeks",
    estimateBusinessDelivery: "~1 month",
    estimateRefonteDelivery: "~2 weeks",
    estimateAppDelivery: "from 1 month",
    estimatePopular: "Most popular",
    estimatesDisclaimer: "These estimates are indicative and may vary depending on scope, integrations, and content complexity. A detailed quote is provided before any work begins.",
    estimateCtaQuote: "Request a quote",
    estimateCtaQuestion: "Ask a question",
    supportBandTitle: "Protect your project with a support plan",
    supportBandSubtitle: "Optional annual subscription · Included hours · Guaranteed SLA",
    supportBandHours: "h included",
    supportBandP1: "P1:",
    supportBandDetails: "See full details",
    supportBandExtra: "Extra hours:",
    estimateVitrineTitle: "Showcase Website",
    estimateVitrineSubtitle: "Up to 5 pages — perfect for presenting your activity",
    estimateVitrineItems: [
      "Responsive design (desktop, tablet, mobile)",
      "Up to 5 custom pages",
      "Contact form",
      "Basic SEO optimisation",
      "Go-live on agreed hosting",
    ],
    estimateBusinessTitle: "Business Website",
    estimateBusinessSubtitle: "Blog, e-commerce, advanced forms & integrations",
    estimateBusinessItems: [
      "All features of the Showcase tier",
      "Blog or news section",
      "E-commerce or booking system",
      "Third-party integrations (newsletter, maps, payments…)",
      "Advanced SEO on request",
    ],
    estimateRefonteTitle: "Redesign / Migration",
    estimateRefonteSubtitle: "Modernise an existing site without starting from scratch",
    estimateRefonteItems: [
      "Visual and UX overhaul",
      "Content migration",
      "Performance & speed optimisation",
      "Mobile responsiveness update",
    ],
    estimateAppTitle: "Custom Web App",
    estimateAppSubtitle: "Tailored solution with database, auth, business logic",
    estimateAppItems: [
      "Custom interface and business logic",
      "User authentication",
      "Database design and management",
      "API development or integration",
      "Detailed quote after scoping session",
    ],

    practicalInfoTitle: `<span>Practical</span> information`,
    practicalInfoDescription: "Rates, payment terms, warranty and working hours: what to know before we start.",
    hourlyRateTitle: "Standard hourly rate",
    hourlyRateStandard: "Standard",
    hourlyRateUrgent: "Urgent (off-hours)",
    hourlyRateWeekend: "Weekend / public holiday",
    hourlyRateMinBilling: "Minimum billing: 30 min. Every started half-hour is due.",
    hourlyRateContractNote: "With a support contract, extra hours are billed at 90–120 CHF/h. The Premium plan includes 2h of weekend intervention per year at no extra charge.",
    paymentTitle: "Payment terms",
    paymentStep1: "50%",
    paymentStep1Sub: "at order — before work begins",
    paymentStep2: "50%",
    paymentStep2Sub: "before going live",
    paymentNote: "Late payments incur 5% annual interest from the due date, plus recovery costs.",
    warrantyTitle: "Corrective warranty",
    warrantyDays: "days after going live",
    warrantyDescription: "We correct any technical anomalies attributable to us within 14 days of the site going live.",
    warrantyExclusion: "Excludes new requests, content changes, hosting issues, or client-side interventions.",
    hoursTitle: "Business hours",
    hoursSchedule: "Monday – Friday, 07:00 – 18:00",
    hoursNote: "Excluding official Valais public holidays",
    scopeTitle: "Website creation — what is included",
    includedTitle: "Included by default",
    excludedTitle: "Not included by default",
    practicalIncludedItems: [
      "Responsive design (desktop, tablet, mobile)",
      "Basic technical SEO optimisation",
      "Contact forms and standard integrations",
      "Go-live on the agreed hosting",
      "14-day corrective warranty",
    ],
    practicalExcludedItems: [
      "Content writing, translation, photo or video creation",
      "Advanced SEO (beyond basic technical optimisation)",
      "Legal compliance (privacy policy, cookies, T&Cs)",
      "Accessibility (WCAG) or specific compliance requirements",
      "Maintenance, updates and monitoring after go-live",
    ],

    supportPricingTitle: `<span>Support</span> pricing`,
    supportPricingDescription: "Applicable to all projects — website, app, or other. One flat rate for all services.",
    supportPerYear: "year",
    supportIncluded: "included",
    supportExtra: "additional hours",
    supportEssentialName: "Support Essentiel",
    supportBusinessName: "Support Business",
    supportSlaP1Essential: "1 business day",
    supportSlaP2Essential: "2 business days",
    supportSlaP3Essential: "3 to 5 business days",
    supportSlaP1Business: "4 business hours",
    supportSlaP2Business: "1 business day",
    supportSlaP3Business: "2 business days",
    supportEssentialNote: "No after-hours intervention included. Urgent requests outside business hours are possible on express request and billed at the standard rate, with no SLA guarantee.",
    supportBusinessNote: "After-hours interventions are not included in the annual flat rate.",
    supportAfterHoursLabel: "After-hours interventions",
    supportAfterHoursUrgent: "Urgent (outside business hours)",
    supportAfterHoursWeekend: "Weekend / public holiday",
    supportPremiumName: "Support Premium",
    supportSlaP1Premium: "2 business hours",
    supportSlaP2Premium: "8 business hours",
    supportSlaP3Premium: "1 business day",
    supportPremiumWeekendIncluded: "Weekend intervention included up to 2h per contract year",
    supportPremiumBeyond: "Beyond that:",
    supportPremiumNote: "After-hours and weekend rates apply beyond the included 2h/year.",

    itServicesProcessTitle: `How an <span> assignment </span> runs`,
    itServicesProcessDescription: "Five steps, from first contact through to follow-up after go-live:",
    processData: [
        {
            title: "Consultation",
            description: "We review your situation, your constraints and what you actually expect.",
        },
        {
            title: "Analysis",
            description: "We review what is already there, flag the blockers and cost the work.",
        },
        {
            title: "Proposal",
            description: "You receive a detailed quote, with scope, timeline and what is and is not included.",
        },
        {
            title: "Implementation",
            description: "We deploy with minimal disruption, outside production hours when necessary.",
        },
        {
            title: "Follow-up",
            description: "After go-live we handle updates, fixes and support, with or without a contract.",
        },
    ],
    supportPageTitle: `Support <span>contract</span>`,
    supportPageSubtitle: "An optional annual subscription to protect your project with guaranteed response times and included hours.",
    supportPageIntro: "The support contract is separate from the creation project. It activates after go-live and covers technical interventions, fixes and improvement requests within the included hours.",
    supportPagePriorityTitle: "Priority definitions",
    supportPagePriorityDescription: "Final classification is at the sole discretion of the Provider.",
    supportPageP1Desc: "Site or service completely inaccessible.",
    supportPageP2Desc: "Essential feature degraded or severely disrupted.",
    supportPageP3Desc: "Minor incident, improvement request or question.",
    supportPageHoursTitle: "Business hours",
    supportPageHoursDesc: "Monday – Friday, 07:00 – 18:00, excluding official Valais public holidays. SLA deadlines are expressed in business hours or days according to this definition.",
    supportPagePlansTitle: "Support plans",
    supportPagePlansDescription: "The subscribed plan is defined in writing. Without a contract, all interventions are billed at the standard hourly rate.",
    supportPageAfterHoursTitle: "After-hours interventions",
    supportPageAfterHoursEssential: "Not included. Available on express request, billed at standard rates with no SLA.",
    supportPageAfterHoursBusiness: "Available on express request.",
    supportPageAfterHoursPremium: "2h weekend included per year. Beyond that, standard rates apply.",
    supportPageLimitTitle: "Operational limitations",
    supportPageLimits: [
      "Maximum 2 simultaneous P1 incidents per client. Additional requests may be reclassified as P2.",
      "Response means the start of effective handling (analysis, diagnosis). It does not constitute a resolution deadline.",
      "SLA deadlines do not apply when the incident depends on a third party (host, registrar, API, plugin) or when required access is unavailable.",
      "The Provider may reclassify any abusive, repetitive or out-of-scope request as a billable intervention.",
    ],
    supportPageTermsTitle: "Contract terms",
    supportPageTerms: [
      "Annual subscription, automatically renewed unless cancelled in writing 30 days before expiry.",
      "Unused included hours are neither carried over nor refunded at end of period.",
      "In case of early termination, the full annual amount remains due until the contractual expiry date.",
      "The support contract is independent of the creation project and can be subscribed at any time.",
    ],
    supportPageCtaTitle: "A question about the support contract?",
    supportPageCtaDesc: "Write to us to work out which plan fits your activity, or to request a quote.",
    supportPageBackLink: "← Back to IT services",
    supportPageMoreInfo: "More info",
    supportMostPopular: "Most popular",

    itFaqTitle: "Frequently Asked Questions",
    itFaq1: {
        faqQuestion: "What kind of web projects do you build?",
        faqAnswer: "Showcase sites, business sites (blog, online shop, booking), redesigns and migrations, and custom web applications with a database and user authentication. We work with SMEs, freelancers and associations across French-speaking Switzerland.",
    },
    itFaq2: {
        faqQuestion: "Do you work with small businesses and freelancers?",
        faqAnswer: "Yes — they are in fact our core clientele. We size every project to your budget and your real needs, with a detailed quote and no hidden fees.",
    },
    itFaq3: {
        faqQuestion: "What regions do you serve?",
        faqAnswer: "We are happy to meet clients in the cantons of Valais, Vaud, Geneva and Fribourg. Since development and follow-up happen remotely, we also work with clients elsewhere in Switzerland and abroad.",
    },
    itFaq4: {
        faqQuestion: "How long does it take to build a website or application?",
        faqAnswer: "Allow 2 to 4 weeks for a showcase website, and typically 6 to 16 weeks for a custom web application or a major redesign, depending on scope. The timeline is agreed with you when the project starts.",
    },
    // SUPPORT CONTRACT DISABLED — DO NOT DELETE
    // The support-contract offering is being reworked: the question below was
    // replaced by one about what happens after go-live. Former copy, to restore
    // as-is when the offering comes back:
    // faqQuestion: "Do you offer support or maintenance contracts?",
    // faqAnswer: "Yes. After go-live, three annual contract levels (Essentiel, Business, Premium) cover fixes, changes and questions: included intervention hours, guaranteed response times (SLA) and a reduced hourly rate beyond them."
    itFaq5: {
        faqQuestion: "What happens once the site is live?",
        faqAnswer: "Any technical fault attributable to our own work is fixed free of charge for 14 days after go-live. After that, fixes and changes are handled on request, by quote or at the hourly rate. An annual follow-up offering is in preparation.",
    },
    itFaq6: {
        faqQuestion: "How does the initial contact work?",
        faqAnswer: "Book a free 30-minute consultation through our online tool. We review your situation together, then you receive a detailed quote within 48 hours, with no commitment.",
    },
};
export default it;
