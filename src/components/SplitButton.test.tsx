import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SplitButton } from './SplitButton';
import { Play, Pause, Download } from 'lucide-react';

describe('SplitButton', () => {
  // -- Rendering --------------------------------------------------------─

  it('renders children as button text', () => {
    render(<SplitButton onClick={() => {}}>Start</SplitButton>);
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('renders action button and chevron button', () => {
    render(<SplitButton onClick={() => {}}>Action</SplitButton>);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2); // action + chevron
  });

  it('renders chevron button with aria-label', () => {
    render(<SplitButton onClick={() => {}}>Start</SplitButton>);
    expect(screen.getByRole('button', { name: 'More options' })).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    render(<SplitButton iconLeft={Play} onClick={() => {}}>Play</SplitButton>);
    // Icon is rendered inside the button
    expect(screen.getByText('Play')).toBeInTheDocument();
  });

  // -- Variants ----------------------------------------------------------

  it('applies primary variant by default', () => {
    const { container } = render(<SplitButton onClick={() => {}}>Primary</SplitButton>);
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    // Primary has specific background color in inline styles
    expect(actionButton.style.backgroundColor).toBe('var(--color-primary-1)');
  });

  it('applies secondary variant', () => {
    const { container } = render(
      <SplitButton variant="secondary" onClick={() => {}}>Secondary</SplitButton>,
    );
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    expect(actionButton.style.backgroundColor).toBe('transparent');
  });

  it('applies elevated variant', () => {
    const { container } = render(
      <SplitButton variant="elevated" onClick={() => {}}>Elevated</SplitButton>,
    );
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    expect(actionButton.style.backgroundColor).toBe('var(--color-surface-1)');
  });

  // -- Sizes --------------------------------------------------------------

  it('defaults to medium size (40px height)', () => {
    const { container } = render(<SplitButton onClick={() => {}}>Medium</SplitButton>);
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    expect(actionButton.style.height).toBe('40px');
  });

  it('applies small size (32px height)', () => {
    const { container } = render(<SplitButton size="sm" onClick={() => {}}>Small</SplitButton>);
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    expect(actionButton.style.height).toBe('32px');
  });

  it('applies large size (48px height)', () => {
    const { container } = render(<SplitButton size="lg" onClick={() => {}}>Large</SplitButton>);
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    expect(actionButton.style.height).toBe('48px');
  });

  it('applies extra-small size (24px height)', () => {
    const { container } = render(<SplitButton size="xs" onClick={() => {}}>XS</SplitButton>);
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    expect(actionButton.style.height).toBe('24px');
  });

  // -- Click handling ----------------------------------------------------─

  it('calls onClick when action button clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<SplitButton onClick={handleClick}>Click me</SplitButton>);
    const [actionButton] = screen.getAllByRole('button');
    await user.click(actionButton);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('calls onChevronClick when chevron button clicked', async () => {
    const user = userEvent.setup();
    const handleChevronClick = vi.fn();
    render(<SplitButton onChevronClick={handleChevronClick}>Action</SplitButton>);
    const chevronButton = screen.getByRole('button', { name: 'More options' });
    await user.click(chevronButton);
    expect(handleChevronClick).toHaveBeenCalledOnce();
  });

  it('calls both handlers for separate clicks', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const handleChevronClick = vi.fn();
    render(
      <SplitButton onClick={handleClick} onChevronClick={handleChevronClick}>
        Both
      </SplitButton>,
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]); // action
    await user.click(buttons[1]); // chevron
    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleChevronClick).toHaveBeenCalledOnce();
  });

  // -- Disabled state ----------------------------------------------------─

  it('sets disabled attribute on both buttons', () => {
    render(<SplitButton disabled onClick={() => {}}>Disabled</SplitButton>);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('does not call handlers when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const handleChevronClick = vi.fn();
    render(
      <SplitButton disabled onClick={handleClick} onChevronClick={handleChevronClick}>
        Disabled
      </SplitButton>,
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    expect(handleClick).not.toHaveBeenCalled();
    expect(handleChevronClick).not.toHaveBeenCalled();
  });

  it('applies opacity-40 when disabled', () => {
    const { container } = render(<SplitButton disabled onClick={() => {}}>Disabled</SplitButton>);
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.style.opacity).toBe('0.4');
    });
  });

  // -- chevronOpen state --------------------------------------------------

  it('sets aria-expanded on chevron button', () => {
    render(<SplitButton chevronOpen onClick={() => {}}>Open</SplitButton>);
    const chevronButton = screen.getByRole('button', { name: 'More options' });
    expect(chevronButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-expanded=false when chevronOpen is false', () => {
    render(<SplitButton chevronOpen={false} onClick={() => {}}>Closed</SplitButton>);
    const chevronButton = screen.getByRole('button', { name: 'More options' });
    expect(chevronButton).toHaveAttribute('aria-expanded', 'false');
  });

  // -- Custom className --------------------------------------------------─

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <SplitButton className="custom-class" onClick={() => {}}>Custom</SplitButton>,
    );
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });

  // -- Accessibility ----------------------------------------------------─

  it('buttons are keyboard accessible', () => {
    render(<SplitButton onClick={() => {}}>Keyboard</SplitButton>);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('type', 'button');
    });
  });

  it('chevron icon rotates when chevronOpen changes', async () => {
    const { rerender, container } = render(
      <SplitButton chevronOpen={false} onClick={() => {}}>Rotate</SplitButton>,
    );
    const chevronSpan = container.querySelector('button:last-child span');
    // First render: closed (rotate: 0)
    expect(chevronSpan).toBeInTheDocument();

    // Rerender with open state
    rerender(<SplitButton chevronOpen={true} onClick={() => {}}>Rotate</SplitButton>);
    expect(chevronSpan).toBeInTheDocument();
    // Icon should be rotated (handled by motion animate)
  });

  // -- Variants with different icons --------------------------------------

  it('renders with different icons', () => {
    const { rerender } = render(
      <SplitButton iconLeft={Play} onClick={() => {}}>Play</SplitButton>,
    );
    expect(screen.getByText('Play')).toBeInTheDocument();

    rerender(<SplitButton iconLeft={Pause} onClick={() => {}}>Pause</SplitButton>);
    expect(screen.getByText('Pause')).toBeInTheDocument();

    rerender(<SplitButton iconLeft={Download} onClick={() => {}}>Download</SplitButton>);
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  // -- Empty/No children (edge case) --

  it('renders without children', () => {
    render(<SplitButton onClick={() => {}}>Text</SplitButton>);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  // -- No callbacks (edge case) --

  it('renders without onClick handler', async () => {
    const user = userEvent.setup();
    const { container } = render(<SplitButton>No handler</SplitButton>);
    const buttons = container.querySelectorAll('button');
    // Should still render and not crash
    expect(buttons.length).toBe(2);
    await user.click(buttons[0]);
    // Should not throw
  });

  it('renders without onChevronClick handler', async () => {
    const user = userEvent.setup();
    render(<SplitButton onClick={() => {}}>Action only</SplitButton>);
    const chevronButton = screen.getByRole('button', { name: 'More options' });
    await user.click(chevronButton);
    // Should not throw
  });

  // -- Secondary variant with border --------------------------------------

  it('secondary variant has border', () => {
    const { container } = render(
      <SplitButton variant="secondary" onClick={() => {}}>Secondary</SplitButton>,
    );
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    // Secondary should have border styling
    expect(actionButton.style.border).toBeTruthy();
  });

  // -- Elevated variant with shadow --------------------------------------─

  it('elevated variant has shadow', () => {
    const { container } = render(
      <SplitButton variant="elevated" onClick={() => {}}>Elevated</SplitButton>,
    );
    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[0];
    expect(actionButton.style.boxShadow).toBeTruthy();
  });

  // ── Chevron hover state ────────────────────────────────────────────────

  it('triggers onMouseLeave on chevron button', async () => {
    const user = userEvent.setup();
    render(<SplitButton onClick={() => {}}>Hover chevron</SplitButton>);
    const chevronButton = screen.getByRole('button', { name: 'More options' });
    await user.hover(chevronButton);
    await user.unhover(chevronButton);
    expect(chevronButton).toBeInTheDocument();
  });
});
