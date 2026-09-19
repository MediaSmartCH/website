// ============================================================================
// VIDEO DISABLED — DO NOT DELETE
// The site now only talks about IT. Every former video-related string is kept
// commented out right above its replacement so the video offering can be
// restored without rewriting anything.
// ============================================================================
const home = {
    heroTitle: "MediaSmart",
    heroSubtitle: "websites and web applications, built in Switzerland",
    // VIDEO DISABLED — DO NOT DELETE (former mixed video/IT description):
    // heroDescription:
    //     "From professional video production to tailored IT support, MediaSmart combines creativity and technical expertise to bring your ideas to life.",
    heroDescription:
        "Website creation, web application development and bespoke digital tools: we design, build and maintain the tool your organisation needs.",
    itBtn: "Discover our web services",
    // VIDEO DISABLED — DO NOT DELETE: key kept, the button is no longer rendered.
    videoBtn: "Explore Video Services",

    // Former title, from when MediaSmart also did general IT support:
    // "Want to take stock of your IT setup?"
    bookingTitle: "A website or an application in mind?",
    // VIDEO DISABLED — DO NOT DELETE (former "visual narratives" wording):
    // bookingDescription:
    //     "Embark on your creative journey with MediaSmart through a complimentary, 30-minute consultation. Choose a convenient location for you – be it your home, a public space, or even a virtual meeting – and select a time that aligns with our schedule. Simply provide your preferred meeting details and contact information, and we'll set up the appointment. This session is your opportunity to discuss your ideas with us and discover how we can collaborate to turn your vision into compelling visual narratives.",
    bookingDescription:
        "Book a free 30-minute consultation to tell us about your website, application or digital tool. We go over your goals, the features you need, and the best way to build it.",
    bookingBtn: "Book a 30-min consultation",

    partnersTitle: "Our trusted partners",

    aboutTitle: "About ",
    aboutSubtitle: "MediaSmart",
    // VIDEO DISABLED — DO NOT DELETE (former video + IT positioning):
    // aboutDescription: `
    //   MediaSmart is where two worlds meet:
    //   <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
    //     <li><strong>Video production</strong>, to elevate your events, messages, and brand image.</li>
    //     <li><strong>IT solutions</strong>, to ensure your tools are reliable, secure, and high-performing.</li>
    //   </ul>
    //   Based in Western Switzerland, we provide businesses, associations, and individuals with modern, flexible, and results-driven services.
    // `,
    aboutDescription: `
      MediaSmart works with SMEs, freelancers and associations that have no in-house technical team.
      <br />
      A showcase site, an online shop or a tool built around your own processes: we start from how you actually operate, and we stay around after go-live.
    `,
    soloBadge: "Independent",
    soloTitle: "Behind MediaSmart",
    soloName: "Raphael Rouiller",
    soloJobTitle: "Founder & independent contractor",
    // VIDEO DISABLED — DO NOT DELETE (former video + IT wording):
    // soloRole: "A single point of contact for both video and IT needs.",
    soloRole: "A single point of contact, from design through to go-live.",
    soloLead:
        "You speak directly with the person who assesses, designs and builds your project, from the first conversation through to go-live.",
    soloDescription:
        "When an assignment calls for a specific skill, I draw on a network of trusted partners.",
    soloStatDirectLabel: "Format",
    soloStatDirectValue: "1 direct contact",
    soloStatExpertiseLabel: "Areas",
    // VIDEO DISABLED — DO NOT DELETE (former dual expertise):
    // soloStatExpertiseValue: "Video + IT",
    soloStatExpertiseValue: "Websites + applications",
    soloStatLocationLabel: "Base",
    soloStatLocationValue: "French-speaking Switzerland",
    soloWorkingTitle: "What this means for you",
    soloHighlights: [
        "A direct contact, from the first conversation through to go-live.",
        "Precise answers about your own project, with no file passed from one department to another.",
        "External partners brought in only when the project genuinely calls for it."
    ],
    soloNote:
        "The goal is not to look bigger than I am, but to be more useful: reachable, clear and involved in every intervention.",

    // VIDEO DISABLED — DO NOT DELETE (former title, back when the page had two overviews):
    // ITOverviewTitle: "IT Overview",
    saasTitle: `<span>Our business</span> applications`,
    saasDescription:
        "Two applications we build and host ourselves: supplier-invoice tracking and document management.",
    saasCta: "Discover our applications",

    // ------------------------------------------------------------------
    // Active homepage section: the site leads with website and web
    // application development. The "ITOverview*" block below stays in
    // place but is no longer rendered (see the banner above it).
    // ------------------------------------------------------------------
    WebOverviewTitle: `<span>Websites</span> and custom web applications`,
    WebOverviewDescription:
        "Every project is scoped and quoted before it starts.",
    WebOverviewExploreBtn: "See our web services",
    WebOverviewCards: [
        {
            title: "Showcase website",
            description: "Up to five pages to present your activity, with a contact form, a mobile version and clean SEO foundations."
        },
        {
            title: "Business website",
            description: "Blog, online shop, booking system, advanced forms and third-party integrations."
        },
        {
            title: "Custom web application",
            description: "Interface and business logic built for you, user authentication, database design and APIs."
        },
        {
            title: "Redesign and migration",
            description: "Modernise an existing site without starting over: new interface, content migration, mobile version."
        },
        {
            title: "Maintenance and changes",
            description: "A 14-day corrective warranty after go-live, then fixes and changes handled on request."
        },
        {
            title: "Search, AI answers and performance",
            description: "Technical structure, structured data, clear content and loading times: to be found on Google and in the answers AI assistants give."
        }
    ],

    // ==================================================================
    // SECONDARY IT SERVICES DISABLED — DO NOT DELETE
    // The site now leads with website and web application development.
    // The "ITOverview*" block below (maintenance, optimisation,
    // cybersecurity, backup, support) is no longer rendered: the homepage
    // shows "WebOverview*" instead. The keys stay for FR/EN parity and for
    // an immediate rollback.
    // TO RESTORE: set translationPrefix back to "ITOverview" and reuse the
    // IT_OVERVIEW_ANIMATIONS list in src/features/home/components/it-overview.tsx.
    // ==================================================================
    ITOverviewTitle: "Our IT services",
    ITOverviewDescription:
        "Websites, workstations, security and support: the services we deliver day to day.",
    ITOverviewExploreBtn: "See the full list of services",
    ITOverviewCards: [
        {
            title: "Website creation and redesign",
            description: "We design and modernise websites that load fast, read well on every screen and stay easy for you to update."
        },
        {
            title: "Windows and macOS maintenance",
            description: "System and software updates, clean-up and regular checks keep your workstations stable and up to date."
        },
        {
            title: "Performance optimisation",
            description: "We identify what is slowing your machines down and fix the configuration to restore a responsive workstation."
        },
        {
            title: "Cybersecurity and audits",
            description: "Antivirus, firewalls, network hardening and a review of your weak points, plus the good practices to pass on to your team."
        },
        {
            title: "Data backup and restore",
            description: "Regular backups and a clear restore procedure so you can get back to work quickly after an incident."
        },
        {
            title: "User support and training",
            description: "Remote or on-site troubleshooting and training on your tools, explained without unnecessary jargon."
        }
    ],

    // VIDEO DISABLED — DO NOT DELETE
    // The "VideoOverview*" block below is no longer rendered (section removed
    // from the homepage). The keys stay for FR/EN parity and for an immediate
    // restore of the video offering.
    VideoOverviewTitle: "Video Overview",
    VideoOverviewDescription:
        "Professional video services, available individually or as a complete package.",
    VideoOverviewExploreBtn: "Explore More About Video Services",
    VideoOverviewCards: [
        {
            title: "Live video production & streaming",
            description: "Elevate your event with MediaSmart's live video direction. Our production ensures your broadcast is seamless"
        },
        {
            title: "Event broadcasting",
            description: "Relive the highlights. We capture and broadcast your special occasions with high-quality video feeds, perfect for concerts, conferences, and cultural events."
        },
        {
            title: "Professional video editing",
            description: "We craft your visual narrative with precision. Every transition seamless, every scene impactful — bringing your story to life with a cinematic touch."
        },
        {
            title: "Equipment rental",
            description: "Access professional-grade video gear without commitment: cameras, lighting, and sound. We ensure you have the right tools to capture your vision."
        },
        {
            title: "Event photography",
            description: "Every snapshot tells a story. We specialize in capturing the moments that matter most, from corporate events to intimate gatherings."
        },
    ],

    faqTitle: "Frequently Asked Questions",
    tile1: {
        faqQuestion: "What types of events can MediaSmart handle?",
        faqAnswer:
            "MediaSmart is versatile in managing a wide range of events, including corporate conferences, weddings, educational seminars, and live performances. We tailor our services to meet the unique requirements of each event.",
    },
    tile2: {
        faqQuestion: "Can I use MediaSmart for a small event?",
        faqAnswer:
            "Yes, we are happy to work with events of all sizes, from intimate to large. We customize our services to meet your specific needs, regardless of your event's scale.",
    },
    tile3: {
        faqQuestion: "How does equipment rental work with MediaSmart?",
        faqAnswer:
            "Our equipment rental process is designed for convenience and quality. Just let us know your needs during a free 30-minute consultation, and we will offer suitable equipment with a customized quote.",
    },
    tile4: {
        faqQuestion: "Does MediaSmart offer post-event video editing?",
        faqAnswer:
            "Yes, that's our specialty. Our post-event editing utilizes advanced methods to turn your raw footage into a sleek final product, perfectly capturing the essence of your event.",
    },
    tile5: {
        faqQuestion:
            "Does MediaSmart offer photo services for my event?",
        faqAnswer:
            "Certainly. Our photography services include event coverage, portrait sessions, and custom photo shoots to capture the memorable moments of your occasion.",
    },
    tile6: {
        faqQuestion: "How far in advance should I book MediaSmart's services?",
        faqAnswer:
            "We recommend booking as early as possible, especially for larger events or during peak periods. This ensures that we can allocate the appropriate resources and staff to meet your specific needs. However, we also strive to accommodate last-minute requests as much as possible.",
    },

    testimonialTitle: "Testimonials",
    testimonialTitleDescription:
        "Trusted by our clients",
    review: "Tell us your experience",
    noTestimonial: "No testimonials yet. Would you like to be the first to leave a review on Google?",

    contactTitle: "Get in touch with us",
    contactName: "Name *",
    contactEmail: "Email *",
    contactMobile: "Phone number",
    contactMsg: "Describe your needs *",
    contactCheckboxTxt: "I agree that MediaSmart may use my contact details to handle this request, in accordance with the",
    contactCheckboxPrivacyLink: "privacy policy",
    contactCheckboxSuffix: "*",
    contactBtn: "Send message",
    contactErrorText: "Please accept the terms before sending.",
    contactInvalidEmailError: "This email address does not look valid.",
    contactInvalidMobileError: "This phone number does not look valid.",
    contactRequiredEmailError: "An email address is required.",
    contactRequiredNameError: "Name is required.",
    contactRequiredMobileError: "A phone number is required.",
    contactRequiredMsgError: "This field is required.",
    contactSecurityError: "The security check did not go through. Reload the page and try again.",
    contactSendError: "Your message could not be sent right now. Check the details you entered and try again in a moment.",
    contactRequired: "* Required field",
    contactDone: "Done",
    contactLoading: "Sending…",
    contactSuccessTitle: "Message sent",
    contactSuccessBody: "Thank you for your message. We will get back to you as soon as possible.",
    contactSuccessNew: "Send another message",
    contactIntentQuestion: "Ask a question",
    contactIntentQuote: "Request a quote",
    contactProjectTypeLabel: "Project type *",
    contactProjectTypeRequired: "Please select a project type.",
    contactProjectVitrine: "Showcase website",
    contactProjectBusiness: "Business website",
    contactProjectRefonte: "Redesign / migration",
    contactProjectApp: "Custom web application",
    contactProjectOther: "Other / not sure yet"
};
export default home;
