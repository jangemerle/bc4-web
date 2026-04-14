/**
 * BC4Cloud — Produkt: Volání (CS)
 *
 * Vstupní produkt — náhrada analogové ústředny. Pro firmy, které zatím nepotřebují plné CC.
 *
 * ⚠️ Draft — screenshoty a reference dodat, čísla ověřit.
 */

import type { ProductContent } from '../types';

export const productCalling: ProductContent = {
  seo: {
    title: 'Cloud ústředna | Volání | BC4Cloud',
    description: 'Cloudová náhrada klasické ústředny. Přehled hovorů, nahrávky, IVR, mobilní aplikace. Rychlé nasazení, žádný hardware.',
    ogImage: '/og/product-calling.png', // TODO
  },

  hero: {
    eyebrow: 'VOLÁNÍ',
    headline: 'Ústředna, která nepotřebuje místnost v suterénu.',
    subheadline: 'Cloudová náhrada analogové ústředny. Přehled všech hovorů, nahrávky, IVR, statistiky výkonu — všechno přes prohlížeč. Agenti volají z počítače nebo mobilu, vy vidíte, co se děje.',
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
      src: '/product/calling-dashboard-hero.png', // TODO
      alt: 'Dashboard BC4Cloud Volání zobrazující živé hovory, fronty a denní statistiky',
    },
  },

  painPoints: {
    eyebrow: 'PROČ NÁHRADU',
    headline: 'Stará ústředna vám krade víc než si myslíte.',
    items: [
      {
        pain: 'Stará ústředna dožívá a výrobce přestal vydávat aktualizace.',
        resolution: 'Přejděte na cloud během 3–5 pracovních dnů. Žádný nový hardware, žádná instalace u vás ve firmě.',
      },
      {
        pain: 'Nikdo neví, kolik hovorů nám skutečně volá a kolik jich agenti nezvednou.',
        resolution: 'Kompletní reporting v reálném čase. Každý hovor v CDR, statistiky per agent i per směnu.',
      },
      {
        pain: 'IVR a přepojení musí nastavovat IT technik přes příkazovou řádku.',
        resolution: 'Vizuální editor call flow. Upravíte IVR, pracovní dobu, skupiny agentů sami přes prohlížeč.',
      },
    ],
  },

  features: {
    eyebrow: 'CO UMÍ',
    headline: 'Všechno, co potřebujete, nic navíc.',
    items: [
      {
        title: 'Dashboard a reporting',
        description: 'Živý přehled příchozích a odchozích hovorů, čekajících zákazníků, obsazenosti agentů. Reporty per směnu, export do XLSX.',
        screenshot: '/product/calling-dashboard.png', // TODO
        icon: 'BarChart3',
      },
      {
        title: 'Nahrávání hovorů',
        description: 'Každý hovor volitelně nahrajeme. Nahrávky jsou šifrované, dostupné přes webovou aplikaci, GDPR compliant.',
        screenshot: '/product/calling-recording.png', // TODO
        icon: 'Mic',
      },
      {
        title: 'IVR a call flow',
        description: 'Hlasový průvodce přivítá zákazníka, zjistí, co potřebuje, a pošle ho správnému týmu. Vizuální editor bez programování.',
        screenshot: '/product/calling-ivr.png', // TODO
        icon: 'GitBranch',
      },
      {
        title: 'Mobilní aplikace',
        description: 'Agenti volají z telefonu jako z firmy — s firemním číslem, v historii hovorů, bez VPN. Android i iOS.',
        screenshot: '/product/calling-mobile.png', // TODO
        icon: 'Smartphone',
      },
      {
        title: 'Callback a zmeškaná volání',
        description: 'Když zákazník zavěsí, dostane automatický callback jakmile je agent volný. Žádné ztracené hovory.',
        screenshot: '/product/calling-callback.png', // TODO
        icon: 'PhoneOutgoing',
      },
    ],
  },

  technicalSpecs: {
    eyebrow: 'TECHNICKÉ PARAMETRY',
    headline: 'Pro IT oddělení a malé firmy.',
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

  caseStudySnippet: undefined, // TODO

  relatedProducts: {
    headline: 'Až vyrostete, máme pro vás plné CC',
    items: [
      {
        name: 'Kontaktní centrum',
        description: 'Omnichannel — email, chat, SMS, WhatsApp vedle hovorů. Smart routing, kampaně, QA.',
        href: '/produkt/kontaktni-centrum',
        icon: 'MessagesSquare',
      },
    ],
  },

  pricingReference: {
    priceFrom: 'Od 490 Kč / agent / měsíc', // TODO: ověřit cenu
    ctaLabel: 'Zobrazit detail ceny',
    ctaHref: '/cenik#calling',
  },
};
