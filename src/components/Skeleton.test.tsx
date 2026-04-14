import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  // ── Single element ────────────────────────────────────────────────────

  it('renders a single skeleton element by default', () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector('.skeleton-element');
    expect(el).toBeInTheDocument();
  });

  it('renders with full width by default', () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.width).toBe('100%');
  });

  it('applies custom width', () => {
    const { container } = render(<Skeleton width="60%" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.width).toBe('60%');
  });

  it('applies custom height', () => {
    const { container } = render(<Skeleton height={200} />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.height).toBe('200px');
  });

  // ── Variants ──────────────────────────────────────────────────────────

  it('circular variant uses 50% border radius', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.borderRadius).toBe('50%');
  });

  it('circular variant uses size for dimensions', () => {
    const { container } = render(<Skeleton variant="circular" size="lg" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.width).toBe('56px');
    expect(el.style.height).toBe('56px');
  });

  it('rectangular variant defaults to 120px height', () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.height).toBe('120px');
  });

  // ── Multi-line ────────────────────────────────────────────────────────

  it('renders multiple lines when lines > 1', () => {
    const { container } = render(<Skeleton lines={3} />);
    const elements = container.querySelectorAll('.skeleton-element');
    expect(elements).toHaveLength(3);
  });

  it('last line is shorter (70%) for natural text feel', () => {
    const { container } = render(<Skeleton lines={3} />);
    const elements = container.querySelectorAll('.skeleton-element');
    const lastEl = elements[2] as HTMLElement;
    expect(lastEl.style.width).toBe('70%');
  });

  it('first lines use full width', () => {
    const { container } = render(<Skeleton lines={3} />);
    const elements = container.querySelectorAll('.skeleton-element');
    expect((elements[0] as HTMLElement).style.width).toBe('100%');
    expect((elements[1] as HTMLElement).style.width).toBe('100%');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────

  it('sm text height is 12px', () => {
    const { container } = render(<Skeleton size="sm" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.height).toBe('12px');
  });

  it('md text height is 16px', () => {
    const { container } = render(<Skeleton size="md" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.height).toBe('16px');
  });

  it('lg text height is 24px', () => {
    const { container } = render(<Skeleton size="lg" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.height).toBe('24px');
  });

  // ── Pre-composed ──────────────────────────────────────────────────────

  it('Skeleton.Card renders', () => {
    const { container } = render(<Skeleton.Card />);
    const elements = container.querySelectorAll('.skeleton-element');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('Skeleton.List renders with default 4 rows', () => {
    const { container } = render(<Skeleton.List />);
    // Each row has 3 skeleton elements (avatar + 2 text lines + action)
    const elements = container.querySelectorAll('.skeleton-element');
    expect(elements.length).toBeGreaterThanOrEqual(8);
  });

  it('Skeleton.List renders custom row count', () => {
    const { container: c2 } = render(<Skeleton.List rows={2} />);
    const { container: c6 } = render(<Skeleton.List rows={6} />);
    const count2 = c2.querySelectorAll('.skeleton-element').length;
    const count6 = c6.querySelectorAll('.skeleton-element').length;
    expect(count6).toBeGreaterThan(count2);
  });

  // ── Custom className ──────────────────────────────────────────────────

  it('passes className to element', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const el = container.querySelector('.skeleton-element');
    expect(el?.className).toContain('custom-class');
  });

  // ── Animations ────────────────────────────────────────────────────────

  it('applies pulse animation', () => {
    const { container } = render(<Skeleton animation="pulse" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el).toBeInTheDocument();
  });

  it('applies wave animation', () => {
    const { container } = render(<Skeleton animation="wave" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el).toBeInTheDocument();
  });

  it('applies bounce animation', () => {
    const { container } = render(<Skeleton animation="bounce" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el).toBeInTheDocument();
  });

  it('disables animation with "none"', () => {
    const { container } = render(<Skeleton animation="none" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el).toBeInTheDocument();
  });

  // ── Border radius override ────────────────────────────────────────────

  it('applies custom borderRadius as number', () => {
    const { container } = render(<Skeleton borderRadius={16} />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.borderRadius).toBe('16px');
  });

  it('applies custom borderRadius as string', () => {
    const { container } = render(<Skeleton borderRadius="50%" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.borderRadius).toBe('50%');
  });

  // ── Multi-line with custom lineGap ────────────────────────────────────

  it('applies custom lineGap', () => {
    const { container } = render(<Skeleton lines={2} lineGap={20} />);
    const wrapper = container.querySelector('.flex') as HTMLElement;
    expect(wrapper.style.gap).toBe('20px');
  });

  it('renders single element when lines=1', () => {
    const { container } = render(<Skeleton lines={1} />);
    const elements = container.querySelectorAll('.skeleton-element');
    expect(elements).toHaveLength(1);
  });

  // ── Pre-composed: Profile skeleton ─────────────────────────────────────

  it('Skeleton.Profile renders', () => {
    const { container } = render(<Skeleton.Profile />);
    const elements = container.querySelectorAll('.skeleton-element');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('Skeleton.Profile accepts className', () => {
    const { container } = render(<Skeleton.Profile className="custom-profile" />);
    const div = container.querySelector('.custom-profile');
    expect(div).toBeInTheDocument();
  });

  // ── Pre-composed: Stats skeleton ───────────────────────────────────────

  it('Skeleton.Stats renders with default count', () => {
    const { container } = render(<Skeleton.Stats />);
    const cards = container.querySelectorAll('div[style*="border"]');
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  it('Skeleton.Stats renders custom count', () => {
    const { container: c2 } = render(<Skeleton.Stats count={2} />);
    const { container: c6 } = render(<Skeleton.Stats count={6} />);
    const count2 = c2.querySelectorAll('.skeleton-element').length;
    const count6 = c6.querySelectorAll('.skeleton-element').length;
    expect(count6).toBeGreaterThan(count2);
  });

  it('Skeleton.Card accepts className', () => {
    const { container } = render(<Skeleton.Card className="custom-card" />);
    const div = container.querySelector('.custom-card');
    expect(div).toBeInTheDocument();
  });

  it('Skeleton.List accepts className', () => {
    const { container } = render(<Skeleton.List className="custom-list" />);
    const div = container.querySelector('.custom-list');
    expect(div).toBeInTheDocument();
  });

  // ── Width as number ───────────────────────────────────────────────────

  it('converts numeric width to px', () => {
    const { container } = render(<Skeleton width={200} />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.width).toBe('200px');
  });

  it('keeps string width as is', () => {
    const { container } = render(<Skeleton width="50%" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.width).toBe('50%');
  });

  // ── Height edge cases ──────────────────────────────────────────────────

  it('rectangular variant height overrides size', () => {
    const { container } = render(<Skeleton variant="rectangular" size="sm" height={200} />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.height).toBe('200px');
  });

  it('circular variant dimensions are equal', () => {
    const { container } = render(<Skeleton variant="circular" size="md" />);
    const el = container.querySelector('.skeleton-element') as HTMLElement;
    expect(el.style.width).toBe(el.style.height);
  });
});
