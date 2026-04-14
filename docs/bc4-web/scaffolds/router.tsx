/**
 * Router — top-level routing pro celý repo (Kvalt docs + BC4 marketing).
 *
 * 📍 Cílová lokace: src/router.tsx
 *
 * 🔧 Před přesunem nainstalovat:
 *    npm install react-router-dom vite-ssg
 *
 * 🔧 Po instalaci vite-ssg upravit src/main.tsx:
 *    import { ViteSSG } from 'vite-ssg';
 *    import { routes } from './router';
 *
 *    export const createApp = ViteSSG(App, { routes });
 *
 *    Místo původního ReactDOM.createRoot(...).render(<App />)
 *
 * 🔧 vite.config.ts přidat:
 *    ssgOptions: {
 *      script: 'async',
 *      formatting: 'minify',
 *      crittersOptions: { reduceInlineStyles: false },
 *    }
 */

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

// ─── Lazy imports ────────────────────────────────────────────────────────────
// Marketing routes
const MarketingLayout = lazy(() => import('./marketing/layouts/MarketingLayout').then(m => ({ default: m.MarketingLayout })));
const HomePage = lazy(() => import('./pages/marketing/HomePage'));
const ProductContactCenterPage = lazy(() => import('./pages/marketing/ProductContactCenterPage'));
const ProductCallingPage = lazy(() => import('./pages/marketing/ProductCallingPage'));
const PricingPage = lazy(() => import('./pages/marketing/PricingPage'));
const ContactPage = lazy(() => import('./pages/marketing/ContactPage'));
const LeadFormPage = lazy(() => import('./pages/marketing/LeadFormPage'));
const LeadFormSubmittedPage = lazy(() => import('./pages/marketing/LeadFormSubmittedPage'));
const NotFoundPage = lazy(() => import('./pages/marketing/NotFoundPage'));

// Docs routes (existing Kvalt DS docs)
const DocsApp = lazy(() => import('./App'));

// ─── Route tree ──────────────────────────────────────────────────────────────

export const routes: RouteObject[] = [
  // ─── BC4 marketing site (root domain) ─────────────────────────────────────
  // CS bez prefixu (primary)
  {
    path: '/',
    element: <MarketingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'produkt/kontaktni-centrum', element: <ProductContactCenterPage /> },
      { path: 'produkt/volani', element: <ProductCallingPage /> },
      // path: 'produkt/ai-voicebot' — fáze 2
      { path: 'cenik', element: <PricingPage /> },
      { path: 'kontakt', element: <ContactPage /> },
      { path: 'poptavka', element: <LeadFormPage /> },
      { path: 'poptavka/odeslano', element: <LeadFormSubmittedPage /> },
    ],
  },

  // EN s prefixem (až bude content hotový)
  // {
  //   path: '/en',
  //   element: <MarketingLayout />,
  //   children: [
  //     { index: true, element: <HomePage /> },
  //     { path: 'product/contact-center', element: <ProductContactCenterPage /> },
  //     ...
  //   ],
  // },

  // ─── Kvalt DS docs site (zachováno) ──────────────────────────────────────
  // Pod path '/ds' nebo na separátní doméně. Pro MVP necháme v subcestě.
  {
    path: '/ds/*',
    element: <DocsApp />,
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

/**
 * Helper pro vite-ssg — vyjmenuje všechny statické routy pro prerender.
 * Dynamic routes (např. /reference/[slug]) musí být listed manuálně nebo
 * generated z content files.
 */
export function getStaticPaths(): string[] {
  return [
    '/',
    '/produkt/kontaktni-centrum',
    '/produkt/volani',
    '/cenik',
    '/kontakt',
    '/poptavka',
    '/poptavka/odeslano',
    // Docs routes nejsou prerendered — jsou client-side jen
  ];
}
