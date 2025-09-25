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

const Homepage = lazy(() => import("../pages/Home"));
const VideoServicesPage = lazy(() => import("../pages/VideoServices"));
const ITServicesPage = lazy(() => import("../pages/ITServices"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicy"));
const Error404Page = lazy(() => import("../pages/Error404"));

/** Petit wrapper réutilisable : Suspense + ErrorBoundary */
const Wrap = (node: React.ReactNode) => (
  <ErrorBoundary>
    <Suspense fallback={<PreLoader />}>{node}</Suspense>
  </ErrorBoundary>
);

/** Layout qui encadre les pages (Navbar/Footer) + Outlet */
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
  { path: "/", element: <Navigate to="/fr" replace /> },

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
          { path: "404", element: Wrap(<Error404Page />) },
          { path: "*", element: <Navigate to="../404" replace /> },
        ],
      },
    ],
  },

  // 404 global pour les URLs sans langue valide
  { path: "*", element: <Navigate to="/fr/404" replace /> },
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
