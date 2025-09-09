import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreLoader from "components/preLoader/PreLoader";

const Homepage = lazy(() => import("../pages/Homepage"));
const VideoServicesPage = lazy(() => import("../pages/VideoServicesPage"));
const ITServicesPage = lazy(() => import("../pages/ITServicesPage"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage"));

const Config = () => {
  return (
    <Router>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/it-services" element={<ITServicesPage />} />
          <Route path="/video-services" element={<VideoServicesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default Config;
