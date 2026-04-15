#!/usr/bin/env node
/**
 * scrape-bc4cz.mjs
 *
 * Scrape bc4.cz produktových stránek přes Apify cheerio-scraper.
 * Výstup: docs/bc4-web/references/bc4cz-scrape-{date}.md
 *
 * Použití:
 *   1. Mít APIFY_TOKEN v .env (žij venku z gitu)
 *   2. node scripts/scrape-bc4cz.mjs
 *
 * Co dělá:
 *   - Volá Apify cheerio-scraper synchronně (run-sync-get-dataset-items)
 *   - Pro každou URL extrahuje hlavní text content + nadpisy
 *   - Konsoliduje do markdown souboru pro Claude analýzu
 */

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

// ─── Load .env (jednoduchý parser, žádné dotenv dependency) ────────────────
function loadEnv() {
  try {
    const envPath = resolve(repoRoot, '.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // .env neexistuje — to je OK, token může být v shell env
  }
}

loadEnv();

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) {
  console.error('❌ APIFY_TOKEN not found.');
  console.error('   Vytvoř .env soubor v root projektu s obsahem:');
  console.error('   APIFY_TOKEN=apify_api_xxxxxxxxxxx');
  process.exit(1);
}

// ─── URLs k scrape ──────────────────────────────────────────────────────────
const URLS = [
  'https://bc4.cz/en/products/bc4-office-panel/',
  'https://bc4.cz/en/solutions/',
  'https://bc4.cz/en/products/bc4-softswitch-unified-communications-system/',
  'https://bc4.cz/en/products/bc4-ai-contact-center/',
  'https://bc4.cz/en/products/bc4-ai-voicebot-a-chatbot/',
  'https://bc4.cz/en/products/bc4-mobile-client/',
  'https://bc4.cz/en/products/bc4--agent-panel/',
  'https://bc4.cz/en/products/bc4-supervizor-panel/',
  'https://bc4.cz/en/products/bc4-softswitch-server/',
  'https://bc4.cz/en/',
];

// ─── Apify cheerio-scraper config ───────────────────────────────────────────
// Actor: apify/cheerio-scraper — levný, rychlý, perfektní pro statické HTML
const ACTOR_ID = 'YrQuEkowkNCLdk4j2'; // apify/cheerio-scraper

const pageFunction = `async function pageFunction(context) {
  const { request, $ } = context;
  // Strip nav, header, footer, script, style — chceme jen content
  $('nav, header, footer, script, style, noscript, .menu, .navigation').remove();

  const headings = [];
  $('h1, h2, h3, h4').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const text = $(el).text().trim();
    if (text) headings.push({ level: tag, text });
  });

  const paragraphs = [];
  $('p, li').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20) paragraphs.push(text);
  });

  return {
    url: request.url,
    title: $('title').text().trim() || $('h1').first().text().trim(),
    headings,
    paragraphs: paragraphs.slice(0, 50), // cap
  };
}`;

const input = {
  startUrls: URLS.map(url => ({ url })),
  globs: [{ glob: 'https://bc4.cz/**' }],
  pseudoUrls: [],
  linkSelector: '', // nelinkujeme dál
  pageFunction,
  proxyConfiguration: { useApifyProxy: true },
  maxRequestsPerCrawl: URLS.length,
  maxConcurrency: 5,
};

// ─── Run ───────────────────────────────────────────────────────────────────
console.log(`🚀 Spouštím Apify cheerio-scraper na ${URLS.length} URL...`);

const apifyUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${TOKEN}&timeout=180`;

const response = await fetch(apifyUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(input),
});

if (!response.ok) {
  const text = await response.text();
  console.error(`❌ Apify error ${response.status}: ${text.slice(0, 500)}`);
  process.exit(1);
}

const items = await response.json();
console.log(`✅ Scrape hotov, ${items.length} stránek načteno.`);

// ─── Format jako markdown ──────────────────────────────────────────────────
const date = new Date().toISOString().split('T')[0];
const outputPath = resolve(
  repoRoot,
  `docs/bc4-web/references/bc4cz-scrape-${date}.md`,
);

mkdirSync(dirname(outputPath), { recursive: true });

const lines = [];
lines.push(`# bc4.cz — fresh scrape ${date}`);
lines.push('');
lines.push(`Automaticky vygenerováno přes \`scripts/scrape-bc4cz.mjs\``);
lines.push(`(Apify cheerio-scraper, ${URLS.length} URL).`);
lines.push('');
lines.push('---');
lines.push('');

for (const item of items) {
  if (!item || typeof item !== 'object') continue;
  lines.push(`## ${item.title || '(no title)'}`);
  lines.push(`URL: ${item.url}`);
  lines.push('');

  if (item.headings?.length) {
    lines.push('### Headings');
    for (const h of item.headings) {
      const indent = h.level === 'h1' ? '' : h.level === 'h2' ? '  ' : '    ';
      lines.push(`${indent}- **${h.text}**`);
    }
    lines.push('');
  }

  if (item.paragraphs?.length) {
    lines.push('### Content');
    for (const p of item.paragraphs) {
      lines.push(`- ${p}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
}

writeFileSync(outputPath, lines.join('\n'), 'utf-8');
console.log(`📝 Output: ${outputPath}`);
console.log(`   Velikost: ${(lines.join('\n').length / 1024).toFixed(1)} KB`);
