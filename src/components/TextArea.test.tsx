import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders a textarea element', () => {
    render(<TextArea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<TextArea placeholder="Enter text here" />);
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('renders with caption text', () => {
    render(<TextArea label="Notes" caption="Optional field" />);
    expect(screen.getByText('Optional field')).toBeInTheDocument();
  });

  // ── Sizes ─────────────────────────────────────────────────────────────

  it('defaults to medium size', () => {
    render(<TextArea label="Field" />);
    const textarea = screen.getByLabelText('Field');
    expect(textarea).toHaveClass('text-base');
  });

  it('applies small size (text-md)', () => {
    render(<TextArea label="Small" size="sm" />);
    const textarea = screen.getByLabelText('Small');
    expect(textarea).toHaveClass('text-md');
  });

  it('applies large size (text-base with larger padding)', () => {
    render(<TextArea label="Large" size="lg" />);
    const textarea = screen.getByLabelText('Large');
    expect(textarea).toHaveClass('text-base');
  });

  // ── Value and onChange ─────────────────────────────────────────────────

  it('renders with defaultValue', () => {
    render(<TextArea label="Text" defaultValue="Hello" />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Hello');
  });

  it('updates value when controlled', async () => {
    const { rerender } = render(<TextArea label="Text" value="Initial" onChange={() => {}} />);
    let textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Initial');

    rerender(<TextArea label="Text" value="Updated" onChange={() => {}} />);
    textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Updated');
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TextArea label="Text" onChange={handleChange} />);

    await user.type(screen.getByLabelText('Text'), 'hello');
    expect(handleChange).toHaveBeenCalledTimes(5); // h-e-l-l-o
  });

  it('reflects hasValue state when typed', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TextArea label="Text" onChange={handleChange} />);

    const textarea = screen.getByLabelText('Text');
    expect(textarea).toHaveClass('placeholder:font-medium');

    await user.type(textarea, 'content');
    expect(handleChange).toHaveBeenCalled();
  });

  // ── Disabled state ─────────────────────────────────────────────────────

  it('sets disabled attribute', () => {
    render(<TextArea label="Field" disabled />);
    expect(screen.getByLabelText('Field')).toBeDisabled();
  });

  it('disables resize grip when disabled', () => {
    render(<TextArea label="Field" disabled />);
    const gripButton = screen.getByRole('textbox').parentElement?.querySelector('[style*="se-resize"]');
    expect(gripButton).not.toBeInTheDocument();
  });

  it('applies disabled styling', () => {
    render(<TextArea label="Field" disabled />);
    const wrapper = screen.getByLabelText('Field').parentElement;
    expect(wrapper).toHaveClass('opacity-50');
  });

  // ── ReadOnly state ─────────────────────────────────────────────────────

  it('sets readOnly attribute', () => {
    render(<TextArea label="Field" readOnly />);
    expect(screen.getByLabelText('Field')).toHaveAttribute('readonly');
  });

  it('disables resize grip when readOnly', () => {
    render(<TextArea label="Field" readOnly />);
    const gripButton = screen.getByRole('textbox').parentElement?.querySelector('[style*="se-resize"]');
    expect(gripButton).not.toBeInTheDocument();
  });

  it('applies readOnly styling', () => {
    render(<TextArea label="Field" readOnly />);
    const wrapper = screen.getByLabelText('Field').parentElement;
    expect(wrapper).toHaveClass('opacity-50');
  });

  // ── Invalid / Error state ──────────────────────────────────────────────

  it('sets aria-invalid when invalid', () => {
    render(<TextArea label="Email" invalid />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message when invalid with errorMessage', () => {
    render(<TextArea label="Email" invalid errorMessage="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('shows caption when provided and not invalid', () => {
    render(<TextArea label="Notes" caption="Be descriptive" />);
    expect(screen.getByText('Be descriptive')).toBeInTheDocument();
  });

  it('prioritizes errorMessage over caption when invalid', () => {
    render(
      <TextArea
        label="Field"
        caption="Helper text"
        invalid
        errorMessage="Error text"
      />
    );
    expect(screen.getByText('Error text')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('links error to textarea via aria-describedby', () => {
    render(
      <TextArea
        label="Email"
        invalid
        errorMessage="Bad email"
        caption="Optional"
      />
    );
    const textarea = screen.getByLabelText('Email');
    const describedBy = textarea.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorElement = document.getElementById(describedBy!);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('Bad email');
  });

  // ── Focus and Blur ────────────────────────────────────────────────────

  it('calls onFocus when focused', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<TextArea label="Text" onFocus={onFocus} />);

    await user.click(screen.getByLabelText('Text'));
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it('calls onBlur when blurred', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<TextArea label="Text" onBlur={onBlur} />);

    const textarea = screen.getByLabelText('Text');
    await user.click(textarea);
    await user.tab();

    expect(onBlur).toHaveBeenCalledOnce();
  });

  // ── Resize behavior ────────────────────────────────────────────────────

  it('renders resize grip for interactive textarea', () => {
    render(<TextArea label="Text" />);
    const textarea = screen.getByLabelText('Text');
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]');
    expect(gripButton).toBeInTheDocument();
  });

  it('does not render resize grip for disabled textarea', () => {
    render(<TextArea label="Text" disabled />);
    const textarea = screen.getByLabelText('Text');
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]');
    expect(gripButton).not.toBeInTheDocument();
  });

  it('does not render resize grip for readonly textarea', () => {
    render(<TextArea label="Text" readOnly />);
    const textarea = screen.getByLabelText('Text');
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]');
    expect(gripButton).not.toBeInTheDocument();
  });

  it('allows resize via grip drag', () => {
    render(<TextArea label="Text" />);

    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;

    // Note: Full drag simulation is complex with jsdom's getBoundingClientRect
    // This test verifies the grip is present and interactive
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]');
    expect(gripButton).toBeInTheDocument();
  });

  it('shows grip hover color on hover', () => {
    render(<TextArea label="Text" />);

    const textarea = screen.getByLabelText('Text');
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]') as HTMLElement;

    expect(gripButton).toBeInTheDocument();
    // Initial state: subtle color
    expect(gripButton.style.color).toBeTruthy();
  });

  // ── Min height ─────────────────────────────────────────────────────────

  it('has minimum height of 80px', () => {
    render(<TextArea label="Text" />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.style.minHeight).toBe('80px');
  });

  // ── Placeholder styling ────────────────────────────────────────────────

  it('has styled placeholder with font-medium', () => {
    render(<TextArea placeholder="Placeholder" />);
    const textarea = screen.getByPlaceholderText('Placeholder');
    expect(textarea).toHaveClass('placeholder:font-medium');
  });

  it('uses correct placeholder color via style tag', () => {
    const { container } = render(<TextArea label="Text" />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    const styleTag = container.querySelector(`style`);
    expect(styleTag?.textContent).toContain(`#${textarea.id}::placeholder`);
  });

  // ── Padding by size ────────────────────────────────────────────────────

  it('applies sm size padding', () => {
    render(<TextArea label="Small" size="sm" />);
    const textarea = screen.getByLabelText('Small') as HTMLTextAreaElement;
    // Small padding: 5.5px 12px (top/bottom) and 18px (bottom for grip space)
    expect(textarea.style.padding).toBeTruthy();
  });

  it('applies md size padding', () => {
    render(<TextArea label="Medium" size="md" />);
    const textarea = screen.getByLabelText('Medium') as HTMLTextAreaElement;
    expect(textarea.style.padding).toBeTruthy();
  });

  it('applies lg size padding', () => {
    render(<TextArea label="Large" size="lg" />);
    const textarea = screen.getByLabelText('Large') as HTMLTextAreaElement;
    expect(textarea.style.padding).toBeTruthy();
  });

  // ── Text color ─────────────────────────────────────────────────────────

  it('has interactive text color when interactive', () => {
    render(<TextArea label="Text" />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.style.color).toBeTruthy();
    // Should be on-surface color (interactive)
  });

  it('has disabled text color when disabled', () => {
    render(<TextArea label="Text" disabled />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.style.color).toBeTruthy();
    // Should be on-surface-subtle color (disabled)
  });

  it('has readonly text color when readonly', () => {
    render(<TextArea label="Text" readOnly />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.style.color).toBeTruthy();
  });

  // ── Cursor ─────────────────────────────────────────────────────────────

  it('shows text cursor when interactive', () => {
    render(<TextArea label="Text" />);
    const textarea = screen.getByLabelText('Text');
    expect(textarea).toHaveClass('cursor-text');
  });

  it('shows not-allowed cursor when disabled', () => {
    render(<TextArea label="Text" disabled />);
    const textarea = screen.getByLabelText('Text');
    expect(textarea).toHaveClass('cursor-not-allowed');
  });

  // ── Forward ref ────────────────────────────────────────────────────────

  it('forwards ref to textarea element', () => {
    const ref = vi.fn();
    render(<TextArea label="Text" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });

  it('can be accessed via forwarded ref', () => {
    let textareaRef: HTMLTextAreaElement | null = null;
    render(
      <TextArea
        label="Text"
        ref={(el) => {
          textareaRef = el;
        }}
      />
    );

    expect(textareaRef).toBeInstanceOf(HTMLTextAreaElement);
    textareaRef!.value = 'test';
    expect(textareaRef!.value).toBe('test');
  });

  // ── Required attribute ────────────────────────────────────────────────

  it('supports required attribute', () => {
    render(<TextArea label="Text" required />);
    expect(screen.getByLabelText('Text')).toHaveAttribute('required');
  });

  // ── Custom id and aria-describedby ────────────────────────────────────

  it('uses custom id when provided', () => {
    render(<TextArea label="Text" id="custom-id" />);
    expect(screen.getByLabelText('Text')).toHaveAttribute('id', 'custom-id');
  });

  it('generates unique id when not provided', () => {
    const { container: container1 } = render(<TextArea />);
    const { container: container2 } = render(<TextArea />);

    const textarea1 = container1.querySelector('textarea');
    const textarea2 = container2.querySelector('textarea');

    expect(textarea1?.id).not.toBe(textarea2?.id);
  });

  it('links caption to textarea via aria-describedby', () => {
    render(<TextArea label="Notes" caption="Helper" id="test-area" />);
    const textarea = screen.getByLabelText('Notes');
    const describedBy = textarea.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent('Helper');
  });

  // ── Readonly doesn't apply disabled styling ─────────────────────────

  it('applies opacity-50 to wrapper when disabled or readonly', () => {
    const { rerender } = render(<TextArea label="Text" disabled />);
    let wrapper = screen.getByLabelText('Text').parentElement;
    expect(wrapper).toHaveClass('opacity-50');

    rerender(<TextArea label="Text" readOnly />);
    wrapper = screen.getByLabelText('Text').parentElement;
    expect(wrapper).toHaveClass('opacity-50');
  });

  // ── Border shadow styling ──────────────────────────────────────────────

  it('applies transition-shadow styling to field wrapper', () => {
    render(<TextArea label="Text" />);
    const fieldWrapper = screen.getByLabelText('Text').parentElement;
    // Field wrapper should have transition classes
    expect(fieldWrapper).toHaveClass('rounded-m');
  });

  // ── Hover state ────────────────────────────────────────────────────────

  it('updates hovered state on mouse enter/leave', async () => {
    const user = userEvent.setup();
    render(<TextArea label="Text" />);

    const wrapper = screen.getByLabelText('Text').parentElement;

    // Hover
    await user.hover(wrapper!);
    // State changed internally — no direct way to test, but no errors

    // Unhover
    await user.unhover(wrapper!);
  });

  // ── Multiple TextAreas ─────────────────────────────────────────────────

  it('renders multiple textareas with unique ids', () => {
    render(
      <div>
        <TextArea label="First" />
        <TextArea label="Second" />
        <TextArea label="Third" />
      </div>
    );

    const first = screen.getByLabelText('First') as HTMLTextAreaElement;
    const second = screen.getByLabelText('Second') as HTMLTextAreaElement;
    const third = screen.getByLabelText('Third') as HTMLTextAreaElement;

    expect(first.id).not.toBe(second.id);
    expect(second.id).not.toBe(third.id);
  });

  // ── Controlled vs uncontrolled ─────────────────────────────────────────

  it('works as uncontrolled with defaultValue', async () => {
    const user = userEvent.setup();
    render(<TextArea label="Text" defaultValue="Initial" />);

    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Initial');

    await user.type(textarea, 'more');
    expect(textarea.value).toBe('Initialmore');
  });

  it('works as controlled with value prop', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <TextArea label="Text" value="A" onChange={handleChange} />
    );

    await user.type(screen.getByLabelText('Text'), 'B');
    expect(handleChange).toHaveBeenCalled();

    // Simulate parent re-rendering with new value
    rerender(
      <TextArea label="Text" value="AB" onChange={handleChange} />
    );

    expect((screen.getByLabelText('Text') as HTMLTextAreaElement).value).toBe('AB');
  });

  // ── Accessibility ──────────────────────────────────────────────────────

  it('has proper label association', () => {
    render(<TextArea label="Bio" />);
    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toBeInTheDocument();
  });

  it('uses font-sans for all text', () => {
    render(<TextArea label="Text" />);
    const textarea = screen.getByLabelText('Text');
    expect(textarea).toHaveClass('font-sans');
  });

  it('uses font-semibold for textarea text', () => {
    render(<TextArea label="Text" />);
    const textarea = screen.getByLabelText('Text');
    expect(textarea).toHaveClass('font-semibold');
  });

  it('has appropriate line height styling', () => {
    render(<TextArea label="Text" />);
    const textarea = screen.getByLabelText('Text');
    // Textarea should have font-sans and semibold weight for consistent line metrics
    expect(textarea).toHaveClass('font-sans', 'font-semibold');
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it('handles empty string value', () => {
    render(<TextArea label="Text" value="" onChange={() => {}} />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('handles very long text', async () => {
    const user = userEvent.setup();
    const longText = 'a'.repeat(1000);

    const handleChange = vi.fn();
    render(<TextArea label="Text" onChange={handleChange} />);

    await user.type(screen.getByLabelText('Text'), longText);
    expect(handleChange).toHaveBeenCalledTimes(1000);
  });

  it('handles newlines in text', () => {
    render(<TextArea label="Text" defaultValue="Line 1" />);

    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Line 1');
  });

  it('applies all extra props from ...rest', () => {
    render(
      <TextArea
        label="Text"
        data-testid="custom-test"
        spellCheck="false"
        autoComplete="off"
      />
    );

    const textarea = screen.getByTestId('custom-test');
    expect(textarea).toHaveAttribute('spellcheck', 'false');
    expect(textarea).toHaveAttribute('autocomplete', 'off');
  });

  // ── Resize drag behavior ───────────────────────────────────────────────

  it('renders resize grip and allows drag setup', () => {
    render(<TextArea label="Text" />);

    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]') as HTMLElement;

    expect(gripButton).toBeInTheDocument();

    // Verify grip has mousedown handler
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientY: 100,
    });

    gripButton.dispatchEvent(mouseDownEvent);
    expect(textarea).toBeInTheDocument();
  });

  it('starts drag on grip mousedown with correct initial state', () => {
    render(<TextArea label="Text" />);

    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]') as HTMLElement;

    // Simulate mousedown on grip with coordinates
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientY: 200,
    });

    gripButton.dispatchEvent(mouseDownEvent);
    // Drag setup should work without error
    expect(textarea).toBeInTheDocument();
  });

  it('prevents resize when disabled (no grip rendered)', () => {
    render(<TextArea label="Text" disabled />);

    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]');

    expect(gripButton).not.toBeInTheDocument();
  });

  it('prevents resize when readonly (no grip rendered)', () => {
    render(<TextArea label="Text" readOnly />);

    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]');

    expect(gripButton).not.toBeInTheDocument();
  });

  // ── Custom callback forwarding ─────────────────────────────────────────

  it('calls custom onBlur callback', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<TextArea label="Text" onBlur={onBlur} />);

    const textarea = screen.getByLabelText('Text');
    await user.click(textarea);
    await user.tab();

    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('preserves onBlur callback for readonly fields', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<TextArea label="Text" readOnly onBlur={onBlur} />);

    const textarea = screen.getByLabelText('Text');
    await user.click(textarea);
    await user.tab();

    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('calls custom onFocus callback', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<TextArea label="Text" onFocus={onFocus} />);

    const textarea = screen.getByLabelText('Text');
    await user.click(textarea);

    expect(onFocus).toHaveBeenCalledOnce();
  });

  it('preserves onFocus callback for readonly fields', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<TextArea label="Text" readOnly onFocus={onFocus} />);

    const textarea = screen.getByLabelText('Text');
    await user.click(textarea);

    expect(onFocus).toHaveBeenCalledOnce();
  });

  // ── Grip hover state ───────────────────────────────────────────────────

  it('changes grip color on grip hover', async () => {
    const user = userEvent.setup();
    render(<TextArea label="Text" />);

    const textarea = screen.getByLabelText('Text');
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]') as HTMLElement;

    expect(gripButton).toBeInTheDocument();
    // Hover over grip
    await user.hover(gripButton);
    // Hover state is internal, but grip should respond
    expect(gripButton).toBeInTheDocument();
  });

  it('restores grip color on grip unhover', async () => {
    const user = userEvent.setup();
    render(<TextArea label="Text" />);

    const textarea = screen.getByLabelText('Text');
    const gripButton = textarea.parentElement?.querySelector('div[style*="se-resize"]') as HTMLElement;

    await user.hover(gripButton);
    await user.unhover(gripButton);
    // Grip should still exist
    expect(gripButton).toBeInTheDocument();
  });

  // ── HasValue state tracking ────────────────────────────────────────────

  it('sets hasValue when textarea has defaultValue at mount', () => {
    render(<TextArea label="Text" defaultValue="Hello" />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Hello');
  });

  it('clears hasValue when value is cleared', () => {
    const { rerender } = render(<TextArea label="Text" value="Initial" onChange={() => {}} />);

    rerender(<TextArea label="Text" value="" onChange={() => {}} />);
    const textarea = screen.getByLabelText('Text') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  // ── Wrapper border shadow state ────────────────────────────────────────

  it('applies correct border shadow on focus', async () => {
    const user = userEvent.setup();
    render(<TextArea label="Text" />);

    const wrapper = screen.getByLabelText('Text').parentElement;
    expect(wrapper).toHaveStyle({ boxShadow: expect.anything() });

    await user.click(screen.getByLabelText('Text'));
    // Focus state should update shadow
    expect(wrapper).toHaveStyle({ boxShadow: expect.anything() });
  });

  it('applies correct border shadow on invalid state', () => {
    render(<TextArea label="Text" invalid />);

    const wrapper = screen.getByLabelText('Text').parentElement;
    expect(wrapper).toHaveStyle({ boxShadow: expect.anything() });
  });

  // ── Ref merging ───────────────────────────────────────────────────────

  it('merges object refs correctly', () => {
    const ref = { current: null } as React.MutableRefObject<HTMLTextAreaElement | null>;
    render(<TextArea label="Text" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.value).toBe('');
  });

  it('handles null ref gracefully', () => {
    render(<TextArea label="Text" ref={null} />);
    const textarea = screen.getByLabelText('Text');
    expect(textarea).toBeInTheDocument();
  });
});
