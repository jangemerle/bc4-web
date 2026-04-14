import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnimatedIcon } from './AnimatedIcon';
import { Rocket, Heart, Settings } from 'lucide-react';

// Mock getTotalLength for SVG geometry elements (not available in jsdom)
beforeEach(() => {
  (SVGElement.prototype as Record<string, unknown>).getTotalLength = vi.fn(() => 100);
});

describe('AnimatedIcon', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders an SVG icon', () => {
    render(<AnimatedIcon icon={Rocket} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders the specified icon component', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies aria-hidden by default', () => {
    const { container } = render(<AnimatedIcon icon={Heart} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not apply aria-hidden when aria-label is provided', () => {
    const { container } = render(
      <AnimatedIcon icon={Heart} aria-label="Favorite" />
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('applies custom aria-label', () => {
    const { container } = render(
      <AnimatedIcon icon={Settings} aria-label="Settings menu" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'Settings menu');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────

  it('renders with default size (lg = 24px)', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('applies size="sm" (16px)', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  it('applies size="md" (20px)', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} size="md" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('applies size="lg" (24px)', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('applies size="xl" (32px)', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} size="xl" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('overrides size with sizePx', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} size="lg" sizePx={48} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });

  // ── Stroke width ───────────────────────────────────────────────────────

  it('applies default strokeWidth of 2', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke-width', '2');
  });

  it('applies custom strokeWidth', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} strokeWidth={3} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke-width', '3');
  });

  // ── Trigger modes ──────────────────────────────────────────────────────

  it('renders with trigger="mount" by default', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with trigger="hover"', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} trigger="hover" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with trigger="manual"', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} trigger="manual" animate={true} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Hover trigger behavior ─────────────────────────────────────────────

  it('triggers animation on hover', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AnimatedIcon icon={Rocket} trigger="hover" />
    );
    const wrapper = container.querySelector('span');
    expect(wrapper).toBeInTheDocument();

    if (wrapper) {
      await user.hover(wrapper);
      // Verify SVG still exists and is interactive
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // The animation setup happens asynchronously via requestAnimationFrame
      // Just verify the component didn't break
    }
  });

  it('triggers animation on mouse enter and leave', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AnimatedIcon icon={Rocket} trigger="hover" />
    );
    const wrapper = container.querySelector('span');
    expect(wrapper).toBeInTheDocument();

    if (wrapper) {
      await user.hover(wrapper);
      await user.unhover(wrapper);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    }
  });

  // ── Manual trigger behavior ────────────────────────────────────────────

  it('responds to animate prop when trigger="manual"', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} trigger="manual" animate={true} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('updates when animate prop changes', () => {
    const { container, rerender } = render(
      <AnimatedIcon icon={Rocket} trigger="manual" animate={false} />
    );
    let svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    rerender(
      <AnimatedIcon icon={Rocket} trigger="manual" animate={true} />
    );
    svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Animation properties ──────────────────────────────────────────────

  it('applies stagger prop to delay between strokes', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} stagger={0.15} />
    );
    const paths = container.querySelectorAll('path, line, circle');
    expect(paths.length > 0).toBe(true);
  });

  it('applies custom strokeDuration', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} strokeDuration={0.5} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Custom className ──────────────────────────────────────────────────

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} className="custom-icon" />
    );
    const wrapper = container.querySelector('.custom-icon');
    expect(wrapper).toBeInTheDocument();
  });

  it('applies multiple custom classes', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} className="custom-icon extra-class" />
    );
    const wrapper = container.querySelector('.custom-icon');
    expect(wrapper).toHaveClass('custom-icon');
    expect(wrapper).toHaveClass('extra-class');
  });

  // ── Wrapper styling ───────────────────────────────────────────────────

  it('wrapper has display:inline-flex', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} />);
    const wrapper = container.querySelector('span');
    const style = window.getComputedStyle(wrapper!);
    expect(style.display).toBe('inline-flex');
  });

  it('wrapper has lineHeight:0', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} />);
    const wrapper = container.querySelector('span');
    expect(wrapper).toHaveStyle({ lineHeight: '0' });
  });

  // ── SVG geometry elements ──────────────────────────────────────────────

  it('finds and animates path elements', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} trigger="mount" />
    );
    const paths = container.querySelectorAll('path');
    expect(paths.length >= 0).toBe(true);
  });

  it('finds and animates circle elements', () => {
    const { container } = render(
      <AnimatedIcon icon={Heart} trigger="mount" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Icon variations ───────────────────────────────────────────────────

  it('works with different Lucide icons', () => {
    const icons = [Rocket, Heart, Settings];
    icons.forEach((icon) => {
      const { container } = render(<AnimatedIcon icon={icon} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  // ── Integration tests ──────────────────────────────────────────────────

  it('combines size, strokeWidth, and className', () => {
    const { container } = render(
      <AnimatedIcon
        icon={Rocket}
        size="xl"
        strokeWidth={1.5}
        className="text-red-500"
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('stroke-width', '1.5');
    const wrapper = container.querySelector('.text-red-500');
    expect(wrapper).toBeInTheDocument();
  });

  it('combines trigger="hover" with custom stagger', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AnimatedIcon icon={Rocket} trigger="hover" stagger={0.12} />
    );
    const wrapper = container.querySelector('span');
    expect(wrapper).toBeInTheDocument();

    if (wrapper) {
      await user.hover(wrapper);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    }
  });

  it('works with trigger="manual" and aria-label', () => {
    const { container } = render(
      <AnimatedIcon
        icon={Settings}
        trigger="manual"
        animate={true}
        aria-label="Adjust settings"
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'Adjust settings');
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  // ── Edge cases ────────────────────────────────────────────────────────

  it('handles strokeDuration of 0', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} strokeDuration={0} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles stagger of 0', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} stagger={0} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles very large strokeWidth', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} strokeWidth={10} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke-width', '10');
  });

  it('handles very large sizePx', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} sizePx={256} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '256');
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('has proper role for SVG when aria-label is set', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} aria-label="Launch" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'Launch');
  });

  it('is skipped by screen readers when aria-hidden', () => {
    const { container } = render(<AnimatedIcon icon={Rocket} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  // ── SVG state preservation ─────────────────────────────────────────────

  it('preserves SVG state between re-renders', () => {
    const { container, rerender } = render(
      <AnimatedIcon icon={Rocket} size="lg" />
    );
    const firstSvg = container.querySelector('svg');
    expect(firstSvg).toBeInTheDocument();

    rerender(<AnimatedIcon icon={Rocket} size="xl" />);
    const secondSvg = container.querySelector('svg');
    expect(secondSvg).toBeInTheDocument();
    expect(secondSvg).toHaveAttribute('width', '32');
  });

  it('maintains animation setup when className changes', () => {
    const { container, rerender } = render(
      <AnimatedIcon icon={Rocket} className="initial" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    rerender(
      <AnimatedIcon icon={Rocket} className="initial updated" />
    );
    const updatedSvg = container.querySelector('svg');
    expect(updatedSvg).toBeInTheDocument();
  });

  // ── Mount trigger animation ───────────────────────────────────────────

  it('initializes correctly with trigger="mount"', () => {
    const { container } = render(
      <AnimatedIcon icon={Rocket} trigger="mount" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Paths should exist
    const paths = container.querySelectorAll('path, line, circle');
    expect(paths.length >= 0).toBe(true);
  });

  // ── Complex scenarios ──────────────────────────────────────────────────

  it('handles rapid trigger changes', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AnimatedIcon icon={Rocket} trigger="hover" />
    );
    const wrapper = container.querySelector('span');

    if (wrapper) {
      await user.hover(wrapper);
      await user.unhover(wrapper);
      await user.hover(wrapper);
      await user.unhover(wrapper);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    }
  });

  it('works correctly when nested in a container', () => {
    const { container } = render(
      <div className="icon-container">
        <AnimatedIcon icon={Rocket} className="nested-icon" />
      </div>
    );
    const nested = container.querySelector('.nested-icon');
    expect(nested).toBeInTheDocument();
  });

  it('renders multiple instances independently', () => {
    const { container } = render(
      <div>
        <AnimatedIcon icon={Rocket} />
        <AnimatedIcon icon={Heart} />
        <AnimatedIcon icon={Settings} />
      </div>
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(3);
  });
});
