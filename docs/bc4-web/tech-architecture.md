# BC4Cloud Web — Technická architektura

Živý dokument. Poslední aktualizace: 2026-04-14.

Obsahuje všechna engineering rozhodnutí, jejich odůvodnění, a repo konvence specifické pro BC4 web. Kvalt DS konvence jsou nadřazené a najdete je v `CLAUDE.md` a `docs/conventions.md`.

---

## 1. Stack (rozhodnuto)

| Vrstva | Volba | Verze | Důvod |
|--------|-------|-------|-------|
| Framework | React | 19 | Stejný jako Kvalt DS, sdílíme komponenty |
| Jazyk | TypeScript | 5.9 | Stejný jako Kvalt |
| Build | Vite | 8 | Stejný jako Kvalt |
| Styling | Tailwind CSS | 3 | Stejný jako Kvalt, používáme jeho semantic tokens |
| Animace | Motion | 12 | Stejný jako Kvalt, všechny transition z `src/tokens/motion.ts` |
| Ikony | Lucide React | latest | Stejný jako Kvalt |
| Routing | react-router-dom | 6 | Client-side routing + locale prefix |
| SSG | **vite-ssg** | latest | Prerender každé stránky do HTML pro SEO a LCP |
| i18n | **react-i18next** | latest | De facto standard pro React, namespace per stránka |
| Formuláře | **react-hook-form + zod** | latest | Minimum re-renderů, type-safe schémata |
| Analytika | **Plausible** | — | GDPR-friendly, bez cookie consent peklo, lightweight script |
| Monitoring | **Sentry** (volitelně) | — | Error tracking v produkci |
| Deploy | Vercel | — | Již používáno Janem, git flow funguje |

**Co NEpřidáme do stacku:**
- ❌ Redux / Zustand / Jotai — marketingový web nepotřebuje global state, stačí React state a URL
- ❌ SWR / TanStack Query — nemáme dostatek API volání, která by to ospravedlnila
- ❌ Next.js — při použití vite-ssg získáme stejné SEO benefity bez migrace stacku
- ❌ CMS headless (Sanity, Contentful) — pro MVP content jako TypeScript objekty. CMS až když Jan nebo marketing přestane snášet deploy per copy změnu
- ❌ shadcn/ui — máme vlastní Kvalt DS, šlo by o duplikaci

## 2. Proč vite-ssg a ne čisté SPA

**Důvod 1: SEO.** Google dnes sice renderuje JS, ale dělá to s latencí, nekonzistentně a u dlouhých stránek nedočte do konce. Marketingový B2B web bez prerendered HTML = stavba na písku. vite-ssg prerenderuje každou známou routu do statického HTML → Google čte hotový obsah bez exekuce JS.

**Důvod 2: LCP.** Čisté SPA má LCP typicky 3,5–5 s (čekání na hydrataci). Prerender = LCP 0,8–1,5 s. Research (Google/Amazon) říká +100ms LCP = −1 až −3% konverze. U marketingového webu kritické.

**Důvod 3: Sdílení náhledů.** OG tagy a meta description musí být v initial HTML response, jinak Facebook/LinkedIn/Twitter nezrenderují preview. SPA tenhle problém nevyřeší bez SSR nebo prerender.

**Důvod 4: Odolnost.** Prerendered HTML funguje i když se JS nestáhne nebo spadne. Degradace je elegantní, ne binární.

**Cena volby:**
- Build o 10–30 s delší (prerender fáze)
- Dynamické routy (např. `/poptavka/odeslano?id=...`) musí explicitně říct ssg, že mají prerender skippovat
- Plain vite-ssg nenabízí API routes → pro backend (ARES, form submit) použijeme Vercel Functions zvlášť

## 3. Organizace složek

```
src/
├── components/                    # Kvalt DS — NESAHAT v tomto projektu
│   ├── Button.tsx
│   ├── Input.tsx
│   └── ...
│
├── marketing/                     # NOVÉ — vše specifické pro bc4-web
│   ├── sections/                  # Velké landing page building bloky
│   │   ├── Hero.tsx
│   │   ├── LogoCloud.tsx
│   │   ├── BenefitTriplet.tsx
│   │   ├── ProductScreenshot.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── SegmentCards.tsx
│   │   ├── CaseStudyHighlight.tsx
│   │   ├── LeadForm.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTABand.tsx
│   │   └── PricingTable.tsx
│   ├── layouts/                   # Layouty sdílené napříč stránkami
│   │   ├── MarketingLayout.tsx    # Header + main + Footer
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── primitives/                # Nízké utility specifické pro web
│       ├── Container.tsx
│       ├── SectionHeading.tsx
│       ├── EyebrowLabel.tsx
│       └── Prose.tsx              # Wrapper pro long-form text content
│
├── pages/
│   ├── docs/                      # Stávající Kvalt DS docs — NESAHAT
│   │   ├── components/
│   │   └── foundations/
│   └── marketing/                 # NOVÉ
│       ├── Home.tsx
│       ├── ProductContactCenter.tsx
│       ├── ProductCalling.tsx
│       ├── Pricing.tsx
│       ├── Contact.tsx
│       ├── LeadForm.tsx
│       └── LeadFormSubmitted.tsx
│
├── content/                       # NOVÉ — všechen marketingový text
│   ├── cs/
│   │   ├── common.ts              # nav, footer, generic CTA
│   │   ├── home.ts
│   │   ├── product-cc.ts
│   │   ├── product-calling.ts
│   │   ├── pricing.ts
│   │   └── contact.ts
│   ├── en/                        # Zatím prázdný, připraveno
│   └── types.ts                   # Sdílené typy (HomeContent, PricingContent, ...)
│
├── i18n/                          # NOVÉ
│   ├── config.ts                  # react-i18next setup
│   └── useT.ts                    # wrapper hook (useTranslation s type safety)
│
├── routes/                        # NOVÉ
│   ├── marketing.tsx              # Marketing routes s locale prefix
│   └── docs.tsx                   # Docs routes (stávající)
│
└── router.tsx                     # NOVÉ — top-level router
```

**Klíčová pravidla:**
- `src/components/` = Kvalt DS primitives. V rámci bc4-web **nikdy** neupravujeme. Když něco chybí, přidáme do DS (po konzultaci s Janem), ne do `marketing/`.
- `src/marketing/` = aplikační kompozitní komponenty **specifické pro tento web**. Hero, LeadForm, CTABand jsou marketing-level, ne DS-level.
- `src/content/` = **žádný hardcoded text v komponentách**. Každý string prochází content file. Exception: technické labely, které se nikdy nepřekládají (např. "BC4Cloud").

## 4. Rozhodnutí o i18n

**Volba:** `react-i18next` s namespace per stránka.

**URL strategy:**
- CS bez prefixu: `/`, `/produkt/kontaktni-centrum`, `/cenik`
- EN s prefixem: `/en`, `/en/product/contact-center`, `/en/pricing`
- Fallback: `/cs/*` → 301 redirect na `/*`

**Content loading:**
- Content je TypeScript objekt, ne JSON. Proč: autocomplete, build-time type check, refactor safety.
- Každá stránka má vlastní namespace file (`content/cs/home.ts`). Ne monolitický dict.
- i18n init loaduje jen namespace aktuální stránky + common. Code splitting automatický.

**Struktura content souboru — example:**

```ts
// src/content/types.ts
export interface HomeContent {
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
  benefits: Array<{
    title: string;
    description: string;
    icon: string;  // Lucide icon name
  }>;
  // ...
}

// src/content/cs/home.ts
import type { HomeContent } from '../types';

export const home: HomeContent = {
  seo: {
    title: 'BC4Cloud — Kontaktní centrum, které funguje od prvního dne',
    description: '...',
    ogImage: '/og/home.png',
  },
  hero: {
    headline: 'Sjednoťte hovory, emaily a chaty do jednoho přehledu.',
    subheadline: '...',
    primaryCta: { label: 'Domluvit ukázku', href: '/poptavka' },
    secondaryCta: { label: 'Jak to funguje', href: '#how-it-works' },
  },
  // ...
};
```

**Type safety:**
- Každá content shape je TypeScript interface v `content/types.ts`.
- Když přidáme EN content a zapomeneme field → TypeScript error při buildu.
- i18n wrapper vrací typed `t()` funkci na základě aktuálního namespace.

## 5. Formuláře — react-hook-form + zod

**Proč tato kombo:**
- `react-hook-form` = uncontrolled forms, minimum re-renderů, výborná DX
- `zod` = type-safe schema validation, sdílená mezi frontendem a backend funkcí (validuje před i po síti)

**Struktura schématu:**

```ts
// src/marketing/forms/leadForm.schema.ts
import { z } from 'zod';

export const leadFormSchema = z.object({
  ico: z.string()
    .regex(/^\d{8}$/, 'IČ musí mít 8 číslic'),
  email: z.string()
    .email('Vyplňte platný email'),
  phone: z.string()
    .regex(/^\+?[\d\s]{9,15}$/, 'Vyplňte platné telefonní číslo'),
  teamSize: z.number()
    .int().min(1, 'Alespoň 1 osoba').max(1000),
  gdprConsent: z.literal(true, { errorMap: () => ({ message: 'Potřebujeme váš souhlas' }) }),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
```

**ARES validace:**
- Po blur na field IČ → debounced request na `/api/ares?ico=...` (Vercel Function)
- Funkce volá veřejné ARES API, vrátí jméno firmy nebo 404
- UI zobrazí pod fieldem jméno firmy (success) nebo warning "Firma nenalezena v ARES" (neblokuje submit)

**Form submit flow:**
1. Frontend validuje přes zod
2. POST na `/api/leads` s payload
3. Backend revaliduje přes stejný zod schema
4. Backend kontroluje: existuje firma, není stávající zákazník, nemá HW ústřednu (tyto checky jsou backend-side, na frontendu nic)
5. Vrátí `{ ok: true }` nebo `{ ok: false, error }`
6. Frontend redirect na `/poptavka/odeslano` + tracking event

**Duplicitní submit:**
- Idempotency key = hash submission payload + timestamp bucket (60 s)
- Druhý identický submit do 60 s → backend vrátí 200 bez uložení (idempotent)

## 6. Backend — Vercel Functions

**Rozsah pro MVP:**
- `/api/ares?ico=XXX` — lookup firmy v ARES, vrátí `{ found, companyName?, address? }`
- `/api/leads` — POST endpoint pro poptávku. Validace, kontroly, uložení, notifikace
- `/api/og/[slug]` — dynamic OG image generation (volitelné, fáze 2)

**Architektura `/api/leads`:**
```
POST /api/leads
  ↓
  1. Zod validace payloadu
  2. Honeypot check (pole viditelné jen robotům)
  3. Rate limit (5 requestů / IP / 10 min, Upstash Redis)
  4. ARES check (server-side, source of truth)
  5. CRM check — ping do CRM BusinessComu, existuje firma?
     (tento endpoint musíme dostat od IT BusinessComu)
  6. Uložení do BC4 CRM / DB
  7. Notifikace — email obchodníkovi + slack/teams webhook
  8. Response { ok: true, leadId }
```

**Kdo implementuje backend integrace:**
- Otevřená otázka #5 ze `strategy.md` § 10 — kdo píše ARES endpoint a CRM integraci? Pro MVP jdeme s ARES (veřejné API, lze napsat hned) a emailovou notifikací. CRM integrace je fáze 1.5.

## 7. Performance rozpočty

**Cíle (Lighthouse mobile, 4G simulation):**
- Performance ≥ 90
- LCP ≤ 2,5 s
- CLS ≤ 0,1
- INP ≤ 200 ms
- TBT ≤ 300 ms

**Bundle budgets:**
- Initial JS (first load) ≤ 150 KB gzipped
- Total JS ≤ 300 KB gzipped
- Každý obrázek ≤ 200 KB (po WebP kompresi), ≤ 50 KB pro logo
- Hero screenshot ≤ 120 KB WebP

**Strategie:**
- **Obrázky:** AVIF + WebP s fallback PNG. `<picture>` tag. `loading="lazy"` na vše pod foldem, `loading="eager"` + `fetchpriority="high"` na hero. Explicit width/height attributes pro no-CLS.
- **Fonty:** Self-hosted přes Kvalt typografický setup. `font-display: swap`. Preload jen hero fontu (Borna bold).
- **Třetí strany:** Plausible má ~1 KB tracking script. Sentry volitelně a jen lazy-load.
- **JS splitting:** Každá marketing stránka má vlastní chunk. Shared vendor chunk pro React/Motion.
- **No polyfills** pro starý IE11 apod. Modern browsers only. Baseline: Chrome 90+, Safari 14+, Firefox 88+.

## 8. Analytika a trackování konverze

**Plausible:**
- Script v `<head>` přes proxy (anti-adblock), domain: `bc4cloud.cz`
- Custom events pro klíčové akce (viz níže)
- Goal funnels v Plausible UI

**Custom events (naming convention `action_object`):**
- `cta_click` s props `{ location, variant }` (location = 'header' | 'hero' | 'pre-footer' | 'inline-form')
- `form_start` s `{ form }`
- `form_submit` s `{ form, source }`
- `form_error` s `{ form, field, error }`
- `video_play` s `{ id, location }`
- `ares_lookup` s `{ found }`
- `pricing_tier_click` s `{ tier }`

**UTM handling:**
- Zachovat UTM parametry v localStorage pro atribuci skrz session
- Přidat do form submitu jako skryté pole
- Dokumentovat kampaň naming convention

**Žádné cookie consent banner** — Plausible nepotřebuje consent (no cookies, no fingerprinting, GDPR compliant).

## 9. Testing strategie

**Co testujeme:**
- Unit testy pro business logic (validace, utility funkce) — Vitest, stejný setup jako Kvalt
- Component testy jen pro netriviální marketing komponenty (LeadForm s ARES flow, PricingTable s toggly) — RTL
- E2E pro kritické flowy — Playwright (existuje v Kvalt repu):
  - Happy path: home → CTA → formulář → odeslání → děkovná stránka
  - Happy path mobile equivalent
  - Form validace edge cases (invalid IČ, invalid email)
  - Navigace dostupná klávesnicí
  - Language switch (až bude EN)

**Co netestujeme v MVP:**
- Vizuální regresní screenshoty per page — fáze 2 (playwright-test skill)
- Performance budgets v CI — fáze 2 (Lighthouse CI)
- A11y audit v CI — fáze 2 (axe-core přes Playwright skill)

## 10. Deployment

**Target:** Vercel, GitHub-integrated deploys
**Doména fáze 1:** `bc4-web-*.vercel.app` preview subdomain
**Doména finální:** TBD (otevřená otázka v `strategy.md`)

**Environment variables (Vercel):**
- `ARES_API_URL` — veřejné ARES API
- `CRM_API_URL`, `CRM_API_KEY` — BusinessCom CRM (až budeme integrovat)
- `NOTIFICATION_EMAIL` — kam jdou nové leady
- `SLACK_WEBHOOK_URL` — teams/slack kanál pro real-time notifikace
- `PLAUSIBLE_DOMAIN` — analytics domain
- `UPSTASH_REDIS_*` — rate limiting

**CI pipeline (GitHub Actions, budoucnost):**
1. Type-check
2. Lint
3. Unit tests
4. Build
5. Playwright E2E (smoke)
6. Deploy přes Vercel integration

Pro MVP jen vite-ssg build + Vercel auto-deploy z main branch.

## 11. Mezirepo závislosti a konvence

**Sdílení s Kvalt DS docs:**
- Obojí žije ve stejném repu (rozhodnuto 2026-04-14)
- `src/components/` je sdílený
- `src/tokens/` je sdílený (motion, colors, typography, spacing)
- Docs routes a marketing routes jsou oddělené v `src/router.tsx`
- Deploy může běžet jako dva targety (marketing = `bc4cloud.cz`, docs = `ds.bc4cloud.cz`) nebo jako jeden s conditional routing — rozhodneme při deployi

**Git workflow:**
- Conventional commits (viz `COMMIT_CONVENTION.md`)
- Scope labely: `feat(bc4-home)`, `feat(bc4-pricing)`, `fix(bc4-leadform)`, `refactor(bc4-header)`, `content(bc4-home)` pro pure copy změny
- **Nikdy** nevznikne commit, který mixuje Kvalt DS změnu a BC4 marketing změnu — jeden účel per commit

## 12. Animation strategy

**Knihovna:** Motion 12 (motion.dev) — již v Kvalt DS, sdílíme. **Žádný GSAP, žádný Lenis** v MVP.

**Obecná pravidla:**
- Všechen timing z `src/tokens/motion.ts` (`spring.snappy`, `spring.default`, `duration.fast`, atd.). Žádné inline `transition: { duration: 0.3 }`.
- `<MotionConfig reducedMotion="user">` na úrovni MarketingLayout — globálně respect prefers-reduced-motion.
- Animation budget: max 50 ms stagger mezi sourozenci (Kvalt rule z `philosophy.md`).
- Nikdy animovat `width`/`height`/`top`/`left` — pouze `transform` a `opacity` (composited properties).
- Box shadows — pokud je element animovaný přes Motion, shadow řeší Motion `style`, ne Tailwind transition.

**Konkrétní patterny pro BC4 web:**

| Pattern | Implementace | Kde |
|---------|--------------|-----|
| Hero text fade-up | `initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={transition.reveal}` | HomePage hero |
| Stagger reveal kartiček | `whileInView` + `transition.delay = i * 0.05` | BenefitTriplet, SegmentCards, Features |
| Hero screenshot parallax | `useScroll() + useTransform([0,500],[0,-50])` na `y` | HomePage productShowcase |
| Sticky scroll progress bar | `useScroll() + scaleX={scrollYProgress}` na top fixed div | MarketingLayout |
| Sticky bottom CTA na mobilu | Conditional render po `useScroll()` thresholdu 600px | MarketingLayout |
| Pin-and-reveal "How it works" | `position: sticky` + `useScroll target` + `useTransform` | HomePage HowItWorks |
| Animovaná čísla (case study) | `useMotionValue + useSpring + useTransform` | CaseStudyHighlight |
| FAQ accordion | Layout animation (`AnimatePresence + motion.div layout`) | FAQ section |
| Logo cloud subtle drift | `motion.div animate={{ x: [-10, 10] }} transition={{ repeat: Infinity, repeatType: 'reverse' }}` | LogoCloud (volitelné, pouze pokud test ukáže value) |
| Form success state | `<motion.div role="alert" initial={{opacity:0}} animate>` | LeadForm | 

**Co NEděláme:**
- Auto-play hero video (zabíjí LCP)
- Particle backgrounds, abstract floating shapes
- Cursor follow effects (B2B audience to nesnáší)
- Scroll-jacking (smooth scroll knihovny — viz důvody)
- Animace, které se nezastaví — žádné `Infinity` loops s viditelným pohybem (kromě subtle ambient)

**Performance:**
- `whileInView` má `viewport={{ once: true }}` default — animace běží jen jednou per element
- Heavy animace (parallax, scroll-driven) test profilovat v Chrome DevTools → Performance — drop pod 60 fps na mobilu = optimalizovat nebo vypnout
- Pro reduced motion: opacity-only fade pod 200 ms, žádný spatial pohyb

---

## 13. Rozhodnutí, která nechávám otevřená

Tato rozhodnutí nemusíme dělat teď — proveden až ve chvíli, kdy budou relevantní:

- **Error monitoring v produkci** — Sentry vs. Vercel Analytics (decide při deploy)
- **OG image generation** — statické assety vs. serverless Satori funkce (decide při první potřebě dynamických OG)
- **CMS migrace** — Sanity / Directus / žádný CMS (decide kdy content updates přestanou být PR-friendly)
- **A/B testing** — PostHog / Vercel Edge Config / ne (decide při prvních conversion optimization cyklech)
- **Backend stack pro ARES a CRM** — Vercel Functions (Node) vs. samostatný API v jiném tech stacku (decide dle konsensu s IT BusinessComu)
