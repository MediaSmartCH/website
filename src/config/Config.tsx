import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import PreLoader from "components/preLoader/PreLoader";
import Layout from "components/Layout";
import ConstructionWrapper from "components/ConstructionWrapper";
import LangLayout from "config/LangLayout";
import ErrorBoundary from "components/dev/ErrorBoundary";

const Homepage = lazy(() => import("../pages/Home"));
const VideoServicesPage = lazy(() => import("../pages/VideoServices"));
const ITServicesPage = lazy(() => import("../pages/ITServices"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicy"));
const Error404Page = lazy(() => import("../pages/Error404"));

const LayoutWrapper = () => (
  <Layout>
    <ErrorBoundary>
      <Suspense fallback={<PreLoader />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  </Layout>
);

const Error404Wrapper = () => (
  <ErrorBoundary>
    <Suspense fallback={<PreLoader />}>
      <Error404Page />
    </Suspense>
  </ErrorBoundary>
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
              {/* Page 404 avec layout - s'adapte automatiquement à la langue */}
              <Route path="404" element={<Error404Wrapper />} />
              {/* Redirection vers /lang/404 pour les routes inexistantes */}
              <Route path="*" element={<Navigate to="../404" replace />} />
            </Route>
          </Route>

          {/* 404 global pour les URLs sans langue valide - géré par LangLayout */}
          <Route path="*" element={<Navigate to="/fr/404" replace />} />
        </Routes>
      </Router>
    </ConstructionWrapper>
  );
};

export default Config;