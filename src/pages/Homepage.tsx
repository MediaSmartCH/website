import React from "react";
import AOS from "aos";

import Navbar from "components/common/Navbar";
import Hero from "components/presentation/home/Hero";
import ITOverview from "components/presentation/home/it-overview";
import About from "components/presentation/home/About";
import VideoOverview from "components/presentation/home/video-overview";
import Testimonials from "components/common/testimonials";
import Booking from "components/common/Booking";
import Contact from "components/common/Contact";
import Footer from "components/common/Footer";

import bg from "assets/images/faq-bg.png";
import useScrollToHash from "services/hooks/useScrolltoHash";

const Homepage = () => {
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
      <ITOverview />
      <About />
      <VideoOverview />
      <div id="testimonials" className="pt-[100px]">
        <Testimonials />
      </div>
      <div className="relative pt-[40px] md:pt-[50px] w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto">
        <img
          src={bg}
          className="absolute left-0 top-[70px] md:top-[30px] lg:top-[30px] xl:top-[0px] 2xl:top-[-50px]"
        />
        <div className="pt-[130px] md:pt-[170px] lg:pt-[220px] xl:pt-[250px] 2xl:pt-[250px] pb-[40px]">
          <Booking />
        </div>
      </div>
      <Contact />
      <Footer />
    </div>
  );
};

export default Homepage;
