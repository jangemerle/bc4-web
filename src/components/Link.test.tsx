import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  // -- Rendering --------------------------------------------------------─

  it('renders an anchor element', () => {
    render(<Link href="/docs">Documentation</Link>);
    expect(screen.getByRole('link', { name: 'Documentation' })).toBeInTheDocument();
  });

  it('renders children as link text', () => {
    render(<Link href="/home">Home</Link>);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies correct href attribute', () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('renders with default underline styling', () => {
    render(<Link href="/">Link</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('underline');
  });

  // -- Sizes --------------------------------------------------------------

  it('defaults to inheriting size from parent', () => {
    render(
      <p>
        Text with <Link href="/">link</Link>
      </p>,
    );
    const link = screen.getByRole('link');
    // Should not have an explicit size class
    expect(link.className).not.toContain('text-sm');
    expect(link.className).not.toContain('text-md');
  });

  it('applies small size (text-sm)', () => {
    render(<Link href="/" size="sm">Small link</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-sm');
  });

  it('applies medium size (text-md)', () => {
    render(<Link href="/" size="md">Medium link</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-md');
  });

  it('applies base size (text-base)', () => {
    render(<Link href="/" size="base">Base link</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-base');
  });

  it('applies large size (text-lg)', () => {
    render(<Link href="/" size="lg">Large link</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-lg');
  });

  // -- External links ----------------------------------------------------─

  it('sets target="_blank" for external links', () => {
    render(<Link href="https://example.com" external>External</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('sets rel="noopener noreferrer" for external links', () => {
    render(<Link href="https://example.com" external>External</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not set target for internal links', () => {
    render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
  });

  it('does not set rel for internal links', () => {
    render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole('link');
    expect(link.getAttribute('rel')).toBeNull();
  });

  // -- Monochrome variant ------------------------------------------------─

  it('applies monochrome styling when enabled', () => {
    render(<Link href="/" monochrome>Monochrome</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-inherit');
    expect(link.className).toContain('decoration-current');
  });

  it('inherits text color in monochrome mode', () => {
    render(
      <p style={{ color: 'red' }}>
        <Link href="/" monochrome>Monochrome</Link>
      </p>,
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-inherit');
  });

  it('applies colored styling by default', () => {
    render(<Link href="/">Colored</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-[var(--color-on-secondary-1)]');
  });

  // -- Focus and hover states --------------------------------------------─

  it('has focus-visible outline classes for keyboard navigation', () => {
    render(<Link href="/">Focusable</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('focus-visible:outline');
  });

  it('removes underline on hover in colored mode', () => {
    render(<Link href="/">Hover</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('hover:no-underline');
  });

  it('applies hover color change in colored mode', () => {
    render(<Link href="/">Hover</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('hover:text-[var(--color-on-secondary-2)]');
  });

  it('applies opacity change on hover in monochrome mode', () => {
    render(<Link href="/" monochrome>Hover</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('hover:opacity-70');
  });

  it('applies opacity change on active in monochrome mode', () => {
    render(<Link href="/" monochrome>Active</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('active:opacity-60');
  });

  // -- Click handling ----------------------------------------------------─

  it('allows navigation on click', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn((e: React.MouseEvent) => {
      e.preventDefault();
    });
    render(<Link href="/" onClick={handleClick}>Click me</Link>);
    await user.click(screen.getByRole('link'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  // -- Ref forwarding ----------------------------------------------------─

  it('forwards ref to the anchor element', () => {
    const ref = vi.fn();
    render(<Link href="/" ref={ref}>Ref</Link>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
  });

  // -- Custom className --------------------------------------------------─

  it('applies custom className', () => {
    render(<Link href="/" className="custom-class">Custom</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('custom-class');
  });

  it('preserves default classes with custom className', () => {
    render(<Link href="/" className="mt-4">Custom</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('underline');
    expect(link.className).toContain('mt-4');
  });

  // -- Data attributes and accessibility ----------------------------------

  it('passes through data attributes', () => {
    render(<Link href="/" data-testid="custom-link">Data</Link>);
    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
  });

  it('passes through aria attributes', () => {
    render(
      <Link href="/" aria-label="Custom label" aria-describedby="description">
        Aria
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'Custom label');
    expect(link).toHaveAttribute('aria-describedby', 'description');
  });

  it('maintains semantic link role', () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  // -- CSS transitions ----------------------------------------------------

  it('applies transition classes for smooth color changes', () => {
    render(<Link href="/">Transition</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('transition-colors');
    expect(link.className).toContain('duration-150');
  });

  // -- Underline styling --------------------------------------------------

  it('applies underline with offset and thickness', () => {
    render(<Link href="/">Underline</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('underline-offset-2');
    expect(link.className).toContain('decoration-1');
  });

  // -- Combination tests --------------------------------------------------

  it('combines size with monochrome', () => {
    render(
      <Link href="/" size="lg" monochrome>
        Large monochrome
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-lg');
    expect(link.className).toContain('text-inherit');
  });

  it('combines external with custom className', () => {
    render(
      <Link href="https://example.com" external className="external-link">
        External
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.className).toContain('external-link');
  });

  // -- Empty content edge case --------------------------------------------

  it('renders with empty children', () => {
    render(<Link href="/"></Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  // -- Different href formats --------------------------------------------─

  it('accepts absolute URLs', () => {
    render(<Link href="https://example.com/page">Absolute</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/page');
  });

  it('accepts relative URLs', () => {
    render(<Link href="../sibling">Relative</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '../sibling');
  });

  it('accepts hash links', () => {
    render(<Link href="#section">Anchor</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#section');
  });

  it('accepts mailto links', () => {
    render(<Link href="mailto:test@example.com">Email</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:test@example.com');
  });

  // -- Monochrome active state --------------------------------------------

  it('removes underline on active in monochrome mode', () => {
    render(<Link href="/" monochrome>Active</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('active:no-underline');
  });

  // -- Cursor styling ----------------------------------------------------─

  it('applies cursor-pointer class', () => {
    render(<Link href="/">Cursor</Link>);
    const link = screen.getByRole('link');
    expect(link.className).toContain('cursor-pointer');
  });
});
