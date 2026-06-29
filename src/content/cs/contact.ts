/**
 * BC4Cloud — Kontakt (CS)
 *
 * Alternativa k poptávkovému formuláři pro lidi, kteří chtějí mluvit přímo.
 * Kontaktní údaje MUSÍ být ověřeny s BusinessComem před publikací.
 *
 * Data žijí v `contact.json` (editovatelné přes live edit drawer). Tenhle
 * soubor je jen typovaný re-export.
 */

import type { ContactContent } from '../types';
import data from './contact.json';

export const contact = data as unknown as ContactContent;
