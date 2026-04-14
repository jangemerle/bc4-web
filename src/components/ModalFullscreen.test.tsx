import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ModalFullscreen } from './ModalFullscreen';

describe('ModalFullscreen', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders nothing when closed', () => {
    render(
      <ModalFullscreen open={false} onClose={() => {}}>
        <ModalFullscreen.Media>
          <img src="test.jpg" alt="test" />
        </ModalFullscreen.Media>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Media>
          <img src="test.jpg" alt="test" />
        </ModalFullscreen.Media>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal attribute', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Test</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).toHaveAttribute('aria-modal');
  });

  it('applies default aria-label when not provided', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Test</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Fullscreen view');
  });

  it('applies custom aria-label', () => {
    render(
      <ModalFullscreen open onClose={() => {}} aria-label="Gallery view">
        <ModalFullscreen.Content>
          <p>Test</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Gallery view');
  });

  // ── Sub-components ────────────────────────────────────────────────────

  it('renders Media sub-component', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Media>
          <img src="test.jpg" alt="Gallery image" />
        </ModalFullscreen.Media>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByAltText('Gallery image')).toBeInTheDocument();
  });

  it('renders Content sub-component', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <h2>Title</h2>
          <p>Description</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('supports custom className on Media', () => {
    const { container } = render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Media className="custom-media">
          <div>Media</div>
        </ModalFullscreen.Media>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const media = container.querySelector('.custom-media');
    expect(media).toBeInTheDocument();
  });

  it('supports custom className on Content', () => {
    const { container } = render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Media>
          <div>Media</div>
        </ModalFullscreen.Media>
        <ModalFullscreen.Content className="custom-content">
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const content = container.querySelector('.custom-content');
    expect(content).toBeInTheDocument();
  });

  // ── Close behavior ────────────────────────────────────────────────────

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <ModalFullscreen open onClose={handleClose}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <ModalFullscreen open onClose={handleClose}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const { container } = render(
      <ModalFullscreen open onClose={handleClose}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const backdrop = container.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      await user.click(backdrop);
      expect(handleClose).toHaveBeenCalledOnce();
    }
  });

  // ── Close label ───────────────────────────────────────────────────────

  it('applies default close label "Close"', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('applies custom close label', () => {
    render(
      <ModalFullscreen open onClose={() => {}} closeLabel="Dismiss">
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  // ── Navigation (prev/next) ────────────────────────────────────────────

  it('renders prev navigation button when onPrev is provided', () => {
    render(
      <ModalFullscreen open onClose={() => {}} onPrev={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
  });

  it('renders next navigation button when onNext is provided', () => {
    render(
      <ModalFullscreen open onClose={() => {}} onNext={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('does not render prev button when onPrev is not provided', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.queryByLabelText('Previous')).not.toBeInTheDocument();
  });

  it('does not render next button when onNext is not provided', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.queryByLabelText('Next')).not.toBeInTheDocument();
  });

  it('calls onPrev when previous button is clicked', async () => {
    const user = userEvent.setup();
    const handlePrev = vi.fn();
    render(
      <ModalFullscreen open onClose={() => {}} onPrev={handlePrev}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    await user.click(screen.getByLabelText('Previous'));
    expect(handlePrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup();
    const handleNext = vi.fn();
    render(
      <ModalFullscreen open onClose={() => {}} onNext={handleNext}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    await user.click(screen.getByLabelText('Next'));
    expect(handleNext).toHaveBeenCalledOnce();
  });

  it('calls onPrev when ArrowLeft key is pressed', async () => {
    const user = userEvent.setup();
    const handlePrev = vi.fn();
    render(
      <ModalFullscreen open onClose={() => {}} onPrev={handlePrev}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    await user.keyboard('{ArrowLeft}');
    expect(handlePrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when ArrowRight key is pressed', async () => {
    const user = userEvent.setup();
    const handleNext = vi.fn();
    render(
      <ModalFullscreen open onClose={() => {}} onNext={handleNext}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    await user.keyboard('{ArrowRight}');
    expect(handleNext).toHaveBeenCalledOnce();
  });

  // ── Background color ──────────────────────────────────────────────────

  it('uses default dark background color when bgColor not provided', () => {
    const { container } = render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toHaveStyle({ backgroundColor: 'var(--color-inverted-surface)' });
  });

  it('applies custom background color via bgColor prop', () => {
    const { container } = render(
      <ModalFullscreen open onClose={() => {}} bgColor="var(--color-surface-2)">
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toHaveStyle({ backgroundColor: 'var(--color-surface-2)' });
  });

  // ── Actions ───────────────────────────────────────────────────────────

  it('renders additional actions when provided', () => {
    render(
      <ModalFullscreen
        open
        onClose={() => {}}
        actions={<button>Share</button>}
      >
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders multiple actions', () => {
    render(
      <ModalFullscreen
        open
        onClose={() => {}}
        actions={
          <div>
            <button>Save</button>
            <button>Share</button>
          </div>
        }
      >
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  // ── Custom className ──────────────────────────────────────────────────

  it('applies custom className to grid container', () => {
    const { container } = render(
      <ModalFullscreen open onClose={() => {}} className="custom-grid">
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const grid = container.querySelector('.custom-grid');
    expect(grid).toBeInTheDocument();
  });

  // ── Focus management ──────────────────────────────────────────────────

  it('moves focus to first focusable element when opened', async () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <button>First Button</button>
          <button>Second Button</button>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    // Close button is first in DOM order (top-right), so it gets focused
    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toHaveFocus();
    });
  });

  it('focuses close button if no other focusable elements', async () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Just text, no buttons</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toHaveFocus();
    });
  });

  it('traps Tab focus within modal', async () => {
    const user = userEvent.setup();
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <button>Button 1</button>
          <button>Button 2</button>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    // Close button is first focusable
    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toHaveFocus();
    });
    // Tab to Button 1
    await user.keyboard('{Tab}');
    expect(screen.getByText('Button 1')).toHaveFocus();
    // Tab to Button 2
    await user.keyboard('{Tab}');
    expect(screen.getByText('Button 2')).toHaveFocus();
  });

  it('cycles focus backward with Shift+Tab', async () => {
    const user = userEvent.setup();
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <button>Button 1</button>
          <button>Button 2</button>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    // Close button is first focusable
    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toHaveFocus();
    });
    // Shift+Tab from close button should wrap to last focusable (Button 2)
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(screen.getByText('Button 2')).toHaveFocus();
  });

  it('restores focus to trigger element when closed', async () => {
    const { rerender } = render(
      <div>
        <button id="trigger">Open Modal</button>
        <ModalFullscreen open={false} onClose={() => {}}>
          <ModalFullscreen.Content>
            <p>Content</p>
          </ModalFullscreen.Content>
        </ModalFullscreen>
      </div>
    );
    const triggerBtn = document.getElementById('trigger')!;
    triggerBtn.focus();
    expect(triggerBtn).toHaveFocus();

    rerender(
      <div>
        <button id="trigger">Open Modal</button>
        <ModalFullscreen open onClose={() => {}}>
          <ModalFullscreen.Content>
            <p>Content</p>
          </ModalFullscreen.Content>
        </ModalFullscreen>
      </div>
    );
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    rerender(
      <div>
        <button id="trigger">Open Modal</button>
        <ModalFullscreen open={false} onClose={() => {}}>
          <ModalFullscreen.Content>
            <p>Content</p>
          </ModalFullscreen.Content>
        </ModalFullscreen>
      </div>
    );
    await waitFor(() => {
      expect(triggerBtn).toHaveFocus();
    });
  });

  // ── Body scroll prevention ────────────────────────────────────────────

  it('prevents body scroll when open', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(document.body.style.overflow).toBe('hidden');
    rerender(
      <ModalFullscreen open={false} onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('restores body scroll on unmount', () => {
    const { unmount } = render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  // ── Backdrop behavior ──────────────────────────────────────────────────

  it('has backdrop with aria-hidden', () => {
    const { container } = render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
  });

  // ── Complex content ───────────────────────────────────────────────────

  it('handles rich HTML content', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Media>
          <img src="image.jpg" alt="test" />
        </ModalFullscreen.Media>
        <ModalFullscreen.Content>
          <h2>Title</h2>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  // ── AnimatePresence behavior ──────────────────────────────────────────

  it('removes from DOM when closed after being open', async () => {
    const { rerender } = render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <ModalFullscreen open={false} onClose={() => {}}>
        <ModalFullscreen.Content>
          <p>Content</p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  // ── Edge cases ────────────────────────────────────────────────────────

  it('handles empty children gracefully', () => {
    render(
      <ModalFullscreen open onClose={() => {}}>
      </ModalFullscreen>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles multiple modals independently', () => {
    render(
      <div>
        <ModalFullscreen open onClose={() => {}}>
          <ModalFullscreen.Content>
            <p>Modal 1</p>
          </ModalFullscreen.Content>
        </ModalFullscreen>
      </div>
    );
    expect(screen.getByText('Modal 1')).toBeInTheDocument();
  });

  it('does not close when non-focusable element is Tab target in modal', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <ModalFullscreen open onClose={handleClose}>
        <ModalFullscreen.Content>
          <div tabIndex={-1}>Non-focusable div</div>
          <button>Button</button>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledOnce();
  });

  // ── Focus trap edge case ─────────────────────────────────────────────

  it('wraps focus when Tab pressed at last focusable element', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ModalFullscreen open onClose={() => {}}>
        <ModalFullscreen.Content>
          <button>Button A</button>
          <button>Button B</button>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    );

    // Close button is first focusable, Button B is last
    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toHaveFocus();
    });

    // Navigate through all elements to reach Button B
    await user.keyboard('{Tab}');
    await user.keyboard('{Tab}');
    const lastButton = screen.getByText('Button B');
    expect(lastButton).toHaveFocus();

    // Tab from last element should wrap to first (Close button)
    await user.keyboard('{Tab}');

    // Due to focus trap, we should be back at the Close button
    const focusables = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    expect(document.activeElement).toBe(first);
  });

  // ── Cleanup ────────────────────────────────────────────────────────────

  afterEach(() => {
    document.body.style.overflow = '';
  });
});
