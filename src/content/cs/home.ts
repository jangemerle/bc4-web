/**
 * BC4Cloud — Homepage (CS)
 *
 * Tone inspirováno analýzou Freelo.io
 * (docs/bc4-web/references/freelo-tone-analysis.md):
 *   - Konkrétní čísla místo abstraktních benefitů
 *   - Problém → emoce → řešení (ne feature list)
 *   - Neformální vykání, česky bez korporátních frází
 *   - Každé tvrzení má důkaz v dosahu (číslo, screenshot, citace)
 *   - Žádné "revoluční", "moderní", "komplexní" — prázdná slova
 *
 * ⚠️ Data žijí v `home.json` (editovatelné přes live edit drawer na webu).
 * Tenhle soubor je jen typovaný re-export. Otevřené úkoly k obsahu:
 *
 *   - trustBand.logos: až budou reálná loga + povolení, přidat outcome per logo.
 *     Příklad: { name: 'T-Mobile CZ', src: '/logos/clients/t-mobile.svg',
 *     alt: 'T-Mobile CZ — zákazník BC4Cloud', outcome: '18 % pokles AHT za 90 dní',
 *     href: '/reference/t-mobile' }
 *   - statsBand: všechna čísla ověřit s vedením BusinessComu. Teď jsou to draft
 *     hodnoty (benchmark Baymard 2023 + contact center industry reporty).
 *     Jakmile budou reálná čísla, vyměnit — nedělat z toho PR překlep.
 *   - productVideo: po nahrání videa vyměnit src. Self-hosted MP4
 *     ('/videos/bc4-showcase.mp4') nebo YouTube/Vimeo embed URL.
 *   - testimonials: skryté dokud nemáme reálnou referenci s čísly (strategy.md § 10).
 *     Nahradit reálnými citacemi se jménem, fotkou, firmou a souhlasem.
 */

import type { HomeContent } from '../types';
import data from './home.json';

export const home = data as unknown as HomeContent;
