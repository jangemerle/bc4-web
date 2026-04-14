# BC4Cloud Web — Pre-build setup checklist

Co udělat **těsně předtím**, než se začne s prvním kódem stránky.

Strategické dokumenty jsou hotové, BC4 character je registrovaný, content typy a skeleton soubory jsou na místě. Tahle dokumentace dotahuje finální mechaniku.

---

## 1. Instalace npm balíčků

Spustit jako jeden bulk install:

```bash
npm install \
  react-router-dom \
  i18next \
  react-i18next \
  i18next-browser-languagedetector \
  react-hook-form \
  @hookform/resolvers \
  zod
```

Dev / build dependencies:

```bash
npm install -D vite-ssg
```

Volitelně pro production-grade backend:

```bash
npm install @upstash/redis @upstash/ratelimit
```

## 2. Přesun scaffoldů na finální místa

Všechny soubory v `docs/bc4-web/scaffolds/` jsou hotový kód, který čeká na npm install. Po instalaci je přesunout:

| Scaffold | Cíl |
|----------|-----|
| `scaffolds/leadForm.schema.ts` | `src/marketing/forms/leadForm.schema.ts` |
| `scaffolds/i18n.ts` | `src/i18n/config.ts` |
| `scaffolds/useContent.ts` | `src/i18n/useContent.ts` |
| `scaffolds/MarketingLayout.tsx` | `src/marketing/layouts/MarketingLayout.tsx` |
| `scaffolds/router.tsx` | `src/router.tsx` |
| `scaffolds/LeadForm.tsx` | `src/marketing/sections/LeadForm.tsx` |
| `scaffolds/api-leads.ts` | `api/leads.ts` |

Po přesunu **smazat** scaffold složku — udržujeme single source of truth.

## 3. Vytvořit ještě chybějící soubory (po přesunu)

Tyto komponenty scaffoldy referencují, ale ještě neexistují — vytvoří se při stavbě:

- `src/marketing/layouts/Header.tsx` — globální navigace + sticky CTA
- `src/marketing/layouts/Footer.tsx` — 4-sloupcový footer + pre-footer CTA band
- `src/pages/marketing/HomePage.tsx`
- `src/pages/marketing/ProductContactCenterPage.tsx`
- `src/pages/marketing/ProductCallingPage.tsx`
- `src/pages/marketing/PricingPage.tsx`
- `src/pages/marketing/ContactPage.tsx`
- `src/pages/marketing/LeadFormPage.tsx`
- `src/pages/marketing/LeadFormSubmittedPage.tsx`
- `src/pages/marketing/NotFoundPage.tsx`
- `src/marketing/sections/Hero.tsx`
- `src/marketing/sections/LogoCloud.tsx`
- `src/marketing/sections/BenefitTriplet.tsx`
- `src/marketing/sections/ProductScreenshot.tsx`
- `src/marketing/sections/HowItWorks.tsx`
- `src/marketing/sections/SegmentCards.tsx`
- `src/marketing/sections/CaseStudyHighlight.tsx`
- `src/marketing/sections/FAQ.tsx`
- `src/marketing/sections/CTABand.tsx`
- `src/marketing/sections/PricingTable.tsx`

## 4. Upravit `src/main.tsx` pro vite-ssg

Po instalaci vite-ssg upravit entrypoint:

```tsx
// src/main.tsx — NOVÁ verze (SSG-friendly)
import './styles/globals.css';
import { ViteSSG } from 'vite-ssg';
import { App } from './App';
import { routes, getStaticPaths } from './router';

export const createApp = ViteSSG(
  App,
  { routes },
  ({ initialState }) => {
    // Per-route hooks zde
  },
);

// Vite-ssg sám zavolá createApp() při buildu pro každý path z getStaticPaths()
```

A `src/App.tsx` zjednodušit na:

```tsx
import { Outlet } from 'react-router-dom';
export function App() {
  return <Outlet />;
}
```

## 5. `vite.config.ts` přidat ssgOptions

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: { reduceInlineStyles: false },
    includedRoutes: () => [
      '/', '/produkt/kontaktni-centrum', '/produkt/volani',
      '/cenik', '/kontakt', '/poptavka', '/poptavka/odeslano',
    ],
  },
});
```

Build commit: `npm run build` → vite-ssg vygeneruje `dist/` se statickým HTML pro každý path.

## 6. Plausible analytics

Přidat do `index.html` před `</head>`:

```html
<script defer data-domain="bc4cloud.cz" src="https://plausible.io/js/script.js"></script>
```

Nebo přes proxy (anti-adblock) — viz [Plausible docs](https://plausible.io/docs/proxy/introduction).

## 7. Vercel environment variables

V Vercel project settings (Settings → Environment Variables):

| Variable | Value | Scope |
|----------|-------|-------|
| `NOTIFICATION_EMAIL` | obchod@bc4cloud.cz | Production + Preview |
| `SLACK_WEBHOOK_URL` | (Slack/Teams URL) | Production + Preview |
| `BC4_CRM_API_URL` | (až bude integrace) | Production |
| `BC4_CRM_API_KEY` | (až bude integrace) | Production |
| `UPSTASH_REDIS_REST_URL` | (volitelné, rate limiting) | Production |
| `UPSTASH_REDIS_REST_TOKEN` | (volitelné) | Production |

## 8. Deploy preflight checklist

Před prvním deployem (i preview):

- [ ] `npm run build` lokálně bez chyb
- [ ] `npm run lint` bez warningů
- [ ] `npm test` zelený
- [ ] Lighthouse ≥ 85 na homepage (cíl 90, ale 85 OK pro preview)
- [ ] Manuální test poptávkového formuláře end-to-end (mock ARES → submit → success page)
- [ ] OG image existuje aspoň jako default `/og/default.png`
- [ ] favicon.ico v `public/`
- [ ] robots.txt + sitemap.xml — pro preview blokovat indexaci (`Disallow: /`)

## 9. Aktivace BC4 character v marketingu

V `src/marketing/layouts/MarketingLayout.tsx` (po přesunu z scaffoldu) je:

```tsx
<CharacterProvider character="bc4">
  ...
</CharacterProvider>
```

Tím se na celou marketing route větev aplikují BC4 brand tokeny (modrá primary, Manrope font). Kvalt DS docs (`/ds/*`) zachovávají defaultní `kvalt-default` character.

---

## Otevřené otázky před prvním kódem

Předtím, než řekneš "začínáme", potvrdit:

1. ✅ Tech stack potvrzený (React + Vite + Kvalt DS + vite-ssg + i18next + rhf + zod + Plausible)
2. ✅ Single repo, dvě deploy targets (marketing na bc4cloud.cz, docs na ds.bc4cloud.cz)
3. ⏳ Logo BC4Cloud + favicon — **blocker** pro Header
4. ⏳ Klientská loga (3–5) — **blocker** pro LogoCloud sekci
5. ⏳ Čísla o společnosti (let, realizací, agentů) — **blocker** pro WhyUs sekci
6. ⏳ Min. 1 case study s čísly — **soft blocker** pro CaseStudyHighlight (sekce se může skrýt)
7. ⏳ Screenshoty z aplikace — **blocker** pro ProductShowcase a produktové stránky
8. ⏳ Cenové hladiny ověřené — **blocker** pro Pricing
9. ⏳ ARES + CRM integration approach — implementaci backend v MVP nebo až v fázi 1.5?
10. ⏳ Doména finální — bc4cloud.cz vs. bc4.cz redirect
