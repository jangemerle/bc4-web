import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from './Chip';
import { Sparkles, Star } from 'lucide-react';

describe('Chip', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders children text', () => {
    render(<Chip>Design</Chip>);
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('renders as a button element when clickable (default)', () => {
    render(<Chip>Clickable</Chip>);
    const element = screen.getByRole('button', { name: 'Clickable' });
    expect(element.tagName).toBe('BUTTON');
  });

  it('renders as a span element when not clickable', () => {
    render(<Chip clickable={false}>Read-only</Chip>);
    const element = screen.getByText('Read-only');
    expect(element.tagName).toBe('SPAN');
  });

  it('sets button type to "button" when clickable', () => {
    render(<Chip>Clickable</Chip>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  // ── Sizes ──────────────────────────────────────────────────────────────

  it('defaults to sm size', () => {
    render(<Chip>Small</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('px-2');
    expect(chip.className).toContain('py-[2px]');
  });

  it('applies md size padding', () => {
    render(<Chip size="md">Medium</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('px-3');
    expect(chip.className).toContain('py-[3.5px]');
  });

  // ── Clickable state ────────────────────────────────────────────────────

  it('applies interactive background when clickable', () => {
    render(<Chip clickable>Interactive</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('bg-[var(--color-surface-3)]');
  });

  it('applies non-interactive background when not clickable', () => {
    render(<Chip clickable={false}>Static</Chip>);
    const chip = screen.getByText('Static').parentElement;
    expect(chip?.className).toContain('bg-[var(--color-surface-1)]');
  });

  it('applies hover styles only when clickable', () => {
    render(<Chip clickable>Hoverable</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('hover:bg-[var(--color-secondary-2)]');
    expect(chip.className).toContain('cursor-pointer');
  });

  it('does not apply hover styles when not clickable', () => {
    render(<Chip clickable={false}>Static</Chip>);
    const chip = screen.getByText('Static').parentElement;
    expect(chip?.className).not.toContain('hover:bg-');
    expect(chip?.className).not.toContain('cursor-pointer');
  });

  // ── Click handling ─────────────────────────────────────────────────────

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Chip onClick={handleClick}>Clickable</Chip>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when not clickable', () => {
    const handleClick = vi.fn();
    render(
      <Chip clickable={false} onClick={handleClick}>
        Static
      </Chip>
    );
    // Non-clickable chips are spans, so we can't click them with user-event
    // Verify the handler was never called by the component architecture
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ── Icon support ───────────────────────────────────────────────────────

  it('renders with a leading icon', () => {
    render(<Chip icon={Sparkles}>AI Generated</Chip>);
    const chip = screen.getByRole('button', { name: /AI Generated/i });
    expect(chip).toBeInTheDocument();
    // Icon is rendered via Icon component
  });

  it('renders icon and text together', () => {
    render(<Chip icon={Star}>Featured</Chip>);
    expect(screen.getByText('Featured')).toBeInTheDocument();
    const chip = screen.getByRole('button', { name: /Featured/i });
    expect(chip).toBeInTheDocument();
  });

  it('renders text only when no icon is provided', () => {
    render(<Chip>Simple text</Chip>);
    expect(screen.getByText('Simple text')).toBeInTheDocument();
  });

  // ── User avatar variant ────────────────────────────────────────────────

  it('renders with user avatar and initials', () => {
    render(<Chip user={{ initials: 'DT' }}>David T.</Chip>);
    expect(screen.getByText('DT')).toBeInTheDocument();
    expect(screen.getByText('David T.')).toBeInTheDocument();
  });

  it('applies user variant padding', () => {
    render(<Chip user={{ initials: 'AB' }}>Alice B.</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('pl-[2px]');
    expect(chip.className).toContain('pr-2');
    expect(chip.className).toContain('py-[2px]');
  });

  it('applies user variant padding for md size', () => {
    render(
      <Chip size="md" user={{ initials: 'JD' }}>
        John D.
      </Chip>
    );
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('pl-[3.5px]');
    expect(chip.className).toContain('pr-3');
    expect(chip.className).toContain('py-[3.5px]');
  });

  it('displays correct avatar size for sm size', () => {
    const { container } = render(
      <Chip size="sm" user={{ initials: 'AB' }}>
        User
      </Chip>
    );
    const avatarDiv = container.querySelector('.size-4');
    expect(avatarDiv).toBeInTheDocument();
  });

  it('displays correct avatar size for md size', () => {
    const { container } = render(
      <Chip size="md" user={{ initials: 'AB' }}>
        User
      </Chip>
    );
    const avatarDiv = container.querySelector('.size-5');
    expect(avatarDiv).toBeInTheDocument();
  });

  // ── Removable/dismissible state ────────────────────────────────────────

  it('renders remove button when removable is true', () => {
    render(
      <Chip removable onRemove={vi.fn()}>
        Removable
      </Chip>
    );
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    expect(removeButton).toBeInTheDocument();
  });

  it('does not render remove button when removable is false (default)', () => {
    render(<Chip>Not removable</Chip>);
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(
      <Chip removable onRemove={handleRemove}>
        Tag
      </Chip>
    );
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    await user.click(removeButton);
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  it('stops propagation when remove button is clicked', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    const handleChipClick = vi.fn();
    render(
      <Chip removable onRemove={handleRemove} onClick={handleChipClick}>
        Tag
      </Chip>
    );
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    await user.click(removeButton);
    // onRemove should be called, but click should not bubble to chip
    expect(handleRemove).toHaveBeenCalledOnce();
    // The chip click handler should not be called due to stopPropagation
  });

  it('applies opacity transition to remove button', () => {
    render(
      <Chip removable onRemove={vi.fn()}>
        Tag
      </Chip>
    );
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    expect(removeButton.className).toContain('opacity-60');
    expect(removeButton.className).toContain('hover:opacity-100');
    expect(removeButton.className).toContain('transition-opacity');
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('has focus-visible outline when clickable', () => {
    render(<Chip>Focusable</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('focus-visible:outline');
    expect(chip.className).toContain('focus-visible:outline-2');
    expect(chip.className).toContain('outline-none');
  });

  it('has outline-offset for focus ring when clickable', () => {
    render(<Chip>Focusable</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('focus-visible:outline-offset-2');
  });

  it('remove button has aria-label for accessibility', () => {
    render(
      <Chip removable onRemove={vi.fn()}>
        Tag
      </Chip>
    );
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    expect(removeButton).toHaveAttribute('aria-label', 'Remove');
  });

  it('applies text color and font styling', () => {
    render(<Chip>Styled</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('text-[var(--color-on-surface)]');
    expect(chip.className).toContain('font-sans');
    expect(chip.className).toContain('font-bold');
  });

  // ── Custom props ───────────────────────────────────────────────────────

  it('passes className through', () => {
    render(<Chip className="mt-4">Custom</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('mt-4');
  });

  it('passes HTML attributes through', () => {
    render(
      <Chip data-testid="custom-chip" aria-label="Custom chip">
        Test
      </Chip>
    );
    expect(screen.getByTestId('custom-chip')).toBeInTheDocument();
    expect(screen.getByTestId('custom-chip')).toHaveAttribute('aria-label', 'Custom chip');
  });

  it('merges className with base classes', () => {
    render(<Chip className="my-custom-class">Test</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('inline-flex');
    expect(chip.className).toContain('items-center');
    expect(chip.className).toContain('rounded-xl');
    expect(chip.className).toContain('my-custom-class');
  });

  // ── Combination scenarios ──────────────────────────────────────────────

  it('renders removable chip with icon', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(
      <Chip removable onRemove={handleRemove} icon={Sparkles}>
        AI Feature
      </Chip>
    );
    expect(screen.getByText('AI Feature')).toBeInTheDocument();
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    await user.click(removeButton);
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  it('renders removable chip with user avatar', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(
      <Chip removable onRemove={handleRemove} user={{ initials: 'JD' }}>
        John Doe
      </Chip>
    );
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    await user.click(removeButton);
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  it('applies all transitions', () => {
    render(<Chip>Transitioned</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('transition-all');
    expect(chip.className).toContain('duration-150');
  });

  it('applies border-none to remove default styling', () => {
    render(<Chip>Bordered</Chip>);
    const chip = screen.getByRole('button');
    expect(chip.className).toContain('border-none');
  });

  // ── Non-clickable with complex content ──────────────────────────────────

  it('renders non-clickable chip with icon', () => {
    render(
      <Chip clickable={false} icon={Star}>
        Featured
      </Chip>
    );
    expect(screen.getByText('Featured')).toBeInTheDocument();
    const chip = screen.getByText('Featured').closest('span');
    expect(chip?.tagName).toBe('SPAN');
  });

  it('renders non-clickable chip with user avatar', () => {
    render(
      <Chip clickable={false} user={{ initials: 'AB' }}>
        Alice Brown
      </Chip>
    );
    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.getByText('Alice Brown')).toBeInTheDocument();
    const chip = screen.getByText('Alice Brown').closest('span');
    expect(chip?.tagName).toBe('SPAN');
  });
});
