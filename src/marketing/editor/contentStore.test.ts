import { afterEach, describe, expect, it } from 'vitest';
import {
  enumerateFields,
  getByPath,
  getChanges,
  getEditPayload,
  getNamespace,
  hasChanges,
  resetAll,
  setValueByPath,
} from './contentStore';

afterEach(() => {
  resetAll();
});

describe('contentStore', () => {
  it('starts with no changes', () => {
    expect(hasChanges()).toBe(false);
    expect(getChanges()).toHaveLength(0);
  });

  it('reads a known nested string by path', () => {
    const headline = getByPath(getNamespace('home'), 'hero.headline');
    expect(typeof headline).toBe('string');
    expect((headline as string).length).toBeGreaterThan(0);
  });

  it('setValueByPath updates the live value and is immutable', () => {
    const before = getNamespace('home');
    setValueByPath('home', 'hero.headline', 'Nový headline');
    const after = getNamespace('home');

    expect(getByPath(after, 'hero.headline')).toBe('Nový headline');
    expect(after).not.toBe(before); // new top reference
    expect(getByPath(before, 'hero.headline')).not.toBe('Nový headline'); // old untouched
  });

  it('tracks changes and resets cleanly', () => {
    setValueByPath('home', 'hero.headline', 'Změněno');
    expect(hasChanges()).toBe(true);
    const changes = getChanges();
    expect(changes).toEqual([
      expect.objectContaining({ ns: 'home', path: 'hero.headline', after: 'Změněno' }),
    ]);

    resetAll();
    expect(hasChanges()).toBe(false);
  });

  it('reverting a value to its original drops it from changes', () => {
    const original = getByPath(getNamespace('home'), 'hero.headline') as string;
    setValueByPath('home', 'hero.headline', 'X');
    expect(hasChanges()).toBe(true);
    setValueByPath('home', 'hero.headline', original);
    expect(hasChanges()).toBe(false);
  });

  it('builds an edit payload keyed by file and path', () => {
    setValueByPath('home', 'hero.headline', 'A');
    setValueByPath('contact', 'hero.headline', 'B');
    const payload = getEditPayload();

    expect(payload['src/content/cs/home.json']).toMatchObject({ 'hero.headline': 'A' });
    expect(payload['src/content/cs/contact.json']).toMatchObject({ 'hero.headline': 'B' });
  });

  it('enumerates editable fields with sections and flags technical keys', () => {
    const fields = enumerateFields('home');
    expect(fields.length).toBeGreaterThan(0);

    const headline = fields.find((f) => f.path === 'hero.headline');
    expect(headline).toMatchObject({ section: 'hero', type: 'string', technical: false });

    // hrefs/trackingIds are flagged technical
    const technical = fields.filter((f) => f.technical);
    expect(technical.some((f) => f.key === 'href' || f.key === 'trackingId')).toBe(true);
  });

  it('handles array-index paths (faq items)', () => {
    const fields = enumerateFields('home');
    const arrayField = fields.find((f) => /\.\d+\./.test(f.path));
    expect(arrayField).toBeDefined();

    // round-trips through set/get
    setValueByPath('home', arrayField!.path, 'Edited array leaf');
    expect(getByPath(getNamespace('home'), arrayField!.path)).toBe('Edited array leaf');
  });
});
