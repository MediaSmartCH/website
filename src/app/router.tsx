import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useParams,
  type RouteObject,
} from "react-router-dom";

import Layout from "@app/layout/site-layout";
import ConstructionWrapper from "@app/construction-wrapper";
import LangLayout from "@app/layout/lang-layout";
import ErrorBoundary from "@app/layout/error-boundary";

import PreLoader from "@shared/components/preloader";
import { withChunkRecovery } from "@shared/lib/chunk-recovery";
import {
  buildLocalizedPath,
  DEFAULT_LANGUAGE,
  normalizeLanguage,
} from "@shared/config/languages";

const Homepage = lazy(withChunkRecovery(() => import("@features/home/home-page")));
/* ============================================================================
 * VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
 * Le volet "services vidéo" est mis en pause : le site ne communique plus que
 * sur l'informatique. Tout le code ci-dessous reste volontairement en place
 * pour pouvoir réactiver l'offre vidéo en décommentant simplement ce bloc.
 * ============================================================================ */
// const VideoServicesPage = lazy(withChunkRecovery(() => import("@features/video-services/video-services-page")));
const PrivacyPolicyPage = lazy(withChunkRecovery(() => import("@features/privacy-policy/privacy-policy-page")));
const LegalNoticePage = lazy(withChunkRecovery(() => import("@features/legal/legal-notice-page")));
const TermsPage = lazy(withChunkRecovery(() => import("@features/legal/terms-page")));
const Error404Page = lazy(withChunkRecovery(() => import("@features/error/error-404-page")));
/* ============================================================================
 * CONTRAT DE SUPPORT DÉSACTIVÉ — NE PAS SUPPRIMER
 * L'offre de contrat de support est en cours de refonte. La page, ses textes
 * (it.supportPage*, it.support*) et son composant restent en place ; seule la
 * route est neutralisée, comme pour la vidéo.
 * POUR RÉACTIVER : décommenter la ligne ci-dessous et la route plus bas, puis
 * suivre la marche à suivre décrite dans "_supportContractDisabled"
 * (src/shared/seo/route-seo-data.json).
 * ========================================================================= */
// const SupportContractPage = lazy(withChunkRecovery(() => import("@features/support-contract/support-contract-page")));
const BookingManagePage = lazy(withChunkRecovery(() => import("@features/booking/booking-manage-page")));
const SuisseRomandePage = lazy(withChunkRecovery(() => import("@features/agency/suisse-romande-page")));
const ValaisPage = lazy(withChunkRecovery(() => import("@features/agency/valais-page")));
const WorkIndexPage = lazy(withChunkRecovery(() => import("@features/work/work-index-page")));
const WorkDetailPage = lazy(withChunkRecovery(() => import("@features/work/work-detail-page")));

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

/* ============================================================================
 * ROUTES DÉSACTIVÉES — NE PAS SUPPRIMER
 * Renvoie une route mise en pause (/:lang/video-services, puis
 * /:lang/support-contract) vers l'accueil de la même langue.
 * Vercel sert déjà une 301 (voir "redirects" dans vercel.json), mais elle ne
 * s'applique ni en dev, ni en preview, ni lors d'une navigation interne : sans
 * cette redirection côté routeur, l'URL tomberait sur la 404 en local.
 * Le chemin est construit en absolu à partir du segment de langue, une cible
 * relative ("..") se résolvant mal sous une route splat.
 * ============================================================================ */
const RedirectToHome: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  return <Navigate to={buildLocalizedPath(normalizeLanguage(lang), "/")} replace />;
};

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
          /* ANCIENNE URL — NE PAS SUPPRIMER SANS VÉRIFIER LES LIENS ENTRANTS
             /it-services pointait vers /web-development, qui a été fusionnée
             dans l'accueil. La redirection va donc directement à l'accueil
             plutôt que d'enchaîner deux sauts, exactement comme video-services.
             Vercel répond une 301 en production (voir "redirects" dans
             vercel.json) ; cette route couvre le dev, la preview et la
             navigation interne. */
          { path: "it-services", element: <RedirectToHome /> },
          /* Pages régionales. Les slugs sont en français dans les deux langues,
             comme toutes les autres routes du site : `routeKeyByPath` associe un
             chemin unique aux deux locales, et les hreflang relient les deux
             adresses. */
          { path: "web-agency-switzerland", element: Wrap(<SuisseRomandePage />) },
          { path: "web-agency-valais", element: Wrap(<ValaisPage />) },
          /* Réalisations : l'index, puis une page par projet client. Un slug
             inconnu rend la 404 depuis la page elle-même, pour ne pas répondre
             200 sur une adresse qui n'existe pas. */
          { path: "projects", element: Wrap(<WorkIndexPage />) },
          { path: "projects/:slug", element: Wrap(<WorkDetailPage />) },
          /* VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
             La page vidéo n'est plus rendue : l'URL renvoie vers l'accueil.
             Vercel répond déjà une 301 (voir "redirects" dans vercel.json), mais
             ces redirects ne s'appliquent ni en dev ni en preview ni lors d'une
             navigation interne — d'où cette redirection côté routeur, qui évite
             de tomber sur la 404 partout ailleurs qu'en production.
             Pour réactiver la vidéo : supprimer la ligne Navigate ci-dessous et
             décommenter la route d'origine. */
          { path: "video-services", element: <RedirectToHome /> },
          // { path: "video-services", element: Wrap(<VideoServicesPage />) },
          { path: "privacy-policy", element: Wrap(<PrivacyPolicyPage />) },
          { path: "legal-notice", element: Wrap(<LegalNoticePage />) },
          { path: "terms", element: Wrap(<TermsPage />) },
          /* CONTRAT DE SUPPORT DÉSACTIVÉ — NE PAS SUPPRIMER
             Même mécanique que la vidéo : Vercel répond une 301 en production
             (voir "redirects" dans vercel.json), et cette redirection côté
             routeur couvre le dev, la preview et la navigation interne.
             Pour réactiver : supprimer la ligne Navigate et décommenter la
             route d'origine juste en dessous. */
          { path: "support-contract", element: <RedirectToHome /> },
          // { path: "support-contract", element: Wrap(<SupportContractPage />) },
          { path: "booking/manage", element: Wrap(<BookingManagePage />) },
        ],
      },

      /* The 404 sits outside LayoutWrapper on purpose: it is a dead end, not a
         page of the site. Rendering it inside the shell put the fixed header
         on top of it and left the footer to be found by scrolling, which
         invited the visitor to keep exploring a page that leads nowhere. It
         stays under LangLayout so the locale and the SEO tags still apply. */
      { path: "404", element: Wrap(<Error404Page />) },
      // Any unmatched sub-path falls through to the 404 page.
      { path: "*", element: <Navigate to="../404" replace /> },
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
