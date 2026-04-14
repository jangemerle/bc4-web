/**
 * BC4Cloud — Produkt: Volání (CS)
 *
 * Vstupní produkt — náhrada analogové ústředny pro firmy, které zatím
 * nepotřebují plný omnichannel.
 */

import type { ProductContent } from '../types';

export const productCalling: ProductContent = {
  seo: {
    title: 'Cloud ústředna | Volání | BC4Cloud',
    description: 'Cloudová náhrada analogové ústředny. Přehled hovorů, nahrávky, IVR, mobilní aplikace. Rychlé nasazení, žádný hardware.',
    ogImage: '/og/product-calling.png',
  },

  hero: {
    eyebrow: 'VOLÁNÍ',
    headline: 'Ústředna, co nepotřebuje místnost v suterénu.',
    subheadline: 'Cloudová náhrada analogové ústředny. Přehled všech hovorů, nahrávky, IVR, statistiky — všechno z prohlížeče. Agenti volají z počítače nebo mobilu, vy vidíte, co se děje.',
    primaryCta: {
      label: 'Domluvit ukázku',
      href: '/poptavka?source=product_calling',
      trackingId: 'cta_product_calling_hero',
    },
    secondaryCta: {
      label: 'Zobrazit cenu',
      href: '/cenik#calling',
      trackingId: 'cta_product_calling_pricing',
    },
    heroVisual: {
      type: 'screenshot',
      src: '/product/calling-dashboard-hero.png',
      alt: 'Dashboard BC4Cloud Volání — živé hovory, fronty a denní statistiky',
    },
  },

  painPoints: {
    eyebrow: 'PROČ NÁHRADU',
    headline: 'Stará ústředna vám krade víc, než si myslíte.',
    items: [
      {
        pain: 'Stará ústředna dosluhuje a výrobce už nevydává aktualizace. IT stresuje, kdy to spadne natrvalo.',
        resolution: 'Přejděte na cloud za 5 pracovních dnů. Žádný nový hardware, žádná instalace ve vaší serverovně. Portaci čísel si vyřídíme sami.',
      },
      {
        pain: 'Nikdo pořádně neví, kolik hovorů nám skutečně přichází a kolik jich agenti nezvednou. Ptáte se dokola „kolik jsme jich zmeškali?".',
        resolution: 'Kompletní reporting v reálném čase. Každý hovor v CDR, statistiky per agent i per směna, export do XLSX na čtyři kliky.',
      },
      {
        pain: 'Přidat pobočkovou klapku nebo změnit IVR znamená telefonát technikovi a týden čekání.',
        resolution: 'Vizuální editor call flow přímo v administraci. Upravíte IVR, pracovní dobu i skupiny agentů sami. Tím techník ušetří deset hodin měsíčně.',
      },
    ],
  },

  features: {
    eyebrow: 'CO UMÍ',
    headline: 'Všechno, co potřebujete. Nic navíc.',
    items: [
      {
        title: 'Dashboard a reporting',
        description: 'Živý přehled příchozích i odchozích hovorů, čekajících zákazníků, obsazenosti agentů. Reporty po směnách, export do XLSX.',
        screenshot: '/product/calling-dashboard.png',
        icon: 'BarChart3',
      },
      {
        title: 'Nahrávání hovorů',
        description: 'Každý hovor volitelně nahrajeme. Nahrávky šifrované, dostupné přes webovou aplikaci, GDPR compliant.',
        screenshot: '/product/calling-recording.png',
        icon: 'Mic',
      },
      {
        title: 'IVR a call flow',
        description: 'Hlasový průvodce přivítá zákazníka, zjistí, co potřebuje, pošle ho správné skupině. Vizuální editor, žádné skriptování.',
        screenshot: '/product/calling-ivr.png',
        icon: 'GitBranch',
      },
      {
        title: 'Mobilní aplikace',
        description: 'Agenti volají z telefonu jako z firmy — s firemním číslem, v historii hovorů, bez VPN. Android i iOS.',
        screenshot: '/product/calling-mobile.png',
        icon: 'Smartphone',
      },
      {
        title: 'Callback a zmeškané hovory',
        description: 'Když zákazník zavěsí dřív, než agent stihne zvednout, dostane automatický callback jakmile bude fronta volná. Žádné ztracené hovory.',
        screenshot: '/product/calling-callback.png',
        icon: 'PhoneOutgoing',
      },
    ],
  },

  technicalSpecs: {
    eyebrow: 'TECHNICKÉ PARAMETRY',
    headline: 'Pro IT oddělení.',
    specs: [
      {
        category: 'Nasazení',
        items: [
          { label: 'Čas do spuštění', value: '3–5 pracovních dnů' },
          { label: 'Hardware', value: 'Žádný — volání z prohlížeče nebo mobilu' },
          { label: 'Portace čísel', value: 'Ano, od všech českých operátorů' },
          { label: 'SIP telefony', value: 'Podporujeme Htek a další přes SIP/IP' },
        ],
      },
      {
        category: 'Funkce',
        items: [
          { label: 'Příchozí fronty', value: 'Neomezeně' },
          { label: 'IVR úrovní', value: 'Neomezeně' },
          { label: 'Záznam hovorů', value: 'Volitelně, šifrovaně' },
          { label: 'Pracovní doba', value: 'Per skupina, per den, svátky' },
        ],
      },
    ],
  },

  caseStudySnippet: undefined,

  relatedProducts: {
    headline: 'Až vyrostete, máme pro vás plné CC',
    items: [
      {
        name: 'Kontaktní centrum',
        description: 'Omnichannel — email, chat, SMS, WhatsApp vedle hovorů. Smart routing, kampaně, QA scorecards.',
        href: '/produkt/kontaktni-centrum',
        icon: 'MessagesSquare',
      },
    ],
  },

  pricingReference: {
    priceFrom: 'Od 490 Kč / agent / měsíc',
    ctaLabel: 'Zobrazit detail ceny',
    ctaHref: '/cenik#calling',
  },
};
