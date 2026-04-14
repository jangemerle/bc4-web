import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders a checkbox input', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('label click toggles checkbox', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox label="Agree" onChange={handleChange} />);
    await user.click(screen.getByText('Agree'));
    expect(handleChange).toHaveBeenCalledOnce();
  });

  // ── Checked state ─────────────────────────────────────────────────────

  it('reflects checked prop', () => {
    render(<Checkbox checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('reflects unchecked state', () => {
    render(<Checkbox checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  // ── Disabled state ────────────────────────────────────────────────────

  it('sets disabled attribute', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox disabled onChange={handleChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ── Invalid state ─────────────────────────────────────────────────────

  it('shows error message when invalid with errorMessage', () => {
    render(<Checkbox label="Terms" invalid errorMessage="You must accept" checked onChange={() => {}} />);
    expect(screen.getByText('You must accept')).toBeInTheDocument();
  });

  it('links error to checkbox via aria-describedby', () => {
    render(<Checkbox label="Terms" invalid errorMessage="Required" checked onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');
    const describedBy = checkbox.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toBeInTheDocument();
  });

  // ── Sizes ─────────────────────────────────────────────────────────────

  it('defaults to small size', () => {
    render(<Checkbox label="Small" />);
    // sm size = size-4 class on the visual box
    const checkbox = screen.getByRole('checkbox');
    const visualBox = checkbox.closest('label')?.querySelector('[class*="size-4"]');
    expect(visualBox).toBeInTheDocument();
  });

  it('applies large size', () => {
    render(<Checkbox size="lg" label="Large" />);
    const checkbox = screen.getByRole('checkbox');
    const visualBox = checkbox.closest('label')?.querySelector('[class*="size-6"]');
    expect(visualBox).toBeInTheDocument();
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('checkbox is visually hidden but accessible', () => {
    render(<Checkbox label="Hidden" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.className).toContain('sr-only');
  });

  it('has focus-visible outline on visual box', () => {
    render(<Checkbox label="Focus" />);
    const checkbox = screen.getByRole('checkbox');
    const visualBox = checkbox.closest('label')?.querySelector('[class*="peer-focus-visible"]');
    expect(visualBox).toBeInTheDocument();
  });

  // ── Hover state ────────────────────────────────────────────────────────

  it('triggers onMouseLeave event on label', async () => {
    const user = userEvent.setup();
    const { container } = render(<Checkbox label="Hover test" />);
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
    await user.hover(label!);
    await user.unhover(label!);
    expect(label).toBeInTheDocument();
  });

});
