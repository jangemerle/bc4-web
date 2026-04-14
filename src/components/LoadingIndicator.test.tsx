import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoadingIndicator } from './LoadingIndicator';

describe('LoadingIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    try {
      vi.runOnlyPendingTimers();
    } catch {
      // Timers might not be active
    }
    try {
      vi.useRealTimers();
    } catch {
      // Timers might already be real
    }
  });

  // ── Rendering ────────────────────────────────────────────────────────

  it('renders a loading indicator by default', () => {
    render(<LoadingIndicator />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with role="status" for accessibility', () => {
    render(<LoadingIndicator />);
    const element = screen.getByRole('status');
    expect(element).toHaveAttribute('role', 'status');
  });

  it('renders with aria-label by default', () => {
    render(<LoadingIndicator />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders with custom aria-label when label is provided', () => {
    render(<LoadingIndicator label="Saving changes..." />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving changes...');
  });

  // ── Spinner variant ──────────────────────────────────────────────────

  describe('Spinner Variant', () => {
    it('renders spinner variant by default', () => {
      const { container } = render(<LoadingIndicator />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders spinner with correct size (md) by default', () => {
      const { container } = render(<LoadingIndicator />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('renders spinner with sm size', () => {
      const { container } = render(<LoadingIndicator size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
    });

    it('renders spinner with lg size', () => {
      const { container } = render(<LoadingIndicator size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('spinner has animate-spin class when motion is enabled', () => {
      const { container } = render(<LoadingIndicator />);
      const svg = container.querySelector('svg');
      expect(svg?.className.baseVal).toContain('animate-spin');
    });

    it('spinner SVG has role="img" and aria-hidden', () => {
      const { container } = render(<LoadingIndicator />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('spinner with each size has correct stroke-width', () => {
      const { container: smContainer } = render(<LoadingIndicator size="sm" />);
      const smCircle = smContainer.querySelector('circle');
      expect(smCircle).toHaveAttribute('stroke-width', '2');

      const { container: mdContainer } = render(<LoadingIndicator size="md" />);
      const mdCircle = mdContainer.querySelector('circle');
      expect(mdCircle).toHaveAttribute('stroke-width', '2.5');

      const { container: lgContainer } = render(<LoadingIndicator size="lg" />);
      const lgCircle = lgContainer.querySelector('circle');
      expect(lgCircle).toHaveAttribute('stroke-width', '3');
    });
  });

  // ── Illustration variant ─────────────────────────────────────────────

  describe('Illustration Variant', () => {
    it('renders illustration variant when specified', () => {
      vi.useFakeTimers();
      const { container } = render(<LoadingIndicator variant="illustration" />);
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
    });

    it('renders illustration with default GIF', () => {
      vi.useFakeTimers();
      const { container } = render(<LoadingIndicator variant="illustration" />);
      const img = container.querySelector('img') as HTMLImageElement;
      expect(img.src).toContain('walking-up-the-stairs');
      expect(img.src).toContain('-400w.gif');
    });

    it('renders illustration with custom GIF name', () => {
      vi.useFakeTimers();
      const { container } = render(
        <LoadingIndicator
          variant="illustration"
          illustrationName="custom-illustration"
        />
      );
      const img = container.querySelector('img') as HTMLImageElement;
      expect(img.src).toContain('custom-illustration-400w.gif');
    });

    it('illustration has alt text', () => {
      vi.useFakeTimers();
      const { container } = render(<LoadingIndicator variant="illustration" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Loading');
    });

    it('illustration has loading="eager" and decoding="async"', () => {
      vi.useFakeTimers();
      const { container } = render(<LoadingIndicator variant="illustration" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'eager');
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });

  // ── Label rendering ─────────────────────────────────────────────────

  describe('Label', () => {
    it('displays label text below spinner', () => {
      render(<LoadingIndicator label="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not display label when not provided', () => {
      render(<LoadingIndicator />);
      const textContent = screen.getByRole('status').textContent;
      expect(textContent).not.toContain('Loading');
    });

    it('label text size matches indicator size (sm)', () => {
      render(<LoadingIndicator size="sm" label="Small" />);
      const label = screen.getByText('Small');
      expect(label.className).toContain('text-xs');
    });

    it('label text size matches indicator size (md)', () => {
      render(<LoadingIndicator size="md" label="Medium" />);
      const label = screen.getByText('Medium');
      expect(label.className).toContain('text-sm');
    });

    it('label text size matches indicator size (lg)', () => {
      render(<LoadingIndicator size="lg" label="Large" />);
      const label = screen.getByText('Large');
      expect(label.className).toContain('text-md');
    });

    it('label has text-center class', () => {
      render(<LoadingIndicator label="Centered" />);
      const label = screen.getByText('Centered');
      expect(label.className).toContain('text-center');
    });

    it('label uses CSS variable for color', () => {
      render(<LoadingIndicator label="Colored" />);
      const label = screen.getByText('Colored');
      expect(label.style.color).toBe('var(--color-on-surface-subtle-1)');
    });
  });

  // ── Rotating messages (illustration variant only) ────────────────────

  describe('Rotating Messages', () => {
    it('shows rotating messages for illustration variant without label', () => {
      vi.useFakeTimers();
      render(<LoadingIndicator variant="illustration" />);
      const politeDiv = screen.getByRole('status').querySelector('[aria-live="polite"]');
      expect(politeDiv).toBeInTheDocument();
    });

    it('does not show rotating messages when label is provided', () => {
      vi.useFakeTimers();
      render(<LoadingIndicator variant="illustration" label="Loading..." />);
      const label = screen.getByText('Loading...');
      expect(label).toBeInTheDocument();
      const politeDiv = screen.getByRole('status').querySelector('[aria-live="polite"]');
      expect(politeDiv).not.toBeInTheDocument();
    });

    it('does not show rotating messages for spinner variant', () => {
      render(<LoadingIndicator variant="spinner" />);
      const politeDiv = screen.getByRole('status').querySelector('[aria-live="polite"]');
      expect(politeDiv).not.toBeInTheDocument();
    });

    it('rotating message has aria-live="polite"', () => {
      vi.useFakeTimers();
      render(<LoadingIndicator variant="illustration" />);
      const politeDiv = screen.getByRole('status').querySelector('[aria-live="polite"]');
      expect(politeDiv).toHaveAttribute('aria-live', 'polite');
    });

    it('accepts custom messageInterval', () => {
      vi.useFakeTimers();
      const { rerender } = render(
        <LoadingIndicator variant="illustration" messageInterval={2000} />
      );
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(
        <LoadingIndicator variant="illustration" messageInterval={500} />
      );
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  // ── Custom className ─────────────────────────────────────────────────

  describe('className Passthrough', () => {
    it('accepts and applies custom className', () => {
      const { container } = render(
        <LoadingIndicator className="custom-class" />
      );
      const wrapper = container.querySelector('[role="status"]');
      expect(wrapper?.className).toContain('custom-class');
    });

    it('preserves default classes with custom className', () => {
      const { container } = render(
        <LoadingIndicator className="my-custom-class" />
      );
      const wrapper = container.querySelector('[role="status"]');
      expect(wrapper?.className).toContain('inline-flex');
      expect(wrapper?.className).toContain('flex-col');
      expect(wrapper?.className).toContain('my-custom-class');
    });

    it('accepts custom style prop', () => {
      const { container } = render(
        <LoadingIndicator style={{ margin: '20px' }} />
      );
      const wrapper = container.querySelector('[role="status"]');
      expect(wrapper).toHaveStyle({ margin: '20px' });
    });

    it('sets minWidth when label is present', () => {
      const { container } = render(
        <LoadingIndicator label="Loading..." />
      );
      const wrapper = container.querySelector('[role="status"]');
      expect(wrapper).toHaveStyle({ minWidth: '160px' });
    });

    it('sets minWidth when showing rotating messages', () => {
      vi.useFakeTimers();
      const { container } = render(
        <LoadingIndicator variant="illustration" />
      );
      const wrapper = container.querySelector('[role="status"]');
      expect(wrapper).toHaveStyle({ minWidth: '160px' });
    });
  });

  // ── Size and layout combinations ──────────────────────────────────────

  describe('Size Variants', () => {
    it('all size variants render correctly', () => {
      const { unmount } = render(<LoadingIndicator size="sm" label="Small" />);
      expect(screen.getByText('Small')).toBeInTheDocument();
      unmount();

      render(<LoadingIndicator size="md" label="Medium" />);
      expect(screen.getByText('Medium')).toBeInTheDocument();
      unmount();

      render(<LoadingIndicator size="lg" label="Large" />);
      expect(screen.getByText('Large')).toBeInTheDocument();
    });

    it('spinner size and label size scale together', () => {
      const { container } = render(
        <LoadingIndicator size="lg" label="Big Loading" />
      );
      const svg = container.querySelector('svg');
      const label = screen.getByText('Big Loading');
      expect(svg).toHaveAttribute('width', '48');
      expect(label.className).toContain('text-md');
    });
  });

  // ── Accessibility ───────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('has proper semantic role for status announcements', () => {
      render(<LoadingIndicator label="Saving..." />);
      expect(screen.getByRole('status')).toHaveAttribute('role', 'status');
    });

    it('aria-label is set to label prop or "Loading"', () => {
      const { unmount } = render(<LoadingIndicator />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
      unmount();

      render(<LoadingIndicator label="Processing" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Processing');
    });

    it('spinner SVG is hidden from screen readers', () => {
      const { container } = render(<LoadingIndicator />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('rotating messages use aria-live for dynamic updates', () => {
      vi.useFakeTimers();
      const { container } = render(<LoadingIndicator variant="illustration" />);
      const polite = container.querySelector('[aria-live="polite"]');
      expect(polite).toBeInTheDocument();
    });
  });

  // ── Integration tests ────────────────────────────────────────────────

  describe('Integration', () => {
    it('spinner + label combination', () => {
      render(<LoadingIndicator variant="spinner" size="md" label="Uploading..." />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });

    it('illustration + custom GIF + label', () => {
      vi.useFakeTimers();
      const { container } = render(
        <LoadingIndicator
          variant="illustration"
          illustrationName="my-custom-gif"
          label="Loading custom..."
        />
      );
      const img = container.querySelector('img') as HTMLImageElement;
      expect(img.src).toContain('my-custom-gif');
      expect(screen.getByText('Loading custom...')).toBeInTheDocument();
    });

    it('all props combined', () => {
      vi.useFakeTimers();
      const { container } = render(
        <LoadingIndicator
          variant="illustration"
          size="lg"
          label="Custom loading state"
          illustrationName="custom-gif"
          messageInterval={2000}
          className="absolute top-0"
          style={{ padding: '10px' }}
        />
      );
      const wrapper = container.querySelector('[role="status"]');
      expect(wrapper).toHaveClass('absolute', 'top-0');
      expect(wrapper).toHaveStyle({ padding: '10px' });
      expect(screen.getByText('Custom loading state')).toBeInTheDocument();
    });
  });

  // ── Edge cases ───────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('renders with empty string label', () => {
      const { container } = render(<LoadingIndicator label="" />);
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('renders with very long label', () => {
      const longLabel = 'This is a very long loading message that might wrap to multiple lines';
      render(<LoadingIndicator label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('renders with special characters in label', () => {
      const specialLabel = 'Loading... (50%)';
      render(<LoadingIndicator label={specialLabel} />);
      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it('can be re-rendered with different props', () => {
      const { rerender } = render(<LoadingIndicator size="sm" label="Small" />);
      expect(screen.getByText('Small')).toBeInTheDocument();

      rerender(<LoadingIndicator size="lg" label="Large" />);
      expect(screen.getByText('Large')).toBeInTheDocument();
    });

    it('multiple instances can be rendered', () => {
      render(
        <>
          <LoadingIndicator label="First" />
          <LoadingIndicator label="Second" />
          <LoadingIndicator label="Third" />
        </>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });
});
