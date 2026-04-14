import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ─── Self-hosted Manrope (BC4 character font) ─────────────────────────────
// Bundled přes @fontsource — LCP lepší než Google Fonts CDN, ~150ms úspora.
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';

import './index.css';
import App from './App.tsx';
import { LocaleProvider } from './contexts/LocaleProvider';

// ─── Marketing (BC4Cloud) ─────────────────────────────────────────────────
import { MarketingLayout } from './marketing/layouts/MarketingLayout';
import HomePage from './pages/marketing/HomePage';
import ProductContactCenterPage from './pages/marketing/ProductContactCenterPage';
import ProductCallingPage from './pages/marketing/ProductCallingPage';
import PricingPage from './pages/marketing/PricingPage';
import ContactPage from './pages/marketing/ContactPage';
import LeadFormPage from './pages/marketing/LeadFormPage';
import LeadFormSubmittedPage from './pages/marketing/LeadFormSubmittedPage';
import NotFoundPage from './pages/marketing/NotFoundPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider defaultLocale="cs">
      <BrowserRouter>
        <Routes>
          {/* ── BC4Cloud marketing site ───────────────────────────────── */}
          <Route element={<MarketingLayout />}>
            <Route index element={<HomePage />} />
            <Route path="produkt/kontaktni-centrum" element={<ProductContactCenterPage />} />
            <Route path="produkt/volani" element={<ProductCallingPage />} />
            <Route path="cenik" element={<PricingPage />} />
            <Route path="kontakt" element={<ContactPage />} />
            <Route path="poptavka" element={<LeadFormPage />} />
            <Route path="poptavka/odeslano" element={<LeadFormSubmittedPage />} />
          </Route>

          {/* ── Kvalt DS docs (existing) ──────────────────────────────── */}
          {/* App.tsx používá vlastní query-based routing přes ?page=xyz */}
          <Route path="/ds/*" element={<App />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  </StrictMode>,
);
