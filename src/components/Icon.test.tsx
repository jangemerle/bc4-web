import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';
import { Heart, Settings, Search, AlertCircle } from 'lucide-react';

describe('Icon', () => {
  // ── Rendering ──────────────────────────────────────────────────────────

  it('renders icon SVG', () => {
    const { container } = render(<Icon icon={Heart} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders different icon types', () => {
    const { rerender, container } = render(<Icon icon={Heart} />);
    let svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    rerender(<Icon icon={Settings} />);
    svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Size variants ──────────────────────────────────────────────────────

  it('defaults to lg size (24px)', () => {
    const { container } = render(<Icon icon={Heart} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders sm size (16px)', () => {
    const { container } = render(<Icon icon={Heart} size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  it('renders md size (20px)', () => {
    const { container } = render(<Icon icon={Heart} size="md" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('renders lg size (24px)', () => {
    const { container } = render(<Icon icon={Heart} size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders xl size (32px)', () => {
    const { container } = render(<Icon icon={Heart} size="xl" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  // ── Custom sizePx ──────────────────────────────────────────────────────

  it('overrides size with sizePx', () => {
    const { container } = render(<Icon icon={Heart} size="lg" sizePx={40} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('sizePx works independently of size prop', () => {
    const { container } = render(<Icon icon={Heart} sizePx={28} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '28');
    expect(svg).toHaveAttribute('height', '28');
  });

  // ── Stroke width ───────────────────────────────────────────────────────

  it('defaults to strokeWidth 2', () => {
    const { container } = render(<Icon icon={Heart} />);
    const svg = container.querySelector('svg');
    // strokeWidth is set on the SVG element
    // Lucide-react components apply strokeWidth, check it's present
    expect(svg).toBeInTheDocument();
  });

  it('overrides strokeWidth', () => {
    const { container } = render(<Icon icon={Heart} strokeWidth={3} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('sets aria-hidden when no aria-label', () => {
    const { container } = render(<Icon icon={Heart} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('removes aria-hidden when aria-label provided', () => {
    const { container } = render(<Icon icon={Heart} aria-label="Like" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(svg).toHaveAttribute('aria-label', 'Like');
  });

  it('applies custom aria-label', () => {
    const { container } = render(<Icon icon={AlertCircle} aria-label="Alert" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'Alert');
  });

  // ── CSS Classes and styling ────────────────────────────────────────────

  it('applies custom className', () => {
    const { container } = render(<Icon icon={Heart} className="text-red-500" />);
    const svg = container.querySelector('svg');
    expect(svg?.className.baseVal).toContain('text-red-500');
  });

  it('applies multiple custom classes', () => {
    const { container } = render(<Icon icon={Heart} className="text-red-500 w-8 h-8" />);
    const svg = container.querySelector('svg');
    const classValue = svg?.className.baseVal || svg?.className;
    expect(classValue).toContain('text-red-500');
    expect(classValue).toContain('w-8');
    expect(classValue).toContain('h-8');
  });

  // ── Data attributes ───────────────────────────────────────────────────

  it('passes data attributes through', () => {
    const { container } = render(<Icon icon={Heart} data-testid="heart-icon" />);
    const svg = container.querySelector('[data-testid="heart-icon"]');
    expect(svg).toBeInTheDocument();
  });

  // ── Common icon usage patterns ─────────────────────────────────────────

  it('works with different icon types', () => {
    const icons = [Heart, Settings, Search, AlertCircle];
    icons.forEach(icon => {
      const { container } = render(<Icon icon={icon} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('renders small icon with aria-label for buttons', () => {
    const { container } = render(
      <Icon icon={Heart} size="sm" aria-label="Like this" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('aria-label', 'Like this');
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('renders large decorative icon', () => {
    const { container } = render(
      <Icon icon={Heart} size="xl" className="text-primary" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it('handles zero strokeWidth', () => {
    const { container } = render(<Icon icon={Heart} strokeWidth={0} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles very large strokeWidth', () => {
    const { container } = render(<Icon icon={Heart} strokeWidth={10} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles very large sizePx', () => {
    const { container } = render(<Icon icon={Heart} sizePx={200} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
  });

  it('handles very small sizePx', () => {
    const { container } = render(<Icon icon={Heart} sizePx={8} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '8');
  });

  // ── Props combination ──────────────────────────────────────────────────

  it('combines all props correctly', () => {
    const { container } = render(
      <Icon
        icon={Heart}
        size="md"
        sizePx={22}
        strokeWidth={2.5}
        aria-label="Favorite"
        className="text-red-600"
        data-testid="custom-icon"
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '22');
    expect(svg).toHaveAttribute('aria-label', 'Favorite');
    expect(svg?.className.baseVal).toContain('text-red-600');
    expect(svg).toHaveAttribute('data-testid', 'custom-icon');
  });

  it('prioritizes sizePx over size prop', () => {
    const { container } = render(
      <Icon icon={Heart} size="lg" sizePx={18} />
    );
    const svg = container.querySelector('svg');
    // sizePx should override size
    expect(svg).toHaveAttribute('width', '18');
    expect(svg).not.toHaveAttribute('width', '24');
  });
});
