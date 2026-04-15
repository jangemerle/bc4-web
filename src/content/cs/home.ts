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
      // TODO: až budou reálná loga + povolení, přidat outcome per logo
      // Příklad správného záznamu:
      // {
      //   name: 'T-Mobile CZ',
      //   src: '/logos/clients/t-mobile.svg',
      //   alt: 'T-Mobile CZ — zákazník BC4Cloud',
      //   outcome: '18 % pokles AHT za 90 dní',
      //   href: '/reference/t-mobile',
      // },
      { name: 'Placeholder 1', src: '/logos/clients/placeholder-1.svg', alt: 'Klient 1' },
      { name: 'Placeholder 2', src: '/logos/clients/placeholder-2.svg', alt: 'Klient 2' },
      { name: 'Placeholder 3', src: '/logos/clients/placeholder-3.svg', alt: 'Klient 3' },
      { name: 'Placeholder 4', src: '/logos/clients/placeholder-4.svg', alt: 'Klient 4' },
      { name: 'Placeholder 5', src: '/logos/clients/placeholder-5.svg', alt: 'Klient 5' },
    ],
  },

  statsBand: {
    eyebrow: 'VÝSLEDKY Z REÁLNÝCH NASAZENÍ',
    headline: 'Čím se to vyplatí. V číslech.',
    // TODO: Všechna čísla ověřit s vedením BusinessComu. Teď jsou to
    // draft hodnoty založené na benchmarku Baymard 2023 a průměrech z
    // contact center industry reportů. Jakmile budou reálná čísla,
    // vyměnit — nedělat z toho PR překlep.
    stats: [
      {
        value: '12–25 %',
        label: 'Hovorů zachráněno',
        description: 'Callback fronta dovolá zpět zákazníkům, co by jinak spadli.',
      },
      {
        value: '0:45',
        label: 'Průměrné čekání',
        description: 'Z 2:30 v prvním měsíci. Skill-based routing a callback queue.',
      },
      {
        value: '5 dnů',
        label: 'Od podpisu k prvnímu hovoru',
        description: 'Základní Volání. Portace čísel, IVR, účty agentů — naše práce.',
      },
      {
        value: '99,95 %',
        label: 'Uptime SLA',
        description: 'Redundantní infra v Praze a EU. Status page v reálném čase.',
      },
    ],
    footnote: 'Průměr napříč zákazníky za prvních 90 dní provozu. Konkrétní čísla pro vaši firmu spočítáme na ukázce.',
  },

  benefits: {
    eyebrow: 'CO VÁM BC4CLOUD PŘINESE',
    headline: 'Tři starosti, které vás přestanou budit ve tři ráno.',
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

  featureShowcase: {
    eyebrow: 'FUNKCE, CO SKUTEČNĚ POUŽIJETE',
    headline: 'Pět věcí, které vám ušetří nejvíc času každý den.',
    subheadline: 'Vybrali jsme funkce, na které se vaši agenti i vy budete dívat nejčastěji. Všechny v ceně tarifu Kontaktní centrum.',
    items: [
      {
        id: 'supervizor-panel',
        title: 'Supervizor Panel',
        eyebrow: 'MONITORING A KOUČOVÁNÍ',
        headline: 'Vidíte, co se děje, hned jak se to děje.',
        description: 'Živý pohled na celé kontaktní centrum. Kolik lidí čeká ve frontě, kdo je na hovoru, kdo má pauzu, kdo překračuje průměrný čas. Problém vidíte před šéfem, ne na pondělní poradě.',
        highlights: [
          'Dashboard per agent, per fronta, per směna — vše v reálném čase',
          'Whisper mode — poradíte agentovi bez toho, aby vás zákazník slyšel',
          'Tichý náslech pro QA a koučování nováčků',
          'Alerty na překročení KPI přímo do emailu nebo Slacku',
        ],
        screenshot: {
          src: '/product/supervizor-panel.png',
          alt: 'Supervizor Panel — dashboard s reálně-časovým přehledem front, agentů a KPI',
        },
        icon: 'Eye',
        learnMoreHref: '/produkt/kontaktni-centrum#supervizor',
      },
      {
        id: 'ivr-editor',
        title: 'Vizuální IVR editor',
        eyebrow: 'CALL FLOW BEZ PROGRAMOVÁNÍ',
        headline: 'Hlasový průvodce, který si upravíte myší.',
        description: 'Nový uvítací text, změna pracovní doby nebo přesměrování na svátky — všechno kliknutím. Žádný technik, žádné čekání týden na změnu.',
        highlights: [
          'Drag & drop editor call flow — přetáhnete uzel, propojíte čárou',
          'Time conditions — jiná logika ve špičce, večer a o víkendu',
          'Text-to-Speech přímo v editoru (Microsoft TTS, čeština)',
          'Okamžitý preview — otestujete, než změna jde živě',
        ],
        screenshot: {
          src: '/product/ivr-editor.png',
          alt: 'Vizuální editor IVR call flow s drag-and-drop uzly',
        },
        icon: 'GitBranch',
        learnMoreHref: '/produkt/volani#ivr',
      },
      {
        id: 'queue-management',
        title: 'Fronty a přihlašování',
        eyebrow: 'SKILL-BASED ROUTING',
        headline: 'Agent si vybere fronty. Systém ví, kdo co umí.',
        description: 'Nováček zvedá jen jednoduché dotazy. Senior bere eskalace a VIP zákazníky. Jednací den? Agent odškrtne pauzu, systém ji respektuje.',
        highlights: [
          'Agent se přihlásí do front, do kterých má dovednosti',
          'Skill-based routing — zákazník jde na agenta, co problém zvládne',
          'Agentské pauzy s typem (oběd, školení, administrativa)',
          'Automatické pauzy po hovoru pro wrap-up práci',
        ],
        screenshot: {
          src: '/product/queue-management.png',
          alt: 'Přehled front s přihlášenými agenty a jejich skill mapováním',
        },
        icon: 'Users',
      },
      {
        id: 'predictive-dialer',
        title: 'Prediktivní dialer',
        eyebrow: 'VÝKONNÉ ODCHOZÍ KAMPANĚ',
        headline: 'Voláte až tehdy, kdy někdo zvedne.',
        description: 'Systém vytáčí víc čísel najednou a přepojí agenta teprve, když se ozve reálný člověk. Answering machine, obsazeno, neodpovídá — filtruje za vás. Agent volá 3× víc za hodinu.',
        highlights: [
          'Prediktivní, progresivní a proaktivní módy — pro různé kampaně',
          'Answer detection — přeskočí záznamník nebo fax',
          'Import kontaktů z XLSX nebo přes REST API',
          'Live reporting — konverze per agent, per kampaň, per směna',
        ],
        screenshot: {
          src: '/product/predictive-dialer.png',
          alt: 'Rozhraní prediktivního dialeru s reportingem kampaní',
        },
        icon: 'Megaphone',
        learnMoreHref: '/produkt/kontaktni-centrum#dialer',
      },
      {
        id: 'ai-summary',
        title: 'AI shrnutí hovoru',
        eyebrow: 'AUTOMATIZACE PO HOVORU',
        headline: 'Agent zavěsí. Zápis má hotový.',
        description: 'Nahrávku přepíšeme do textu, AI shrne klíčové body, vytvoří task nebo předá obchodníkovi s kontextem. Agent šetří 5–10 minut po každém hovoru.',
        highlights: [
          'Automatický přepis v češtině (i angličtině)',
          'AI shrnutí — problém, řešení, co má zákazník dále udělat',
          'Sentiment analýza — označí rizikové konverzace pro reviews',
          'Předání s kontextem — task v CRM s odkazem na nahrávku',
        ],
        screenshot: {
          src: '/product/ai-summary.png',
          alt: 'Automatické AI shrnutí hovoru s přepisem a akcemi',
        },
        icon: 'Sparkles',
        learnMoreHref: '/produkt/ai-voicebot',
      },
    ],
  },

  productVideo: {
    eyebrow: 'VIDEO UKÁZKA',
    headline: 'Minuta a víte, jak BC4Cloud běží.',
    // TODO: po nahrání videa vyměnit. Self-hosted MP4 nebo YouTube/Vimeo URL.
    // Příklad self-hosted: '/videos/bc4-showcase.mp4'
    // Příklad YouTube embed: 'https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1'
    videoSrc: undefined,
    posterSrc: '/videos/bc4-showcase-poster.png', // TODO: dodat poster (1920×1080)
    alt: 'Minutový walkthrough BC4Cloud — přijetí hovoru, zákaznická historie, AI shrnutí a předání obchodníkovi.',
    duration: '1:00',
    chapters: [
      {
        timestamp: '0:00',
        title: 'Přijetí hovoru',
        description: 'Agent zvedne telefon. Historie zákazníka, skript a akce naskočí ve stejném okně.',
      },
      {
        timestamp: '0:20',
        title: 'Omnichannel v jedné obrazovce',
        description: 'Vedle hovoru: email, chat, WhatsApp. Kontext se nikam nepromítá.',
      },
      {
        timestamp: '0:40',
        title: 'AI shrnutí a předání',
        description: 'Po zavěšení: automatický zápis do CRM a předání obchodníkovi s notifikací.',
      },
    ],
    cta: {
      label: 'Domluvit ukázku',
      href: '/poptavka?source=home_video',
      trackingId: 'cta_video_primary',
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
        description: 'Voicebot a chatbot pro rutinní dotazy, speech analytics pro každý hovor. Agenti se věnují složitým věcem, AI řeší ty opakované.',
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
    eyebrow: 'PRO JAKÉ FIRMY',
    headline: 'Pro firmy všech velikostí. Od 5 agentů po velká call centra.',
    subheadline: 'BC4Cloud roste s vámi — ať obsluhujete 30 hovorů denně nebo 3 000. Pár scénářů, kde obzvlášť dává smysl:',
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
        tagline: 'Audit trail ke každému hovoru. Šifrovaná nahrávka. GDPR ready.',
        icon: 'ShieldCheck',
      },
      {
        name: 'Telco operátoři',
        tagline: 'Prediktivní dialer na retention kampaně. Statistiky ke směně.',
        icon: 'Antenna',
      },
    ],
    footnote: 'Nepoznáváte svůj obor? Taky tam patříte. Většina našich zákazníků nesedí úplně do jedné kategorie — řekněte nám, co řešíte, a ukážeme vám, jak to funguje.',
  },

  // Skryjeme dokud nemáme reálnou referenci s čísly (viz strategy.md § 10)
  caseStudyHighlight: undefined,

  testimonials: {
    eyebrow: 'CO ŘÍKAJÍ ZÁKAZNÍCI',
    headline: 'Slovem těch, co BC4Cloud denně používají.',
    subheadline: 'Tři hlasy z různých odvětví. Konkrétní čísla, ne marketingové fráze.',
    // TODO: nahradit reálnými citacemi se jménem, fotkou, firmou a souhlasem
    // se zveřejněním. Šablona zachovává Baymard pattern: jméno + pozice + firma
    // + konkrétní výsledek v citaci.
    items: [
      {
        quote:
          'Po nasazení BC4Cloudu jsme v prvním kvartálu zachránili 18 % hovorů, co by jinak skončily ve frontě bez odezvy. Callback funguje, agenti to mají rádi.',
        author: 'Petra Nováková',
        role: 'Vedoucí kontaktního centra',
        company: '[Klient placeholder]',
        authorPhoto: '/testimonials/placeholder-1.png',
      },
      {
        quote:
          'Přechod ze staré ústředny trval pět dní. Kompletní portace čísel, IVR, zaškolení agentů. Méně času, než jsme čekali — a žádný výpadek.',
        author: 'Tomáš Dvořák',
        role: 'IT manažer',
        company: '[Klient placeholder]',
        authorPhoto: '/testimonials/placeholder-2.png',
      },
      {
        quote:
          'Šlo nám o jednoduchost. Agenti zvládli zaškolení za dvě hodiny, supervizoři vidí všechno v reálném čase. Žádné Excely, žádná chaotická data.',
        author: 'Jana Procházková',
        role: 'Provozní ředitelka',
        company: '[Klient placeholder]',
        authorPhoto: '/testimonials/placeholder-3.png',
      },
    ],
  },

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
        title: 'Rostete s námi. Od 5 do 500.',
        description: 'Začnete s 5 agenty, rostete na 500. Z Volání na plný omnichannel přejdete pár kliknutími v administraci.',
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
