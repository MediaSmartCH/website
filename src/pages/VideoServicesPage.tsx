import React from "react";
import AOS from "aos";

import useScrollToHash from "services/hooks/useScrolltoHash";
import Navbar from "components/common/Navbar";
import Hero from "components/presentation/videoServices/Hero";
import About from "components/presentation/videoServices/About";
import Services from "components/presentation/videoServices/Services";
import Partner from "components/presentation/videoServices/Partner";
import Testimonials from "components/common/testimonials";
import Faq from "components/presentation/videoServices/Faq";
import Booking from "components/common/Booking";
import Contact from "components/common/Contact";
import Footer from "components/common/Footer";

export default function VideoServicesPage() {
  useScrollToHash();

  React.useEffect(() => {
    AOS.init({
      // duration: 2500,
      once: true,
      offset: 50,
    });
  }, []);
  return (
    <div>
      <Navbar />
      <Hero />
      <Partner />
      <About />
      <Services />
      <div className="pt-[40px] md:pt-[50px]">
        <Testimonials />
      </div>
      <Faq />
      <div className="pt-[40px] md:pt-[50px] w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto">
        <div className="px-[20px] md:px-[50px] lg:px-0 booking-bg rounded-[20px] 2xl:rounded-[20px] pt-[27px] pb-[32px] lg:pt-[42px] lg:pb-[28px]">
          <Booking />
        </div>
      </div>
      <Contact />
      <Footer />
    </div>
  );
};

