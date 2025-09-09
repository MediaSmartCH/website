import React from "react";
import AOS from "aos";

import { useAppSelector } from "services/hooks/hooks";

// import Layout from "../components/Layout";
// import Navbar from "components/common/Navbar";
import Hero from "components/presentation/itServices/Hero";
import About from "components/presentation/itServices/About";
import Services from "components/presentation/itServices/Services";
import Booking from "components/common/Booking";
import Contact from "components/common/Contact";
// import Footer from "components/common/Footer";
import Process from "components/presentation/itServices/Process";

export default function ITServicesPage() {
  // useScrollToHash();

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
      AOS.refresh();
      // AOS.init({
      //   once: true,
      //   offset: 50,
      // });
      setHasAnimated(true);
    }, []);
  

  // Empêcher les re-animations lors du changement de thème
  React.useEffect(() => {
    if (hasAnimated) {
      // Désactiver temporairement AOS
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach(el => {
        el.classList.add('aos-animate');
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
    }
  }, [themeReducer, hasAnimated]);
  return (
    // <div>
      <>
        {/* <Navbar /> */}
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
        {/* <Footer /> */}
      </>
    // {/* </div> */}
  );
};
