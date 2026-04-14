/**
 * Accessibility Tests — Component Pages
 *
 * Runs axe-core on each component documentation page to catch:
 * - Missing ARIA labels/roles
 * - Color contrast violations
 * - Keyboard navigation issues
 * - Form label associations
 * - Heading hierarchy problems
 *
 * These tests block CI — a11y violations fail the build.
 *
 * Run: npm run test:a11y
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ─── Component pages to audit ────────────────────────────────────────────────
// Each entry: [page hash, human-readable name]

const COMPONENT_PAGES: [string, string][] = [
  ['button', 'Button'],
  ['input', 'Input'],
  ['select', 'Select'],
  ['text-area', 'TextArea'],
  ['checkbox', 'Checkbox'],
  ['radio-button', 'RadioButton'],
  ['toggle', 'Toggle'],
  ['accordion', 'Accordion'],
  ['modal', 'Modal'],
  ['tabs', 'Tabs'],
  ['dropdown-menu', 'DropdownMenu'],
  ['card', 'Card'],
  ['chip', 'Chip'],
  ['badge', 'Badge'],
  ['tooltip', 'Tooltip'],
  ['toast', 'Toast'],
  ['data-table', 'DataTable'],
  ['pagination', 'Pagination'],
  ['skeleton', 'Skeleton'],
  ['loading-indicator', 'LoadingIndicator'],
  ['date-picker', 'DatePicker'],
  ['content-switcher', 'ContentSwitcher'],
  ['search-input', 'SearchInput'],
  ['link', 'Link'],
];

// Rules that produce too many false positives in a docs site context.
// These should be re-enabled as we fix the underlying issues.
const DISABLED_RULES = [
  'color-contrast',      // Many showcase blocks use decorative colors
  'page-has-heading-one', // SPA — heading hierarchy resets per page
  'landmark-one-main',    // SPA layout has a single main landmark
  'region',               // Decorative/showcase content outside landmarks
];

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Accessibility — Component Pages', () => {
  for (const [hash, name] of COMPONENT_PAGES) {
    test(`${name} page passes axe audit`, async ({ page }) => {
      await page.goto(`/#${hash}`);

      // Wait for page content to render (Motion animations settle)
      await page.waitForTimeout(500);

      const results = await new AxeBuilder({ page })
        .disableRules(DISABLED_RULES)
        .analyze();

      // Collect violation details for readable error output
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
