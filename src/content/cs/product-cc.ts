/**
 * BC4Cloud — Produkt: Kontaktní centrum (CS)
 *
 * Hlavní produktová stránka. Hluboká story o omnichannel CC.
 *
 * ⚠️ Draft — screenshoty a reference dodat, čísla ověřit.
 */

import type { ProductContent } from '../types';

export const productContactCenter: ProductContent = {
  seo: {
    title: 'Kontaktní centrum v cloudu | BC4Cloud',
    description: 'Omnichannel kontaktní centrum: telefon, email, chat, SMS, WhatsApp v jednom rozhraní. Smart routing, kampaně, AI. Česká podpora.',
    ogImage: '/og/product-cc.png', // TODO
  },

  hero: {
    eyebrow: 'KONTAKTNÍ CENTRUM',
    headline: 'Jeden panel pro všechno, co vám zákazníci napíší.',
    subheadline: 'Telefon, email, chat, SMS, WhatsApp a Messenger — v jednom okně, jednou historií, jedním smart routingem. Bez přeskakování mezi aplikacemi.',
    primaryCta: {
      label: 'Domluvit ukázku',
      href: '/poptavka?source=product_cc',
      trackingId: 'cta_product_cc_hero',
    },
    secondaryCta: {
      label: 'Zobrazit cenu',
      href: '/cenik#contact-center',
      trackingId: 'cta_product_cc_pricing',
    },
    heroVisual: {
      type: 'screenshot',
      src: '/product/cc-omnichannel-hero.png', // TODO
      alt: 'Omnichannel Agent Panel zobrazující aktivní telefonní hovor vedle vlákna WhatsApp a historie zákazníka',
    },
  },

  painPoints: {
    eyebrow: 'CO TO ŘEŠÍ',
    headline: 'Tři vzorce, které vám kradou čas každý den.',
    items: [
      {
        pain: 'Zákazník píše na email, pak volá, pak na WhatsApp — pokaždé začíná znovu.',
        resolution: 'Sjednocená historie napříč kanály. Agent vidí celý příběh zákazníka bez ohledu na to, kudy zrovna přichází.',
      },
      {
        pain: 'Nováčkové agenti nestíhají směrování hovorů a přehazují zákazníky zbytečně.',
        resolution: 'Smart routing rozhoduje automaticky — podle dovedností agenta, jazyka, historie zákazníka, nebo CRM dat.',
      },
      {
        pain: 'Odchozí kampaně jsou v Excelu, kvóty v jiném nástroji, přepis hovorů nikde.',
        resolution: 'Prediktivní dialer, kampaňová dashboard a automatický přepis hovorů v jedné aplikaci. Import kampaní z XLSX.',
      },
    ],
  },

  features: {
    eyebrow: 'CO V TOM JE',
    headline: 'Funkce, které skutečně používáte.',
    subheadline: 'Žádné "enterprise features" schovaná v menu. Všechno, co zmíníme, najdete za dva kliky.',
    items: [
      {
        title: 'Omnichannel Agent Panel',
        description: 'Jedno okno pro hovory, emaily, chaty, SMS, WhatsApp a sociální sítě. Zákaznická historie a skript napravo, kontextové akce nahoře.',
        screenshot: '/product/cc-agent-panel.png', // TODO
        icon: 'Monitor',
        bullets: [
          'WebRTC dialer — volání z prohlížeče, bez instalace',
          'Kontextové skripty a knowledge base',
          'Auto-wrap up a kategorizace hovoru',
        ],
      },
      {
        title: 'Smart routing',
        description: 'Skill-based a data-driven routing. Zákazník podle CRM hodnoty, jazyka, nebo historie interakcí se dostane ke správnému agentovi napoprvé.',
        screenshot: '/product/cc-routing.png', // TODO
        icon: 'GitBranch',
        bullets: [
          'Skill-based — dovednosti agenta',
          'Data-driven — integrace s CRM hodnotami',
          'Priority queueing a callback pro dlouhé fronty',
        ],
      },
      {
        title: 'Supervizor Panel',
        description: '360° pohled na kontaktní centrum. Real-time monitoring front, náslech hovorů, koučování agentů přes whisper mode.',
        screenshot: '/product/cc-supervisor.png', // TODO
        icon: 'Eye',
        bullets: [
          'Real-time dashboard výkonu',
          'Whisper, barge-in a náslech',
          'Alerty na překročení KPI',
        ],
      },
      {
        title: 'Odchozí kampaně',
        description: 'Prediktivní, progresivní a proaktivní dialery pro retention a sales kampaně. Import kontaktů z XLSX, segmentace, reporting.',
        screenshot: '/product/cc-campaigns.png', // TODO
        icon: 'Megaphone',
        bullets: [
          'Prediktivní dialer s answer detection',
          'Import kampaní z XLSX / CRM',
          'Reporting výsledků per agent / kampaň',
        ],
      },
      {
        title: 'Nahrávání a QA',
        description: 'Každý hovor se dá nahrát, přepsat a ohodnotit. Kritéria QA pro tým, export pro audit, šifrování at rest.',
        screenshot: '/product/cc-recording.png', // TODO
        icon: 'Mic',
        bullets: [
          'Automatický přepis v češtině',
          'QA scorecards a koučovací kategorie',
          'Šifrované nahrávky, GDPR compliant',
        ],
      },
    ],
  },

  technicalSpecs: {
    eyebrow: 'TECHNICKÉ PARAMETRY',
    headline: 'Pro váš IT tým.',
    specs: [
      {
        category: 'Nasazení',
        items: [
          { label: 'Model', value: 'SaaS cloud, on-premise, hybrid' },
          { label: 'Lokalita dat', value: 'Praha + EU' },
          { label: 'Uptime SLA', value: '99,95 %' }, // TODO: ověřit
          { label: 'Backup RPO / RTO', value: '1 h / 4 h' }, // TODO: ověřit
        ],
      },
      {
        category: 'Integrace',
        items: [
          { label: 'Protokoly', value: 'SIP, CSTA, WebRTC, REST API' },
          { label: 'Přímé integrace', value: 'MS Teams, Salesforce, HubSpot, Dynamics, Pipedrive' }, // TODO: ověřit
          { label: 'Webhooks', value: 'Příchozí hovor, konec hovoru, nová interakce' },
          { label: 'Import kontaktů', value: 'XLSX, CSV, REST API' },
        ],
      },
      {
        category: 'Škálovatelnost',
        items: [
          { label: 'Minimum agentů', value: '5' },
          { label: 'Maximum agentů', value: '500+' },
          { label: 'Počet kanálů', value: 'Neomezeně' },
          { label: 'Jazyky agentů', value: 'Čeština, slovenština, angličtina, další na vyžádání' },
        ],
      },
      {
        category: 'Bezpečnost',
        items: [
          { label: 'Šifrování', value: 'TLS 1.3 in transit, AES-256 at rest' },
          { label: 'Autentizace', value: 'SSO (SAML, OIDC), 2FA' },
          { label: 'Compliance', value: 'GDPR, ISO 27001' }, // TODO: ověřit certifikace
          { label: 'Audit log', value: 'Kompletní, retence dle zákazníka' },
        ],
      },
    ],
  },

  // Case study — až bude reálná
  caseStudySnippet: undefined, // TODO

  relatedProducts: {
    headline: 'Doplňte CC dalšími úrovněmi',
    items: [
      {
        name: 'AI Voicebot & Chatbot',
        description: 'Automatizujte ověření identity, rezervace a rutinní FAQ. Voicebot a chatbot napojené na ChatGPT a vaše data.',
        href: '/produkt/ai-voicebot',
        icon: 'Sparkles',
      },
      {
        name: 'Volání',
        description: 'Pokud zatím nepotřebujete omnichannel, začněte s Voláním. Kdykoli později přejdete na plné CC.',
        href: '/produkt/volani',
        icon: 'Phone',
      },
    ],
  },

  pricingReference: {
    priceFrom: 'Od 890 Kč / agent / měsíc', // TODO: ověřit cenu
    ctaLabel: 'Zobrazit detail ceny',
    ctaHref: '/cenik#contact-center',
  },
};
