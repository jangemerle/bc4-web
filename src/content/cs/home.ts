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
    headline: 'Spokojení zákazníci, vyšší konverze. Z jednoho kontaktního centra.',
    subheadline: 'BC4Cloud sjednocuje telefony, emaily, chat a WhatsApp do jednoho okna. Vaši operátoři nepřeskakují mezi aplikacemi, zákazník čeká kratší dobu a vy vidíte, co se děje v reálném čase.',
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
      src: '/product/bronet/header.png',
      alt: 'BC4Cloud — kontaktní centrum v prohlížeči',
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
    headline: 'Jak se BC4Cloud vyplatí v číslech',
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
        description: 'Z 2:30 v prvním měsíci.',
      },
      {
        value: '5 dnů',
        label: 'Od podpisu k prvnímu hovoru',
        description: 'Základní Volání. Portace čísel, IVR, účty operátorů — naše práce.',
      },
      {
        value: '99,95 %',
        label: 'Uptime SLA',
        description: 'Servery v Česku a EU, zálohované na 2 místech. Pokud něco vypadne, hned to vidíte.',
      },
    ],
    footnote: 'Průměr napříč zákazníky za prvních 90 dní provozu. Konkrétní čísla pro vaši firmu spočítáme na ukázce.',
  },

  benefits: {
    eyebrow: 'CO VÁM BC4CLOUD PŘINESE',
    headline: '4 starosti, které vás přestanou budit ve 4 ráno.',
    items: [
      {
        title: 'Lepší zákaznická zkušenost',
        description: 'Hovory vám přestanou utíkat. Systém automaticky zavolá zpět zákazníkům, kterým dojde trpělivost. 86 % zákazníků nakoupí znovu, pokud má dobrou zkušenost.',
        icon: 'PhoneIncoming',
      },
      {
        title: 'Zákazníci nečekají na lince',
        description: 'Průměrné čekání jde z minut na sekundy — a frustrovaný zákazník neběží ke konkurenci. 81 % zákazníků odejde po 2 negativních zkušenostech.',
        icon: 'Timer',
      },
      {
        title: 'Vyšší produktivita: agent ví, s kým mluví',
        description: 'Historie zákazníka naskočí v okamžiku přijetí hovoru. Žádné „počkejte, prověřím to v našem systému" — odpověď leží před agentem, než stihne říct dobrý den.',
        icon: 'Users',
      },
      {
        title: 'Víc vyřízených požadavků bez navýšení týmu',
        description: 'Díky podrobným statistikám, vyhodnocování úspěšnosti hovorů a automatickému přidělování následných úkolů získáte dokonalý přehled o svém obchodním týmu.',
        icon: 'BarChart3',
      },
    ],
  },

  productShowcase: {
    eyebrow: 'TAKHLE TO VYPADÁ V PRAXI',
    headline: 'Jedno okno pro všechno, co vám zákazníci napíší.',
    subheadline: 'Panel operátora sjednocuje hovory, chaty, emaily a WhatsApp. Historie, skript, kontaktní akce — vedle sebe, nic se neskrývá pod 3 kliky.',
    screenshot: {
      src: '/product/agent-panel-annotated.png',
      alt: 'Anotovaný screenshot Panelu operátora BC4Cloud',
      annotations: [],
    },
  },

  featureShowcase: {
    eyebrow: 'FUNKCE, CO SKUTEČNĚ POUŽIJETE',
    headline: '5 věcí, které vám ušetří nejvíc času každý den.',
    subheadline: 'Vybrali jsme funkce, na které se vaši operátoři i vy budete dívat nejčastěji. Všechny v ceně tarifu Kontaktní centrum.',
    items: [
      {
        id: 'agent-panel',
        title: 'Panel operátora',
        eyebrow: 'OMNICHANNEL INBOX',
        headline: 'Hovor, SMS a WhatsApp v jedné obrazovce.',
        description: 'Operátor nepřeskakuje mezi aplikacemi. Hovor, SMS i vlákno z WhatsAppu má vedle sebe. Karta zákazníka s historií z CRM naskočí v okamžiku přijetí — žádné „počkejte, prověřím to v ERPku".',
        highlights: [
          'WebRTC dialer — volání z prohlížeče, bez instalace',
          'Hovor, SMS a WhatsApp v jedné obrazovce',
          'Karta hovoru s poznámkou, kategorií a historií volajícího',
          'Volání přes headset nebo CTI ovládání pevného Htek telefonu',
        ],
        screenshot: {
          src: '/product/bronet/imgBCCP-small-6.fa9b9904_3840.webp',
          alt: 'BC4 Karta hovoru — detaily hovoru, kategorie, historie čísla a poznámky operátora',
        },
        icon: 'Monitor',
        learnMoreHref: '/produkt/kontaktni-centrum',
      },
      {
        id: 'smart-routing',
        title: 'Smart routing',
        eyebrow: 'ROUTING A FRONTY',
        headline: 'Zákazník na správného operátora hned.',
        description: 'Skill-based routing pošle hovor jen operátorovi, který má dovednosti. Data-driven routing využije údaje o zákazníkovi z CRM. Když všichni obsadí, zákazníkovi voláme zpět — nečeká ve frontě.',
        highlights: [
          'Skill-based routing — podle dovedností operátora',
          'Data-driven — využije údaje o zákazníkovi z CRM',
          'Panel front — operátor se přihlásí jedním klikem, pauzy jsou součást',
          'Callback queue — místo čekání zákazníkovi automaticky zavoláme zpět',
        ],
        screenshot: {
          src: '/product/bronet/imgBCCP-small-5.4295f61b_3840.webp',
          alt: 'Smart routing — kartičky front (Servis, Reklamace) s počty čekajících a obsloužených hovorů',
        },
        icon: 'GitBranch',
      },
      {
        id: 'supervizor-panel',
        title: 'Supervizor Panel + Wallboard',
        eyebrow: 'MONITORING A KOUČOVÁNÍ',
        headline: 'Vidíte, co se děje, hned jak se to děje.',
        description: 'Real-time monitoring i historical reporting v jednom. 360° pohled na celé kontaktní centrum, náslech ongoing hovorů pro koučování, wallboard pro velký displej v open-space.',
        highlights: [
          'Real-time dashboard per operátor, per fronta, per směna',
          'Náslech ongoing hovorů pro QA i koučování nováčků',
          'CDR a výkonnostní reporty s exportem do XLSX',
          'Wallboard pro nástěnnou TV v týmovém prostoru',
        ],
        screenshot: {
          src: '/product/bronet/imgBCCP-full-3.d9e80df0_3840.webp',
          alt: 'BC4 Supervizor panel — KPI metriky a tabulka aktivních hovorů s tichým příposlechem',
        },
        icon: 'Eye',
        learnMoreHref: '/produkt/kontaktni-centrum#supervizor',
      },
      {
        id: 'ai-voicebot',
        title: 'AI Voicebot s ChatGPT',
        eyebrow: 'AI AUTOMATIZACE',
        headline: 'Voicebot, který umí vaši firmu.',
        description: 'Konverzační AI napojená na ChatGPT, trénovaná na vašich datech. Vyřídí rutinní dotazy. Když nestačí, předá hovor operátorovi s kontextem. Bonus: každý hovor přepíšeme do textu a vyhodnotíme sentiment.',
        highlights: [
          'Voicebot a chatbot napojené na ChatGPT',
          'Trénink na vaší knowledge base, FAQ, produktech',
          'Předání operátorovi s kontextem, když AI nestačí',
          'ASR přepis a sentiment analýza každého hovoru',
        ],
        screenshot: {
          src: '/product/bronet/imgBCCP-small-4.05c00ce2_3840.webp',
          alt: 'BC4 vizuální editor call flow — uzly Otevíračka, IVR hláška, větve podle volby',
        },
        icon: 'Sparkles',
        learnMoreHref: '/produkt/ai-voicebot',
      },
      {
        id: 'mobile-client',
        title: 'Mobile Client',
        eyebrow: 'MOBILITA, BEZ VPN',
        headline: 'Operátor volá z mobilu jako z kanceláře.',
        description: 'Oficiální aplikace BC4 Agent Panel v App Store a Google Play — pro iOS i Android. Stejné funkce jako desktop Panel operátora: fronty, callback, kontakty, transfer. Bez VPN díky integrovanému SBC. Pro terénní techniky, hybridní práci nebo pohotovost.',
        highlights: [
          'Stáhnete přímo z App Store a Google Play, instalace za minutu',
          'Stejný workflow jako desktop — fronty, callback, kategorie a poznámky k hovoru',
          'VPN-less díky integrovanému SBC — bezpečný přístup zvenku',
          'Pro snadnou obsluhu mimo kancelář — terén, hybridní práce, pohotovost',
        ],
        screenshot: {
          src: '/product/bronet/imgBCCP-full-7.6f750b38_3840.webp',
          alt: 'BC4 Mobile Client — 4 mobilní obrazovky: dialer, aktivní hovor, panel operátora a callback',
        },
        icon: 'Smartphone',
        appStoreLinks: {
          appStore: 'https://apps.apple.com/cz/app/bc4-agent-panel/id6458532928',
          googlePlay: 'https://play.google.com/store/apps/details?id=com.bc4.caller.android.agent&hl=cs',
        },
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
        description: 'Operátor zvedne telefon. Historie zákazníka, skript a akce naskočí ve stejném okně.',
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
    headline: '4 úrovně. Začnete tam, kde to dává smysl.',
    subheadline: 'Volání a Kontaktní centrum jsou základní úrovně. AI a Integrace jsou přídavné moduly — přidáte je k libovolné úrovni, kdykoli to bude potřeba.',
    tiers: [
      {
        tier: 1,
        title: 'Chytré volání',
        description: 'Vaší staré analogové ústředně končí životnost? Cloudová náhrada bez nového hardwaru a bez investic. Nasadíme do 5 dnů, portujeme čísla, převezmeme provoz.',
        features: [
          'Přehled všech příchozích i odchozích hovorů v reálném čase',
          'Nahrávání hovorů pro kontrolu kvality, šifrovaně',
          'IVR editor v prohlížeči — žádný IT technik ne­potřebujete',
          'Statistiky výkonu per směna a per operátor',
        ],
        learnMoreHref: '/produkt/volani',
      },
      {
        tier: 2,
        title: 'Kontaktní centrum',
        description: 'Pro firmy, které chtějí povýšit zákaznické oddělení — nebo už call centrum mají. Telefon, SMS a WhatsApp v jednom rozhraní, jedním chytrým směrováním.',
        features: [
          'Chytré směrování hovorů podle dovedností operátora a hodnoty zákazníka',
          'WhatsApp Business API + hromadné SMS s šablonami',
          'Odchozí kampaně s prediktivním dialerem a importem z XLSX',
          'Dashboardy a reporting výkonu týmu v reálném čase',
        ],
        learnMoreHref: '/produkt/kontaktni-centrum',
      },
      {
        tier: 3,
        title: 'AI',
        description: 'Modul nad Voláním i Kontaktním centrem. Voicebot a chatbot pro rutinní dotazy, speech analytics pro každý hovor. Operátoři se věnují složitým věcem, AI řeší ty opakované.',
        features: [
          'Voicebot — ověření identity, rezervace, směrování hovorů',
          'Chatbot napojený na ChatGPT a vaše vlastní data',
          'Automatický přepis hovoru do textu v češtině',
          'Sentiment analýza a detekce rizikových konverzací',
        ],
        learnMoreHref: '/produkt/ai-voicebot',
        addOn: true,
      },
      {
        tier: 4,
        title: 'Integrace',
        description: 'Modul, který napojí libovolnou úroveň na CRM, ERP, ticketing nebo nemocniční informační systém. Kontakty tečou dovnitř, záznamy o hovorech zpátky — bez ručního přepisování.',
        features: [
          'Import kontaktů z CRM, ERP, ticketing nebo NIS',
          'Záznamy hovorů (kdo, kdy, výsledek) zpět do CRM',
          'REST API a webhooks pro vlastní integrace',
          'Hotové konektory: MS Teams, SAP, Salesforce, HubSpot',
        ],
        addOn: true,
        learnMoreHref: '/funkce',
      },
    ],
  },

  segments: {
    eyebrow: 'PRO JAKÉ FIRMY',
    headline: 'Pro firmy všech velikostí a oborů. Od 1 operátora po velká call centra.',
    subheadline: 'BC4Cloud roste s vámi — ať řešíte desítky nebo tisíce hovorů denně.',
    items: [
      {
        name: 'E-shopy',
        tagline: 'Zvládnete špičku bez navyšování lidí. Navíc můžete automaticky oslovit zákazníky, kteří nedokončili objednávku.',
        icon: 'ShoppingCart',
      },
      {
        name: 'Servisní firmy',
        tagline: 'Technik v terénu má vše po ruce — volá přes mobil a okamžitě vidí historii komunikace se zákazníkem.',
        icon: 'Wrench',
      },
      {
        name: 'Banky a finance',
        tagline: 'Audit trail ke každému hovoru. Šifrovaná nahrávka. GDPR ready.',
        icon: 'ShieldCheck',
      },
      {
        name: 'Zdravotnictví',
        tagline: 'Rezervační linka bez čekání. SMS i WhatsApp připomínky termínů snižují počet nedostavených pacientů.',
        icon: 'Stethoscope',
      },
      {
        name: 'Telco operátoři',
        tagline: 'Prediktivní dialer na retention kampaně. Statistiky ke směně.',
        icon: 'Antenna',
      },
    ],
    footnote: 'Váš obor v seznamu není? Nevadí — BC4Cloud používají firmy z desítek odvětví. Řekněte nám, co řešíte, a ukážeme vám, jak to funguje konkrétně u vás.',
  },

  // Skryjeme dokud nemáme reálnou referenci s čísly (viz strategy.md § 10)
  caseStudyHighlight: undefined,

  testimonials: {
    eyebrow: 'CO ŘÍKAJÍ ZÁKAZNÍCI',
    headline: 'Slovem těch, co BC4Cloud denně používají.',
    subheadline: '3 hlasy z různých odvětví. Konkrétní čísla, ne marketingové fráze.',
    // TODO: nahradit reálnými citacemi se jménem, fotkou, firmou a souhlasem
    // se zveřejněním. Šablona zachovává Baymard pattern: jméno + pozice + firma
    // + konkrétní výsledek v citaci.
    items: [
      {
        quote:
          'Po nasazení BC4Cloudu jsme v prvním kvartálu zachránili 18 % hovorů, co by jinak skončily ve frontě bez odezvy. Callback funguje, operátoři to mají rádi.',
        author: 'Petra Nováková',
        role: 'Vedoucí kontaktního centra',
        company: '[Klient placeholder]',
        authorPhoto: '/testimonials/placeholder-1.png',
      },
      {
        quote:
          'Přechod ze staré ústředny trval 5 dní. Kompletní portace čísel, IVR, zaškolení operátorů. Méně času, než jsme čekali — a žádný výpadek.',
        author: 'Tomáš Dvořák',
        role: 'IT manažer',
        company: '[Klient placeholder]',
        authorPhoto: '/testimonials/placeholder-2.png',
      },
      {
        quote:
          'Šlo nám o jednoduchost. Operátoři zvládli zaškolení za 2 hodiny, supervizoři vidí všechno v reálném čase. Žádné Excely, žádná chaotická data.',
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
    // Subheadline odstraněn — disclaimer pod submit tlačítkem řeší totéž
    // ("Ozveme se obvykle do pár minut v pracovní době Po–Pá 8–17").
    subheadline: '',
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
        title: 'Rostete s námi. Od 1 do 500.',
        description: 'Začnete s 1 operátorem, rostete na 500. Z Volání na plný omnichannel přejdete pár kliknutími v administraci.',
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
        answer: 'Volání rozjedeme do 5 pracovních dnů od podpisu — portaci čísel, základní IVR, účty operátorů. Plné kontaktní centrum s integrací na CRM 2–4 týdny. AI moduly nasazujeme samostatně, kdykoli později.',
      },
      {
        question: 'Potřebujeme vlastní IT tým?',
        answer: 'Ne. BC4Cloud běží v cloudu. Operátoři se přihlásí přes prohlížeč nebo naši mobilní aplikaci. Stačí stabilní internet a headset — zbytek je náš problém.',
      },
      {
        question: 'Kolik to stojí?',
        answer: 'Účtujeme per operátor za měsíc, minimum je 1 operátor. Konkrétní cenu pro váš case spočítáme do 1 pracovního dne od vyplnění [poptávky](/poptavka).',
      },
      {
        question: 'Funguje to s naším CRM?',
        answer: 'Máme otevřené REST API a webhooks pro příchozí hovory, click-to-call a zápis interakcí. Z krabice máme integraci s MS Teams. Napojení na vaše CRM nebo ERP přes API obvykle 2–5 pracovních dnů — záleží na složitosti.',
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
        answer: 'Platforma škáluje od 1 do 500+ operátorů. Přidání operátora je klikem v administraci, žádná nová smlouva. Když přejdete z Volání na plný omnichannel, změna se aktivuje do 24 hodin.',
      },
    ],
  },
};
