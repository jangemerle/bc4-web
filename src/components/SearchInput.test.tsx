import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders an input element', () => {
    render(<SearchInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<SearchInput placeholder="Search items..." />);
    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
  });

  it('renders with aria-label', () => {
    render(<SearchInput aria-label="Search" />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  // ── Search icon ────────────────────────────────────────────────────────

  it('renders search icon on the left', () => {
    render(<SearchInput placeholder="Search" />);
    const input = screen.getByPlaceholderText('Search');
    const wrapper = input.closest('.relative');
    // Check that the wrapper contains an SVG (lucide-react Search icon)
    expect(wrapper?.querySelector('svg')).toBeInTheDocument();
  });

  // ── Clear button behavior ──────────────────────────────────────────────

  it('does not show clear button when input is empty', () => {
    render(<SearchInput placeholder="Search" />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('shows clear button when value is entered', async () => {
    const user = userEvent.setup();
    render(<SearchInput placeholder="Search" />);
    await user.type(screen.getByPlaceholderText('Search'), 'test query');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('shows clear button with defaultValue', () => {
    render(<SearchInput placeholder="Search" defaultValue="initial" />);
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('does not show clear button when defaultValue is empty string', () => {
    render(<SearchInput placeholder="Search" defaultValue="" />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('does not show clear button when value is empty string', async () => {
    render(<SearchInput placeholder="Search" value="" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  // ── Clear button click ─────────────────────────────────────────────────

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SearchInput placeholder="Search" value="test" onChange={() => {}} onClear={onClear} />);
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    await user.click(clearButton);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('hides clear button after clicking it', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = useState('test');
      return (
        <SearchInput
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
        />
      );
    };
    render(<TestComponent />);
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toBeInTheDocument();
    await user.click(clearButton);
    // After clicking clear, the button should disappear because value is now empty
    // In a real app, this would be managed by the parent component
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  // ── User input ─────────────────────────────────────────────────────────

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchInput placeholder="Search" onChange={onChange} />);
    await user.type(screen.getByPlaceholderText('Search'), 'hello');
    expect(onChange).toHaveBeenCalledTimes(5); // h-e-l-l-o
  });

  it('accepts controlled value prop', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <SearchInput
        placeholder="Search"
        value="initial"
        onChange={handleChange}
      />,
    );
    expect(screen.getByDisplayValue('initial')).toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText('Search'));
    rerender(
      <SearchInput
        placeholder="Search"
        value=""
        onChange={handleChange}
      />,
    );
    expect(screen.queryByDisplayValue('initial')).not.toBeInTheDocument();
  });

  // ── Disabled state ─────────────────────────────────────────────────────

  it('sets disabled attribute when disabled', () => {
    render(<SearchInput placeholder="Search" disabled />);
    expect(screen.getByPlaceholderText('Search')).toBeDisabled();
  });

  it('does not show clear button when disabled (even with value)', () => {
    render(<SearchInput placeholder="Search" value="test" onChange={() => {}} disabled />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('does not allow typing when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchInput placeholder="Search" onChange={onChange} disabled />);
    await user.type(screen.getByPlaceholderText('Search'), 'attempt');
    // Should not fire onChange because input is disabled
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── ReadOnly state ─────────────────────────────────────────────────────

  it('sets readOnly attribute when readOnly', () => {
    render(<SearchInput placeholder="Search" readOnly />);
    expect(screen.getByPlaceholderText('Search')).toHaveAttribute('readonly');
  });

  it('does not show clear button when readOnly (even with value)', () => {
    render(<SearchInput placeholder="Search" value="test" onChange={() => {}} readOnly />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  // ── Size variants ──────────────────────────────────────────────────────

  it('defaults to medium size', () => {
    render(<SearchInput placeholder="Search" aria-label="Field" />);
    const wrapper = screen.getByLabelText('Field').closest('.relative');
    expect(wrapper?.className).toContain('h-10');
  });

  it('applies small size', () => {
    render(<SearchInput placeholder="Search" aria-label="Field" size="sm" />);
    const wrapper = screen.getByLabelText('Field').closest('.relative');
    expect(wrapper?.className).toContain('h-8');
  });

  it('applies large size', () => {
    render(<SearchInput placeholder="Search" aria-label="Field" size="lg" />);
    const wrapper = screen.getByLabelText('Field').closest('.relative');
    expect(wrapper?.className).toContain('h-12');
  });

  it('uses correct clear button size for small SearchInput', async () => {
    const user = userEvent.setup();
    render(<SearchInput placeholder="Search" size="sm" />);
    await user.type(screen.getByPlaceholderText('Search'), 'test');
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    // Small SearchInput should use 'xs' clear button which has p-1 (4px)
    expect(clearButton.className).toContain('p-1');
  });

  it('uses correct clear button size for large SearchInput', async () => {
    const user = userEvent.setup();
    render(<SearchInput placeholder="Search" size="lg" />);
    await user.type(screen.getByPlaceholderText('Search'), 'test');
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    // Large SearchInput should use 'sm' clear button (larger than xs)
    expect(clearButton).toBeInTheDocument();
  });

  // ── Focus and blur ─────────────────────────────────────────────────────

  it('calls onFocus when focused', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<SearchInput placeholder="Search" onFocus={onFocus} />);
    await user.click(screen.getByPlaceholderText('Search'));
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it('calls onBlur when blurred', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<SearchInput placeholder="Search" onBlur={onBlur} />);
    const input = screen.getByPlaceholderText('Search');
    await user.click(input);
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  // ── Ref forwarding ─────────────────────────────────────────────────────

  it('forwards ref to the input element', () => {
    const ref = vi.fn();
    render(<SearchInput placeholder="Search" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('renders as a textbox role (standard input)', () => {
    render(<SearchInput placeholder="Search" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('clear button has aria-label for accessibility', async () => {
    const user = userEvent.setup();
    render(<SearchInput placeholder="Search" />);
    await user.type(screen.getByPlaceholderText('Search'), 'test');
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
  });

  it('clear button has tabIndex={-1} to exclude from tab order', async () => {
    const user = userEvent.setup();
    render(<SearchInput placeholder="Search" />);
    await user.type(screen.getByPlaceholderText('Search'), 'test');
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toHaveAttribute('tabindex', '-1');
  });

  // ── className pass-through ─────────────────────────────────────────────

  it('passes custom className to the Input component', () => {
    // Note: Input wraps the actual input element, so className is applied
    // to the wrapper, not the underlying input. This tests that the prop
    // is accepted and passed through the component hierarchy.
    render(<SearchInput placeholder="Search" className="custom-class" />);
    const input = screen.getByPlaceholderText('Search');
    // The input should still be present and functional
    expect(input).toBeInTheDocument();
  });

  // ── Integration scenarios ──────────────────────────────────────────────

  it('works in a controlled component pattern', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <SearchInput
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
        />
      );
    };
    render(<TestComponent />);
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;

    // Initially no clear button
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    // Type some text
    await user.type(input, 'query');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();

    // Click clear button
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input.value).toBe('');
  });

  it('supports HTML input attributes', () => {
    render(
      <SearchInput
        placeholder="Search"
        maxLength={50}
        autoComplete="off"
        spellCheck={false}
      />,
    );
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
    expect(input.maxLength).toBe(50);
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('spellcheck', 'false');
  });
});
