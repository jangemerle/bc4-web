#!/usr/bin/env node

/**
 * Stage a Recraft-generated asset into a Pencil session folder.
 *
 * Usage:
 *   node scripts/stage-recraft-assets.mjs <session> <source> <name>
 *
 * Arguments:
 *   session  — Session folder name (e.g. "lebowski-dashboard")
 *   source   — UUID filename or full path from public/recraft-output/
 *   name     — Human-readable name for the asset (e.g. "trophy", "hero-badge")
 *
 * Examples:
 *   node scripts/stage-recraft-assets.mjs lebowski-dashboard 206ec767-db48-4de9-8359-018a74f618d1.webp trophy
 *   node scripts/stage-recraft-assets.mjs league-cards /full/path/to/file.svg crest
 *
 * The script:
 *   1. Copies the file to pencil/assets/<session>/<name>.<ext>
 *   2. Creates or updates manifest.json in that session folder
 *   3. Prints the relative path for use in Pencil prompts
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const RECRAFT_OUTPUT = join(ROOT, 'public', 'recraft-output');
const ASSETS_DIR = join(ROOT, 'pencil', 'assets');

const [session, sourceArg, name] = process.argv.slice(2);

if (!session || !sourceArg || !name) {
  console.error('Usage: stage-recraft-assets.mjs <session> <source-file> <name>');
  console.error('  session  — folder name (e.g. "lebowski-dashboard")');
  console.error('  source   — UUID filename or full path from recraft-output/');
  console.error('  name     — human name without extension (e.g. "trophy")');
  process.exit(1);
}

// Resolve source path — accept UUID filename or full path
const sourcePath = existsSync(sourceArg)
  ? resolve(sourceArg)
  : join(RECRAFT_OUTPUT, sourceArg);

if (!existsSync(sourcePath)) {
  console.error(`Source not found: ${sourcePath}`);
  console.error(`Available in recraft-output/:`);
  const { readdirSync } = await import('node:fs');
  readdirSync(RECRAFT_OUTPUT).forEach(f => console.error(`  ${f}`));
  process.exit(1);
}

// Create session directory
const sessionDir = join(ASSETS_DIR, session);
mkdirSync(sessionDir, { recursive: true });

// Copy with human-readable name
const ext = extname(sourcePath);
const destFile = `${name}${ext}`;
const destPath = join(sessionDir, destFile);
copyFileSync(sourcePath, destPath);

// Load or create manifest
const manifestPath = join(sessionDir, 'manifest.json');
let manifest;

if (existsSync(manifestPath)) {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} else {
  manifest = {
    session,
    created: new Date().toISOString().split('T')[0],
    penFile: '',
    description: '',
    status: 'active',
    assets: [],
  };
}

// Check if asset with same name already exists — replace it
const existingIdx = manifest.assets.findIndex(a => a.file === destFile);
const assetEntry = {
  file: destFile,
  type: 'other',
  recraftStyle: '',
  recraftSubstyle: '',
  prompt: '',
  sourceUUID: basename(sourcePath),
  postProcessing: [],
  pickedFrom: 4,
};

if (existingIdx >= 0) {
  manifest.assets[existingIdx] = { ...manifest.assets[existingIdx], ...assetEntry };
} else {
  manifest.assets.push(assetEntry);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// Output the relative path for Pencil prompts
const relPath = `./assets/${session}/${destFile}`;
console.log(`✓ Staged: ${relPath}`);
console.log(`  Source: ${basename(sourcePath)}`);
console.log(`  Manifest: ${manifest.assets.length} asset(s) in session "${session}"`);
console.log(`\n  Use in Pencil prompt:`);
console.log(`    fill: { type: "image", url: "${relPath}", mode: "fit" }`);
