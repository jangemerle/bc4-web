import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DensityProvider, spacinessVars } from './DensityProvider';

describe('DensityProvider', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders children', () => {
    render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders as a div element', () => {
    render(
      <DensityProvider spaciness={1}>
        <span data-testid="child">Test</span>
      </DensityProvider>
    );
    const child = screen.getByTestId('child');
    expect(child.parentElement?.tagName).toBe('DIV');
  });

  it('applies custom className', () => {
    render(
      <DensityProvider spaciness={1} className="custom-class">
        <div>Content</div>
      </DensityProvider>
    );
    const container = screen.getByText('Content').parentElement;
    expect(container?.className).toContain('custom-class');
  });

  // ── Spaciness variables ────────────────────────────────────────────────

  it('applies spaciness CSS variable', () => {
    const { container } = render(
      <DensityProvider spaciness={0.85}>
        <div data-testid="child">Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--spaciness')).toBe('0.85');
  });

  it('applies space-xs token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--space-xs')).toBe('4px');
  });

  it('applies space-sm token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--space-sm')).toBe('8px');
  });

  it('applies space-md token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--space-md')).toBe('16px');
  });

  it('applies space-lg token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--space-lg')).toBe('24px');
  });

  it('applies space-xl token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--space-xl')).toBe('32px');
  });

  it('applies space-2xl token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--space-2xl')).toBe('48px');
  });

  it('applies space-3xl token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--space-3xl')).toBe('64px');
  });

  it('applies space-4xl token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--space-4xl')).toBe('96px');
  });

  it('applies layout-gutter token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--layout-gutter')).toBe('16px');
  });

  it('applies layout-margin token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--layout-margin')).toBe('24px');
  });

  it('applies layout-gap-tight token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--layout-gap-tight')).toBe('12px');
  });

  it('applies layout-gap-default token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--layout-gap-default')).toBe('24px');
  });

  it('applies layout-gap-section token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--layout-gap-section')).toBe('48px');
  });

  it('applies layout-gap-page token at default spaciness (1)', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    expect(provider.style.getPropertyValue('--layout-gap-page')).toBe('96px');
  });

  // ── Compact density (0.75) ─────────────────────────────────────────────

  it('scales space tokens down for compact density (0.75)', () => {
    const { container } = render(
      <DensityProvider spaciness={0.75}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    // Snap: Math.round((4 * 0.75) / 4) * 4 = Math.round(0.75) * 4 = 1 * 4 = 4px
    // space-md: Math.round((16 * 0.75) / 4) * 4 = Math.round(3) * 4 = 3 * 4 = 12px
    expect(provider.style.getPropertyValue('--space-xs')).toBe('4px');
    expect(provider.style.getPropertyValue('--space-md')).toBe('12px');
  });

  it('scales space tokens down for very compact density (0.5)', () => {
    const { container } = render(
      <DensityProvider spaciness={0.5}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    // space-sm: Math.round((8 * 0.5) / 4) * 4 = Math.round(1) * 4 = 1 * 4 = 4
    expect(provider.style.getPropertyValue('--space-sm')).toBe('4px');
  });

  // ── Spacious density (1.25) ────────────────────────────────────────────

  it('scales space tokens up for spacious density (1.25)', () => {
    const { container } = render(
      <DensityProvider spaciness={1.25}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    // space-sm: Math.round((8 * 1.25) / 4) * 4 = Math.round(2.5) * 4 = 3 * 4 = 12px
    // space-md: Math.round((16 * 1.25) / 4) * 4 = Math.round(5) * 4 = 5 * 4 = 20px
    expect(provider.style.getPropertyValue('--space-sm')).toBe('12px');
    expect(provider.style.getPropertyValue('--space-md')).toBe('20px');
  });

  it('scales space tokens up for very spacious density (1.5)', () => {
    const { container } = render(
      <DensityProvider spaciness={1.5}>
        <div>Content</div>
      </DensityProvider>
    );
    const provider = container.querySelector('div > div') as HTMLElement;
    // space-lg: Math.round((24 * 1.5) / 4) * 4 = Math.round(9) * 4 = 9 * 4 = 36
    expect(provider.style.getPropertyValue('--space-lg')).toBe('36px');
  });

  // ── Multiple children ──────────────────────────────────────────────────

  it('renders multiple children', () => {
    render(
      <DensityProvider spaciness={1}>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </DensityProvider>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
    expect(screen.getByTestId('child3')).toBeInTheDocument();
  });

  it('renders nested DensityProviders with different spaciness values', () => {
    const { container } = render(
      <DensityProvider spaciness={1}>
        <div>Outer</div>
        <DensityProvider spaciness={0.85}>
          <div data-testid="inner-content">Inner</div>
        </DensityProvider>
      </DensityProvider>
    );
    // Get the outer DensityProvider element (first div > div)
    const outer = container.querySelector('div > div') as HTMLElement;
    // Get the inner DensityProvider element (parent of inner-content)
    const innerContent = screen.getByTestId('inner-content');
    const inner = innerContent.parentElement as HTMLElement;

    expect(outer.style.getPropertyValue('--spaciness')).toBe('1');
    expect(inner.style.getPropertyValue('--spaciness')).toBe('0.85');
  });
});

describe('spacinessVars function', () => {
  // Cast helper — spacinessVars returns CSSProperties but includes custom properties
  const getVars = (s: number) => spacinessVars(s) as Record<string, string | number>;

  // ── Direct function testing ────────────────────────────────────────────

  it('returns CSSProperties object', () => {
    const vars = getVars(1);
    expect(typeof vars).toBe('object');
    expect(vars).not.toBeNull();
  });

  it('includes --spaciness property', () => {
    const vars = getVars(0.85);
    expect(vars['--spaciness']).toBe(0.85);
  });

  it('includes all space token properties', () => {
    const vars = getVars(1);
    expect(vars['--space-xs']).toBeDefined();
    expect(vars['--space-sm']).toBeDefined();
    expect(vars['--space-md']).toBeDefined();
    expect(vars['--space-lg']).toBeDefined();
    expect(vars['--space-xl']).toBeDefined();
    expect(vars['--space-2xl']).toBeDefined();
    expect(vars['--space-3xl']).toBeDefined();
    expect(vars['--space-4xl']).toBeDefined();
  });

  it('includes all layout token properties', () => {
    const vars = getVars(1);
    expect(vars['--layout-gutter']).toBeDefined();
    expect(vars['--layout-margin']).toBeDefined();
    expect(vars['--layout-gap-tight']).toBeDefined();
    expect(vars['--layout-gap-default']).toBeDefined();
    expect(vars['--layout-gap-section']).toBeDefined();
    expect(vars['--layout-gap-page']).toBeDefined();
  });

  it('returns pixel unit strings for space tokens', () => {
    const vars = getVars(1);
    expect(vars['--space-xs']).toBe('4px');
    expect(vars['--space-sm']).toBe('8px');
    expect(vars['--space-md']).toBe('16px');
  });

  it('snaps values to 4px grid for spaciness 1', () => {
    const vars = getVars(1);
    // All values should be divisible by 4
    const getNumericValue = (val: string | number | undefined): number =>
      parseInt(val as string);
    expect(getNumericValue(vars['--space-xs']) % 4).toBe(0);
    expect(getNumericValue(vars['--space-sm']) % 4).toBe(0);
    expect(getNumericValue(vars['--space-md']) % 4).toBe(0);
    expect(getNumericValue(vars['--space-lg']) % 4).toBe(0);
  });

  it('snaps values to 4px grid for spaciness 0.75', () => {
    const vars = getVars(0.75);
    const getNumericValue = (val: string | number | undefined): number =>
      parseInt(val as string);
    expect(getNumericValue(vars['--space-md']) % 4).toBe(0);
    expect(getNumericValue(vars['--space-lg']) % 4).toBe(0);
    expect(getNumericValue(vars['--layout-gutter']) % 4).toBe(0);
  });

  it('snaps values to 4px grid for spaciness 1.25', () => {
    const vars = getVars(1.25);
    const getNumericValue = (val: string | number | undefined): number =>
      parseInt(val as string);
    expect(getNumericValue(vars['--space-md']) % 4).toBe(0);
    expect(getNumericValue(vars['--space-lg']) % 4).toBe(0);
  });

  it('produces consistent values across multiple calls for same spaciness', () => {
    const vars1 = getVars(0.9);
    const vars2 = getVars(0.9);
    expect(vars1['--space-md']).toBe(vars2['--space-md']);
    expect(vars1['--space-lg']).toBe(vars2['--space-lg']);
    expect(vars1['--layout-gutter']).toBe(vars2['--layout-gutter']);
  });

  it('produces different values for different spaciness multipliers', () => {
    const compact = getVars(0.75);
    const normal = getVars(1);
    const spacious = getVars(1.25);

    const getNumericValue = (val: string | number | undefined): number =>
      parseInt(val as string);
    expect(getNumericValue(compact['--space-md'])).toBeLessThanOrEqual(
      getNumericValue(normal['--space-md'])
    );
    expect(getNumericValue(normal['--space-md'])).toBeLessThanOrEqual(
      getNumericValue(spacious['--space-md'])
    );
  });

  it('handles edge case: spaciness 0', () => {
    const vars = getVars(0);
    expect(vars['--spaciness']).toBe(0);
    // All should be 0px
    expect(vars['--space-xs']).toBe('0px');
    expect(vars['--space-md']).toBe('0px');
  });

  it('handles edge case: high spaciness (2)', () => {
    const vars = getVars(2);
    expect(vars['--spaciness']).toBe(2);
    // Values should double
    expect(vars['--space-md']).toBe('32px'); // 16 * 2 = 32
    expect(vars['--space-lg']).toBe('48px'); // 24 * 2 = 48
  });
});
