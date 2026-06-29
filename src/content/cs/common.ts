/**
 * BC4Cloud — Common content (CS)
 *
 * Sdílený obsah napříč stránkami: navigace, footer, globální CTA, legal texty.
 *
 * ⚠️ Obsah je v přípravné fázi. Finální čísla/reference/kontakty ověřit s BusinessComem
 * před deployem (viz strategy.md § 10 otevřené otázky).
 *
 * Data žijí v `common.json` (editovatelné přes live edit drawer). Tenhle
 * soubor je jen typovaný re-export.
 */

import type { CommonContent } from '../types';
import data from './common.json';

export const common = data as unknown as CommonContent;
