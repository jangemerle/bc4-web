/**
 * BC4Cloud — Produkt: Volání (CS)
 *
 * Vstupní produkt — náhrada analogové ústředny pro firmy, které zatím
 * nepotřebují plný omnichannel.
 *
 * Data žijí v `product-calling.json` (editovatelné přes live edit drawer).
 * Tenhle soubor je jen typovaný re-export.
 */

import type { ProductContent } from '../types';
import data from './product-calling.json';

export const productCalling = data as unknown as ProductContent;
