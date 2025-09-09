import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import PreLoader from "components/preLoader/PreLoader";
import Layout from "components/Layout";

const Homepage = lazy(() => import("../pages/Homepage"));
const VideoServicesPage = lazy(() => import("../pages/VideoServicesPage"));
const ITServicesPage = lazy(() => import("../pages/ITServicesPage"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage"));

const LayoutWrapper = () => (
  <Layout>
    <Suspense fallback={<PreLoader />}>
      <Outlet />
    </Suspense>
  </Layout>
);

const Config = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutWrapper />}>
          <Route index element={<Homepage />} />
          <Route path="it-services" element={<ITServicesPage />} />
          <Route path="video-services" element={<VideoServicesPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>
      </Routes>
    </Router>
    // <Router>
    //   <Suspense fallback={<PreLoader />}>
    //     <Routes>
    //       <Route path="/" element={<Homepage />} />
    //       <Route path="/it-services" element={<ITServicesPage />} />
    //       <Route path="/video-services" element={<VideoServicesPage />} />
    //       <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    //     </Routes>
    //   </Suspense>
    // </Router>
  );
};

export default Config;
