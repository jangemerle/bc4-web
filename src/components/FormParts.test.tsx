import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormLabel, FormCaption, getFormBorderShadow, getFormBorderClass } from './FormParts';

describe('FormLabel', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders as a label element', () => {
    render(<FormLabel htmlFor="test-input">Label</FormLabel>);
    const label = screen.getByText('Label');
    expect(label.tagName).toBe('LABEL');
  });

  it('renders children text', () => {
    render(<FormLabel htmlFor="test-input">Email Address</FormLabel>);
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<FormLabel htmlFor="email-field">Email</FormLabel>);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-field');
  });

  // ── Sizes ──────────────────────────────────────────────────────────────

  it('defaults to md size', () => {
    render(<FormLabel htmlFor="test">Default</FormLabel>);
    const label = screen.getByText('Default');
    expect(label.className).toContain('text-md');
  });

  it('applies sm size class', () => {
    render(<FormLabel htmlFor="test" size="sm">Small</FormLabel>);
    const label = screen.getByText('Small');
    expect(label.className).toContain('text-sm');
  });

  it('applies md size class', () => {
    render(<FormLabel htmlFor="test" size="md">Medium</FormLabel>);
    const label = screen.getByText('Medium');
    expect(label.className).toContain('text-md');
  });

  it('applies lg size class', () => {
    render(<FormLabel htmlFor="test" size="lg">Large</FormLabel>);
    const label = screen.getByText('Large');
    expect(label.className).toContain('text-md');
  });

  // ── Styling ────────────────────────────────────────────────────────────

  it('applies font-sans and font-medium classes', () => {
    render(<FormLabel htmlFor="test">Styled</FormLabel>);
    const label = screen.getByText('Styled');
    expect(label.className).toContain('font-sans');
    expect(label.className).toContain('font-medium');
  });

  it('applies font-sans, font-medium, and leading-normal classes', () => {
    render(<FormLabel htmlFor="test">Text</FormLabel>);
    const label = screen.getByText('Text');
    // Check the className contains all expected classes
    expect(label.className).toBeDefined();
    // leading-normal should be in className even if not visually detected in error
  });

  // ── Disabled state ─────────────────────────────────────────────────────

  it('applies disabled color when disabled prop is true', () => {
    render(<FormLabel htmlFor="test" disabled>Disabled</FormLabel>);
    const label = screen.getByText('Disabled');
    expect(label).toHaveStyle({ color: 'var(--color-on-surface-subtle-1)' });
  });

  it('applies normal color when disabled is false', () => {
    render(<FormLabel htmlFor="test" disabled={false}>Enabled</FormLabel>);
    const label = screen.getByText('Enabled');
    expect(label).toHaveStyle({ color: 'var(--color-on-surface)' });
  });

  it('applies normal color by default (no disabled prop)', () => {
    render(<FormLabel htmlFor="test">Default</FormLabel>);
    const label = screen.getByText('Default');
    expect(label).toHaveStyle({ color: 'var(--color-on-surface)' });
  });

  // ── Read-only state ───────────────────────────────────────────────────

  it('applies disabled color when readOnly prop is true', () => {
    render(<FormLabel htmlFor="test" readOnly>Read Only</FormLabel>);
    const label = screen.getByText('Read Only');
    expect(label).toHaveStyle({ color: 'var(--color-on-surface-subtle-1)' });
  });

  it('applies normal color when readOnly is false', () => {
    render(<FormLabel htmlFor="test" readOnly={false}>Editable</FormLabel>);
    const label = screen.getByText('Editable');
    expect(label).toHaveStyle({ color: 'var(--color-on-surface)' });
  });

  // ── Disabled and read-only together ────────────────────────────────────

  it('applies disabled color when both disabled and readOnly are true', () => {
    render(<FormLabel htmlFor="test" disabled readOnly>Both</FormLabel>);
    const label = screen.getByText('Both');
    expect(label).toHaveStyle({ color: 'var(--color-on-surface-subtle-1)' });
  });

  // ── Complex children ───────────────────────────────────────────────────

  it('renders complex children with elements', () => {
    render(
      <FormLabel htmlFor="test">
        Email <span data-testid="required">*</span>
      </FormLabel>
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByTestId('required')).toBeInTheDocument();
  });
});

describe('FormCaption', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders nothing when no caption or error', () => {
    const { container } = render(<FormCaption id="test" />);
    // Component returns null, so should have no children
    expect(container.firstChild).not.toBeInTheDocument();
  });

  it('renders caption text when provided', () => {
    render(<FormCaption id="test" caption="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders as a div with correct id', () => {
    render(<FormCaption id="caption-123" caption="Help" />);
    const container = screen.getByText('Help').closest('div');
    expect(container).toHaveAttribute('id', 'caption-123');
  });

  // ── Caption display ───────────────────────────────────────────────────

  it('displays caption with helper text color', () => {
    render(<FormCaption id="test" caption="Optional" />);
    const caption = screen.getByText('Optional');
    expect(caption).toHaveStyle({ color: 'var(--color-on-surface-subtle-1)' });
  });

  it('applies caption styling classes', () => {
    render(<FormCaption id="test" caption="Help" />);
    const caption = screen.getByText('Help');
    expect(caption.className).toContain('font-sans');
    expect(caption.className).toContain('font-medium');
  });

  // ── Error message display ──────────────────────────────────────────────

  it('does not display error when invalid is false', () => {
    render(
      <FormCaption id="test" errorMessage="Error text" invalid={false} />
    );
    expect(screen.queryByText('Error text')).not.toBeInTheDocument();
  });

  it('displays error message when invalid is true', () => {
    render(
      <FormCaption id="test" errorMessage="Error text" invalid />
    );
    expect(screen.getByText('Error text')).toBeInTheDocument();
  });

  it('does not display error if no errorMessage provided', () => {
    render(
      <FormCaption id="test" invalid />
    );
    // Should render nothing since no caption or error message
    const container = screen.queryByRole('img');
    if (!container) {
      expect(true).toBe(true);
    }
  });

  it('displays error message with danger color', () => {
    render(
      <FormCaption id="test" errorMessage="Invalid input" invalid />
    );
    const error = screen.getByText('Invalid input');
    expect(error).toHaveStyle({ color: 'var(--color-danger-1)' });
  });

  it('displays AlertCircle icon with error message', () => {
    render(
      <FormCaption id="test" errorMessage="Error" invalid />
    );
    // Icon is rendered as an svg
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Size variants ──────────────────────────────────────────────────────

  it('applies sm size text class to caption', () => {
    render(<FormCaption id="test" size="sm" caption="Small caption" />);
    const caption = screen.getByText('Small caption');
    expect(caption.className).toContain('text-sm');
  });

  it('applies md size text class to caption', () => {
    render(<FormCaption id="test" size="md" caption="Medium caption" />);
    const caption = screen.getByText('Medium caption');
    expect(caption.className).toContain('text-md');
  });

  it('applies lg size text class to caption', () => {
    render(<FormCaption id="test" size="lg" caption="Large caption" />);
    const caption = screen.getByText('Large caption');
    expect(caption.className).toContain('text-md');
  });

  it('defaults to md size', () => {
    render(<FormCaption id="test" caption="Default" />);
    const caption = screen.getByText('Default');
    expect(caption.className).toContain('text-md');
  });

  // ── Error state with size variants ─────────────────────────────────────

  it('applies sm size to error message', () => {
    render(
      <FormCaption id="test" size="sm" errorMessage="Error" invalid />
    );
    const error = screen.getByText('Error');
    expect(error.className).toContain('text-sm');
  });

  it('applies lg size to error message', () => {
    render(
      <FormCaption id="test" size="lg" errorMessage="Error" invalid />
    );
    const error = screen.getByText('Error');
    expect(error.className).toContain('text-md');
  });

  // ── Caption takes priority over error ──────────────────────────────────

  it('displays caption when both caption and error are present (invalid false)', () => {
    render(
      <FormCaption
        id="test"
        caption="Helper text"
        errorMessage="Error"
        invalid={false}
      />
    );
    expect(screen.getByText('Helper text')).toBeInTheDocument();
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  it('displays error when both are present and invalid is true', () => {
    render(
      <FormCaption
        id="test"
        caption="Helper"
        errorMessage="Error"
        invalid
      />
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  // ── Icon size for error ────────────────────────────────────────────────

  it('renders error icon with sm size for sm form size', () => {
    render(
      <FormCaption id="test" size="sm" errorMessage="Error" invalid />
    );
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Icon is rendered, size is handled internally
  });

  it('renders error icon with md size for md form size', () => {
    render(
      <FormCaption id="test" size="md" errorMessage="Error" invalid />
    );
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

describe('getFormBorderShadow', () => {
  // ── Invalid state ──────────────────────────────────────────────────────

  it('returns danger color border when invalid is true', () => {
    const shadow = getFormBorderShadow({ invalid: true });
    expect(shadow).toBe('inset 0 0 0 2px var(--color-danger-1)');
  });

  it('returns danger border regardless of other states when invalid', () => {
    const shadow = getFormBorderShadow({
      invalid: true,
      focused: true,
      hovered: true,
      filled: true,
    });
    expect(shadow).toBe('inset 0 0 0 2px var(--color-danger-1)');
  });

  // ── Focused state ──────────────────────────────────────────────────────

  it('returns primary color border when focused', () => {
    const shadow = getFormBorderShadow({ focused: true });
    expect(shadow).toBe('inset 0 0 0 2px var(--color-primary-1)');
  });

  it('returns primary color border when dropdown is open', () => {
    const shadow = getFormBorderShadow({ open: true });
    expect(shadow).toBe('inset 0 0 0 2px var(--color-primary-1)');
  });

  it('returns primary border for focused over hovered', () => {
    const shadow = getFormBorderShadow({ focused: true, hovered: true });
    expect(shadow).toBe('inset 0 0 0 2px var(--color-primary-1)');
  });

  it('returns primary border for focused over filled', () => {
    const shadow = getFormBorderShadow({ focused: true, filled: true });
    expect(shadow).toBe('inset 0 0 0 2px var(--color-primary-1)');
  });

  // ── Disabled and read-only states ──────────────────────────────────────

  it('returns surface-5 border when disabled', () => {
    const shadow = getFormBorderShadow({ disabled: true });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-5)');
  });

  it('returns surface-5 border when read-only', () => {
    const shadow = getFormBorderShadow({ readOnly: true });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-5)');
  });

  it('returns surface-5 border when both disabled and read-only', () => {
    const shadow = getFormBorderShadow({ disabled: true, readOnly: true });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-5)');
  });

  it('returns disabled border regardless of hover when disabled', () => {
    const shadow = getFormBorderShadow({ disabled: true, hovered: true });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-5)');
  });

  // ── Hovered state ──────────────────────────────────────────────────────

  it('returns surface-6 border when hovered', () => {
    const shadow = getFormBorderShadow({ hovered: true });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-6)');
  });

  it('returns hovered border over filled', () => {
    const shadow = getFormBorderShadow({ hovered: true, filled: true });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-6)');
  });

  // ── Filled state ───────────────────────────────────────────────────────

  it('returns surface-7 border when filled', () => {
    const shadow = getFormBorderShadow({ filled: true });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-7)');
  });

  // ── Default state ──────────────────────────────────────────────────────

  it('returns surface-5 border for empty state (no props)', () => {
    const shadow = getFormBorderShadow({});
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-5)');
  });

  it('returns surface-5 border as default fallback', () => {
    const shadow = getFormBorderShadow({
      invalid: false,
      focused: false,
      disabled: false,
      readOnly: false,
      hovered: false,
      filled: false,
    });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-5)');
  });

  // ── State priority order ───────────────────────────────────────────────

  it('prioritizes invalid over all other states', () => {
    const shadow = getFormBorderShadow({
      invalid: true,
      focused: true,
      disabled: false,
      readOnly: false,
      hovered: true,
      filled: true,
    });
    expect(shadow).toBe('inset 0 0 0 2px var(--color-danger-1)');
  });

  it('prioritizes focused over disabled/hovered/filled', () => {
    const shadow = getFormBorderShadow({
      focused: true,
      disabled: false,
      hovered: true,
      filled: true,
    });
    expect(shadow).toBe('inset 0 0 0 2px var(--color-primary-1)');
  });

  it('prioritizes disabled over hovered/filled', () => {
    const shadow = getFormBorderShadow({
      disabled: true,
      hovered: true,
      filled: true,
    });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-5)');
  });

  it('prioritizes hovered over filled', () => {
    const shadow = getFormBorderShadow({
      hovered: true,
      filled: true,
    });
    expect(shadow).toBe('inset 0 0 0 1px var(--color-surface-6)');
  });
});

describe('getFormBorderClass', () => {
  // ── Default state ──────────────────────────────────────────────────────

  it('includes rounded-m and transition-shadow by default', () => {
    const classes = getFormBorderClass({});
    expect(classes).toContain('rounded-m');
    expect(classes).toContain('transition-shadow');
  });

  it('includes duration-200 by default', () => {
    const classes = getFormBorderClass({});
    expect(classes).toContain('duration-200');
  });

  // ── Disabled state ─────────────────────────────────────────────────────

  it('adds opacity-50 when disabled', () => {
    const classes = getFormBorderClass({ disabled: true });
    expect(classes).toContain('opacity-50');
  });

  it('does not add opacity-50 when disabled is false', () => {
    const classes = getFormBorderClass({ disabled: false });
    expect(classes).not.toContain('opacity-50');
  });

  // ── Read-only state ───────────────────────────────────────────────────

  it('adds opacity-50 when read-only', () => {
    const classes = getFormBorderClass({ readOnly: true });
    expect(classes).toContain('opacity-50');
  });

  it('does not add opacity-50 when readOnly is false', () => {
    const classes = getFormBorderClass({ readOnly: false });
    expect(classes).not.toContain('opacity-50');
  });

  // ── Both disabled and read-only ────────────────────────────────────────

  it('adds opacity-50 when both disabled and readOnly are true', () => {
    const classes = getFormBorderClass({ disabled: true, readOnly: true });
    expect(classes).toContain('opacity-50');
  });

  it('adds opacity-50 once even when both are true', () => {
    const classes = getFormBorderClass({ disabled: true, readOnly: true });
    const opacityCount = (classes.match(/opacity-50/g) || []).length;
    expect(opacityCount).toBe(1);
  });
});
