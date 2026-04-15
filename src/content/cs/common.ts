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
    tagline: 'Kontaktní centrum, co šetří hodiny denně',
    logoDark: '/logos/bc4cloud-dark.svg',   // TODO: získat od BusinessComu
    logoLight: '/logos/bc4cloud-light.svg', // TODO: získat od BusinessComu
  },
  nav: {
    primary: [
      { label: 'Funkce', href: '/funkce' },
      { label: 'Ceník', href: '/cenik' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    primaryCta: {
      label: 'Domluvit ukázku',
      href: '/poptavka',
      trackingId: 'cta_header',
    },
  },
  footer: {
    tagline: 'BC4Cloud je od BusinessComu. Postavené v Praze pro české a evropské firmy, které nechtějí další enterprise bludiště.',
    columns: [
      {
        title: 'Produkt',
        links: [
          { label: 'Funkce', href: '/funkce' },
          { label: 'Ceník', href: '/cenik' },
          { label: 'Kontakt', href: '/kontakt' },
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
    headline: 'Ať vám přestanou utíkat hovory.',
    subheadline: 'Ukážeme vám BC4Cloud na reálném příkladu, který sedí vašemu byznysu. Bez prodejních skriptů, bez závazku.',
    cta: {
      label: 'Domluvit ukázku',
      href: '/poptavka',
      trackingId: 'cta_pre_footer',
    },
  },
  legal: {
    gdprConsentLabel: 'Souhlasím se zpracováním osobních údajů',
    gdprConsentDetails: 'Vaše údaje použijeme jen k tomu, abychom vám zavolali ohledně BC4Cloudu. Nikomu je nepřeprodáme. Detaily v [zásadách ochrany osobních údajů](/gdpr).',
    privacyPolicyUrl: '/gdpr',
  },
};
