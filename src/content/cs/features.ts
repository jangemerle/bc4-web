/**
 * BC4Cloud — Stránka Funkce (CS)
 *
 * Detailní přehled jednotlivých částí aplikace, inspirováno strukturou
 * bronet.cz/cs/bc4-call-centrum/. Hlubší než homepage FeatureShowcase —
 * pokrývá Panel operátora, Karta hovoru, Panel Front, Callback, Statistiky,
 * Supervizor, CDR, Reporty, Wallboard, Mobile Client, AI Voicebot.
 *
 * Data žijí v `features.json` (editovatelné přes live edit drawer). Tenhle
 * soubor je jen typovaný re-export.
 */

import type { ProductContent } from '../types';
import data from './features.json';

export const features = data as unknown as ProductContent;
