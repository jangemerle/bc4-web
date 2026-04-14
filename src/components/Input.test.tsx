import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';
import { Search, Eye } from 'lucide-react';

describe('Input', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders caption text', () => {
    render(<Input label="Name" caption="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  // ── Sizes ─────────────────────────────────────────────────────────────

  it('defaults to medium size (h-10)', () => {
    render(<Input label="Field" />);
    const wrapper = screen.getByLabelText('Field').closest('.relative');
    expect(wrapper?.className).toContain('h-10');
  });

  it('applies small size (h-8)', () => {
    render(<Input label="Small" size="sm" />);
    const wrapper = screen.getByLabelText('Small').closest('.relative');
    expect(wrapper?.className).toContain('h-8');
  });

  // ── Invalid state ─────────────────────────────────────────────────────

  it('sets aria-invalid when invalid', () => {
    render(<Input label="Email" invalid />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message when invalid with errorMessage', () => {
    render(<Input label="Email" invalid errorMessage="Nope nope nope" />);
    expect(screen.getByText('Nope nope nope')).toBeInTheDocument();
  });

  it('links error to input via aria-describedby', () => {
    render(<Input label="Email" invalid errorMessage="Bad email" caption="Helper" />);
    const input = screen.getByLabelText('Email');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const caption = document.getElementById(describedBy!);
    expect(caption).toBeInTheDocument();
  });

  // ── Disabled / ReadOnly ───────────────────────────────────────────────

  it('sets disabled attribute', () => {
    render(<Input label="Field" disabled />);
    expect(screen.getByLabelText('Field')).toBeDisabled();
  });

  it('sets readOnly attribute', () => {
    render(<Input label="Field" readOnly />);
    expect(screen.getByLabelText('Field')).toHaveAttribute('readonly');
  });

  // ── User interaction ──────────────────────────────────────────────────

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);
    await user.type(screen.getByLabelText('Name'), 'hello');
    expect(handleChange).toHaveBeenCalledTimes(5); // h-e-l-l-o
  });

  it('calls onFocus and onBlur', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<Input label="Field" onFocus={onFocus} onBlur={onBlur} />);
    const input = screen.getByLabelText('Field');
    await user.click(input);
    expect(onFocus).toHaveBeenCalledOnce();
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  // ── Icons ─────────────────────────────────────────────────────────────

  it('renders with left icon', () => {
    render(<Input label="Search" iconLeft={Search} />);
    // Input should still be accessible
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('renders right icon button when icon + onIconClick provided', () => {
    const handleClick = vi.fn();
    render(<Input label="Password" icon={Eye} onIconClick={handleClick} />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  // ── Ref forwarding ────────────────────────────────────────────────────

  it('forwards ref to the input element', () => {
    const ref = vi.fn();
    render(<Input label="Ref" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

});
