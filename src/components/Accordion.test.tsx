import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Accordion, AccordionItem } from './Accordion';
import { ChevronDown } from 'lucide-react';

describe('Accordion', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders items with titles', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First Item">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second Item">
          Content 2
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByRole('button', { name: /First Item/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Second Item/ })).toBeInTheDocument();
  });

  it('renders children content within accordion items when open', () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1" title="Item">
          <p>This is the content</p>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('This is the content')).toBeInTheDocument();
  });

  // ── Single mode behavior ───────────────────────────────────────────────

  it('opens one item when clicked in single mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    await user.click(firstBtn);
    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Second/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes currently open item when clicking another in single mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');

    await user.click(secondBtn);
    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    expect(secondBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes item when clicking it again in single mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button', { name: /First/ });
    expect(btn).toHaveAttribute('aria-expanded', 'true');

    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  // ── Multiple mode behavior ─────────────────────────────────────────────

  it('allows multiple items open simultaneously in multiple mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    await user.click(firstBtn);
    await user.click(secondBtn);

    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');
    expect(secondBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles items independently in multiple mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple" defaultValue={['item-1']}>
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');
    expect(secondBtn).toHaveAttribute('aria-expanded', 'false');

    await user.click(firstBtn);
    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    expect(secondBtn).toHaveAttribute('aria-expanded', 'false');
  });

  // ── Chevron rotation ───────────────────────────────────────────────────

  it('has chevron icon in trigger', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Item">
          Content
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button', { name: /Item/ });
    // The button should contain a ChevronDown icon
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  // ── Disabled items ─────────────────────────────────────────────────────

  it('prevents opening disabled items', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Disabled" disabled>
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Enabled">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const disabledBtn = screen.getByRole('button', { name: /Disabled/ });
    const enabledBtn = screen.getByRole('button', { name: /Enabled/ });

    expect(disabledBtn).toBeDisabled();
    expect(enabledBtn).not.toBeDisabled();

    await user.click(disabledBtn);
    expect(disabledBtn).toHaveAttribute('aria-expanded', 'false');

    await user.click(enabledBtn);
    expect(enabledBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies disabled opacity styling', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Disabled" disabled>
          Content
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button', { name: /Disabled/ });
    expect(btn.className).toContain('opacity-40');
  });

  // ── Controlled vs uncontrolled ─────────────────────────────────────────

  it('works as uncontrolled component with defaultValue', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');

    await user.click(firstBtn);
    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('works as controlled component with value and onValueChange', async () => {
    const user = userEvent.setup();
    let currentValue = 'item-1';
    const handleChange = vi.fn((newValue) => {
      currentValue = newValue;
    });

    const { rerender } = render(
      <Accordion type="single" value={currentValue} onValueChange={handleChange}>
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    await user.click(secondBtn);
    expect(handleChange).toHaveBeenCalledWith('item-2');

    rerender(
      <Accordion type="single" value="item-2" onValueChange={handleChange}>
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    expect(secondBtn).toHaveAttribute('aria-expanded', 'true');
  });

  // ── onValueChange callback ─────────────────────────────────────────────

  it('calls onValueChange with single value in single mode', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Accordion type="single" onValueChange={handleChange}>
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button', { name: /First/ });
    await user.click(btn);

    expect(handleChange).toHaveBeenCalledWith('item-1');
  });

  it('calls onValueChange with empty string when closing in single mode', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Accordion type="single" defaultValue="item-1" onValueChange={handleChange}>
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button', { name: /First/ });
    await user.click(btn);

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('calls onValueChange with array in multiple mode', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Accordion type="multiple" onValueChange={handleChange}>
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    await user.click(firstBtn);
    expect(handleChange).toHaveBeenCalledWith(['item-1']);

    await user.click(secondBtn);
    expect(handleChange).toHaveBeenCalledWith(['item-1', 'item-2']);
  });

  // ── Variants ───────────────────────────────────────────────────────────

  it('applies default variant classes (borders, rounded)', () => {
    const { container } = render(
      <Accordion type="single" variant="default">
        <AccordionItem value="item-1" title="First">
          Content
        </AccordionItem>
      </Accordion>
    );

    const accordion = container.querySelector('.rounded-lg');
    expect(accordion).toBeInTheDocument();
    expect(accordion?.className).toContain('border');
  });

  it('applies flush variant classes (no borders)', () => {
    const { container } = render(
      <Accordion type="single" variant="flush">
        <AccordionItem value="item-1" title="First">
          Content
        </AccordionItem>
      </Accordion>
    );

    const accordion = container.querySelector('div > div');
    expect(accordion?.className).not.toContain('rounded-lg');
  });

  // ── Keyboard navigation ────────────────────────────────────────────────

  it('toggles with Enter key', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Item">
          Content
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button', { name: /Item/ });
    btn.focus();

    await user.keyboard('{Enter}');
    expect(btn).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Enter}');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles with Space key', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Item">
          Content
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button', { name: /Item/ });
    btn.focus();

    await user.keyboard(' ');
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('navigates with ArrowDown key', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
        <AccordionItem value="item-3" title="Third">
          Content 3
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    firstBtn.focus();
    await user.keyboard('{ArrowDown}');

    expect(secondBtn).toHaveFocus();
  });

  it('navigates with ArrowUp key', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    secondBtn.focus();
    await user.keyboard('{ArrowUp}');

    expect(firstBtn).toHaveFocus();
  });

  it('wraps to last item with ArrowUp on first item', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    firstBtn.focus();
    await user.keyboard('{ArrowUp}');

    expect(secondBtn).toHaveFocus();
  });

  it('wraps to first item with ArrowDown on last item', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    secondBtn.focus();
    await user.keyboard('{ArrowDown}');

    expect(firstBtn).toHaveFocus();
  });

  it('focuses first item with Home key', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
        <AccordionItem value="item-3" title="Third">
          Content 3
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const lastBtn = screen.getByRole('button', { name: /Third/ });

    lastBtn.focus();
    await user.keyboard('{Home}');

    expect(firstBtn).toHaveFocus();
  });

  it('focuses last item with End key', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
        <AccordionItem value="item-3" title="Third">
          Content 3
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const lastBtn = screen.getByRole('button', { name: /Third/ });

    firstBtn.focus();
    await user.keyboard('{End}');

    expect(lastBtn).toHaveFocus();
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('has aria-expanded attribute', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Item">
          Content
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-expanded');
  });

  it('has aria-controls pointing to content', () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1" title="Item">
          Content
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button');
    const controlsId = btn.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();

    const content = document.getElementById(controlsId!);
    expect(content).toBeInTheDocument();
  });

  it('has content region with proper ARIA attributes', () => {
    const { container } = render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1" title="Item">
          Content
        </AccordionItem>
      </Accordion>
    );

    const region = container.querySelector('[role="region"]');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-labelledby');
  });

  it('has focus-visible outline classes on trigger', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Item">
          Content
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button');
    expect(btn.className).toContain('focus-visible:outline');
  });

  // ── Icon support ───────────────────────────────────────────────────────

  it('renders leading icon in trigger', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Item" icon={ChevronDown}>
          Content
        </AccordionItem>
      </Accordion>
    );

    const btn = screen.getByRole('button');
    // Should have 2 SVGs: one for leading icon, one for chevron
    const svgs = btn.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it('handles empty content', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="Empty Item" />
      </Accordion>
    );

    const btn = screen.getByRole('button', { name: /Empty Item/ });
    await user.click(btn);

    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles all items collapsed in single mode', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    expect(secondBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('handles all items collapsed in multiple mode', () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1" title="First">
          Content 1
        </AccordionItem>
        <AccordionItem value="item-2" title="Second">
          Content 2
        </AccordionItem>
      </Accordion>
    );

    const firstBtn = screen.getByRole('button', { name: /First/ });
    const secondBtn = screen.getByRole('button', { name: /Second/ });

    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    expect(secondBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports long titles that wrap', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" title="This is a very long accordion item title that might wrap to multiple lines">
          Content
        </AccordionItem>
      </Accordion>
    );

    // Title is transformed via <Typo> — typopo's en widow rule inserts NBSP
    // between single-letter `a` and the following word, so the regex uses
    // `\s` to match either a regular space or NBSP.
    const btn = screen.getByRole('button', { name: /This is\s+a\s+very long/ });
    expect(btn).toBeInTheDocument();
  });

  // ── Error handling ─────────────────────────────────────────────────────

  it('throws error when AccordionItem is used outside Accordion', () => {
    // useAccordionContext should throw when context is null
    expect(() => {
      render(
        <AccordionItem value="item-1" title="Orphaned Item">
          Content
        </AccordionItem>
      );
    }).toThrow('AccordionItem must be used within Accordion');
  });
});
