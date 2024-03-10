import React from "react";
import AOS from "aos";
import Faq from "components/presentation/Faq";
import Footer from "components/presentation/Footer";
import About from "components/presentation/About";
import Hero from "components/presentation/Hero";
import Tickers from "components/presentation/Testimonials";
import Navbar from "components/presentation/Navbar";
import Partner from "components/presentation/Partner";
import Services from "components/presentation/Services";
import Booking from "components/presentation/Booking";
import Testimonials from "components/presentation/Testimonials";
import Contact from "components/presentation/Contact";
// import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/react"

const Homepage = () => {
  React.useEffect(() => {
    AOS.init({
      duration: 2500,
      once: true,
      offset: 50,
    });
  }, []);
  return (
    <div>
      {/* <Analytics /> */}
      {/* <SpeedInsights /> */}
      {/* <div className="hero-bg"> */}
      <Navbar />
      <Hero />
      {/* <Partner /> */}
      <About />
      <Services />
      <Testimonials />
      <Faq />
      <Booking />
      <Contact />
      <Footer />
    </div>
  );
};

export default Homepage;
