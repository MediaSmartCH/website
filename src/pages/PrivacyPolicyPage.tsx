import React from "react";
import AOS from "aos";

import Navbar from "components/common/Navbar";
import Footer from "components/common/Footer";
import PrivacyPolicy from "components/presentation/privacyPolicy/index";


const PrivacyPolicyPage = () => {

    
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
            <PrivacyPolicy />
            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
