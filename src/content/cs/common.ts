/**
 * BC4Cloud — Common content (CS)
 *
 * Sdílený obsah napříč stránkami: navigace, footer, globální CTA, legal texty.
 *
 * ⚠️ Obsah je v přípravné fázi. Finální čísla/reference/kontakty ověřit s BusinessComem
 * před deployem (viz strategy.md § 10 otevřené otázky).
 */

import type { CommonContent } from '../types';

export const common: CommonContent = {
  brand: {
    name: 'BC4Cloud',
    tagline: 'Omnichannel kontaktní centrum pro české firmy',
    logoDark: '/logos/bc4cloud-dark.svg',   // TODO: získat od BusinessComu
    logoLight: '/logos/bc4cloud-light.svg', // TODO: získat od BusinessComu
  },
  nav: {
    primary: [
      {
        label: 'Produkty',
        href: '#',
        children: [
          { label: 'Volání', href: '/produkt/volani' },
          { label: 'Kontaktní centrum', href: '/produkt/kontaktni-centrum' },
          { label: 'AI Voicebot & Chatbot', href: '/produkt/ai-voicebot' },
        ],
      },
      { label: 'Ceník', href: '/cenik' },
      { label: 'Reference', href: '/reference' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    primaryCta: {
      label: 'Domluvit ukázku',
      href: '/poptavka',
      trackingId: 'cta_header',
    },
  },
  footer: {
    tagline: 'Kontaktní centrum od BusinessCom a.s. Vyvinuto v Praze pro české a evropské firmy.',
    columns: [
      {
        title: 'Produkt',
        links: [
          { label: 'Kontaktní centrum', href: '/produkt/kontaktni-centrum' },
          { label: 'Volání', href: '/produkt/volani' },
          { label: 'AI Voicebot', href: '/produkt/ai-voicebot' },
          { label: 'Ceník', href: '/cenik' },
          { label: 'Integrace', href: '/integrace' },
        ],
      },
      {
        title: 'Společnost',
        links: [
          { label: 'O nás', href: '/o-nas' },
          { label: 'Reference', href: '/reference' },
          { label: 'Blog', href: '/blog' }, // Vlna 3
          { label: 'Kariéra', href: '/kariera' }, // Volitelné
        ],
      },
      {
        title: 'Podpora',
        links: [
          { label: 'Kontakt', href: '/kontakt' },
          { label: 'Status platformy', href: 'https://status.bc4cloud.cz', external: true }, // TODO: ověřit URL
          { label: 'Dokumentace', href: '/dev' }, // Vlna 3
        ],
      },
      {
        title: 'Právní',
        links: [
          { label: 'Zpracování osobních údajů', href: '/gdpr' },
          { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
          { label: 'Cookies', href: '/cookies' },
        ],
      },
    ],
    copyright: '© {year} BusinessCom a.s. Všechna práva vyhrazena.',
    legal: [
      { label: 'Zpracování osobních údajů', href: '/gdpr' },
      { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
    ],
    social: [
      { platform: 'linkedin', href: 'https://www.linkedin.com/company/businesscom' }, // TODO: ověřit URL
    ],
  },
  preFooterCta: {
    headline: 'Připravte se na méně ztracených hovorů.',
    subheadline: 'Ukážeme vám, jak BC4Cloud funguje v praxi pro firmy jako je ta vaše. Žádný prodejní tlak, jen ukázka.',
    cta: {
      label: 'Domluvit ukázku',
      href: '/poptavka',
      trackingId: 'cta_pre_footer',
    },
  },
  legal: {
    gdprConsentLabel: 'Souhlasím se zpracováním osobních údajů',
    gdprConsentDetails: 'Vaše údaje použijeme pouze pro kontaktování ohledně BC4Cloud. Nesdílíme je s třetími stranami. Více v [Zásadách ochrany osobních údajů](/gdpr).',
    privacyPolicyUrl: '/gdpr',
  },
};
