import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RadioButton, RadioGroup } from './RadioButton';

describe('RadioButton', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders a radio input', () => {
    render(<RadioButton />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RadioButton label="Option A" name="test" />);
    expect(screen.getByLabelText('Option A')).toBeInTheDocument();
  });

  // ── Checked state ─────────────────────────────────────────────────────

  it('reflects checked prop', () => {
    render(<RadioButton checked onChange={() => {}} name="test" />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('reflects unchecked state', () => {
    render(<RadioButton checked={false} onChange={() => {}} name="test" />);
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  // ── Disabled state ────────────────────────────────────────────────────

  it('sets disabled attribute', () => {
    render(<RadioButton disabled name="test" />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  // ── Invalid state ─────────────────────────────────────────────────────

  it('shows error message when invalid', () => {
    render(<RadioButton name="test" value="a" invalid errorMessage="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('links error to radio via aria-describedby', () => {
    render(<RadioButton name="test" value="a" invalid errorMessage="Required" />);
    const radio = screen.getByRole('radio');
    const describedBy = radio.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toBeInTheDocument();
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('input is visually hidden', () => {
    render(<RadioButton name="test" />);
    expect(screen.getByRole('radio').className).toContain('sr-only');
  });

  it('has focus-visible outline', () => {
    render(<RadioButton name="test" label="Focus" />);
    const radio = screen.getByRole('radio');
    const ring = radio.closest('label')?.querySelector('[class*="peer-focus-visible"]');
    expect(ring).toBeInTheDocument();
  });

  // ── Standalone onChange callback ───────────────────────────────────────

  it('calls onChange when used standalone (not in RadioGroup)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton name="standalone" label="Option" onChange={handleChange} />);
    await user.click(screen.getByLabelText('Option'));
    expect(handleChange).toHaveBeenCalled();
  });
});

describe('RadioGroup', () => {
  it('renders with role="radiogroup"', () => {
    render(
      <RadioGroup name="plan" value="free" onChange={() => {}}>
        <RadioButton value="free" label="Free" />
        <RadioButton value="pro" label="Pro" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('checks the radio matching group value', () => {
    render(
      <RadioGroup name="plan" value="pro" onChange={() => {}}>
        <RadioButton value="free" label="Free" />
        <RadioButton value="pro" label="Pro" />
      </RadioGroup>,
    );
    expect(screen.getByLabelText('Free')).not.toBeChecked();
    expect(screen.getByLabelText('Pro')).toBeChecked();
  });

  it('calls onChange with clicked value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup name="plan" value="free" onChange={handleChange}>
        <RadioButton value="free" label="Free" />
        <RadioButton value="pro" label="Pro" />
      </RadioGroup>,
    );
    await user.click(screen.getByLabelText('Pro'));
    expect(handleChange).toHaveBeenCalledWith('pro');
  });

  it('disables all children when group is disabled', () => {
    render(
      <RadioGroup name="plan" value="free" onChange={() => {}} disabled>
        <RadioButton value="free" label="Free" />
        <RadioButton value="pro" label="Pro" />
      </RadioGroup>,
    );
    expect(screen.getByLabelText('Free')).toBeDisabled();
    expect(screen.getByLabelText('Pro')).toBeDisabled();
  });

  it('renders horizontal layout with direction="row"', () => {
    render(
      <RadioGroup name="plan" value="free" onChange={() => {}} direction="row">
        <RadioButton value="free" label="Free" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup').className).toContain('flex-row');
  });
});
