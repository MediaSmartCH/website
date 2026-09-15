import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  type RouteObject,
} from "react-router-dom";
import PreLoader from "@shared/components/preloader";
import Layout from "@app/layout/site-layout";
import ConstructionWrapper from "@app/construction-wrapper";
import LangLayout from "@app/layout/lang-layout";
import ErrorBoundary from "@app/layout/error-boundary";
import { DEFAULT_LANGUAGE } from "@shared/config/languages";

const Homepage = lazy(() => import("@features/home/home-page"));
const VideoServicesPage = lazy(() => import("@features/video-services/video-services-page"));
const ITServicesPage = lazy(() => import("@features/it-services/it-services-page"));
const PrivacyPolicyPage = lazy(() => import("@features/privacy-policy/privacy-policy-page"));
const Error404Page = lazy(() => import("@features/error/error-404-page"));
const SupportContractPage = lazy(() => import("@features/support-contract/support-contract-page"));
const BookingManagePage = lazy(() => import("@features/booking/booking-manage-page"));

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
          { path: "booking/manage", element: Wrap(<BookingManagePage />) },
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
