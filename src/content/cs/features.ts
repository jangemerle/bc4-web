/**
 * BC4Cloud — Stránka Funkce (CS)
 *
 * Detailní přehled jednotlivých částí aplikace, inspirováno strukturou
 * bronet.cz/cs/bc4-call-centrum/. Hlubší než homepage FeatureShowcase —
 * pokrývá Agent Panel, Karta hovoru, Panel Front, Callback, Statistiky,
 * Supervizor, CDR, Reporty, Wallboard, Mobile Client, AI Voicebot.
 */

import type { ProductContent } from '../types';

export const features: ProductContent = {
  seo: {
    title: 'Funkce | BC4Cloud',
    description: 'Detailní přehled funkcí BC4Cloud — Agent Panel, smart routing, supervizor panel, wallboard, mobilní aplikace, AI voicebot a další.',
    ogImage: '/og/features.png',
  },

  hero: {
    eyebrow: 'FUNKCE APLIKACE',
    headline: 'Co najdete v BC4Cloud.',
    subheadline: 'Modulární kontaktní centrum, kde si zapnete jen to, co opravdu používáte. Tady je přehled hlavních částí aplikace, jak je vidí váš agent, supervizor i administrátor.',
    primaryCta: {
      label: 'Domluvit ukázku',
      href: '/poptavka?source=features_hero',
      trackingId: 'cta_features_hero',
    },
    secondaryCta: {
      label: 'Zobrazit cenu',
      href: '/cenik',
      trackingId: 'cta_features_pricing',
    },
    heroVisual: {
      type: 'screenshot',
      src: '/product/bronet/Agent Panel 1.png',
      alt: 'BC4 Agent Panel — fronty, příchozí hovor a historie front',
    },
  },

  painPoints: {
    eyebrow: 'JAK TO POSKLÁDÁTE',
    headline: 'Začnete s Voláním. Doplníte podle potřeby.',
    items: [
      {
        pain: 'Nechcete platit za funkce, které nikdo nepoužívá.',
        resolution: 'Volání je vstupní úroveň — náhrada ústředny. Kontaktní centrum a AI přidáte, až je opravdu potřebujete.',
      },
      {
        pain: 'Někdo potřebuje desktop, jiný mobil, recepce zase něco jiného.',
        resolution: 'Agent Panel, Mobile Client, Office Panel a Wallboard — různé moduly pro různé role. V ceně tarifu.',
      },
      {
        pain: 'Změny v produktu vyžadují technika a týdenní čekání.',
        resolution: 'Většinu nastavení (fronty, IVR, agentské pauzy, kategorie hovorů) si měníte sami v centrální administraci.',
      },
    ],
  },

  features: {
    eyebrow: 'PŘEHLED MODULŮ',
    headline: 'Hlavní části aplikace.',
    subheadline: 'Modulární stavebnice — všechny moduly v ceně tarifu Kontaktní centrum, mnohé i v základním Volání.',
    items: [
      {
        title: 'Agent Panel',
        description: 'Modul pro obsluhu příchozích i odchozích hovorů, emailů, chatů a zpráv. Hovory přes WebRTC z prohlížeče nebo přes CTI ovládání pevného telefonu.',
        screenshot: '/product/bronet/Agent Panel 1.png',
        icon: 'Monitor',
        bullets: [
          'WebRTC dialer — volání bez instalace',
          'Omnichannel inbox: email, chat, SMS, WhatsApp, Messenger',
          'Karta zákazníka s daty z CRM/ERP',
        ],
      },
      {
        title: 'Karta hovoru',
        description: 'Detail aktivního i historického hovoru. Agent zapíše poznámku, vybere hlavní kategorii a podkategorii, vidí historii volajícího a souvislosti z CRM.',
        screenshot: '/product/bronet/imgBCCP-small-6.fa9b9904_3840.webp',
        icon: 'FileText',
        bullets: [
          'Poznámky k hovoru přímo z agentského panelu',
          'Hierarchická kategorizace pro reporting',
          'Historie volajícího + RealTask integrace',
        ],
      },
      {
        title: 'Panel front',
        description: 'Agent se jedním klikem přihlašuje a odhlašuje z front podle svých dovedností. Pauzy s typem (oběd, školení, administrativa) systém respektuje při směrování.',
        screenshot: '/product/bronet/imgBCCP-small-5.4295f61b_3840.webp',
        icon: 'Users',
        bullets: [
          'Skill-based přihlášení do front',
          'Kategorizované pauzy',
          'Real-time stav fronty per skupina',
        ],
      },
      {
        title: 'Callback',
        description: 'Zmeškané hovory a vyžádaná zpětná volání s možností přímého vytočení a označení jako vyřízené. Agent ani zákazník nepřijde o hovor.',
        screenshot: '/product/bronet/imgBCCP-small-8.16ab9de4_3840.webp',
        icon: 'PhoneOutgoing',
        bullets: [
          'Automatický callback při zaplněné frontě',
          'Manual callback ze záznamu zmeškaných',
          'Status vyřízení a počet pokusů',
        ],
      },
      {
        title: 'Osobní statistiky',
        description: 'Agent vidí svůj denní výkon — kolik hovorů přijal, kolik odbavil, jak dlouho byl ve frontě. Bez čekání na pondělní reporting.',
        screenshot: '/product/bronet/imgBCCP-small-9.6872f063_3840.webp',
        icon: 'BarChart3',
        bullets: [
          'Denní souhrn agenta v aplikaci',
          'Pie chart obsazení (hovor / pauza / volný)',
          'Souhrn pauz s typy',
        ],
      },
      {
        title: 'Supervizor Panel',
        description: 'Vedoucí KC vidí v reálném čase celé centrum — KPI, fronty, agenty, kampaně. Tichý příposlech ongoing hovorů a okamžité akce.',
        screenshot: '/product/bronet/imgBCCP-full-3.d9e80df0_3840.webp',
        icon: 'Eye',
        bullets: [
          'KPI nahoře: celkem, dovolané, nedovolané, service level',
          'Tichý příposlech aktivních hovorů',
          'Filtrování podle stavu (aktivní, čekající, agenti, fronty)',
        ],
      },
      {
        title: 'CDR — Call Detail Records',
        description: 'Kompletní seznam všech hovorů na ústředně podle práv uživatele. Filtrování, hledání, export.',
        screenshot: '/product/bronet/imgBCCP-full-4.2c8a597b_3840.webp',
        icon: 'List',
        bullets: [
          'Detailní záznam každého hovoru',
          'Přístup podle uživatelských práv',
          'Export do XLSX',
        ],
      },
      {
        title: 'Reporty',
        description: 'Výkonnostní reporty agentů, front a kampaní. Připravené pohledy plus měsíční report pro vedení.',
        screenshot: '/product/bronet/imgBCCP-full-5.844b210b_3840.webp',
        icon: 'TrendingUp',
        bullets: [
          'Report agentů, front, odchozích kampaní',
          'Měsíční reporty pro vedení',
          'Export a sdílení',
        ],
      },
      {
        title: 'Wallboard',
        description: 'Real-time dashboard pro velkou TV v open-space. Tým vidí stav front, callbacků, čekajících i obsloužených hovorů.',
        screenshot: '/product/bronet/imgBCCP-full-6.483bfb5b_3840.webp',
        icon: 'Tv',
        bullets: [
          'Optimalizováno pro nástěnnou TV',
          'Real-time čísla a metriky',
          'Konfigurovatelné widgety per tým',
        ],
      },
      {
        title: 'Mobilní aplikace',
        description: 'Nativní Android a iOS aplikace pro snadnou obsluhu mimo kancelář. Stejný workflow jako desktop — fronty, callback, transfer, kontakty.',
        screenshot: '/product/bronet/imgBCCP-full-7.6f750b38_3840.webp',
        icon: 'Smartphone',
        bullets: [
          'Android + iOS aplikace',
          'VPN-less díky integrovanému SBC',
          'Stejné funkce jako desktop Agent Panel',
        ],
      },
      {
        title: 'AI Voicebot s ChatGPT',
        description: 'Konverzační AI napojená na ChatGPT a vaše vlastní data. Vyřídí rutinní dotazy 24/7. Když nestačí, předá hovor agentovi s kontextem.',
        screenshot: '/product/bronet/imgBCCP-small-4.05c00ce2_3840.webp',
        icon: 'Sparkles',
        bullets: [
          'Voicebot a chatbot s napojením na ChatGPT',
          'Trénink na vaší knowledge base a FAQ',
          'ASR přepis a sentiment analýza každého hovoru',
        ],
      },
      {
        title: 'Administrace',
        description: 'Centrální web administrace pro nastavení celého systému. Fronty, IVR call flow, time conditions, uživatelské role, lines a trunky.',
        screenshot: '/product/bronet/imgBCCP-full-8.bff84ca9_3840.webp',
        icon: 'Settings',
        bullets: [
          'Vizuální call flow editor',
          'Granulární uživatelská práva',
          'Multi-tenant administrace',
        ],
      },
    ],
  },

  caseStudySnippet: undefined,

  relatedProducts: {
    headline: 'Začněte na úrovni, která vám sedí',
    items: [
      {
        name: 'Volání',
        description: 'Vstupní úroveň. Náhrada ústředny — přehled hovorů, IVR, nahrávky, mobilní aplikace.',
        href: '/produkt/volani',
        icon: 'Phone',
      },
      {
        name: 'Kontaktní centrum',
        description: 'Plný omnichannel — email, chat, SMS, WhatsApp, Messenger. Smart routing, kampaně, QA.',
        href: '/produkt/kontaktni-centrum',
        icon: 'MessagesSquare',
      },
      {
        name: 'AI Voicebot',
        description: 'Voicebot a chatbot s ChatGPT. Speech analytics, sentiment, automatický přepis.',
        href: '/produkt/ai-voicebot',
        icon: 'Sparkles',
      },
    ],
  },

  pricingReference: {
    priceFrom: 'Od 490 Kč / agent / měsíc',
    ctaLabel: 'Zobrazit detail ceny',
    ctaHref: '/cenik',
  },
};
