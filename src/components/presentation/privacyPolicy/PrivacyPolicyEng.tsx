export default function PrivacyPolicyEng({ themeReducer, formattedDate }: any) {

    return (
        <div className="w-full relative mt-[73px] md:mt-[130px] lg:mt-[100px]">

            <div className="hero-bg px-[20px] h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] flex justify-center items-start">
                <div className="mt-[70px] 2xl:mt-[100px]">
                    <h1
                        className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                            } w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px]`}

                        data-aos="fade-up"
                        data-aos-duration="900"
                        data-aos-easing="ease-in-sine"
                    >
                        Privacy Policy
                        <span> - </span>
                        <span className="gradient-text">
                            MediaSmart
                        </span>

                    </h1>
                    <p
                        className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                            } w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] lg:w-[80%] 2xl:w-[65%]`}
                        data-aos="fade-up"
                        data-aos-duration="1200"
                        data-aos-easing="ease-in-sine"
                    >
                        Last updated: {formattedDate}
                    </p>
                </div>
            </div>

            <div
                className="font-poppins  font-light text-sm w-full flex justify-center  homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[10px] md:pt-[50px] lg:md:pt-[30px] pb-[70px]"
            >
                <div className="max-w-3xl max-auto">
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        At <span className="font-medium"> MediaSmart </span>, we place great importance on the protection of
                        your personal data. This policy explains what information we collect, why,
                        and how it is used and protected.
                    </p>

                    {/* Section 1 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-4 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                        }`}>1. Data Controller</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <span className="font-medium">MediaSmart – Raphael Rouiller</span>
                        <br />
                        Address: Valais – Vaud – Geneva – Fribourg
                        <br />
                        Email: <a href="mailto:hello@mediasmart.ch" className="text-blue-600 underline">
                            hello[at]mediasmart.ch
                        </a>
                        <br />
                        Phone:  <a href="tel:+41796578612" className="text-blue-600 underline">
                            +41 79 657 86 12
                        </a>
                    </p>

                    {/* Section 2 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-4 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                        }`}>2. Data Collected</h2>

                    <h3 className={`font-semibold mt-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        a) Contact Form
                    </h3>
                    <ul className={`list-disc list-inside mt-2 mb-4 ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <li>First and last name</li>
                        <li>Email address</li>
                        <li>Phone number (if provided)</li>
                        <li>Message content</li>
                    </ul>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <span className="font-medium">Use:</span> to respond to your request and ensure follow-up.
                        <br />
                        <span className="font-medium">Legal basis:</span> consent (mandatory checkbox).
                    </p>

                    <h3 className={`font-semibold mt-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        b) Calendly (appointment scheduling)
                    </h3>
                    <ul className={`list-disc list-inside mt-2 mb-4 ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <li>First and last name</li>
                        <li>Email address</li>
                        <li>Chosen timeslot</li>
                        <li>Additional information you provide in your notes</li>
                    </ul>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <span className="font-medium">Use:</span> appointment management.
                        <br />
                        <span className="font-medium">Legal basis:</span> service execution (necessary).
                        <br />
                        <span className="font-medium">Note:</span> data is processed by Calendly (USA).
                    </p>

                    <h3 className={`font-semibold mt-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        c) Google reCAPTCHA
                    </h3>
                    <p className={`mt-2 mb-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        We use Google reCAPTCHA to protect our forms from spam and abuse. This
                        service may collect certain technical data (IP address, browsing behavior).

                    </p>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>

                        <span className="font-medium">Use:</span> site security.
                        <br />
                        <span className="font-medium">Legal basis:</span> legitimate interest (necessary for functioning).
                    </p>

                    <h3 className={`font-semibold mt-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        d) Google Analytics (optional)
                    </h3>
                    <ul className={`list-disc list-inside mt-2 mb-4 ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <li>Pages visited</li>
                        <li>Visit duration</li>
                        <li>Country of origin</li>
                        <li>Device/browser type</li>
                    </ul>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <span className="font-medium">Use:</span> anonymized statistics to improve our services.
                        <br />
                        <span className="font-medium">Legal basis:</span> explicit consent via the cookie banner.
                        <br />
                        <span className="font-medium">Note:</span> we enable IP anonymization.
                    </p>

                    {/* Section 3 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                        }`}>3. Cookies</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        We use:
                        <br />
                        <span className="font-medium">Necessary cookies:</span> essential for the functioning of the site
                        (contact form, Calendly, reCAPTCHA).
                        <br />
                        <span className="font-medium">Optional cookies:</span> Google Analytics, only if you consent.
                        <br />
                        You can manage your preferences at any time via the cookie banner at the
                        bottom of the page.
                    </p>

                    {/* Section 4 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                        }`}>4. Data Retention</h2>
                    <ul className={`list-disc list-inside ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <li>Contact data: stored for a maximum of 12 months after the last exchange.</li>
                        <li>Appointment data (Calendly): according to Calendly’s policy.</li>
                        <li>Statistical data (Analytics): anonymized and retained for 14 months.</li>
                    </ul>

                    {/* Section 5 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                        }`}>5. Security</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        We implement technical and organizational measures to protect your data
                        against unauthorized access, loss, or disclosure.
                    </p>

                    {/* Section 6 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                        }`}>6. Data Sharing</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        We do not sell or rent your personal data. Some data may be transmitted to
                        our technical providers (e.g., Calendly, Google) solely to provide the
                        services.
                    </p>

                    {/* Section 7 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                        }`}>7. Your Rights</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        In accordance with the <span className="font-medium">GDPR</span> and the{" "}
                        <span className="font-medium">Swiss Data Protection Act (LPD)</span>, you have the following
                        rights:
                    </p>
                    <ul className={`list-disc list-inside mt-2 mb-4 ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        <li>Right of access to your data</li>
                        <li>Right to rectification</li>
                        <li>Right to erasure</li>
                        <li>Right to restriction of processing</li>
                        <li>Right to withdraw consent (e.g., for Google Analytics)</li>
                    </ul>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        To exercise these rights, contact us at:{" "}
                        <a href="mailto:hello@mediasmart.ch" className="text-blue-600 underline">
                            hello[at]mediasmart.ch
                        </a>
                    </p>

                    {/* Section 8 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                        }`}>8. Changes</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                        }`}>
                        We may update this policy in line with legal or technical developments.
                        The most recent version will always be available on this page.
                    </p>
                </div>
            </div>
        </div>
    );
}