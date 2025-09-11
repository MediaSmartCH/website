import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import PreLoader from "components/preLoader/PreLoader";
import Layout from "components/Layout";
import ConstructionWrapper from "components/ConstructionWrapper";
import LangLayout from "config/LangLayout";
import ErrorBoundary from "components/dev/ErrorBoundary";

const Homepage = lazy(() => import("../pages/Homepage"));
const VideoServicesPage = lazy(() => import("../pages/VideoServicesPage"));
const ITServicesPage = lazy(() => import("../pages/ITServicesPage"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage"));

const LayoutWrapper = () => (
  <Layout>
    <ErrorBoundary>
      <Suspense fallback={<PreLoader />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  </Layout>
);

const Config = () => {
  return (
    <ConstructionWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/fr" replace />} />

          <Route path="/:lang/*" element={<LangLayout />}>
            <Route element={<LayoutWrapper />}>
              <Route index element={<Homepage />} />
              <Route path="it-services" element={<ITServicesPage />} />
              <Route path="video-services" element={<VideoServicesPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/fr" replace />} />
        </Routes>
      </Router>
    </ConstructionWrapper>
  );
};

export default Config;
