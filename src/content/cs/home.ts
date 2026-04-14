/**
 * BC4Cloud — Homepage (CS)
 *
 * Skeleton homepage content. Draft copy vychází z projektové dokumentace
 * (`bc4-web/bc4cloud-web-dokumentace.html`), briefu od kolegy
 * (`docs/bc4-web/references/colleague-brief.md`) a brand tone z `strategy.md`.
 *
 * ⚠️ Tato verze je PRVNÍ DRAFT. Před deployem všechno validovat:
 *   - Čísla ověřit s BusinessComem (otevřené otázky v strategy.md § 10)
 *   - Citace referencí nahradit reálnými (nebo sekci skrýt)
 *   - Screenshoty aplikace dodat do public/product/
 *   - Copy sanity test dle knowledge-distilled.md § 5 projít každou sekci
 */

import type { HomeContent } from '../types';

export const home: HomeContent = {
  seo: {
    title: 'BC4Cloud — Kontaktní centrum, které zvládnou i nováčci',
    description: 'Telefony, emaily, chat a WhatsApp v jednom přehledu. České kontaktní centrum z cloudu. Nasazení během dnů, ne měsíců.',
    ogImage: '/og/home.png', // TODO: vyrobit
  },

  hero: {
    // Test specifičnosti — TODO: iterovat tento headline s Janem
    headline: 'Sjednoťte hovory, emaily a chaty do jednoho přehledu.',
    subheadline: 'BC4Cloud je české kontaktní centrum z cloudu. Volání, omnichannel komunikace, AI automatizace — vše, co váš tým skutečně využije. Bez překvapení v ceně, bez ústředny v podkroví.',
    primaryCta: {
      label: 'Domluvit ukázku',
      href: '/poptavka?source=home_hero',
      trackingId: 'cta_hero_primary',
    },
    secondaryCta: {
      label: 'Jak to funguje',
      href: '#how-it-works',
      trackingId: 'cta_hero_secondary',
    },
    heroVisual: {
      type: 'screenshot',
      src: '/product/agent-panel-hero.png', // TODO: dodat screenshot
      alt: 'Agent panel BC4Cloud — přehled aktivního hovoru, historie zákazníka a dostupné akce v jednom okně',
    },
  },

  trustBand: {
    label: 'DŮVĚŘUJÍ NÁM',
    logos: [
      // TODO: nahradit reálnými logy klientů s povolením
      { name: 'Placeholder 1', src: '/logos/clients/placeholder-1.svg', alt: 'Klient 1' },
      { name: 'Placeholder 2', src: '/logos/clients/placeholder-2.svg', alt: 'Klient 2' },
      { name: 'Placeholder 3', src: '/logos/clients/placeholder-3.svg', alt: 'Klient 3' },
      { name: 'Placeholder 4', src: '/logos/clients/placeholder-4.svg', alt: 'Klient 4' },
      { name: 'Placeholder 5', src: '/logos/clients/placeholder-5.svg', alt: 'Klient 5' },
    ],
  },

  benefits: {
    eyebrow: 'CO VÁM BC4CLOUD PŘINESE',
    headline: 'Tři věci, které vás přestanou bolet za první měsíc.',
    items: [
      {
        title: 'Méně ztracených hovorů',
        description: 'Callback fronta zavolá zpět zákazníkům, kterým by jinak spadla trpělivost. Typicky 12–25 % hovorů, co byste jinak nechytili.', // TODO: ověřit čísla z interních dat
        icon: 'PhoneIncoming',
      },
      {
        title: 'Kratší čekání ve frontě',
        description: 'IVR a skill-based routing pošlou zákazníka rovnou ke správnému agentovi. Průměrné čekání klesá z minut na sekundy.',
        icon: 'Timer',
      },
      {
        title: 'Přehled o každém hovoru',
        description: 'Agent vidí historii zákazníka v okamžiku přijetí. Žádné "počkejte, prověřím to" — odpověď je v okně před ním.',
        icon: 'Users',
      },
    ],
  },

  productShowcase: {
    eyebrow: 'TAKHLE TO VYPADÁ V PRAXI',
    headline: 'Jedno okno pro všechny kanály.',
    subheadline: 'Agent Panel sjednocuje hovory, chaty, emaily a WhatsApp. Zákaznická historie, skript a akční tlačítka vedle sebe — nic se neschovává.',
    screenshot: {
      src: '/product/agent-panel-annotated.png', // TODO: dodat anotovaný screenshot
      alt: 'Anotovaný screenshot Agent Panelu BC4Cloud',
      annotations: [
        // TODO: definovat po získání reálného screenshotu
      ],
    },
  },

  howItWorks: {
    eyebrow: 'JAK BC4 FUNGUJE',
    headline: 'Tři úrovně — začněte tam, kde dává smysl.',
    tiers: [
      {
        tier: 1,
        title: 'Volání',
        description: 'Náhrada klasické ústředny. Pro firmy, které chtějí jen přehled o hovorech, nahrávky a IVR.',
        features: [
          'Přehled všech příchozích a odchozích hovorů',
          'Nahrávání hovorů pro kontrolu kvality',
          'IVR — hlasový průvodce s možnostmi',
          'Statistiky výkonu týmu v reálném čase',
        ],
        learnMoreHref: '/produkt/volani',
      },
      {
        tier: 2,
        title: 'Kontaktní centrum',
        description: 'Plnohodnotná omnichannel komunikace. Telefon, email, chat, SMS, WhatsApp — všechno v jednom rozhraní.',
        features: [
          'Smart routing na základě dovedností agenta',
          'Sdílená schránka pro email a chat',
          'WhatsApp Business API + sociální sítě',
          'Proaktivní kampaně a odchozí dialery',
        ],
        learnMoreHref: '/produkt/kontaktni-centrum',
      },
      {
        tier: 3,
        title: 'AI',
        description: 'Voicebot a chatbot pro rutinní dotazy. Speech analytics z každého hovoru. Automatizace toho, co agenti nemusí dělat ručně.',
        features: [
          'Voicebot — ověření identity, rezervace, směrování',
          'Chatbot s napojením na ChatGPT a vlastní data',
          'Automatický přepis a shrnutí hovorů',
          'Sentiment analýza a detekce trendů',
        ],
        learnMoreHref: '/produkt/ai-voicebot',
      },
    ],
  },

  segments: {
    eyebrow: 'PRO JAKÉ FIRMY',
    headline: 'Kde BC4Cloud dává nejvíc smyslu.',
    items: [
      {
        name: 'E-shopy',
        tagline: 'Peak season bez navýšení agentů. Callback z chyby košíku.',
        icon: 'ShoppingCart',
      },
      {
        name: 'Servisní firmy',
        tagline: 'Hovor z terénu přes WebRTC s historií zákazníka v jednom okně.',
        icon: 'Wrench',
      },
      {
        name: 'Banky a finance',
        tagline: 'Audit trail na každý hovor, šifrovaná nahrávka, PCI/GDPR compliant.',
        icon: 'ShieldCheck',
      },
      {
        name: 'Telekomunikační operátoři',
        tagline: 'Prediktivní dialer pro retention kampaně. Statistiky ke směně.',
        icon: 'Antenna',
      },
    ],
  },

  // Case study highlight — skryjeme v renderu dokud nemáme reálnou referenci
  caseStudyHighlight: undefined, // TODO: naplnit po získání reference

  inlineLeadForm: {
    eyebrow: 'DOMLUVIT UKÁZKU',
    headline: 'Zjistěte, jak to funguje u vás.',
    subheadline: 'Vyplňte 4 pole. Ozveme se obvykle do několika minut v pracovní době.',
  },

  whyUs: {
    eyebrow: 'PROČ SPOLUPRACOVAT S NÁMI',
    headline: 'BusinessCom — 20+ let zkušeností s českou telekomunikací.',
    reasons: [
      {
        title: 'Česká podpora, ne ticketingový orchestr',
        description: 'Zavoláte a mluvíte s člověkem, který vaše CC zná. Bez překladu do angličtiny, bez fronty do Manily.',
        icon: 'Headphones',
      },
      {
        title: 'Data v EU, podle GDPR',
        description: 'Vaše nahrávky a osobní údaje neopouštějí Evropu. Jsme připravení na DPA a interní audity.',
        icon: 'MapPin',
      },
      {
        title: 'Rostete s námi',
        description: 'Od 5 agentů po 500. Přejdete z Volání na plný omnichannel v pár kliknutích, bez re-kontraktace.',
        icon: 'TrendingUp',
      },
      {
        title: '20+ let v telekomunikacích', // TODO: ověřit přesné číslo
        description: 'BusinessCom provozuje telekomunikační služby od roku XXXX. BC4Cloud je pokračováním desítek implementací pro české firmy.', // TODO: ověřit přesná data
        icon: 'Clock',
      },
    ],
  },

  faq: {
    eyebrow: 'ČASTÉ OTÁZKY',
    headline: 'Co se často ptají.',
    items: [
      {
        question: 'Jak rychle BC4Cloud nasadíme?',
        answer: 'Základní Volání typicky 3–5 pracovních dnů od podpisu. Plné Kontaktní centrum s integracemi na CRM 2–4 týdny. AI moduly přidáváme nezávisle, kdykoli později.',
      },
      {
        question: 'Potřebujeme vlastní IT tým na nasazení?',
        answer: 'Ne. BC4Cloud běží v cloudu. Agenti se přihlásí přes prohlížeč nebo naši aplikaci. Potřebujete jen stabilní internet a headset.',
      },
      {
        question: 'Kolik to stojí?',
        answer: 'Fakturujeme per agent za měsíc. Konkrétní ceny najdete na [Ceníku](/cenik). Minimum je 5 agentů. Nabídku pro váš case spočítáme do 1 pracovního dne od poptávky.',
      },
      {
        question: 'Integrujete se s naším CRM?',
        answer: 'Ano. Máme otevřené REST API a webhooks pro příchozí hovory, click-to-call a zápis interakcí. Přímá integrace je hotová pro MS Dynamics, Salesforce, HubSpot, Pipedrive. Další CRM přes API obvykle 2–5 dnů implementace.',
      },
      {
        question: 'Co když rosteme? Nejsme zamčení?',
        answer: 'Začnete na 5 agentech, přidáváte klikem. Přejdete z Volání na plné Kontaktní centrum bez re-kontraktace. Smlouva má výpovědní lhůtu 3 měsíce, žádné lock-in roky.',
      },
      {
        question: 'Kde jsou naše data?',
        answer: 'V datových centrech v Praze a Evropě. Nikdy mimo EU. Nahrávky jsou šifrované at rest i in transit. Jsme GDPR compliant a dodáme vám DPA k podpisu.',
      },
    ],
  },
};
