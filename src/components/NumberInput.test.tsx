import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  // -- Rendering --------------------------------------------------------─

  it('renders an input element', () => {
    render(<NumberInput label="Quantity" />);
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<NumberInput label="Count" />);
    expect(screen.getByLabelText('Count')).toBeInTheDocument();
  });

  it('renders with caption', () => {
    render(<NumberInput label="Amount" caption="Min 0, Max 100" />);
    expect(screen.getByText('Min 0, Max 100')).toBeInTheDocument();
  });

  it('renders with error message when invalid', () => {
    render(<NumberInput label="Age" invalid errorMessage="Must be 18+" />);
    expect(screen.getByText('Must be 18+')).toBeInTheDocument();
  });

  it('renders increment button with aria-label', () => {
    render(<NumberInput label="Count" />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument();
  });

  it('renders decrement button with aria-label', () => {
    render(<NumberInput label="Count" />);
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument();
  });

  // -- Sizes ------------------------------------------------------------─

  it('defaults to medium size (h-10)', () => {
    render(<NumberInput label="Field" />);
    const wrapper = screen.getByLabelText('Field').closest('.relative');
    expect(wrapper?.className).toContain('h-10');
  });

  it('applies small size (h-8)', () => {
    render(<NumberInput label="Small" size="sm" />);
    const wrapper = screen.getByLabelText('Small').closest('.relative');
    expect(wrapper?.className).toContain('h-8');
  });

  it('applies large size (h-12)', () => {
    render(<NumberInput label="Large" size="lg" />);
    const wrapper = screen.getByLabelText('Large').closest('.relative');
    expect(wrapper?.className).toContain('h-12');
  });

  // -- Default value ----------------------------------------------------─

  it('displays default value of 0', () => {
    render(<NumberInput label="Count" />);
    const input = screen.getByLabelText('Count') as HTMLInputElement;
    expect(input.value).toBe('0');
  });

  it('displays custom defaultValue', () => {
    render(<NumberInput label="Count" defaultValue={42} />);
    const input = screen.getByLabelText('Count') as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  it('displays controlled value', () => {
    render(<NumberInput label="Count" value={100} onChange={() => {}} />);
    const input = screen.getByLabelText('Count') as HTMLInputElement;
    expect(input.value).toBe('100');
  });

  // -- Increment / Decrement ----------------------------------------------

  it('increments value on increase button click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" defaultValue={5} onChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it('decrements value on decrease button click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" defaultValue={5} onChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('respects custom step value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" defaultValue={0} step={10} onChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(handleChange).toHaveBeenCalledWith(10);
  });

  // -- Min / Max bounds --------------------------------------------------─

  it('does not decrement below min', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" defaultValue={0} min={0} onChange={handleChange} />);
    // Decrease button is disabled when at min, so clicking won't call the handler
    const decreaseBtn = screen.getByRole('button', { name: 'Decrease' });
    expect(decreaseBtn).toBeDisabled();
    await user.click(decreaseBtn);
    // Button is disabled, so onChange should not be called
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('disables decrease button when at min', () => {
    render(<NumberInput label="Count" defaultValue={0} min={0} />);
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });

  it('does not increment above max', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" defaultValue={100} max={100} onChange={handleChange} />);
    // Increase button is disabled when at max, so clicking won't call the handler
    const increaseBtn = screen.getByRole('button', { name: 'Increase' });
    expect(increaseBtn).toBeDisabled();
    await user.click(increaseBtn);
    // Button is disabled, so onChange should not be called
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('disables increase button when at max', () => {
    render(<NumberInput label="Count" defaultValue={100} max={100} />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });

  it('allows negative values when allowNegative is true', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Temperature" defaultValue={0} allowNegative step={1} onChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(handleChange).toHaveBeenCalledWith(-1);
  });

  it('prevents negative values by default (min=0)', () => {
    render(<NumberInput label="Count" defaultValue={0} />);
    const input = screen.getByLabelText('Count') as HTMLInputElement;
    // default min should be 0, preventing negatives
    expect(input.value).toBe('0');
  });

  // -- Disabled state ----------------------------------------------------─

  it('sets disabled attribute', () => {
    render(<NumberInput label="Count" disabled />);
    expect(screen.getByLabelText('Count')).toBeDisabled();
  });

  it('disables both buttons when disabled', () => {
    render(<NumberInput label="Count" disabled />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });

  it('disables buttons when readOnly', () => {
    render(<NumberInput label="Count" readOnly />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });

  it('does not call onChange when disabled and buttons clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" disabled onChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // -- Invalid / aria attributes ------------------------------------------

  it('sets aria-invalid when invalid', () => {
    render(<NumberInput label="Age" invalid />);
    expect(screen.getByLabelText('Age')).toHaveAttribute('aria-invalid', 'true');
  });

  it('links error message to input via aria-describedby', () => {
    render(<NumberInput label="Age" invalid errorMessage="Bad" caption="Helper" />);
    const input = screen.getByLabelText('Age');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const caption = document.getElementById(describedBy!);
    expect(caption).toBeInTheDocument();
  });

  it('links caption to input via aria-describedby', () => {
    render(<NumberInput label="Count" caption="Max 100" />);
    const input = screen.getByLabelText('Count');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const caption = document.getElementById(describedBy!);
    expect(caption).toHaveTextContent('Max 100');
  });

  // -- Direct input editing ----------------------------------------------─

  it('parses typed numeric input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" onChange={handleChange} />);
    const input = screen.getByLabelText('Count');
    await user.clear(input);
    await user.type(input, '42');
    expect(handleChange).toHaveBeenLastCalledWith(42);
  });

  it('clamps typed value to min/max bounds', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" min={0} max={100} onChange={handleChange} />);
    const input = screen.getByLabelText('Count');
    await user.clear(input);
    await user.type(input, '150');
    expect(handleChange).toHaveBeenLastCalledWith(100);
  });

  it('treats empty input as 0', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" onChange={handleChange} />);
    const input = screen.getByLabelText('Count');
    await user.clear(input);
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it('ignores non-numeric input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<NumberInput label="Count" onChange={handleChange} />);
    const input = screen.getByLabelText('Count');
    await user.clear(input);
    await user.type(input, 'abc');
    // handleChange should NOT be called for invalid input
    expect(handleChange).toHaveBeenCalledWith(0); // empty string becomes 0
  });

  // -- Focus / Blur ------------------------------------------------------─

  it('calls onFocus when focused', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<NumberInput label="Count" onFocus={onFocus} />);
    await user.click(screen.getByLabelText('Count'));
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it('calls onBlur when blurred', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<NumberInput label="Count" onBlur={onBlur} />);
    const input = screen.getByLabelText('Count');
    await user.click(input);
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  // -- Ref forwarding ----------------------------------------------------─

  it('forwards ref to the input element', () => {
    const ref = vi.fn();
    render(<NumberInput label="Count" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  // -- Custom className --------------------------------------------------─

  it('applies custom className to wrapper', () => {
    render(<NumberInput label="Count" className="mt-4" />);
    const wrapper = screen.getByLabelText('Count').closest('.flex.flex-col');
    expect(wrapper?.className).toContain('mt-4');
  });

  // -- Controlled vs Uncontrolled ----------------------------------------─

  it('works as uncontrolled component with defaultValue', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Count" defaultValue={5} />);
    const input = screen.getByLabelText('Count') as HTMLInputElement;
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(input.value).toBe('6');
  });

  it('works as controlled component with value', async () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <NumberInput label="Count" value={10} onChange={handleChange} />,
    );
    const input = screen.getByLabelText('Count') as HTMLInputElement;
    expect(input.value).toBe('10');

    // Click increment
    rerender(<NumberInput label="Count" value={11} onChange={handleChange} />);
    expect(input.value).toBe('11');
  });

});
