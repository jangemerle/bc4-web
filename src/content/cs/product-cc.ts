/**
 * BC4Cloud — Produkt: Kontaktní centrum (CS)
 *
 * Tone inspirovaný analýzou Freelo.io — konkrétní výsledky, přátelský
 * český tón, žádné "enterprise solutions" a "leverage synergies".
 *
 * Data žijí v `product-cc.json` (editovatelné přes live edit drawer). Tenhle
 * soubor je jen typovaný re-export.
 */

import type { ProductContent } from '../types';
import data from './product-cc.json';

export const productContactCenter = data as unknown as ProductContent;
