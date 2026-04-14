/**
 * Accessibility Tests — Foundation & Philosophy Pages
 *
 * Runs axe-core on documentation pages beyond components.
 * Separate file so component a11y and content a11y can be
 * triaged independently.
 *
 * Run: npm run test:a11y
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES: [string, string][] = [
  ['hello', 'Home'],
  ['typography', 'Typography'],
  ['colors', 'Colors'],
  ['shadows', 'Shadows'],
  ['border-radius', 'Border Radius'],
  ['icons', 'Icons'],
  ['spaciness', 'Spacing'],
  ['motion-guidelines', 'Motion Guidelines'],
  ['accessibility', 'Accessibility'],
  ['tone-of-voice', 'Tone of Voice'],
  ['design-principles', 'Design Principles'],
];

const DISABLED_RULES = [
  'color-contrast',
  'page-has-heading-one',
  'landmark-one-main',
  'region',
];

test.describe('Accessibility — Foundation Pages', () => {
  for (const [hash, name] of PAGES) {
    test(`${name} page passes axe audit`, async ({ page }) => {
      await page.goto(`/#${hash}`);
      await page.waitForTimeout(500);

      const results = await new AxeBuilder({ page })
        .disableRules(DISABLED_RULES)
        .analyze();

      const violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
        help: v.helpUrl,
      }));

      expect(
        violations,
        `${name} page has ${violations.length} a11y violation(s):\n${JSON.stringify(violations, null, 2)}`,
      ).toEqual([]);
    });
  }
});
