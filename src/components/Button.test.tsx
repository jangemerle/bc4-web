import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';
import { Plus, Trash2 } from 'lucide-react';

describe('Button', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders children as button text', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to type="button" (not submit)', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('passes type="submit" when specified', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  // ── Variants ──────────────────────────────────────────────────────────

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-[var(--color-primary-1)]');
  });

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-[var(--color-danger-1)]');
  });

  it('applies secondary variant with border', () => {
    render(<Button variant="secondary">Cancel</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('border');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────

  it('applies medium size padding by default', () => {
    render(<Button>Medium</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('px-4');
    expect(btn.className).toContain('py-2');
  });

  it('applies small size padding', () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('px-3');
    expect(btn.className).toContain('py-1');
  });

  // ── Icons ─────────────────────────────────────────────────────────────

  it('renders icon-only button when iconOnly is passed', () => {
    render(<Button iconOnly={Plus} aria-label="Add item" />);
    const btn = screen.getByRole('button', { name: 'Add item' });
    expect(btn).toBeInTheDocument();
    // Should have square padding, not text padding
    expect(btn.className).toContain('p-[10px]');
  });

  it('renders left icon alongside text', () => {
    render(<Button iconLeft={Trash2}>Delete</Button>);
    const btn = screen.getByRole('button', { name: 'Delete' });
    // Should have asymmetric padding (icon side less)
    expect(btn.className).toContain('pl-3');
    expect(btn.className).toContain('pr-4');
  });

  it('renders chevron when multichoice is true', () => {
    render(<Button multichoice>Options</Button>);
    const btn = screen.getByRole('button', { name: 'Options' });
    // Multichoice adds right padding adjustment
    expect(btn.className).toContain('pr-3');
  });

  // ── Disabled state ────────────────────────────────────────────────────

  it('sets disabled attribute when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies disabled opacity class', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button').className).toContain('disabled:opacity-40');
  });

  // ── Click handling ────────────────────────────────────────────────────

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>No click</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('has focus-visible outline classes for keyboard navigation', () => {
    render(<Button>Focus me</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('focus-visible:outline');
  });

  it('applies custom className', () => {
    render(<Button className="mt-4">Custom</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('mt-4');
  });
});
