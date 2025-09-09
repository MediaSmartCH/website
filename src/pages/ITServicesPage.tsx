import React from "react";
import AOS from "aos";

import Navbar from "components/common/Navbar";
import Hero from "components/presentation/itServices/Hero";
import About from "components/presentation/itServices/About";
import Services from "components/presentation/itServices/Services";
import Booking from "components/common/Booking";
import Contact from "components/common/Contact";
import Footer from "components/common/Footer";
import Process from "components/presentation/itServices/Process";

export default function ITServicesPage ()  {
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
      <About />
      <Services />
      <Process />
      <div className="pt-[40px] md:pt-[50px] w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto">
        <div className="px-[20px] md:px-[50px] lg:px-0 pt-[27px] pb-[32px] lg:pt-[42px] lg:pb-[28px]">
          <Booking />
        </div>
      </div>
      <Contact />
      <Footer />
    </div>
  );
};
