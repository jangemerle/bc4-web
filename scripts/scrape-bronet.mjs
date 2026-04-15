#!/usr/bin/env node
/**
 * scrape-bronet.mjs
 *
 * Scrape bronet.cz/cs/bc4-call-centrum/ (Janova předchozí verze BC4 stránky)
 * + stáhne všechny obrázky lokálně do public/product/bronet/.
 */

import { writeFileSync, mkdirSync, readFileSync, createWriteStream } from 'node:fs';
import { dirname, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

function loadEnv() {
  try {
    const content = readFileSync(resolve(repoRoot, '.env'), 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {}
}

loadEnv();

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) {
  console.error('❌ APIFY_TOKEN not found in .env');
  process.exit(1);
}

const TARGET_URL = 'https://www.bronet.cz/cs/bc4-call-centrum/';
const ACTOR_ID = 'YrQuEkowkNCLdk4j2'; // apify/cheerio-scraper

const pageFunction = `async function pageFunction(context) {
  const { request, $ } = context;
  $('script, style, noscript').remove();

  // Headings + content
  const headings = [];
  $('h1, h2, h3, h4').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const text = $(el).text().trim();
    if (text) headings.push({ level: tag, text });
  });

  const paragraphs = [];
  $('p, li').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10) paragraphs.push(text);
  });

  // Images — vyloučíme ty, co očividně nejsou content (logos, icons)
  const images = [];
  const seen = new Set();
  $('img').each((_, el) => {
    const $img = $(el);
    let src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
    if (!src) return;
    // Resolve absolute
    if (src.startsWith('//')) src = 'https:' + src;
    else if (src.startsWith('/')) src = new URL(src, request.url).href;
    if (seen.has(src)) return;
    seen.add(src);
    images.push({
      src,
      alt: $img.attr('alt') || '',
      width: $img.attr('width') || null,
      height: $img.attr('height') || null,
    });
  });

  return {
    url: request.url,
    title: $('title').text().trim() || $('h1').first().text().trim(),
    headings,
    paragraphs,
    images,
  };
}`;

const input = {
  startUrls: [{ url: TARGET_URL }],
  pageFunction,
  proxyConfiguration: { useApifyProxy: true },
  maxRequestsPerCrawl: 1,
};

console.log(`🚀 Scraping ${TARGET_URL}...`);

const apifyUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${TOKEN}&timeout=120`;

const response = await fetch(apifyUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(input),
});

if (!response.ok) {
  console.error(`❌ Apify error ${response.status}: ${(await response.text()).slice(0, 500)}`);
  process.exit(1);
}

const items = await response.json();
const data = items[0];
if (!data) {
  console.error('❌ No data returned');
  process.exit(1);
}

console.log(`✅ Scrape hotov`);
console.log(`   ${data.headings.length} headings`);
console.log(`   ${data.paragraphs.length} paragraphs`);
console.log(`   ${data.images.length} images`);

// ─── Stáhnout obrázky ──────────────────────────────────────────────────────
const imagesDir = resolve(repoRoot, 'public/product/bronet');
mkdirSync(imagesDir, { recursive: true });

console.log(`\n📥 Stahuji obrázky do public/product/bronet/...`);

const downloadedImages = [];
for (const img of data.images) {
  try {
    // Sanitize filename
    let filename = basename(new URL(img.src).pathname).split('?')[0];
    if (!filename || filename === '/') {
      filename = `image-${downloadedImages.length + 1}.jpg`;
    }
    // Skip tiny/icon-like files based on extension or known bad names
    if (filename.endsWith('.svg') && filename.includes('icon')) continue;

    const localPath = resolve(imagesDir, filename);
    const res = await fetch(img.src);
    if (!res.ok) {
      console.log(`  ⚠️  ${filename} → ${res.status}`);
      continue;
    }
    await pipeline(res.body, createWriteStream(localPath));
    const sizeKb = (parseInt(res.headers.get('content-length') ?? '0', 10) / 1024).toFixed(1);
    console.log(`  ✓ ${filename} (${sizeKb} KB)`);
    downloadedImages.push({ ...img, localPath: `/product/bronet/${filename}` });
  } catch (err) {
    console.log(`  ⚠️  ${img.src.slice(0, 60)} — ${err.message}`);
  }
}

// ─── Markdown report ───────────────────────────────────────────────────────
const date = new Date().toISOString().split('T')[0];
const outputPath = resolve(
  repoRoot,
  `docs/bc4-web/references/bronet-cz-scrape-${date}.md`,
);
mkdirSync(dirname(outputPath), { recursive: true });

const lines = [];
lines.push(`# bronet.cz/cs/bc4-call-centrum — scrape ${date}`);
lines.push('');
lines.push(`Source: ${TARGET_URL}`);
lines.push(`Předchozí Janova verze BC4 marketing stránky.`);
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Headings');
for (const h of data.headings) {
  const indent = h.level === 'h1' ? '' : h.level === 'h2' ? '  ' : '    ';
  lines.push(`${indent}- **${h.level.toUpperCase()}** ${h.text}`);
}
lines.push('');
lines.push('## Content (paragraphs + list items)');
for (const p of data.paragraphs) {
  lines.push(`- ${p}`);
}
lines.push('');
lines.push(`## Images (${downloadedImages.length} downloaded → public/product/bronet/)`);
for (const img of downloadedImages) {
  lines.push('');
  lines.push(`### \`${basename(img.localPath)}\``);
  lines.push(`- **Alt:** ${img.alt || '(no alt)'}`);
  lines.push(`- **Original:** ${img.src}`);
  lines.push(`- **Local:** ${img.localPath}`);
  if (img.width || img.height) lines.push(`- **Size:** ${img.width}×${img.height}`);
}

writeFileSync(outputPath, lines.join('\n'), 'utf-8');
console.log(`\n📝 Report: ${outputPath}`);
console.log(`📁 Images: public/product/bronet/ (${downloadedImages.length} files)`);
