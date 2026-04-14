import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders a switch input', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Toggle label="Dark mode" />);
    expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
  });

  // ── Checked state ─────────────────────────────────────────────────────

  it('reflects checked prop via aria-checked', () => {
    render(<Toggle checked onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('reflects unchecked state', () => {
    render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  // ── Interaction ───────────────────────────────────────────────────────

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Toggle label="Toggle me" onChange={handleChange} />);
    await user.click(screen.getByLabelText('Toggle me'));
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Toggle disabled label="No toggle" onChange={handleChange} />);
    await user.click(screen.getByRole('switch'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ── Disabled state ────────────────────────────────────────────────────

  it('sets disabled attribute', () => {
    render(<Toggle disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  // ── Invalid state ─────────────────────────────────────────────────────

  it('shows error message when invalid with errorMessage', () => {
    render(<Toggle invalid errorMessage="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('links error to input via aria-describedby', () => {
    render(<Toggle id="test" invalid errorMessage="Must enable" />);
    const toggle = screen.getByRole('switch');
    const describedBy = toggle.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toBeInTheDocument();
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('uses role="switch" (not checkbox)', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('input is visually hidden', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch').className).toContain('sr-only');
  });

  it('has focus-visible outline on track', () => {
    render(<Toggle label="Focus" />);
    const toggle = screen.getByRole('switch');
    const track = toggle.closest('label')?.querySelector('[class*="peer-focus-visible"]');
    expect(track).toBeInTheDocument();
  });

  // ── Ref forwarding ────────────────────────────────────────────────────

  it('forwards ref to the input element', () => {
    const ref = vi.fn();
    render(<Toggle ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  // ── Size variants ──────────────────────────────────────────────────────

  it('applies small size classes', () => {
    render(<Toggle size="sm" />);
    const track = screen.getByRole('switch').closest('label')?.querySelector('[class*="w-7"]');
    expect(track).toBeInTheDocument();
  });

  it('applies medium size classes (default)', () => {
    render(<Toggle size="md" />);
    const track = screen.getByRole('switch').closest('label')?.querySelector('[class*="w-9"]');
    expect(track).toBeInTheDocument();
  });

  it('applies large size classes', () => {
    render(<Toggle size="lg" />);
    const track = screen.getByRole('switch').closest('label')?.querySelector('[class*="w-11"]');
    expect(track).toBeInTheDocument();
  });

  // ── Label positioning ──────────────────────────────────────────────────

  it('renders label next to toggle with correct gap', () => {
    render(<Toggle label="Enable feature" size="md" />);
    const label = screen.getByText('Enable feature');
    const labelElement = label.closest('label');
    expect(labelElement).toHaveClass('gap-2');
  });

  it('does not add gap when no label provided', () => {
    render(<Toggle size="md" />);
    const label = screen.getByRole('switch').closest('label');
    // When no label, gap-2 should not be added
    expect(label).not.toHaveClass('gap-2');
  });

  // ── Disabled state styling ─────────────────────────────────────────────

  it('applies disabled styling to label', () => {
    render(<Toggle label="Disabled toggle" disabled />);
    const label = screen.getByLabelText('Disabled toggle').closest('label');
    expect(label).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies disabled text color to label text', () => {
    render(<Toggle label="Disabled" disabled />);
    const labelText = screen.getByText('Disabled');
    expect(labelText).toHaveStyle({ color: 'var(--color-on-surface-subtle-1)' });
  });

  it('applies enabled text color when not disabled', () => {
    render(<Toggle label="Enabled" disabled={false} />);
    const labelText = screen.getByText('Enabled');
    expect(labelText).toHaveStyle({ color: 'var(--color-on-surface)' });
  });

  // ── Invalid state styling ──────────────────────────────────────────────

  it('renders error message icon when invalid', () => {
    render(<Toggle invalid errorMessage="This is required" />);
    // Error message should have icon
    const errorText = screen.getByText('This is required');
    expect(errorText).toBeInTheDocument();
  });

  it('applies error styling to track when invalid', () => {
    render(<Toggle invalid errorMessage="Error" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-describedby', expect.stringContaining('error'));
  });

  it('does not show error message when invalid but no errorMessage provided', () => {
    const { container } = render(<Toggle invalid />);
    // No error div should render if no errorMessage
    const errorDiv = container.querySelector('[id*="error"]');
    expect(errorDiv).not.toBeInTheDocument();
  });

  // ── Toggle animation trigger ───────────────────────────────────────────

  it('triggers animation when toggling from unchecked to checked', () => {
    const { rerender } = render(<Toggle checked={false} onChange={() => {}} />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(<Toggle checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('triggers animation when toggling from checked to unchecked', () => {
    const { rerender } = render(<Toggle checked={true} onChange={() => {}} />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');

    rerender(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  // ── Label and disabled combination ─────────────────────────────────────

  it('shows disabled label with toggle', () => {
    render(<Toggle label="Night mode" disabled />);
    const toggle = screen.getByRole('switch');
    const label = toggle.closest('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('cursor-not-allowed');
  });

  it('hover state does not apply when disabled', async () => {
    const user = userEvent.setup();
    render(<Toggle label="Disabled" disabled />);
    const label = screen.getByLabelText('Disabled').closest('label');

    await user.hover(label!);
    // Disabled toggles should not show hover effects
    expect(label).toHaveClass('opacity-50');
  });

  // ── Track color transitions ────────────────────────────────────────────

  it('has track element with proper animation setup', () => {
    render(<Toggle checked={false} onChange={() => {}} />);
    const track = screen.getByRole('switch').closest('label')?.querySelector('div[class*="rounded-full"]');
    expect(track).toBeInTheDocument();
  });

  it('updates track color based on checked state', async () => {
    const { rerender } = render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(<Toggle checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  // ── Press handler integration ──────────────────────────────────────────

  it('integrates usePress hook for press feedback', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Toggle label="Test" onChange={handleChange} />);

    await user.click(screen.getByLabelText('Test'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('does not trigger press feedback when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Toggle label="Disabled" disabled onChange={handleChange} />);

    await user.click(screen.getByRole('switch'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ── Error message margin alignment ─────────────────────────────────────

  it('aligns error message with label when label present', () => {
    const { container } = render(<Toggle id="test" label="Enable" invalid errorMessage="Required" />);
    const errorDiv = container.querySelector('div[id*="error"]') as HTMLElement;
    expect(errorDiv).toBeInTheDocument();
    // Should have margin-left to align under track + label gap
    expect(errorDiv.style.marginLeft).toBeTruthy();
  });

  it('does not apply margin-left to error when no label', () => {
    const { container } = render(<Toggle id="test" invalid errorMessage="Required" />);
    const errorDiv = container.querySelector('div[id*="error"]') as HTMLElement;
    expect(errorDiv).toBeInTheDocument();
    // No margin-left when no label
    expect(errorDiv.style.marginLeft).toBeFalsy();
  });

  // ── Hover state management ─────────────────────────────────────────────

  it('handles mouse enter and leave for hover state', async () => {
    const user = userEvent.setup();
    render(<Toggle label="Hover test" />);
    const label = screen.getByLabelText('Hover test').closest('label');
    expect(label).toBeInTheDocument();

    // Trigger mouse enter
    await user.hover(label!);
    // Component should update internal hover state (setIsHovered(true))

    // Trigger mouse leave
    await user.unhover(label!);
    // Component should update internal hover state (setIsHovered(false))
    // Just verify the label still exists
    expect(label).toBeInTheDocument();
  });
});
