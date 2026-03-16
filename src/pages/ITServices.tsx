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
import WaveBackdrop from "components/common/WaveBackdrop";
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
      <div className="relative overflow-hidden pt-[40px] md:pt-[50px]">
        <WaveBackdrop
          theme={themeReducer}
          className="top-[52px] h-[460px] md:top-[18px] md:h-[500px] lg:top-[8px] lg:h-[540px] xl:top-[-8px] xl:h-[580px]"
        />
        <div className="relative z-10 w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto">
          <div className="pt-[130px] md:pt-[170px] lg:pt-[220px] xl:pt-[250px] 2xl:pt-[250px] pb-[40px]">
            <Booking />
          </div>
        </div>
      </div>
      {/* <div className="pt-[40px] md:pt-[50px] w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto">
        <div className="px-[20px] md:px-[50px] lg:px-0 booking-bg rounded-[20px] 2xl:rounded-[20px] pt-[27px] pb-[32px] lg:pt-[42px] lg:pb-[28px]">
          <Booking />
        </div>
      </div> */}
      <Contact />
      {/* <Footer /> */}
    </>
    // {/* </div> */}
  );
};
