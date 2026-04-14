/**
 * BC4Cloud — Produkt: Kontaktní centrum (CS)
 *
 * Tone inspirovaný analýzou Freelo.io — konkrétní výsledky, přátelský
 * český tón, žádné "enterprise solutions" a "leverage synergies".
 */

import type { ProductContent } from '../types';

export const productContactCenter: ProductContent = {
  seo: {
    title: 'Kontaktní centrum v cloudu | BC4Cloud',
    description: 'Omnichannel kontaktní centrum: telefon, email, chat, SMS, WhatsApp v jednom okně. Smart routing, kampaně, AI shrnutí hovoru. Česká podpora.',
    ogImage: '/og/product-cc.png',
  },

  hero: {
    eyebrow: 'KONTAKTNÍ CENTRUM',
    headline: 'Jedno okno pro všechno, co vám zákazníci napíší.',
    subheadline: 'Telefon, email, chat, SMS, WhatsApp a Messenger. Jedna historie, jeden smart routing, jedna aplikace. Agent nepřeskakuje mezi pěti okny a zákazník neříká poprvé to samé.',
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
      src: '/product/cc-omnichannel-hero.png',
      alt: 'Omnichannel Agent Panel — aktivní hovor vedle vlákna WhatsApp a historie zákazníka',
    },
  },

  painPoints: {
    eyebrow: 'CO TO ŘEŠÍ',
    headline: 'Tři vzorce, co vám kradou čas každý den.',
    items: [
      {
        pain: 'Zákazník napíše na email, pak zavolá, pak zase na WhatsApp. Pokaždé začíná od začátku.',
        resolution: 'Sjednocená historie napříč všemi kanály. Agent vidí, že paní Nováková už včera psala, i když dnes volá — a přesně ví, co řešila.',
      },
      {
        pain: 'Nováček neví, kam hovor přepojit. Zákazníka přehodí třikrát, pak mu zavěsí na obličej.',
        resolution: 'Smart routing rozhodne sám — podle dovedností agenta, jazyka zákazníka, historie nebo dat z CRM. Nováček jen zvedá telefon.',
      },
      {
        pain: 'Odchozí kampaně jsou v Excelu, kvóty ve třetím nástroji, přepis hovoru nikde. A výsledky se ztrácejí mezi sešity.',
        resolution: 'Prediktivní dialer, dashboard kampaní a auto-shrnutí hovoru v jedné aplikaci. Import kontaktů z XLSX, výsledky v reálném čase.',
      },
    ],
  },

  features: {
    eyebrow: 'CO V TOM JE',
    headline: 'Funkce, co skutečně používáte.',
    subheadline: 'Žádné pomlácené "enterprise features" schované pod třemi menu. Všechno, co zmíníme, najdete za dva kliky.',
    items: [
      {
        title: 'Omnichannel Agent Panel',
        description: 'Jedno okno pro hovory, emaily, chaty, SMS, WhatsApp i sociální sítě. Zákaznická historie a skript napravo, kontextové akce nahoře, nic se nezavírá.',
        screenshot: '/product/cc-agent-panel.png',
        icon: 'Monitor',
        bullets: [
          'WebRTC dialer — volání z prohlížeče, bez instalace',
          'Kontextové skripty a knowledge base jedním klikem',
          'Auto-wrap up a kategorizace hovoru po zavěšení',
        ],
      },
      {
        title: 'Smart routing',
        description: 'Skill-based i data-driven. Zákazník s vysokou hodnotou se dostane na seniora, německy mluvící zákazník k německy mluvícímu agentovi, nový zákazník na onboarding tým.',
        screenshot: '/product/cc-routing.png',
        icon: 'GitBranch',
        bullets: [
          'Skill-based — dovednosti agenta dají pořadí',
          'Data-driven — propojení s CRM hodnotami',
          'Priority queueing a callback pro dlouhé fronty',
        ],
      },
      {
        title: 'Supervizor Panel',
        description: '360° pohled na celé centrum. Real-time monitoring front, whisper mode pro koučování nováčků, alerty když něco jde mimo KPI.',
        screenshot: '/product/cc-supervisor.png',
        icon: 'Eye',
        bullets: [
          'Dashboard výkonu per agent a per fronta',
          'Whisper, barge-in a tichý náslech hovoru',
          'Alerty na překročení průměrného času',
        ],
      },
      {
        title: 'Odchozí kampaně',
        description: 'Prediktivní, progresivní a proaktivní dialery pro retention i sales. Import z XLSX nebo přes API, segmentace, reporting po směnách.',
        screenshot: '/product/cc-campaigns.png',
        icon: 'Megaphone',
        bullets: [
          'Prediktivní dialer s answer detection',
          'Import kampaní z XLSX / CRM',
          'Reporting výsledků per agent a per kampaň',
        ],
      },
      {
        title: 'Nahrávání a QA',
        description: 'Každý hovor se dá nahrát, přepsat a ohodnotit. Scorecards pro tým, export pro audit, šifrování at rest i při přenosu.',
        screenshot: '/product/cc-recording.png',
        icon: 'Mic',
        bullets: [
          'Automatický přepis v češtině i angličtině',
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
          { label: 'Model', value: 'SaaS cloud, on-premise nebo hybrid' },
          { label: 'Lokalita dat', value: 'Praha + EU' },
          { label: 'Uptime SLA', value: '99,95 %' },
          { label: 'Backup RPO / RTO', value: '1 h / 4 h' },
        ],
      },
      {
        category: 'Integrace',
        items: [
          { label: 'Protokoly', value: 'SIP, CSTA, WebRTC, REST API' },
          { label: 'Přímé integrace', value: 'MS Teams, Salesforce, HubSpot, Dynamics, Pipedrive' },
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
          { label: 'Šifrování', value: 'TLS 1.3 při přenosu, AES-256 at rest' },
          { label: 'Autentizace', value: 'SSO (SAML, OIDC), dvoufaktorová' },
          { label: 'Compliance', value: 'GDPR, ISO 27001' },
          { label: 'Audit log', value: 'Kompletní, s retencí podle zákazníka' },
        ],
      },
    ],
  },

  caseStudySnippet: undefined,

  relatedProducts: {
    headline: 'Doplňte CC dalšími úrovněmi',
    items: [
      {
        name: 'AI Voicebot & Chatbot',
        description: 'Automatizujte ověření identity, rezervace a rutinní dotazy. Voicebot a chatbot napojené na ChatGPT a vaše vlastní data.',
        href: '/produkt/ai-voicebot',
        icon: 'Sparkles',
      },
      {
        name: 'Volání',
        description: 'Pokud omnichannel zatím nepotřebujete, začněte s Voláním. Kdykoli později přejdete na plné CC bez re-kontraktace.',
        href: '/produkt/volani',
        icon: 'Phone',
      },
    ],
  },

  pricingReference: {
    priceFrom: 'Od 890 Kč / agent / měsíc',
    ctaLabel: 'Zobrazit detail ceny',
    ctaHref: '/cenik#contact-center',
  },
};
