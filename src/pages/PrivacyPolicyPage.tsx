import React from "react";
import AOS from "aos";

import { useAppSelector } from "services/hooks/hooks";

// import Navbar from "components/common/Navbar";
// import Footer from "components/common/Footer";
// import Layout from "../components/Layout";
import PrivacyPolicy from "components/presentation/privacyPolicy/index";


const PrivacyPolicyPage = () => {

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
      <PrivacyPolicy />
      {/* <Footer /> */}
    </>
    // </div>
  );
};

export default PrivacyPolicyPage;
