import React from "react";

export default function PrivacyPolicyEng({
  themeReducer,
  formattedDate,
}: {
  themeReducer: "light" | "dark" | string;
  formattedDate: string;
}) {
  const tText = (light: string, dark: string) =>
    themeReducer === "light" ? light : dark;

  return (
    <div className="w-full pt-[73px] md:pt-[130px] lg:pt-[100px]">
      <div className="relative z-10 px-[20px] pt-[28px] md:pt-[40px] lg:pt-[52px] xl:pt-[60px] 2xl:pt-[72px] flex justify-center items-start">
        <div>
          <h1
            className={`${tText("text-[#14172D]", "text-[#F6F6F6]")} w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px]`}
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-easing="ease-in-sine"
          >
            Privacy Policy <span>-</span>{" "}
            <span className="gradient-text">MediaSmart</span>
          </h1>
          <p
            className={`${tText("text-[#413C58]", "text-[#E5E5E5]")} w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] lg:w-[80%] 2xl:w-[65%]`}
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-easing="ease-in-sine"
          >
            Last updated: {formattedDate}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 font-poppins font-light text-sm w-full flex justify-center homepage-container px-[25px] md:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[18px] md:pt-[30px] lg:pt-[24px] pb-[70px]">
        <div className="max-w-3xl mx-auto">
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            At <span className="font-medium">MediaSmart</span>, we highly value the
            protection of your personal data. This policy explains which
            information we collect, why we collect it, and how it is used and
            protected.
          </p>

          {/* 1. Controller */}
          <h2
            className={`text-xl font-semibold mt-8 mb-4 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            1. Data Controller
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">MediaSmart – Raphael Rouiller</span>
            <br />
            Legal form: Sole proprietorship (not registered in the Commercial
            Register)
            <br />
            Address: Rue des Prumus 21, 1994 Aproz (Nendaz), Switzerland
            <br />
            Email:{" "}
            <a
              href="mailto:hello@mediasmart.ch"
              className="text-blue-600 underline"
            >
              hello[at]mediasmart.ch
            </a>
            <br />
            Phone:{" "}
            <a href="tel:+41796578612" className="text-blue-600 underline">
              +41 79 657 86 12
            </a>
          </p>

          {/* 2. Data collected */}
          <h2
            className={`text-xl font-semibold mt-8 mb-4 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            2. Data Collected
          </h2>

          <h3
            className={`font-semibold mt-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            a) Contact Form
          </h3>
          <ul
            className={`list-disc list-inside mt-2 mb-4 ml-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number (if provided)</li>
            <li>Message content</li>
          </ul>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">Purpose:</span> to answer your request
            and provide follow-up.
            <br />
            <span className="font-medium">Legal basis:</span> consent (mandatory
            checkbox).
          </p>

          <h3
            className={`font-semibold mt-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            b) Appointment booking (Calendly)
          </h3>
          <ul
            className={`list-disc list-inside mt-2 mb-4 ml-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            <li>Full name</li>
            <li>Email address</li>
            <li>Chosen time slot</li>
            <li>Any additional notes</li>
          </ul>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">Purpose:</span> appointment management.
            <br />
            <span className="font-medium">Legal basis:</span> service execution
            (pre-contractual/contractual).
            <br />
            <span className="font-medium">Calendly Privacy Policy:</span>{" "}
            <a
              href="https://calendly.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://calendly.com/privacy
            </a>
          </p>

          <h3
            className={`font-semibold mt-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            c) Google reCAPTCHA
          </h3>
          <p
            className={`mt-2 mb-4 ${tText("text-[#413C58]", "text-[#E5E5E5]")}`}
          >
            We use Google reCAPTCHA to protect our forms from spam and abuse.
            This service may collect certain technical data (IP address,
            technical fingerprints, browsing behavior).
            <br />
            <span className="font-medium">Google Privacy Policy:</span>{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://policies.google.com/privacy
            </a>{" "}
            –{" "}
            <span className="font-medium">reCAPTCHA Terms:</span>{" "}
            <a
              href="https://www.google.com/recaptcha/about/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://www.google.com/recaptcha/about/
            </a>
          </p>

          <h3
            className={`font-semibold mt-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            d) Google Analytics (optional)
          </h3>
          <ul
            className={`list-disc list-inside mt-2 mb-4 ml-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            <li>Pages visited</li>
            <li>Duration of visit</li>
            <li>Country of origin</li>
            <li>Device / browser type</li>
          </ul>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">Purpose:</span> anonymized statistics
            to improve our services.
            <br />
            <span className="font-medium">Legal basis:</span> explicit consent via
            the cookie banner.
            <br />
            <span className="font-medium">Google Analytics Policy:</span>{" "}
            <a
              href="https://support.google.com/analytics/answer/6004245?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://support.google.com/analytics/answer/6004245
            </a>
          </p>

          {/* 3. Cookies */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            3. Cookies
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            We use:
            <br />
            <span className="font-medium">Necessary cookies:</span> essential
            for the site’s operation (forms, Calendly, reCAPTCHA).
            <br />
            <span className="font-medium">Optional cookies:</span> Google Analytics,
            only if you give consent.
          </p>
          <p
            className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}
          >
            You can change your preferences at any time by clicking the{" "}
            <span className="font-medium">cookie icon at the bottom-right corner</span> ("Manage my cookies”).
          </p>

          {/* 4. Hosting */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            4. Hosting & International Transfers
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Our site is hosted by <span className="font-medium">Vercel</span>.
            Your data may be processed and transferred outside Switzerland or the
            EEA (notably to the US) for hosting or content delivery purposes.
            These transfers are governed by{" "}
            <a
              href="https://vercel.com/legal/dpa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium"
            >
              Vercel’s Data Processing Addendum (DPA)
            </a>{" "}
            with safeguards equivalent to the EU Standard Contractual Clauses.
          </p>
          <p className={`${tText("text-[#413C58]", "text-[#E5E5E5]")} mt-3`}>
            For more details, please read{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium"
            >
              Vercel’s Privacy Policy
            </a>
            .
          </p>

          {/* 5. Retention */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            5. Data Retention
          </h2>
          <ul
            className={`list-disc list-inside ml-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            <li>Contact requests: up to 12 months after last interaction.</li>
            <li>Calendly appointments: according to Calendly’s policy.</li>
            <li>Technical logs (security/access): 90 days.</li>
            <li>Analytics data: anonymized and stored for 14 months.</li>
          </ul>

          {/* 6. Security */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            6. Security
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            We implement appropriate technical and organizational measures to
            protect your data from unauthorized access, disclosure, or loss. The
            principle of least privilege is applied: only team members or
            providers who need to access data may do so.
          </p>

          {/* 7. Sharing */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            7. Data Sharing
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            We do not sell or rent your personal data. Some data may be
            transmitted to our technical providers (Vercel, Google, Calendly)
            strictly to provide the services, under binding confidentiality and
            security obligations.
          </p>

          {/* 8. Rights */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            8. Your Rights
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Under the{" "}
            <a
              href="https://www.fedlex.admin.ch/eli/cc/2022/491/en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Swiss Federal Act on Data Protection (FADP)
            </a>{" "}
            and the{" "}
            <a
              href="https://eur-lex.europa.eu/eli/reg/2016/679/oj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              GDPR
            </a>
            , you have the right to access, rectify, delete, restrict or object
            to processing, data portability, and withdraw your consent (e.g. for
            Google Analytics).
          </p>
          <p
            className={`${tText("text-[#413C58]", "text-[#E5E5E5]")} mt-2`}
          >
            To exercise your rights, contact us at:{" "}
            <a
              href="mailto:privacy@mediasmart.ch"
              className="text-blue-600 underline"
            >
              privacy[at]mediasmart.ch
            </a>
            . If you believe your rights are not respected, you may lodge a
            complaint with the{" "}
            <a
              href="https://www.edoeb.admin.ch/edoeb/en/home.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Swiss Federal Data Protection and Information Commissioner
            </a>
            .
          </p>

          {/* 9. Minors */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            9. Minors & Automated Decisions
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            This website is not directed to persons under 16. We do not carry out
            automated decisions or profiling producing legal effects.
          </p>

          {/* 10. Updates */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            10. Updates
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            This policy may change due to legal or technical developments. The
            latest version is always available on this page.
          </p>
        </div>
      </div>
    </div>
  );
}
