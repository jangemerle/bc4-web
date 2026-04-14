#!/usr/bin/env node
/**
 * Kvalt Image Optimizer
 *
 * Resizes and compresses images in public/illustrations/ for web delivery.
 * Generates optimized versions at target dimensions with WebP + original format.
 *
 * Usage:
 *   node scripts/optimize-images.mjs                     # Process all
 *   node scripts/optimize-images.mjs envelope.png        # Process one file
 *   node scripts/optimize-images.mjs --width=600         # Custom width
 *   node scripts/optimize-images.mjs --quality=85        # Custom quality
 *   node scripts/optimize-images.mjs --no-recolor        # Skip hue/sat adjustment
 *   node scripts/optimize-images.mjs --dry-run           # Preview only
 */

import sharp from 'sharp';
import { readdir, stat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, parse, extname } from 'node:path';

// ─── Config ───────────────────────────────────────────────────────────────────
const ILLUSTRATIONS_DIR = 'public/illustrations';
const OPTIMIZED_DIR     = 'public/illustrations/optimized';
const SUPPORTED_EXTS    = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

// Default: 400px wide (200px @2x retina), adjustable via --width flag
const DEFAULT_WIDTH   = 400;
const DEFAULT_QUALITY = 80;

// ─── Kvalt color adjustment ──────────────────────────────────────────────────
// Matches the Photoshop Hue/Saturation edit applied to Icons8 Ouch illustrations
// to fit the Kvalt brand palette. Original values: Hue -154°, Saturation -40.
// Sharp's modulate: hue = degree rotation, saturation = multiplier (1.0 = no change).
// Photoshop -40 on ±100 scale → 0.60 multiplier (60% of original saturation).
const KVALT_HUE_SHIFT     = -154;  // degrees
const KVALT_SAT_MULTIPLIER = 0.60; // Photoshop -40 → 60% of original

// ─── Parse CLI args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {};
const files = [];

for (const arg of args) {
  if (arg.startsWith('--')) {
    const [key, val] = arg.slice(2).split('=');
    flags[key] = val ?? true;
  } else {
    files.push(arg);
  }
}

const targetWidth = parseInt(flags.width, 10) || DEFAULT_WIDTH;
const quality     = parseInt(flags.quality, 10) || DEFAULT_QUALITY;
const dryRun      = flags['dry-run'] === true;
const recolor     = flags['no-recolor'] !== true; // default: apply Kvalt color shift

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function reduction(original, optimized) {
  const pct = ((1 - optimized / original) * 100).toFixed(1);
  return `${pct}%`;
}

async function getImageFiles() {
  const entries = await readdir(ILLUSTRATIONS_DIR);
  return entries.filter(f => {
    const ext = extname(f).toLowerCase();
    return SUPPORTED_EXTS.has(ext) && !f.startsWith('.');
  });
}

// ─── Process a single image ──────────────────────────────────────────────────
async function processImage(filename) {
  const inputPath  = join(ILLUSTRATIONS_DIR, filename);
  const { name, ext } = parse(filename);
  const isGif = ext.toLowerCase() === '.gif';

  const inputStat = await stat(inputPath);
  const inputSize = inputStat.size;

  const results = [];

  if (isGif) {
    // For GIFs: resize using sharp's animated GIF support
    // Sharp supports animated GIFs — resize all frames
    const inputBuffer = await readFile(inputPath);
    const metadata = await sharp(inputBuffer, { animated: true }).metadata();

    // Resize GIF (preserves animation) + optional color adjustment
    let gifPipeline = sharp(inputBuffer, { animated: true })
      .resize(targetWidth, null, { fit: 'inside', withoutEnlargement: true });
    if (recolor) {
      gifPipeline = gifPipeline.modulate({ hue: KVALT_HUE_SHIFT, saturation: KVALT_SAT_MULTIPLIER });
    }
    const resizedBuffer = await gifPipeline.gif({ effort: 7 }).toBuffer();

    const outputName = `${name}-${targetWidth}w.gif`;
    const outputPath = join(OPTIMIZED_DIR, outputName);

    if (!dryRun) {
      await writeFile(outputPath, resizedBuffer);
    }

    results.push({
      output: outputName,
      originalSize: inputSize,
      optimizedSize: resizedBuffer.length,
      format: 'gif',
      frames: metadata.pages || 1,
    });

    // Also generate a WebP version (static first frame for fallback)
    let gifWebpPipeline = sharp(inputBuffer)
      .resize(targetWidth, null, { fit: 'inside', withoutEnlargement: true });
    if (recolor) {
      gifWebpPipeline = gifWebpPipeline.modulate({ hue: KVALT_HUE_SHIFT, saturation: KVALT_SAT_MULTIPLIER });
    }
    const webpBuffer = await gifWebpPipeline.webp({ quality, effort: 6 }).toBuffer();

    const webpName = `${name}-${targetWidth}w.webp`;
    const webpPath = join(OPTIMIZED_DIR, webpName);

    if (!dryRun) {
      await writeFile(webpPath, webpBuffer);
    }

    results.push({
      output: webpName,
      originalSize: inputSize,
      optimizedSize: webpBuffer.length,
      format: 'webp (static fallback)',
    });

  } else {
    // For static images: generate optimized original format + WebP
    const inputBuffer = await readFile(inputPath);

    // 1. Optimized original format (PNG → optimized PNG, JPG → optimized JPG)
    let pipeline = sharp(inputBuffer)
      .resize(targetWidth, null, { fit: 'inside', withoutEnlargement: true });
    if (recolor) {
      pipeline = pipeline.modulate({ hue: KVALT_HUE_SHIFT, saturation: KVALT_SAT_MULTIPLIER });
    }

    let outputBuffer;
    const lowerExt = ext.toLowerCase();

    if (lowerExt === '.png') {
      outputBuffer = await pipeline.png({ quality, compressionLevel: 9, palette: true, effort: 10 }).toBuffer();
    } else if (lowerExt === '.jpg' || lowerExt === '.jpeg') {
      outputBuffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    } else if (lowerExt === '.webp') {
      outputBuffer = await pipeline.webp({ quality, effort: 6 }).toBuffer();
    }

    const origOutputName = `${name}-${targetWidth}w${ext}`;
    const origOutputPath = join(OPTIMIZED_DIR, origOutputName);

    if (!dryRun) {
      await writeFile(origOutputPath, outputBuffer);
    }

    results.push({
      output: origOutputName,
      originalSize: inputSize,
      optimizedSize: outputBuffer.length,
      format: lowerExt.slice(1),
    });

    // 2. WebP version (always, unless input is already WebP)
    if (lowerExt !== '.webp') {
      let webpPipeline = sharp(inputBuffer)
        .resize(targetWidth, null, { fit: 'inside', withoutEnlargement: true });
      if (recolor) {
        webpPipeline = webpPipeline.modulate({ hue: KVALT_HUE_SHIFT, saturation: KVALT_SAT_MULTIPLIER });
      }
      const webpBuffer = await webpPipeline.webp({ quality, effort: 6 }).toBuffer();

      const webpName = `${name}-${targetWidth}w.webp`;
      const webpPath = join(OPTIMIZED_DIR, webpName);

      if (!dryRun) {
        await writeFile(webpPath, webpBuffer);
      }

      results.push({
        output: webpName,
        originalSize: inputSize,
        optimizedSize: webpBuffer.length,
        format: 'webp',
      });
    }
  }

  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🖼️  Kvalt Image Optimizer`);
  console.log(`   Target: ${targetWidth}px wide · Quality: ${quality} · ${recolor ? 'Kvalt recolor ON' : 'No recolor'} · ${dryRun ? 'DRY RUN' : 'Live'}\n`);

  // Ensure output directory exists
  if (!dryRun) {
    await mkdir(OPTIMIZED_DIR, { recursive: true });
  }

  // Get files to process
  let imageFiles;
  if (files.length > 0) {
    imageFiles = files;
  } else {
    imageFiles = await getImageFiles();
  }

  if (imageFiles.length === 0) {
    console.log('   No images found to optimize.');
    return;
  }

  let totalOriginal  = 0;
  let totalOptimized = 0;

  for (const file of imageFiles) {
    try {
      const results = await processImage(file);

      for (const r of results) {
        totalOriginal  += r.originalSize;
        totalOptimized += r.optimizedSize;

        const frameInfo = r.frames ? ` (${r.frames} frames)` : '';
        console.log(
          `   ${file} → ${r.output}${frameInfo}`
        );
        console.log(
          `      ${formatBytes(r.originalSize)} → ${formatBytes(r.optimizedSize)} (${reduction(r.originalSize, r.optimizedSize)} smaller)\n`
        );
      }
    } catch (err) {
      console.error(`   ✗ ${file}: ${err.message}`);
    }
  }

  console.log(`   ─────────────────────────────────`);
  console.log(`   Total: ${formatBytes(totalOriginal)} → ${formatBytes(totalOptimized)} (${reduction(totalOriginal, totalOptimized)} saved)`);
  console.log(`   Output: ${OPTIMIZED_DIR}/\n`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
