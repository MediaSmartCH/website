import React from "react";
import AOS from "aos";

import { useAppSelector } from "services/hooks/hooks";

import Hero from "components/presentation/home/Hero";
import ITOverview from "components/presentation/home/it-overview";
import About from "components/presentation/home/About";
import VideoOverview from "components/presentation/home/video-overview";
import Contact from "components/common/Contact";

import useScrollToHash from "services/hooks/useScrolltoHash";

const Homepage = () => {
  useScrollToHash();

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    AOS.refresh();
    setHasAnimated(true);
  }, []);

  // Freeze AOS animations on theme change to prevent re-triggering entrance effects
  React.useEffect(() => {
    if (hasAnimated) {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach(el => {
        el.classList.add('aos-animate');
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
    }
  }, [themeReducer, hasAnimated]);

  return (
    <>
      <Hero />
      <About />
      <ITOverview />
      <VideoOverview />
      <Contact />
    </>
  );
};

export default Homepage;
