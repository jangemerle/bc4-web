/**
 * BC4Cloud — Ceník (CS)
 *
 * Ceny jsou ILUSTRATIVNÍ. Musí se ověřit s obchodem BusinessComu před produkcí.
 * Otevřená otázka #3 v strategy.md § 10.
 */

import type { PricingContent } from '../types';

export const pricing: PricingContent = {
  seo: {
    title: 'Ceník | BC4Cloud',
    description: 'Transparentní ceník kontaktního centra v cloudu. Per agent za měsíc, bez skrytých poplatků. Kalkulace zdarma.',
    ogImage: '/og/pricing.png', // TODO
  },

  hero: {
    eyebrow: 'CENÍK',
    headline: 'Férové ceny. Bez měsíčních překvapení.',
    subheadline: 'Fakturujeme per agent za měsíc. Funkce, které zahrnuje váš plán, používáte bez limitů a bez dodatečných poplatků za hovor.',
  },

  model: {
    explanation: 'Základem ceny je počet aktivních agentů. Agent = jedna pracovní pozice — uživatel, který může přijímat nebo volat. Supervizor Panel se započítává jako agent. Minimum je 5 agentů, licence jdou navyšovat kdykoli přes administraci.',
    fineprint: [
      'Minimum 5 agentů',
      'Fakturace měsíčně dopředu',
      'Smlouva s výpovědní lhůtou 3 měsíce',
      'Ceny uvedené bez DPH',
      'Slevy pro 50+ agentů — kontaktujte obchod',
    ],
  },

  tiers: [
    {
      id: 'calling',
      name: 'Volání',
      eyebrow: 'PRO ZAČÁTEČNÍKY',
      price: 'Od 490 Kč',
      priceNote: 'za agenta / měsíc',
      features: [
        'Cloudová ústředna s portací čísel',
        'Přehled všech hovorů v reálném čase',
        'IVR a call flow editor',
        'Nahrávání hovorů + šifrované úložiště',
        'Mobilní aplikace (iOS + Android)',
        'Reporty a export do XLSX',
        'Česká podpora v pracovní době',
      ],
      cta: {
        label: 'Domluvit ukázku',
        href: '/poptavka?source=pricing&tier=calling',
        trackingId: 'cta_pricing_calling',
      },
    },
    {
      id: 'contact-center',
      name: 'Kontaktní centrum',
      eyebrow: 'DOPORUČENÉ',
      price: 'Od 890 Kč',
      priceNote: 'za agenta / měsíc',
      highlighted: true,
      features: [
        'Všechno z Volání',
        'Omnichannel — email, chat, SMS',
        'WhatsApp Business API + Messenger',
        'Smart routing (skill + data)',
        'Odchozí kampaně s prediktivním dialerem',
        'Supervizor Panel s náslechem',
        'Integrace do CRM (Salesforce, HubSpot, Dynamics)',
        'REST API a webhooks',
        'SLA 99,95 %',
      ],
      cta: {
        label: 'Domluvit ukázku',
        href: '/poptavka?source=pricing&tier=contact-center',
        trackingId: 'cta_pricing_cc',
      },
    },
    {
      id: 'business',
      name: 'Business',
      eyebrow: 'PRO ENTERPRISE',
      price: 'Od 1 290 Kč',
      priceNote: 'za agenta / měsíc',
      features: [
        'Všechno z Kontaktního centra',
        'AI Voicebot s napojením na ChatGPT',
        'Automatický přepis a shrnutí hovorů',
        'Speech analytics a sentiment',
        'QA scorecards a koučovací moduly',
        'Dedikovaný Customer Success Manager',
        'SSO (SAML, OIDC)',
        'Audit log + compliance pack',
        'Custom SLA a priority support',
      ],
      cta: {
        label: 'Kontaktovat obchod',
        href: '/poptavka?source=pricing&tier=business',
        trackingId: 'cta_pricing_business',
      },
    },
  ],

  addOns: {
    headline: 'Přidejte si, co potřebujete',
    items: [
      {
        name: 'WhatsApp Business API',
        description: 'Oficiální WhatsApp kanál s přílohami a šablonami. Meta fee zahrnut.',
        price: '2 900 Kč / měsíc za kanál', // TODO: ověřit
        icon: 'MessageCircle',
      },
      {
        name: 'AI Voicebot',
        description: 'Konverzační AI pro ověření identity, rezervace, rutinní FAQ.',
        price: 'Od 3 Kč / minuta', // TODO: ověřit
        icon: 'Sparkles',
      },
      {
        name: 'Prediktivní dialer',
        description: 'Pro outbound kampaně. Automatické vytáčení s answer detection.',
        price: '490 Kč / agent / měsíc navíc', // TODO
        icon: 'PhoneOutgoing',
      },
      {
        name: 'Rozšířené nahrávání',
        description: 'Retence nahrávek až 7 let. Pro finanční a zdravotnický sektor.',
        price: 'Od 990 Kč / měsíc', // TODO
        icon: 'Archive',
      },
    ],
  },

  faq: {
    headline: 'Otázky kolem ceny',
    items: [
      {
        question: 'Počítá se agent, který je na dovolené?',
        answer: 'Fakturujeme podle maximálního počtu aktivních účtů v měsíci. Deaktivovaný účet se nepočítá — deaktivaci provádíte sami přes administraci.',
      },
      {
        question: 'Co znamená "bez dodatečných poplatků za hovor"?',
        answer: 'V ceně tarifu jsou zahrnuty jak příchozí, tak standardní odchozí hovory do ČR a SR. Mezinárodní hovory fakturujeme podle ceníku operátora — zobrazíme vám je předem.',
      },
      {
        question: 'Můžu plán kdykoli změnit?',
        answer: 'Ano. Upgrade (Volání → CC → Business) je okamžitý, aktivuje se do 24 hodin. Downgrade platí od dalšího fakturačního období.',
      },
      {
        question: 'Jaká je výpovědní lhůta?',
        answer: 'Smlouva má výpovědní lhůtu 3 měsíce. Žádné lock-in smlouvy na roky, žádné sankce za odchod.',
      },
      {
        question: 'Nabízíte slevy pro větší týmy?',
        answer: 'Ano. Pro 50+ agentů máme individuální nabídku. Kontaktujte obchod přes [poptávkový formulář](/poptavka?source=pricing_enterprise) a připravíme vám cenu na míru.',
      },
      {
        question: 'Jaká je cena onboardingu?',
        answer: 'Onboarding a migrace dat jsou zahrnuté v cenách tarifů. Custom integrace s neznámým CRM účtujeme hodinově — odhad předem.',
      },
    ],
  },

  customPlan: {
    headline: 'Máte jiný use case?',
    subheadline: 'Pro enterprise a hybridní nasazení (on-premise + cloud) vytváříme custom plán. Zavoláme si, probereme požadavky, pošleme nabídku.',
    cta: {
      label: 'Domluvit hovor s obchodem',
      href: '/poptavka?source=pricing_custom',
      trackingId: 'cta_pricing_custom',
    },
  },
};
