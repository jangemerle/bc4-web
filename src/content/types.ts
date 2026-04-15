/**
 * BC4Cloud content types
 *
 * Všechen marketingový obsah prochází typovaným content systémem.
 * Každá stránka má svůj content file v `src/content/{locale}/`.
 * Komponenty stránky jen renderují tyto data, nikdy nemají hardcoded text.
 *
 * Princip: build-time type safety. Když přidáme EN a zapomeneme field,
 * TypeScript selže při buildu, ne až v produkci.
 */

// ─── Primitive content blocks ───────────────────────────────────────────────

export interface SEOMeta {
  /** <title> — max 60 znaků, unikátní per stránka */
  title: string;
  /** <meta name="description"> — max 155 znaků, akční */
  description: string;
  /** OG image URL relativní k `public/` nebo absolutní */
  ogImage: string;
  /** Alternativní canonical URL, pokud se liší od cesty */
  canonical?: string;
  /** JSON-LD schema.org data — volitelné per stránka */
  jsonLd?: Record<string, unknown>;
}

export interface CTA {
  label: string;
  href: string;
  /** Tracking event name pro Plausible */
  trackingId?: string;
  /** Volitelně otevřít v novém okně */
  external?: boolean;
}

export interface Benefit {
  title: string;
  description: string;
  /** Lucide icon name (např. "Phone", "MessageSquare", "ShieldCheck") */
  icon: string;
}

export interface Testimonial {
  /** Citace — 20–30 slov max, obsahuje konkrétní číslo nebo výsledek */
  quote: string;
  /** Jméno + příjmení, nikdy "Spokojený zákazník" */
  author: string;
  /** Pozice + firma */
  role: string;
  /** Firma separátně (pro logo / link) */
  company: string;
  /** URL loga firmy relativní k `public/logos/` */
  companyLogo?: string;
  /** Fotka autora relativní k `public/testimonials/` */
  authorPhoto?: string;
  /** LinkedIn URL autora pro trust / verifikaci */
  authorLinkedIn?: string;
}

export interface LogoCloudItem {
  name: string;
  /** URL loga relativní k `public/logos/` */
  src: string;
  alt: string;
  /** Volitelný link na reference stránku té firmy */
  href?: string;
  /** Konkrétní outcome pod logem — např. "18 % pokles AHT". Podle Baymard 2023
   * logo s outcome přidává +18 % konverze, bez outcome jen +2 %. */
  outcome?: string;
}

export interface FAQItem {
  question: string;
  /** Markdown-style odpověď — může obsahovat **bold**, odkazy */
  answer: string;
}

export interface ProductFeature {
  /** Short label — např. "Smart routing" */
  title: string;
  /** 1–2 věty popis */
  description: string;
  /** URL screenshotu aplikace relativní k `public/product/` */
  screenshot?: string;
  /** Lucide icon name jako fallback pokud screenshot chybí */
  icon?: string;
  /** Volitelné bullet list rozšíření */
  bullets?: string[];
}

export interface Segment {
  /** Název segmentu (e-commerce, servis, banky, telco…) */
  name: string;
  /** Krátká jednovětná diferenciace pro persona tohoto segmentu */
  tagline: string;
  /** Lucide icon name */
  icon: string;
  /** Volitelně odkaz na dedicated segment page v budoucnu */
  href?: string;
}

export interface PricingTier {
  /** Identifikátor pro tracking a selection */
  id: string;
  /** Zobrazovaný název — "Volání", "Kontaktní centrum", "Business" */
  name: string;
  /** Eyebrow label — např. "Pro začínající týmy" */
  eyebrow?: string;
  /** Cena jako string (obsahuje měnu a jednotku) — např. "Od 490 Kč / agent / měsíc" */
  price: string;
  /** Vysvětlení ceny pod hlavní cenou */
  priceNote?: string;
  /** Klíčové features — seznam řetězců, první řádek nejdůležitější */
  features: string[];
  /** Primary CTA per tier */
  cta: CTA;
  /** Highlight jako "Doporučené" — max jeden tier na stránku */
  highlighted?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  /** Submenu items pro mega dropdown */
  children?: NavItem[];
}

// ─── Shared content (common across all pages) ───────────────────────────────

export interface CommonContent {
  brand: {
    name: string;
    tagline: string;
    /** Logo paths — dark varianta pro light bg, light pro dark bg */
    logoDark: string;
    logoLight: string;
  };
  nav: {
    primary: NavItem[];
    primaryCta: CTA;
  };
  footer: {
    /** Popis společnosti pod logem */
    tagline: string;
    columns: Array<{
      title: string;
      links: Array<{ label: string; href: string; external?: boolean }>;
    }>;
    /** Copyright text — rok se generuje automaticky */
    copyright: string;
    /** Právní odkazy pod copyright */
    legal: Array<{ label: string; href: string }>;
    /** Sociální sítě — zobrazeny pouze aktivní */
    social: Array<{ platform: 'linkedin' | 'github' | 'twitter' | 'youtube'; href: string }>;
  };
  preFooterCta: {
    headline: string;
    subheadline: string;
    cta: CTA;
  };
  /** Texty reusable v celém webu (GDPR, form disclaimers, etc.) */
  legal: {
    gdprConsentLabel: string;
    gdprConsentDetails: string;
    privacyPolicyUrl: string;
  };
}

// ─── Home page ──────────────────────────────────────────────────────────────

export interface HomeContent {
  seo: SEOMeta;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    primaryCta: CTA;
    secondaryCta?: CTA;
    /** Path k hero screenshotu nebo video posteru */
    heroVisual: {
      type: 'screenshot' | 'video-poster';
      src: string;
      alt: string;
      /** Pokud type === 'video-poster', URL videa pro klik-play */
      videoSrc?: string;
    };
  };
  trustBand: {
    /** Eyebrow nad logy — např. "Důvěřují nám" */
    label: string;
    logos: LogoCloudItem[];
  };
  benefits: {
    eyebrow?: string;
    headline: string;
    subheadline?: string;
    items: Benefit[];
  };
  productShowcase: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    /** Hlavní anotovaný screenshot */
    screenshot: {
      src: string;
      alt: string;
      /** Anotace — číslo na screenshotu + vysvětlení */
      annotations?: Array<{
        label: string;
        description: string;
        /** Pozice v procentech od left/top */
        position: { x: number; y: number };
      }>;
    };
  };
  statsBand: {
    eyebrow?: string;
    /** Volitelný headline — někdy stačí jen stats bez nadpisu */
    headline?: string;
    /** 3–4 hlavní čísla. Víc je cognitive overload. */
    stats: Array<{
      /** Velké číslo (string kvůli formátování: "18 %", "0:45", "3×") */
      value: string;
      /** Krátký popis pod číslem — 1 řádek */
      label: string;
      /** Volitelný detail pod labelem — 1 věta */
      description?: string;
    }>;
    /** Disclaimer text pod stats — např. "Průměr napříč 10 zákazníky po 90 dnech" */
    footnote?: string;
  };
  featureShowcase: {
    eyebrow?: string;
    headline: string;
    subheadline?: string;
    items: Array<{
      /** Identifikátor (anchor + tracking) */
      id: string;
      /** Short label — "Supervizor Panel", "IVR editor", atd. */
      title: string;
      /** Eyebrow nad headlinem — např. "MONITORING" */
      eyebrow?: string;
      /** Headline feature — jedno výstižné tvrzení */
      headline: string;
      /** 1–3 věty popis funkce */
      description: string;
      /** 3–4 highlights jako bullet list */
      highlights: string[];
      /** Screenshot aplikace ukazující tuto funkci */
      screenshot: {
        src: string;
        alt: string;
      };
      /** Lucide icon jako fallback pokud screenshot není */
      icon: string;
      /** Volitelný odkaz "více o funkci" na produktovou stránku */
      learnMoreHref?: string;
    }>;
  };
  productVideo: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    /** Video zdroj. MP4/WebM self-hosted nebo YouTube/Vimeo URL */
    videoSrc?: string;
    /** Poster image (první frame nebo klíčový snímek). Zobrazí se než user klikne play. */
    posterSrc: string;
    /** Alt/aria-label pro screen reader popisující, co video obsahuje */
    alt: string;
    /** Délka videa v "m:ss" formátu — zobrazí se na poster overlay */
    duration: string;
    /** Chapter markers — tři highlights pod videem pro skimmers co nepustí play */
    chapters: Array<{
      /** Timestamp "0:15" kde chapter začíná (volitelné, pro seek links) */
      timestamp?: string;
      title: string;
      description: string;
    }>;
    /** Inline CTA hned po videu */
    cta: CTA;
  };
  howItWorks: {
    eyebrow?: string;
    headline: string;
    tiers: Array<{
      tier: 1 | 2 | 3;
      /** Název úrovně — "Volání", "Kontaktní centrum", "AI" */
      title: string;
      /** Krátký popis čemu úroveň slouží */
      description: string;
      /** Bullet features */
      features: string[];
      /** Link na dedicated product page */
      learnMoreHref: string;
    }>;
  };
  segments: {
    eyebrow?: string;
    headline: string;
    /** Subheadline — zdůrazní, že segmenty jsou jen příklady, ne exkluzivní výčet */
    subheadline?: string;
    items: Segment[];
    /** Uzavírací text pod grid — invite pro zákazníky mimo zobrazené segmenty */
    footnote?: string;
  };
  caseStudyHighlight?: {
    eyebrow?: string;
    headline: string;
    /** Klíčové číslo — např. "+32 %" */
    stat: string;
    /** Popis čísla */
    statLabel: string;
    /** Plný příběh v 2–3 větách */
    story: string;
    /** Link na plnou case study (fáze 2) */
    href?: string;
    /** Autor citace */
    testimonial: Testimonial;
  };
  testimonials: {
    eyebrow?: string;
    headline: string;
    subheadline?: string;
    items: Testimonial[];
  };
  inlineLeadForm: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
  };
  whyUs: {
    eyebrow?: string;
    headline: string;
    reasons: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  faq: {
    eyebrow?: string;
    headline: string;
    items: FAQItem[];
  };
}

// ─── Product pages (sdílená šablona pro Volání, CC, AI) ─────────────────────

export interface ProductContent {
  seo: SEOMeta;
  hero: {
    eyebrow: string; // "Kontaktní centrum", "Volání", "AI"
    headline: string;
    subheadline: string;
    primaryCta: CTA;
    secondaryCta?: CTA;
    heroVisual: {
      type: 'screenshot' | 'video-poster';
      src: string;
      alt: string;
      videoSrc?: string;
    };
  };
  trustBand?: {
    label: string;
    logos: LogoCloudItem[];
  };
  painPoints: {
    eyebrow?: string;
    headline: string;
    items: Array<{
      pain: string;
      resolution: string;
    }>;
  };
  features: {
    eyebrow?: string;
    headline: string;
    subheadline?: string;
    items: ProductFeature[];
  };
  technicalSpecs?: {
    eyebrow?: string;
    headline: string;
    /** Tabulka nebo accordion — per stránka */
    specs: Array<{
      category: string;
      items: Array<{ label: string; value: string }>;
    }>;
  };
  caseStudySnippet?: {
    testimonial: Testimonial;
    stats?: Array<{ value: string; label: string }>;
  };
  relatedProducts: {
    headline: string;
    items: Array<{
      name: string;
      description: string;
      href: string;
      icon: string;
    }>;
  };
  pricingReference: {
    /** Text jako "Od 490 Kč / agent / měsíc" */
    priceFrom: string;
    ctaLabel: string;
    ctaHref: string;
  };
}

// ─── Pricing page ───────────────────────────────────────────────────────────

export interface PricingContent {
  seo: SEOMeta;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
  };
  model: {
    /** 1–2 věty vysvětlení per-agent modelu */
    explanation: string;
    /** Minimální podmínky (např. "Minimum 5 agentů") */
    fineprint?: string[];
  };
  tiers: PricingTier[];
  addOns: {
    headline: string;
    items: Array<{
      name: string;
      description: string;
      price: string;
      icon: string;
    }>;
  };
  faq: {
    headline: string;
    items: FAQItem[];
  };
  customPlan: {
    headline: string;
    subheadline: string;
    cta: CTA;
  };
}

// ─── Contact page ───────────────────────────────────────────────────────────

export interface ContactContent {
  seo: SEOMeta;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
  };
  channels: Array<{
    /** "Poptávka", "Obchod", "Podpora", "Tisk" */
    name: string;
    description: string;
    /** Kontakt — email / telefon / form href */
    contact: string;
    contactType: 'email' | 'phone' | 'form';
    icon: string;
  }>;
  company: {
    headline: string;
    name: string;
    address: string[];
    ico: string;
    dic?: string;
    email: string;
    phone: string;
  };
  mapEmbed?: {
    /** Google Maps embed URL nebo lat/lng */
    lat: number;
    lng: number;
    zoom: number;
  };
}

// ─── Lead form (inline + standalone) ────────────────────────────────────────

export interface LeadFormContent {
  seo: SEOMeta;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
  };
  /** Field labels, placeholdery, helper texts */
  form: {
    icoLabel: string;
    icoPlaceholder: string;
    icoHelper: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    teamSizeLabel: string;
    teamSizePlaceholder: string;
    gdprLabel: string;
    submitLabel: string;
    disclaimer: string;
  };
  /** Chybové hlášky */
  errors: {
    icoInvalid: string;
    emailInvalid: string;
    phoneInvalid: string;
    teamSizeInvalid: string;
    gdprRequired: string;
    submissionFailed: string;
  };
  /** ARES success / warning messages */
  ares: {
    companyFound: string; // "{companyName}" placeholder
    companyNotFound: string;
  };
}

export interface LeadFormSubmittedContent {
  seo: SEOMeta;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
  };
  /** Co se bude dít teď — 3 kroky */
  nextSteps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  /** CTA na návrat na homepage nebo ceník */
  followUpCta: CTA;
}

// ─── Typed content registry ─────────────────────────────────────────────────

export interface LocaleContent {
  common: CommonContent;
  home: HomeContent;
  productContactCenter: ProductContent;
  productCalling: ProductContent;
  productAi: ProductContent; // Vlna 2
  pricing: PricingContent;
  contact: ContactContent;
  leadForm: LeadFormContent;
  leadFormSubmitted: LeadFormSubmittedContent;
}

export type Locale = 'cs' | 'en';
