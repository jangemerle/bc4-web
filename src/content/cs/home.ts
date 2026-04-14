/**
 * BC4Cloud — Homepage (CS)
 *
 * Tone inspirováno analýzou Freelo.io
 * (docs/bc4-web/references/freelo-tone-analysis.md):
 *   - Konkrétní čísla místo abstraktních benefitů
 *   - Problém → emoce → řešení (ne feature list)
 *   - Neformální vykání, česky bez korporátních frází
 *   - Každé tvrzení má důkaz v dosahu (číslo, screenshot, citace)
 *   - Žádné "revoluční", "moderní", "komplexní" — prázdná slova
 */

import type { HomeContent } from '../types';

export const home: HomeContent = {
  seo: {
    title: 'BC4Cloud — Kontaktní centrum, co šetří hodiny denně',
    description: 'Všechny hovory, emaily, chaty a WhatsApp v jednom okně. Nasadíme do pár dní, bez ústředny v serverovně. Česká podpora.',
    ogImage: '/og/home.png',
  },

  hero: {
    eyebrow: 'KONTAKTNÍ CENTRUM V CLOUDU',
    headline: 'Méně ztracených hovorů, víc spokojených zákazníků.',
    subheadline: 'BC4Cloud sjednocuje telefony, emaily, chat a WhatsApp do jednoho okna. Vaši agenti nepřeskakují mezi aplikacemi, zákazník čeká kratší dobu a vy vidíte, co se děje v reálném čase.',
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
      src: '/product/agent-panel-hero.png',
      alt: 'Agent panel BC4Cloud — aktivní hovor, historie zákazníka a dostupné akce v jednom okně',
    },
  },

  trustBand: {
    label: 'DŮVĚŘUJÍ NÁM',
    logos: [
      { name: 'Placeholder 1', src: '/logos/clients/placeholder-1.svg', alt: 'Klient 1' },
      { name: 'Placeholder 2', src: '/logos/clients/placeholder-2.svg', alt: 'Klient 2' },
      { name: 'Placeholder 3', src: '/logos/clients/placeholder-3.svg', alt: 'Klient 3' },
      { name: 'Placeholder 4', src: '/logos/clients/placeholder-4.svg', alt: 'Klient 4' },
      { name: 'Placeholder 5', src: '/logos/clients/placeholder-5.svg', alt: 'Klient 5' },
    ],
  },

  benefits: {
    eyebrow: 'CO VÁM BC4CLOUD PŘINESE',
    headline: 'Tři bolesti, které vás přestanou budit ve tři ráno.',
    subheadline: 'Konkrétní čísla z reálných nasazení. Žádné "zlepší vám to byznys" — ale taky žádná magie.',
    items: [
      {
        title: 'Hovory vám přestanou utíkat',
        description: 'Callback fronta automaticky zavolá zpět zákazníkům, kterým dojde trpělivost. Naši zákazníci tak zachrání 12 až 25 % hovorů, co by jinak skončily v nikdy-ne.',
        icon: 'PhoneIncoming',
      },
      {
        title: 'Zákazníci nečekají na lince',
        description: 'Skill-based routing pošle hovor rovnou ke správnému agentovi. Průměrné čekání jde z minut na sekundy — a frustrovaný zákazník neběží ke konkurenci.',
        icon: 'Timer',
      },
      {
        title: 'Agent ví, s kým mluví',
        description: 'Historie zákazníka naskočí v okamžiku přijetí hovoru. Žádné „počkejte, prověřím to v ERPku" — odpověď leží před agentem, než stihne říct dobrý den.',
        icon: 'Users',
      },
    ],
  },

  productShowcase: {
    eyebrow: 'TAKHLE TO VYPADÁ V PRAXI',
    headline: 'Jedno okno pro všechno, co vám zákazníci napíší.',
    subheadline: 'Agent panel sjednocuje hovory, chaty, emaily a WhatsApp. Historie, skript, kontaktní akce — vedle sebe, nic se neskrývá pod třemi kliky.',
    screenshot: {
      src: '/product/agent-panel-annotated.png',
      alt: 'Anotovaný screenshot Agent Panelu BC4Cloud',
      annotations: [],
    },
  },

  howItWorks: {
    eyebrow: 'JAK TO FUNGUJE',
    headline: 'Tři úrovně. Začnete tam, kde to dává smysl.',
    tiers: [
      {
        tier: 1,
        title: 'Volání',
        description: 'Cloudová ústředna pro firmy, které zatím nepotřebují víc. Nasadíme do pěti dnů, portujeme čísla, převezmeme provoz.',
        features: [
          'Přehled všech příchozích i odchozích hovorů v reálném čase',
          'Nahrávání hovorů pro kontrolu kvality, šifrovaně',
          'IVR editor v prohlížeči — žádný IT technik ne­potřebujete',
          'Statistiky výkonu per směna a per agent',
        ],
        learnMoreHref: '/produkt/volani',
      },
      {
        tier: 2,
        title: 'Kontaktní centrum',
        description: 'Plný omnichannel. Telefon, email, chat, SMS, WhatsApp, Messenger — v jednom rozhraní, jedním smart routingem.',
        features: [
          'Smart routing podle dovedností agenta i hodnoty zákazníka',
          'Sdílená schránka pro email a chat napříč týmem',
          'WhatsApp Business API + Messenger + sociální sítě',
          'Odchozí kampaně s prediktivním dialerem a importem z XLSX',
        ],
        learnMoreHref: '/produkt/kontaktni-centrum',
      },
      {
        tier: 3,
        title: 'AI',
        description: 'Voicebot a chatbot pro rutinní dotazy, speech analytics pro každý hovor. Agenti se věnují složitým věcem, AI řeší ty nudné.',
        features: [
          'Voicebot — ověření identity, rezervace, směrování hovorů',
          'Chatbot napojený na ChatGPT a vaše vlastní data',
          'Automatický přepis hovoru do textu v češtině',
          'Sentiment analýza a detekce rizikových konverzací',
        ],
        learnMoreHref: '/produkt/ai-voicebot',
      },
    ],
  },

  segments: {
    eyebrow: 'PRO KOHO TO JE',
    headline: 'Kde BC4Cloud dává největší smysl.',
    items: [
      {
        name: 'E-shopy',
        tagline: 'Peak sezona bez navýšení lidí. Callback z opuštěného košíku.',
        icon: 'ShoppingCart',
      },
      {
        name: 'Servisní firmy',
        tagline: 'Technik volá z terénu přes mobil. Historii zákazníka má před očima.',
        icon: 'Wrench',
      },
      {
        name: 'Banky a finance',
        tagline: 'Audit trail ke každému hovoru. Šifrovaná nahrávka. PCI a GDPR ready.',
        icon: 'ShieldCheck',
      },
      {
        name: 'Telco operátoři',
        tagline: 'Prediktivní dialer na retention kampaně. Statistiky ke směně.',
        icon: 'Antenna',
      },
    ],
  },

  // Skryjeme dokud nemáme reálnou referenci s čísly (viz strategy.md § 10)
  caseStudyHighlight: undefined,

  inlineLeadForm: {
    eyebrow: 'DOMLUVIT UKÁZKU',
    headline: 'Ukážeme, jak to funguje u vás.',
    subheadline: 'Vyplňte čtyři pole. Ozveme se obvykle do pár minut v pracovní době. Bez prodejního tlaku — jen ukázka.',
  },

  whyUs: {
    eyebrow: 'PROČ S NÁMI',
    headline: 'BusinessCom — 20+ let v české telekomunikaci.',
    reasons: [
      {
        title: 'Česká podpora. Mluví s vámi člověk.',
        description: 'Když zavoláte, na druhé straně je někdo, kdo vaše CC zná. Bez překladu do angličtiny, bez fronty do zahraničního supportu.',
        icon: 'Headphones',
      },
      {
        title: 'Data zůstávají v EU.',
        description: 'Nahrávky i osobní údaje neopouštějí Evropu. DPA k podpisu vám pošleme. GDPR nestojí na vás, ale na nás.',
        icon: 'MapPin',
      },
      {
        title: 'Rostete s námi. Bez re-kontraktace.',
        description: 'Začnete s pěti agenty, rostete na pět set. Z Volání na plný omnichannel přejdete pár kliknutími — nová smlouva se neotvírá.',
        icon: 'TrendingUp',
      },
      {
        title: '20+ let zkušeností, ne startupová zkouška.',
        description: 'BusinessCom provozuje komunikační řešení od roku 2003. BC4Cloud je pokračováním desítek implementací pro české firmy. Na experimenty máte jiné.',
        icon: 'Clock',
      },
    ],
  },

  faq: {
    eyebrow: 'ČASTÉ OTÁZKY',
    headline: 'Na co se ptají před podpisem.',
    items: [
      {
        question: 'Jak dlouho trvá nasazení?',
        answer: 'Volání rozjedeme do 5 pracovních dnů od podpisu — portaci čísel, základní IVR, účty agentů. Plné kontaktní centrum s integrací na CRM 2–4 týdny. AI moduly nasazujeme samostatně, kdykoli později.',
      },
      {
        question: 'Potřebujeme vlastní IT tým?',
        answer: 'Ne. BC4Cloud běží v cloudu. Agenti se přihlásí přes prohlížeč nebo naši mobilní aplikaci. Stačí stabilní internet a headset — zbytek je náš problém.',
      },
      {
        question: 'Kolik to stojí?',
        answer: 'Účtujeme per agent za měsíc. Konkrétní ceny jsou na [ceníku](/cenik). Minimum je 5 agentů, nabídku pro váš case spočítáme do 1 pracovního dne od vyplnění poptávky.',
      },
      {
        question: 'Funguje to s naším CRM?',
        answer: 'Máme otevřené REST API a webhooks. Přímou integraci máme hotovou pro MS Dynamics, Salesforce, HubSpot a Pipedrive. Jiné CRM doplníme obvykle za 2–5 pracovních dnů — záleží na složitosti.',
      },
      {
        question: 'Nejsme s vámi uvězněni na roky?',
        answer: 'Smlouva má tříměsíční výpovědní lhůtu. Žádné lock-in na 24 měsíců, žádné sankce za odchod. Kdykoli vám vytáhneme data a odevzdáme je.',
      },
      {
        question: 'Kde jsou naše data?',
        answer: 'V datových centrech v Praze a Evropské unii. Nikdy mimo EU. Nahrávky jsou šifrované at rest i při přenosu. Jsme GDPR compliant, DPA vám pošleme automaticky k podpisu smlouvy.',
      },
      {
        question: 'Co když nás teprve čeká růst?',
        answer: 'Platforma škáluje od 5 do 500+ agentů. Přidání agenta je klikem v administraci, žádná nová smlouva. Když přejdete z Volání na plný omnichannel, změna se aktivuje do 24 hodin.',
      },
    ],
  },
};
