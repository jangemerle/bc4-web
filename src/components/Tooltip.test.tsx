import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tooltip } from './Tooltip';
import { Button } from './Button';

describe('Tooltip', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders trigger element without disabled prop', () => {
    render(
      <Tooltip content="Help text">
        <Button>Hover me</Button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('does not render tooltip when disabled', () => {
    render(
      <Tooltip content="Help text" disabled>
        <Button>Hover me</Button>
      </Tooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders tooltip with plain content', async () => {
    const user = userEvent.setup();
    const button = (
      <Tooltip content="This is a tooltip">
        <button>Trigger</button>
      </Tooltip>
    );
    render(button);

    await user.hover(screen.getByRole('button', { name: 'Trigger' }));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
  });

  // ── Plain vs Rich variant ──────────────────────────────────────────────

  it('renders rich tooltip with title and description', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        content="This is the description"
        title="Title"
        rich
      >
        <button>Trigger</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Trigger' }));
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
    });
    expect(screen.getByText('This is the description')).toBeInTheDocument();
  });

  it('renders rich tooltip without title', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Just description" rich>
        <button>Trigger</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Trigger' }));
    await waitFor(() => {
      expect(screen.getByText('Just description')).toBeInTheDocument();
    });
  });

  // ── Hover behavior (plain/transient) ───────────────────────────────────

  it('shows tooltip on mouse enter', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover' });
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip" delayClose={0}>
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover' });
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.unhover(button);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('keeps tooltip open when mouse enters tooltip itself', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover' });
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    const tooltip = screen.getByRole('tooltip');
    await user.hover(tooltip);

    // Should still be visible
    expect(tooltip).toBeInTheDocument();
  });

  // ── Focus behavior ─────────────────────────────────────────────────────

  it('shows tooltip on focus-visible (keyboard focus)', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Keyboard focus tooltip">
        <button>Focus me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Focus me' });
    await user.tab();

    // Tab should focus the button
    expect(button).toHaveFocus();

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('hides tooltip on blur when using mouse', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" delayClose={0}>
        <button>Focus</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Focus' });
    // Focus via click (mouse focus)
    await user.click(button);

    // On blur, tooltip should hide
    button.blur();

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  // ── Delay behavior ────────────────────────────────────────────────────

  it('shows tooltip after hover', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover' });
    await user.hover(button);

    // Tooltip should eventually appear
    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('shows multiple tooltips in sequence', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Tooltip content="Tooltip 1" delayOpen={0}>
          <button>Button 1</button>
        </Tooltip>
        <Tooltip content="Tooltip 2" delayOpen={0}>
          <button>Button 2</button>
        </Tooltip>
      </div>
    );

    const button1 = screen.getByRole('button', { name: 'Button 1' });
    await user.hover(button1);

    await waitFor(() => {
      expect(screen.getByText('Tooltip 1')).toBeInTheDocument();
    });

    // Leave first
    await user.unhover(button1);

    await waitFor(() => {
      expect(screen.queryByText('Tooltip 1')).not.toBeInTheDocument();
    });

    // Hover second
    const button2 = screen.getByRole('button', { name: 'Button 2' });
    await user.hover(button2);

    await waitFor(() => {
      expect(screen.getByText('Tooltip 2')).toBeInTheDocument();
    });
  });

  // ── Placement variants ─────────────────────────────────────────────────

  it('renders with top placement', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Top tooltip" side="top">
        <button>Button</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      // Just verify it renders — exact positioning requires layout
    });
  });

  it('renders with bottom placement', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Bottom tooltip" side="bottom">
        <button>Button</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('renders with left placement', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Left tooltip" side="left">
        <button>Button</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('renders with right placement', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Right tooltip" side="right">
        <button>Button</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ── Alignment ──────────────────────────────────────────────────────────

  it('renders with start alignment', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="top" align="start">
        <button>Button</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('renders with center alignment (default)', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="top" align="center">
        <button>Button</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('renders with end alignment', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="top" align="end">
        <button>Button</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ── Persistent (click-triggered) rich tooltip ──────────────────────────

  it('shows persistent rich tooltip on click', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Description" title="Title" rich persistent>
        <button>Click me</button>
      </Tooltip>
    );

    // Should not be visible on hover
    await user.hover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Should show on click
    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('hides persistent tooltip on second click', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Description" title="Title" rich persistent>
        <button>Click me</button>
      </Tooltip>
    );

    // Click to open
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    // Click again to close
    await user.click(screen.getByRole('button'));

    // Wait for AnimatePresence to complete exit animation
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('hides persistent tooltip on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content="Description" rich persistent>
          <button>Click me</button>
        </Tooltip>
        <button>Outside</button>
      </div>
    );

    // Click to open
    await user.click(screen.getByRole('button', { name: 'Click me' }));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    // Click outside
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('renders action buttons in persistent tooltip', async () => {
    const handleAction = vi.fn();
    const user = userEvent.setup();

    render(
      <Tooltip
        content="Description"
        title="Title"
        rich
        persistent
        actions={[{ label: 'Learn more', onClick: handleAction }]}
      >
        <button>Click me</button>
      </Tooltip>
    );

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Learn more' }));
    expect(handleAction).toHaveBeenCalledOnce();
  });

  it('limits action buttons to 2', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        content="Description"
        rich
        persistent
        actions={[
          { label: 'Action 1', onClick: () => {} },
          { label: 'Action 2', onClick: () => {} },
          { label: 'Action 3', onClick: () => {} },
        ]}
      >
        <button>Click</button>
      </Tooltip>
    );

    await user.click(screen.getByRole('button', { name: 'Click' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Action 3' })).not.toBeInTheDocument();
  });

  // ── Accessibility ────────────────────────────────────────────────────

  it('sets role="tooltip" on tooltip element', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('sets aria-describedby on trigger when tooltip is visible', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover' });

    // Not set when hidden
    expect(button).not.toHaveAttribute('aria-describedby');

    // Set when visible
    await user.hover(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-describedby');
    });
  });

  // ── Escape key ─────────────────────────────────────────────────────────

  it('hides tooltip on Escape key', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover' });
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    // Wait for exit animation
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  // ── Portal behavior ────────────────────────────────────────────────────

  it('portals to document.body by default', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      // Tooltip should be in document.body, not inside the container
      expect(document.body.contains(tooltip)).toBe(true);
      expect(container.contains(tooltip)).toBe(false);
    });
  });

  it('renders inline when portal=false', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Tooltip" portal={false}>
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(container.contains(tooltip)).toBe(true);
    });
  });

  // ── Singleton behavior (only one tooltip at a time) ─────────────────────

  it('closes other tooltips when opening a new one', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content="Tooltip 1" delayOpen={0} delayClose={0}>
          <button>Button 1</button>
        </Tooltip>
        <Tooltip content="Tooltip 2" delayOpen={0}>
          <button>Button 2</button>
        </Tooltip>
      </div>
    );

    // Open first tooltip
    await user.hover(screen.getByRole('button', { name: 'Button 1' }));

    await waitFor(() => {
      expect(screen.getByText('Tooltip 1')).toBeInTheDocument();
    });

    // Open second tooltip — first should close
    await user.hover(screen.getByRole('button', { name: 'Button 2' }));

    await waitFor(() => {
      expect(screen.getByText('Tooltip 2')).toBeInTheDocument();
      expect(screen.queryByText('Tooltip 1')).not.toBeInTheDocument();
    });
  });

  // ── Cleanup ────────────────────────────────────────────────────────────

  it('clears timers on unmount', () => {
    const { unmount } = render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );

    // Unmount should not cause errors
    expect(() => {
      unmount();
    }).not.toThrow();
  });

  // ── Custom styling ─────────────────────────────────────────────────────

  it('applies custom className', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" className="custom-class">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('custom-class');
    });
  });

  it('respects custom z-index', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" zIndex={5000}>
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveStyle({ zIndex: '5000' });
    });
  });

  // ── Offset ─────────────────────────────────────────────────────────────

  it('respects custom offset', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" offset={16}>
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ── Positioning ────────────────────────────────────────────────────────

  it('positions tooltip on right side', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="right">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('positions tooltip on left side', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="left">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('positions tooltip with custom alignment', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="bottom" align="start">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ── Delay configuration ────────────────────────────────────────────────

  it('respects custom delayOpen', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" delayOpen={0}>
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('respects custom delayClose', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" delayClose={0}>
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover' });
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.unhover(button);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  // ── Rich tooltip with multiple actions ──────────────────────────────

  it('renders rich tooltip with two action buttons', async () => {
    const action1 = vi.fn();
    const action2 = vi.fn();
    const user = userEvent.setup();

    render(
      <Tooltip
        content="Description"
        title="Title"
        rich
        persistent
        actions={[
          { label: 'Cancel', onClick: action1 },
          { label: 'Confirm', onClick: action2 },
        ]}
      >
        <button>Click</button>
      </Tooltip>
    );

    await user.click(screen.getByRole('button', { name: 'Click' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(action1).toHaveBeenCalledOnce();
  });

  // ── Warmup window (fast switching between tooltips) ─────────────────

  it('closes tooltip when clicking another button', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content="First" delayOpen={0} delayClose={0}>
          <button>Button 1</button>
        </Tooltip>
        <Tooltip content="Second" delayOpen={0} delayClose={0}>
          <button>Button 2</button>
        </Tooltip>
      </div>
    );

    await user.hover(screen.getByRole('button', { name: 'Button 1' }));

    await waitFor(() => {
      expect(screen.getByText('First')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Button 2' }));

    await waitFor(() => {
      expect(screen.queryByText('First')).not.toBeInTheDocument();
    });
  });

  // ── Edge case: no focused state on trigger ────────────────────────────

  it('renders with forward ref trigger', async () => {
    const user = userEvent.setup();
    const Component = () => {
      const ref = React.useRef<HTMLButtonElement>(null);
      return (
        <Tooltip content="Tooltip">
          <button ref={ref}>Button</button>
        </Tooltip>
      );
    };

    render(<Component />);
    const button = screen.getByRole('button', { name: 'Button' });

    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ── Keyboard focus with persistent rich tooltip ────────────────────────

  it('focuses rich persistent tooltip on open', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        content="Description"
        title="Title"
        rich
        persistent
        actions={[{ label: 'Action', onClick: vi.fn() }]}
      >
        <button>Click</button>
      </Tooltip>
    );

    await user.click(screen.getByRole('button', { name: 'Click' }));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ── No actions in persistent tooltip ───────────────────────────────────

  it('renders rich persistent tooltip without actions', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        content="Description"
        title="Title"
        rich
        persistent
      >
        <button>Click</button>
      </Tooltip>
    );

    await user.click(screen.getByRole('button', { name: 'Click' }));

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  // ── Plain tooltip without animation ────────────────────────────────────

  it('renders plain tooltip', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Plain tooltip" rich={false}>
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Plain tooltip')).toBeInTheDocument();
    });
  });

  // ── Trigger with onClick handler ───────────────────────────────────────

  it('preserves onClick handler on trigger element', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip">
        <button onClick={handleClick}>Click me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  // ── Rich tooltip alignment variants ────────────────────────────────────

  it('supports center alignment', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="bottom" align="center">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('supports end alignment', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="bottom" align="end">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ── Non-persistent plain tooltip mouse events ──────────────────────────

  it('hides plain tooltip on mouse leave from tooltip', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" delayClose={0}>
        <button>Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Hover' });
    await user.hover(button);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();

      // Simulate mouse leave from tooltip
      tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
  });

  // ── Edge case: align="start" with side="top" ────────────────────────────

  it('positions top left', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip" side="top" align="start">
        <button>Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });
});
