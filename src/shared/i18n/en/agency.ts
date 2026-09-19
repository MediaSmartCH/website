// ============================================================================
// REGIONAL PAGES
// English mirror of src/shared/i18n/fr/agency.ts. Same facts, same structure.
//
// The place names stay as they are written locally — Suisse romande is given
// as "French-speaking Switzerland", Valais keeps its own name, and Dorénaz
// is not translated.
// ============================================================================
const agency = {
    // ---------------------------------------------------------------- shared
    servicesTitle: "What we build",
    methodTitle: "How a project runs",
    methodDescription:
        "The same sequence on every project, from the first conversation to the follow-up after launch.",
    // "WHERE WE WORK" SECTION REMOVED — keys kept, see the French file.
    areaTitle: "Where we work",
    proofTitle: "Projects already online",
    proofCta: "See our work in detail",
    servicesCta: "See our web services in detail",
    faqTitle: "Frequently asked questions",
    ctaTitle: "Let's talk about your project",
    ctaDescription:
        "A free, no-commitment 30-minute consultation to go over what you need. You then receive a detailed quote within 48 hours.",
    ctaButton: "Book a 30-minute consultation",
    ctaSecondary: "Write to us directly",

    // ----------------------------------------------- pointers from the site
    valaisLinkLabel: "What we do in Valais",
    romandieLinkLabel: "What we do across French-speaking Switzerland",
    regionalLinksTitle: "Where we work",
    // Under the two regional cards: proximity is an argument, not a
    // condition. Two cards naming two regions and nothing else read as a
    // restriction.
    beyondRegionText: "Based elsewhere in Switzerland, or abroad? Design, development and follow-up happen remotely, as they do on most of our projects.",
    beyondRegionCta: "Talk about your project",
    regionalLinksDescription: "Two pages in detail: what we build, how a project runs, and where we work.",
    regionalLinks: [
        {
            title: "Websites and applications in French-speaking Switzerland",
            description:
                "What we build, how a project runs, where we work and what a site costs: the detailed page for French-speaking Switzerland.",
            label: "See what we do across French-speaking Switzerland",
        },
        {
            title: "Web agency in Valais",
            description:
                "Our footing in the canton: the office in Dorénaz, the Valais clients already online, and the working calendar.",
            label: "See what we do in Valais",
        },
    ],

    // ----------------------------------------- French-speaking Switzerland
    romandieTitle: "Website and web application development in French-speaking Switzerland",
    romandieLead:
        "MediaSmart designs, builds and maintains websites and web applications for SMEs, freelancers and associations across French-speaking Switzerland. The company is a sole proprietorship based in Dorénaz, Valais, run by Raphael Rouiller: you talk to the person who analyses, designs and builds your project.",
    romandieIntro: `
        Choosing a web supplier comes down to three questions: who actually does the work, what the quote covers, and what happens once the site is live. This page answers them for MediaSmart, without going through a form first.
        `,

    romandieServices: [
        {
            title: "Website creation",
            description:
                "Showcase sites of up to five pages to present a business, and fuller sites with a blog, online shop, booking system or advanced forms. Mobile and tablet layouts included, and content you can update yourself.",
        },
        {
            title: "Web application development",
            description:
                "For when a website is no longer enough: interface and business logic built around your processes, authentication and access rights, database design, and API development or integration with the tools you already use.",
        },
        {
            title: "Redesign and migration",
            description:
                "An ageing site rarely needs to be rebuilt from scratch. A review prices what has to be redone and what can be kept: visual redesign, content migration, loading times, mobile layout.",
        },
        {
            title: "Search, AI answer engines and performance",
            description:
                "Technical search-engine and loading-time optimisation, included by default when we build a site. We also prepare pages for answer engines: explicit headings, self-contained answers, structured data — what is called GEO and AEO. Advanced editorial SEO is a separate engagement.",
        },
        {
            title: "Hosted business applications",
            description:
                "Two applications we build and run ourselves: a supplier-invoice analytics dashboard and a document management system installed on your own network. Both came out of client needs rather than a product plan.",
        },
        {
            title: "Support after launch",
            description:
                "Any technical fault attributable to our own work is fixed free of charge for 14 days after launch. After that, fixes and changes are handled on request, by quote or at the hourly rate.",
        },
    ],

    romandieWhyTitle: "How we work",
    romandieWhy: [
        {
            title: "One person, throughout",
            description:
                "The same person from the first conversation to going live. No file is handed between departments, and answers are about your project rather than an internal process.",
        },
        {
            title: "A written scope before anything starts",
            description:
                "You get a detailed scope and a quote before development begins: what is included, what is not, and the timeline. Payment is in two instalments, on order and before launch.",
        },
        {
            title: "Work you can go and look at",
            description:
                "The sites we have built are live and credited: you can open them, browse them on your phone and contact the businesses behind them.",
        },
        {
            title: "Extra hands when a project calls for them",
            description:
                "For a specific skill we draw on a network of partners. The aim is not to look bigger, but to stay reachable and involved on every engagement.",
        },
    ],

    romandieAreaDescription: `
        We are glad to meet clients in <b>Valais, Vaud, Geneva and Fribourg</b>. Because development and follow-up happen remotely, we also work with clients elsewhere in Switzerland and abroad.
        <br />
        The office is in Dorénaz, in Bas-Valais. We work in French or English, and business hours are Monday to Friday, 07:00 to 18:00.
        `,

    romandiePresenceTitle: "Where we are, and how we work",
    romandiePresence: [
        {
            title: "Based in Dorénaz, Valais",
            description: "The office is in Bas-Valais. That is where the work starts from and where journeys are planned.",
        },
        {
            title: "Clients across several cantons",
            description: "SMEs, freelancers and associations, met in Valais, Vaud, Geneva and Fribourg.",
        },
        {
            title: "Meetings on site or online",
            description: "A first conversation can happen at your premises when the journey is worth it, or over video.",
        },
        {
            title: "The work itself happens remotely",
            description: "Design, development and follow-up do not require being neighbours: clients elsewhere in Switzerland and abroad are handled the same way.",
        },
        {
            title: "A technical base built to be found",
            description: "Sites are built with a structure optimised for search engines and for AI answer engines.",
        },
    ],

    romandieFaq: [
        {
            faqQuestion: "Which agency should I choose to build a website in French-speaking Switzerland?",
            faqAnswer:
                "There is no single answer: it depends on your budget, the complexity of the project and who will look after it afterwards. Four things are worth checking before signing — who actually does the work, what the quote includes and excludes, what happens after launch, and whether you can look at previous work online. MediaSmart is a sole proprietorship based in Valais: one point of contact, a written scope before work starts, a 14-day corrective warranty, and client sites that are publicly accessible.",
        },
        {
            faqQuestion: "Do I have to be in French-speaking Switzerland to work with MediaSmart?",
            faqAnswer:
                "No. On-site meetings happen in Valais, Vaud, Geneva and Fribourg, but design, development and follow-up are done remotely. Clients elsewhere in Switzerland or abroad are handled the same way.",
        },
    ],

    // ------------------------------------------------------------- Valais
    valaisTitle: "Web agency in Valais: websites and applications",
    valaisLead:
        "MediaSmart is based in Dorénaz, Valais. We build websites and web applications for businesses, freelancers and associations across the canton — and we are near enough to come and talk about it.",
    valaisIntro: `
        Working with a supplier from the canton changes two practical things: a meeting does not require organising a journey, and the working calendar follows yours, Valais public holidays included. Sites are built with a technical base optimised for search engines and for AI answer engines.
        `,

    valaisLocalTitle: "Our footing in the canton",
    valaisLocal: [
        {
            title: "Based in Dorénaz",
            description:
                "The office is in Dorénaz, in Bas-Valais, between Martigny and the Chablais. A first meeting can take place at your premises rather than over video.",
        },
        {
            title: "Valais clients online",
            description:
                "JoColor, a building-painting company established in Valais, and SoClean4U, a cleaning company working across the Valais and Vaud Chablais: two showcase sites we designed and launched, live right now.",
        },
        {
            title: "A Valais calendar",
            description:
                "Business hours are Monday to Friday, 07:00 to 18:00, excluding the official public holidays of the canton of Valais. Quoted lead times are counted on that calendar, not another.",
        },
        {
            title: "Beyond the canton",
            description:
                "We also meet clients in the cantons of Vaud, Geneva and Fribourg, and work remotely with clients based elsewhere in Switzerland.",
        },
    ],

    valaisServicesTitle: "What we build for Valais businesses",
    valaisServices: [
        {
            title: "Showcase site",
            description:
                "Up to five pages presenting your business and your services, with a contact form, mobile layout, and a technical base built for search engines and AI answer engines alike. About two weeks.",
        },
        {
            title: "Business website",
            description:
                "Blog, online shop, booking system, advanced forms and third-party integrations. About a month.",
        },
        {
            title: "Custom web application",
            description:
                "A tool built around your processes, rather than generic software you have to bend them to: business interface, user accounts, database, integrations. From a month, depending on scope.",
        },
        {
            title: "Redesign of an existing site",
            description:
                "A new interface, migrated content, loading times and a mobile layout — without starting over when the foundations are sound.",
        },
    ],

    valaisFaq: [
        {
            faqQuestion: "Does MediaSmart only work in Valais?",
            faqAnswer:
                "No. The office is in Valais, in Dorénaz, and on-site meetings are concentrated in the canton. We also meet clients in the cantons of Vaud, Geneva and Fribourg, and since development and follow-up are done remotely, we work with clients throughout Switzerland and abroad.",
        },
        {
            faqQuestion: "What kinds of Valais businesses do you work with?",
            faqAnswer:
                "SMEs, freelancers and associations without an in-house technical team. The sites we have built include a building-painting company, a cleaning company, an architecture firm, a secular ceremony officiant and several associations.",
        },
    ],
};
export default agency;
