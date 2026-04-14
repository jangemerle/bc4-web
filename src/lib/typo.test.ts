import { describe, it, expect, beforeEach } from 'vitest';
import { fixTypo, clearTypoCache } from './typo';

const NBSP = '\u00A0';

beforeEach(() => clearTypoCache());

describe('fixTypo — Czech', () => {
  it('binds single-letter prepositions to the following word', () => {
    expect(fixTypo('o psu a kočce i ptákovi', 'cs')).toBe(
      `o${NBSP}psu a${NBSP}kočce i${NBSP}ptákovi`,
    );
  });

  it('handles uppercase single-letter prepositions', () => {
    expect(fixTypo('V Praze', 'cs')).toBe(`V${NBSP}Praze`);
    expect(fixTypo('K dispozici', 'cs')).toBe(`K${NBSP}dispozici`);
    expect(fixTypo('S přáteli', 'cs')).toBe(`S${NBSP}přáteli`);
  });

  it('binds percent with NBSP', () => {
    expect(fixTypo('Cena 5 %', 'cs')).toBe(`Cena 5${NBSP}%`);
  });

  it('attaches ° to digit (Czech convention — no space)', () => {
    expect(fixTypo('24 °C', 'cs')).toBe('24°C');
  });

  it('binds initials with NBSP', () => {
    expect(fixTypo('J. R. R. Tolkien', 'cs')).toBe(
      `J.${NBSP}R.${NBSP}R. Tolkien`,
    );
  });

  it('binds abbreviations before names', () => {
    expect(fixTypo('p. Novák', 'cs')).toBe(`p.${NBSP}Novák`);
    expect(fixTypo('Dr. Dvořák', 'cs')).toBe(`Dr.${NBSP}Dvořák`);
  });

  it('binds digit to Kč (Kvalt custom pre-pass)', () => {
    expect(fixTypo('Cena je 250 Kč', 'cs')).toBe(`Cena je 250${NBSP}Kč`);
    expect(fixTypo('Pouze 1500 Kč měsíčně', 'cs')).toBe(
      `Pouze 1500${NBSP}Kč měsíčně`,
    );
  });

  it('converts straight quotes to Czech curly quotes', () => {
    // Czech uses „bottom“top quotes
    expect(fixTypo('Řekl "ahoj" a odešel', 'cs')).toBe(
      'Řekl „ahoj“ a\u00A0odešel',
    );
  });

  it('is idempotent — running twice yields same output', () => {
    const input = 'V Praze a okolí za 250 Kč';
    const once = fixTypo(input, 'cs');
    const twice = fixTypo(once, 'cs');
    expect(twice).toBe(once);
  });

  it('noop on empty string', () => {
    expect(fixTypo('', 'cs')).toBe('');
  });

  it('does not affect multi-letter words', () => {
    expect(fixTypo('to je dobrý den', 'cs')).toBe('to je dobrý den');
  });
});

describe('fixTypo — English', () => {
  it('binds trailing single-letter widow (a/I before final word)', () => {
    expect(fixTypo('This is a test.', 'en')).toBe(`This is a${NBSP}test.`);
  });

  it('binds trailing word to previous word via widow rule', () => {
    // typopo's en-us widow rule binds the final word to the preceding one.
    const out = fixTypo('He saw a bird.', 'en');
    expect(out).toBe(`He saw a${NBSP}bird.`);
  });

  it('converts straight quotes to English curly quotes', () => {
    expect(fixTypo('He said "hello".', 'en')).toBe('He said “hello”.');
  });

  it('is idempotent', () => {
    const input = 'This is a sentence with a widow.';
    const once = fixTypo(input, 'en');
    const twice = fixTypo(once, 'en');
    expect(twice).toBe(once);
  });
});

describe('fixTypo — cache', () => {
  it('returns cached result on repeat call', () => {
    const input = 'V Praze';
    const first = fixTypo(input, 'cs');
    const second = fixTypo(input, 'cs');
    expect(second).toBe(first);
  });

  it('clearTypoCache() resets cache', () => {
    fixTypo('V Praze', 'cs');
    clearTypoCache();
    // If this runs without error, cache survived the clear
    expect(fixTypo('V Praze', 'cs')).toBe(`V${NBSP}Praze`);
  });
});
