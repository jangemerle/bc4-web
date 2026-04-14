/**
 * BC4Cloud — SEO utility
 *
 * Pomocné funkce pro vkládání meta tagů, OG tagů a JSON-LD do <head>.
 *
 * Funguje bez React Helmet — přímo manipuluje document.head v useEffect.
 * Pro SSG (vite-ssg) se SEO data vykreslí už při prerenderu díky tomu,
 * že vite-ssg poskytuje hook pro headless meta nastavení.
 *
 * Použití:
 *   import { useSEO } from '@/marketing/seo';
 *   import { home } from '@/content/cs/home';
 *
 *   function HomePage() {
 *     useSEO(home.seo, '/');
 *     return <MarketingLayout>...</MarketingLayout>;
 *   }
 */

import { useEffect } from 'react';
import type { SEOMeta } from '@/content/types';

const SITE_URL = 'https://bc4cloud.cz'; // TODO: po deploy upravit

interface SEOOptions {
  /** Aktuální locale — ovlivní hreflang tagy a OG locale */
  locale?: 'cs' | 'en';
  /** Alternativní jazykové verze pro hreflang (path bez prefixu) */
  alternates?: Array<{ locale: string; path: string }>;
}

/**
 * Hook pro nastavení všech SEO meta tagů aktuální stránky.
 * @param meta — SEO objekt z content file
 * @param path — aktuální URL path (bez locale prefixu, např. "/cenik")
 * @param options — locale, alternates pro hreflang
 */
export function useSEO(meta: SEOMeta, path: string, options: SEOOptions = {}): void {
  const { locale = 'cs', alternates = [] } = options;

  useEffect(() => {
    // Title
    document.title = meta.title;

    // Standard meta tags
    setMeta('description', meta.description);
    setMeta('robots', 'index, follow');
    setMeta('language', locale);

    // Canonical
    const canonicalUrl = meta.canonical ?? `${SITE_URL}${path}`;
    setLink('canonical', canonicalUrl);

    // hreflang alternates
    alternates.forEach(alt => {
      setLink('alternate', `${SITE_URL}${alt.path}`, { hreflang: alt.locale });
    });
    setLink('alternate', canonicalUrl, { hreflang: 'x-default' });

    // Open Graph
    const ogImage = meta.ogImage.startsWith('http')
      ? meta.ogImage
      : `${SITE_URL}${meta.ogImage}`;

    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:image:width', '1200', 'property');
    setMeta('og:image:height', '630', 'property');
    setMeta('og:locale', locale === 'cs' ? 'cs_CZ' : 'en_US', 'property');
    setMeta('og:site_name', 'BC4Cloud', 'property');

    // Twitter card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', ogImage);

    // JSON-LD (volitelné per stránka)
    if (meta.jsonLd) {
      setJsonLd(meta.jsonLd);
    }

    return () => {
      // Cleanup JSON-LD při unmount, ostatní meta přepíše další stránka
      removeJsonLd();
    };
  }, [meta, path, locale, alternates]);
}

/**
 * Helper — set or update <meta name="X" content="Y">
 * Atribut: 'name' (default) | 'property' (pro OG) | 'http-equiv'
 */
function setMeta(
  key: string,
  content: string,
  attribute: 'name' | 'property' | 'http-equiv' = 'name',
): void {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

/**
 * Helper — set or update <link rel="X" href="Y">
 */
function setLink(
  rel: string,
  href: string,
  attrs: Record<string, string> = {},
): void {
  const selector = Object.entries(attrs).reduce(
    (sel, [key, value]) => `${sel}[${key}="${value}"]`,
    `link[rel="${rel}"]`,
  );

  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.href = href;
}

/**
 * Inject JSON-LD structured data jako <script type="application/ld+json">
 */
function setJsonLd(data: Record<string, unknown>): void {
  removeJsonLd();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'bc4-jsonld';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function removeJsonLd(): void {
  document.getElementById('bc4-jsonld')?.remove();
}

// ─── Schema.org factories ─────────────────────────────────────────────────────

/** Organization schema — použít na homepage */
export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BC4Cloud',
    legalName: 'BusinessCom a.s.',
    url: SITE_URL,
    logo: `${SITE_URL}/logos/bc4cloud-dark.svg`, // TODO: aktualizovat po dodání loga
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dobrušská 1797/1',
      addressLocality: 'Praha 4',
      postalCode: '147 00',
      addressCountry: 'CZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+420-261-303-303',
      contactType: 'Customer Service',
      areaServed: 'CZ',
      availableLanguage: ['Czech', 'English'],
    },
  };
}

/** Product schema — použít na produktových stránkách */
export function productSchema(name: string, description: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: { '@type': 'Brand', name: 'BC4Cloud' },
    manufacturer: { '@type': 'Organization', name: 'BusinessCom a.s.' },
  };
}

/** FAQPage schema — použít na ceníku a homepage FAQ sekci */
export function faqPageSchema(items: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'), // strip markdown links
      },
    })),
  };
}

/** BreadcrumbList — použít na podstránkách */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
