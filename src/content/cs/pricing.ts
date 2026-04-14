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
    subheadline: 'Platíte per agent za měsíc. Funkce, které tarif obsahuje, používáte bez limitů a bez příplatků za každý hovor.',
  },

  model: {
    explanation: 'Základem ceny je počet aktivních agentů. Agent je jedna pracovní pozice — uživatel, který přijímá nebo volá. Supervizor Panel se počítá jako agent. Minimum je 5 agentů, licence přidáváte i odebíráte v administraci kdykoli.',
    fineprint: [
      'Minimum 5 agentů',
      'Fakturace měsíčně dopředu',
      'Smlouva s výpovědní lhůtou 3 měsíce — žádné lock-in na roky',
      'Ceny uvedené bez DPH',
      'Slevy pro 50+ agentů řešíme individuálně — ozvěte se',
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
        question: 'Proč neukazujete cenu pro celou firmu rovnou?',
        answer: 'Cena se počítá z počtu agentů krát tarif. Minimum je 5 agentů, add-ons (WhatsApp, AI voicebot, prediktivní dialer) si volíte samostatně. Rádi vám ji spočítáme přímo na ukázce — trvá to 60 sekund a pošleme vám ji do hodiny emailem.',
      },
      {
        question: 'Počítá se agent, když je na dovolené?',
        answer: 'Fakturujeme podle maximálního počtu aktivních účtů v měsíci. Deaktivovaný účet se nepočítá — a deaktivaci provedete sami za dva kliky v administraci.',
      },
      {
        question: 'Co znamená „bez příplatků za hovor"?',
        answer: 'V ceně tarifu jsou příchozí i odchozí hovory do ČR a SR. Volání do zahraničí fakturujeme podle ceníku operátora — ale zobrazíme vám je předem, žádné překvapení na faktuře.',
      },
      {
        question: 'Dá se plán kdykoli změnit?',
        answer: 'Ano. Upgrade (Volání → CC → Business) aktivujeme do 24 hodin. Downgrade platí od dalšího fakturačního období — nezablokuje vás v tom, co už jste zaplatili.',
      },
      {
        question: 'Jaká je výpovědní lhůta?',
        answer: 'Tři měsíce. Žádné smlouvy na 24 měsíců, žádné sankce za odchod. Když se rozhodnete odejít, vytáhneme vám data a hotovo.',
      },
      {
        question: 'Máte slevy pro větší týmy?',
        answer: 'Pro 50+ agentů máme individuální nabídku. Ozvěte se přes [poptávkový formulář](/poptavka?source=pricing_enterprise) a cenu upravíme na míru.',
      },
      {
        question: 'Kolik stojí onboarding?',
        answer: 'Onboarding a migraci dat máme v cenách tarifů. Custom integraci s neznámým CRM účtujeme hodinově — odhad dostanete předem, ne v šedé faktuře na konci.',
      },
    ],
  },

  customPlan: {
    headline: 'Máte trochu jiný use case?',
    subheadline: 'Pro enterprise a hybridní nasazení (on-premise + cloud) chystáme custom plán. Zavoláme si, probereme, co potřebujete, pošleme nabídku.',
    cta: {
      label: 'Domluvit hovor s obchodem',
      href: '/poptavka?source=pricing_custom',
      trackingId: 'cta_pricing_custom',
    },
  },
};
