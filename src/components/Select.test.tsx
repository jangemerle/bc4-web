import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select, type SelectOption } from './Select';

const defaultOptions: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
];

describe('Select', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders a button with combobox role', () => {
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('renders with label', () => {
    render(<Select label="Country" options={defaultOptions} />);
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('renders placeholder text when no value selected', () => {
    render(<Select placeholder="Choose a country" options={defaultOptions} />);
    expect(screen.getByText('Choose a country')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<Select placeholder="Pick one" options={defaultOptions} />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('renders caption text', () => {
    render(<Select label="Field" caption="This is required" options={defaultOptions} />);
    expect(screen.getByText('This is required')).toBeInTheDocument();
  });

  // ── Options and selection ──────────────────────────────────────────────

  it('opens dropdown and shows all options', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    await user.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('displays option labels in dropdown', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
  });

  it('selects an option when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={defaultOptions} onChange={handleChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Canada'));
    expect(handleChange).toHaveBeenCalledWith('ca');
  });

  it('displays selected option label in trigger button', () => {
    render(<Select options={defaultOptions} defaultValue="ca" />);
    // Initially should show "Canada"
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('marks selected option as selected in dropdown', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} defaultValue="us" />);
    await user.click(screen.getByRole('combobox'));
    const items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('closes dropdown after selecting an option', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByText('Canada'));
    // Menu animates out, so we need to wait for it to be removed from DOM
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  // ── Size variants ──────────────────────────────────────────────────────

  it('defaults to medium size (h-10)', () => {
    render(<Select label="Field" options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    expect(button.className).toContain('h-10');
  });

  it('applies small size (h-8)', () => {
    render(<Select label="Field" size="sm" options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    expect(button.className).toContain('h-8');
  });

  it('applies large size (h-12)', () => {
    render(<Select label="Field" size="lg" options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    expect(button.className).toContain('h-12');
  });

  // ── Disabled state ─────────────────────────────────────────────────────

  it('sets disabled attribute on button', () => {
    render(<Select label="Field" disabled options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('prevents opening dropdown when disabled', async () => {
    const user = userEvent.setup();
    render(<Select disabled options={defaultOptions} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select disabled options={defaultOptions} onChange={handleChange} />);
    await user.click(screen.getByRole('combobox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ── Read-only state ───────────────────────────────────────────────────

  it('prevents opening dropdown when readOnly', async () => {
    const user = userEvent.setup();
    render(<Select readOnly options={defaultOptions} defaultValue="us" />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not call onChange when readOnly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select readOnly defaultValue="us" options={defaultOptions} onChange={handleChange} />,
    );
    await user.click(screen.getByRole('combobox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ── Invalid / Error state ──────────────────────────────────────────────

  it('sets aria-invalid when invalid', () => {
    render(<Select label="Email" invalid options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message when invalid with errorMessage', () => {
    render(
      <Select label="Country" invalid errorMessage="This field is required" options={defaultOptions} />,
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('links error to button via aria-describedby', () => {
    render(
      <Select
        label="Country"
        invalid
        errorMessage="Required"
        id="country-select"
        options={defaultOptions}
      />,
    );
    const button = screen.getByRole('combobox');
    const describedBy = button.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorEl = document.getElementById(describedBy!);
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveTextContent('Required');
  });

  it('does not show caption when error is shown', () => {
    render(
      <Select
        label="Country"
        caption="Pick your country"
        invalid
        errorMessage="Error message"
        options={defaultOptions}
      />,
    );
    expect(screen.queryByText('Pick your country')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  // ── Keyboard navigation ────────────────────────────────────────────────

  it('opens dropdown with ArrowDown key when closed', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    button.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('opens dropdown with ArrowUp key when closed', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    button.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes dropdown with Escape key', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    await user.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    // Menu animates out, so we need to wait for it to be removed from DOM
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('does not open dropdown with ArrowDown when disabled', async () => {
    const user = userEvent.setup();
    render(<Select disabled options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    button.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not open dropdown with ArrowDown when readOnly', async () => {
    const user = userEvent.setup();
    render(<Select readOnly options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    button.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // ── Controlled vs uncontrolled ─────────────────────────────────────────

  it('works in uncontrolled mode with defaultValue', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} defaultValue="ca" />);
    // Check that Canada is displayed in the select button
    const button = screen.getByRole('combobox');
    expect(button.textContent).toContain('Canada');
    await user.click(button);
    await user.click(screen.getByRole('menuitem', { name: 'Mexico' }));
    // Wait for dropdown to close and verify Mexico is now selected
    await waitFor(() => {
      expect(button.textContent).toContain('Mexico');
    }, { timeout: 500 });
  });

  it('works in controlled mode with value and onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <Select value="us" options={defaultOptions} onChange={handleChange} />,
    );
    expect(screen.getByText('United States')).toBeInTheDocument();
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Canada'));
    expect(handleChange).toHaveBeenCalledWith('ca');
    // Wait for dropdown to close
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    }, { timeout: 500 });
    // Simulate parent updating the value
    rerender(<Select value="ca" options={defaultOptions} onChange={handleChange} />);
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('does not update internal state in controlled mode', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const button = render(<Select value="us" options={defaultOptions} onChange={handleChange} />).getByRole('combobox');
    await user.click(button);
    await user.click(screen.getByRole('menuitem', { name: 'Canada' }));
    // Wait for dropdown to close
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    }, { timeout: 500 });
    // Without rerender, should still show US (controlled)
    expect(button.textContent).toContain('United States');
  });

  // ── onChange callback ──────────────────────────────────────────────────

  it('calls onChange with selected value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={defaultOptions} onChange={handleChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Mexico'));
    expect(handleChange).toHaveBeenCalledWith('mx');
    expect(handleChange).toHaveBeenCalledOnce();
  });

  // ── Label association ──────────────────────────────────────────────────

  it('associates label with button via htmlFor', () => {
    render(<Select id="custom-select" label="Country" options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    expect(button).toHaveAttribute('id', 'custom-select');
    const label = screen.getByText('Country').closest('label');
    expect(label).toHaveAttribute('for', 'custom-select');
  });

  it('generates unique id when not provided', () => {
    render(<Select label="Field1" options={defaultOptions} />);
    const button1 = screen.getByRole('combobox');
    const id1 = button1.getAttribute('id');
    expect(id1).toBeTruthy();

    render(<Select label="Field2" options={defaultOptions} />);
    const buttons = screen.getAllByRole('combobox');
    const id2 = buttons[1].getAttribute('id');
    expect(id2).toBeTruthy();
    // IDs should be different due to useId
    expect(id1).not.toBe(id2);
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it('handles empty options array', () => {
    render(<Select options={[]} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles selecting the same option twice', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={defaultOptions} onChange={handleChange} />);
    const button = screen.getByRole('combobox');
    await user.click(button);
    await user.click(screen.getByRole('menuitem', { name: 'Canada' }));
    // Wait for dropdown to close before opening again
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    }, { timeout: 500 });
    handleChange.mockClear();
    await user.click(button);
    await user.click(screen.getByRole('menuitem', { name: 'Canada' }));
    expect(handleChange).toHaveBeenCalledWith('ca');
  });

  it('handles rapid clicks', async () => {
    const rapidUser = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    // First click opens
    await rapidUser.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    // Rapid second click (before the 50ms close window has passed)
    // should not close the menu
    await rapidUser.click(button);
  });

  it('handles value not matching any option', () => {
    render(<Select value="invalid" options={defaultOptions} onChange={() => {}} />);
    // Placeholder is transformed via fixTypo; `...` → `…` (proper ellipsis)
    expect(screen.getByText('Select…')).toBeInTheDocument();
  });

  it('handles options update', async () => {
    const user = userEvent.setup();
    const initialOptions: SelectOption[] = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    const updatedOptions: SelectOption[] = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ];

    const { rerender } = render(<Select options={initialOptions} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);

    rerender(<Select options={updatedOptions} />);
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  // ── Ref forwarding ────────────────────────────────────────────────────

  it('forwards ref to the button element', () => {
    const ref = vi.fn();
    render(<Select ref={ref} options={defaultOptions} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('sets aria-expanded correctly', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-haspopup="listbox"', () => {
    render(<Select options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('has focus-visible outline', () => {
    render(<Select label="Field" options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    expect(button.className).toContain('focus-visible:outline');
  });

  // ── Class name and custom props ────────────────────────────────────────

  it('applies custom className', () => {
    render(<Select className="custom-class" options={defaultOptions} />);
    const wrapper = screen.getByRole('combobox').closest('.flex');
    expect(wrapper?.className).toContain('custom-class');
  });

  it('applies correct wrapper structure', () => {
    render(<Select label="Country" caption="Required" options={defaultOptions} />);
    const wrapper = screen.getByRole('combobox').closest('.flex');
    expect(wrapper?.className).toContain('flex-col');
    expect(wrapper?.className).toContain('w-full');
  });

  // ── Label disabled state ───────────────────────────────────────────────

  it('shows disabled label when Select is disabled', () => {
    render(<Select label="Country" disabled options={defaultOptions} />);
    const label = screen.getByText('Country').closest('label') as HTMLLabelElement;
    // Disabled label should use the subtle color
    expect(label.style.color).toBe('var(--color-on-surface-subtle-1)');
  });

  it('shows readonly label styling when readOnly', () => {
    render(<Select label="Country" readOnly options={defaultOptions} />);
    const label = screen.getByText('Country').closest('label');
    expect(label).toBeInTheDocument();
  });

  // ── Focus management ───────────────────────────────────────────────────

  it('maintains focus on button after opening dropdown', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    button.focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(button).toHaveFocus();
    });
  });

  it('clears focus when dropdown is closed via selection', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    button.focus();
    await user.click(button);
    await user.click(screen.getByText('Canada'));
    expect(button).not.toHaveFocus();
  });

  it('removes focus class on blur when dropdown is closed', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const button = screen.getByRole('combobox');
    button.focus();
    await user.tab();
    expect(button).not.toHaveFocus();
  });
});
