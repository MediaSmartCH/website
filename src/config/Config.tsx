import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  type RouteObject,
} from "react-router-dom";
import PreLoader from "components/preLoader/PreLoader";
import Layout from "components/Layout";
import ConstructionWrapper from "components/ConstructionWrapper";
import LangLayout from "config/LangLayout";
import ErrorBoundary from "components/dev/ErrorBoundary";
import { DEFAULT_LANGUAGE } from "config/languages";

const Homepage = lazy(() => import("../pages/Home"));
const VideoServicesPage = lazy(() => import("../pages/VideoServices"));
const ITServicesPage = lazy(() => import("../pages/ITServices"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicy"));
const Error404Page = lazy(() => import("../pages/Error404"));
const SupportContractPage = lazy(() => import("../pages/SupportContract"));

// Wraps a page node in an ErrorBoundary and a Suspense with a full-page loader fallback.
const Wrap = (node: React.ReactNode) => (
  <ErrorBoundary>
    <Suspense fallback={<PreLoader />}>{node}</Suspense>
  </ErrorBoundary>
);

// Renders the shared Navbar/Footer shell and delegates page content to the nested Outlet.
const LayoutWrapper: React.FC = () => (
  <Layout>
    <ErrorBoundary>
      <Suspense fallback={<PreLoader />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  </Layout>
);

const routes: RouteObject[] = [
  // Bare "/" immediately redirects to the default locale prefix.
  { path: "/", element: <Navigate to={`/${DEFAULT_LANGUAGE}`} replace /> },

  {
    path: "/:lang/*",
    element: <LangLayout />,
    children: [
      {
        element: <LayoutWrapper />,
        children: [
          { index: true, element: Wrap(<Homepage />) },
          { path: "it-services", element: Wrap(<ITServicesPage />) },
          { path: "video-services", element: Wrap(<VideoServicesPage />) },
          { path: "privacy-policy", element: Wrap(<PrivacyPolicyPage />) },
          { path: "support-contract", element: Wrap(<SupportContractPage />) },
          { path: "404", element: Wrap(<Error404Page />) },
          // Any unmatched sub-path falls through to the 404 page.
          { path: "*", element: <Navigate to="../404" replace /> },
        ],
      },
    ],
  },

  // Catch-all for URLs with no valid language prefix.
  { path: "*", element: <Navigate to={`/${DEFAULT_LANGUAGE}/404`} replace /> },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

const Config: React.FC = () => (
  <ConstructionWrapper>
    <RouterProvider router={router} />
  </ConstructionWrapper>
);

export default Config;
