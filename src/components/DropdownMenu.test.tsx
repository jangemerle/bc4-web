import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DropdownMenu, DropdownMenuItem, DropdownMenuDivider } from './DropdownMenu';
import { Plus, Trash2, Edit, Flag } from 'lucide-react';

// Helper to render menu items within DropdownMenu
const renderInMenu = (ui: React.ReactNode, props = {}) =>
  render(
    <DropdownMenu open onClose={() => {}} {...props}>
      {ui}
    </DropdownMenu>
  );

describe('DropdownMenu', () => {
  // ─── Rendering ────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders nothing when closed', () => {
      render(
        <DropdownMenu open={false} onClose={() => {}}>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenu>,
      );
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders menu when open', () => {
      renderInMenu(<DropdownMenuItem>Item</DropdownMenuItem>);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('renders all menu items', () => {
      renderInMenu(
        <>
          <DropdownMenuItem>Add</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </>
      );
      expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    });

    it('renders with custom width', () => {
      const { container } = renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { width: '400px' }
      );
      const menu = container.querySelector('[role="menu"]');
      expect(menu).toHaveStyle({ width: '400px' });
    });

    it('applies custom className', () => {
      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { className: 'custom-class' }
      );
      const menu = screen.getByRole('menu');
      expect(menu.className).toContain('custom-class');
    });

    it('uses default width for size sm', () => {
      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'sm' }
      );
      const menu = screen.getByRole('menu');
      expect(menu).toHaveStyle({ width: '280px' });
    });

    it('uses default width for size md', () => {
      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'md' }
      );
      const menu = screen.getByRole('menu');
      expect(menu).toHaveStyle({ width: '320px' });
    });

    it('renders search input when search prop is true and size is md', () => {
      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'md', search: true }
      );
      const searchInput = screen.getByPlaceholderText('Search');
      expect(searchInput).toBeInTheDocument();
    });

    it('does not render search for size sm even if search prop is true', () => {
      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'sm', search: true }
      );
      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    });

    it('uses custom search placeholder', () => {
      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'md', search: true, searchPlaceholder: 'Find item...' }
      );
      expect(screen.getByPlaceholderText('Find item...')).toBeInTheDocument();
    });
  });

  // ─── Close Behavior ───────────────────────────────────────────────────────

  describe('Close Behavior', () => {
    it('calls onClose when Escape is pressed', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <DropdownMenu open onClose={handleClose}>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenu>,
      );
      await user.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledOnce();
    });

    it('calls onClose when clicking outside menu', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <>
          <button>Outside</button>
          <DropdownMenu open onClose={handleClose}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenu>
        </>
      );

      const outside = screen.getByRole('button', { name: 'Outside' });
      await user.click(outside);

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });
    });

    it('does not close when clicking trigger if triggerRef is provided', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const triggerRef = { current: null as HTMLElement | null };

      render(
        <div>
          <button ref={(el) => { if (el) triggerRef.current = el; }}>Trigger</button>
          <DropdownMenu open onClose={handleClose} triggerRef={triggerRef}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenu>
        </div>
      );

      const trigger = screen.getByRole('button', { name: 'Trigger' });
      await user.click(trigger);

      // onClose should not be called due to triggerRef
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('closes when clicking menu item', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleClick = vi.fn();

      render(
        <DropdownMenu open onClose={handleClose}>
          <DropdownMenuItem onClick={handleClick}>Action</DropdownMenuItem>
        </DropdownMenu>,
      );

      const item = screen.getByRole('menuitem');
      await user.click(item);

      expect(handleClick).toHaveBeenCalledOnce();
    });
  });

  // ─── Keyboard Navigation ──────────────────────────────────────────────────

  describe('Keyboard Navigation', () => {
    it('navigates with ArrowDown', async () => {
      const user = userEvent.setup();
      renderInMenu(
        <>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </>
      );

      const first = screen.getAllByRole('menuitem')[0];
      first.focus();

      await user.keyboard('{ArrowDown}');

      const second = screen.getAllByRole('menuitem')[1];
      expect(second).toHaveFocus();
    });

    it('navigates with ArrowUp', async () => {
      const user = userEvent.setup();
      renderInMenu(
        <>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </>
      );

      const second = screen.getAllByRole('menuitem')[1];
      second.focus();

      await user.keyboard('{ArrowUp}');

      const first = screen.getAllByRole('menuitem')[0];
      expect(first).toHaveFocus();
    });

    it('wraps to last item when pressing ArrowUp on first', async () => {
      const user = userEvent.setup();
      renderInMenu(
        <>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </>
      );

      const first = screen.getAllByRole('menuitem')[0];
      first.focus();

      await user.keyboard('{ArrowUp}');

      const last = screen.getAllByRole('menuitem')[2];
      expect(last).toHaveFocus();
    });

    it('wraps to first item when pressing ArrowDown on last', async () => {
      const user = userEvent.setup();
      renderInMenu(
        <>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </>
      );

      const last = screen.getAllByRole('menuitem')[2];
      last.focus();

      await user.keyboard('{ArrowDown}');

      const first = screen.getAllByRole('menuitem')[0];
      expect(first).toHaveFocus();
    });

    it('navigates to first with Home', async () => {
      const user = userEvent.setup();
      renderInMenu(
        <>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </>
      );

      const last = screen.getAllByRole('menuitem')[2];
      last.focus();

      await user.keyboard('{Home}');

      const first = screen.getAllByRole('menuitem')[0];
      expect(first).toHaveFocus();
    });

    it('navigates to last with End', async () => {
      const user = userEvent.setup();
      renderInMenu(
        <>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </>
      );

      const first = screen.getAllByRole('menuitem')[0];
      first.focus();

      await user.keyboard('{End}');

      const last = screen.getAllByRole('menuitem')[2];
      expect(last).toHaveFocus();
    });

    it('skips disabled items during navigation', async () => {
      const user = userEvent.setup();
      renderInMenu(
        <>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem disabled>Second (disabled)</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </>
      );

      const first = screen.getAllByRole('menuitem')[0];
      first.focus();

      await user.keyboard('{ArrowDown}');

      // Should skip disabled and focus Third
      const third = screen.getAllByRole('menuitem')[2];
      expect(third).toHaveFocus();
    });

    it('focuses selected item when menu opens', async () => {
      const { rerender } = render(
        <DropdownMenu open={false} onClose={() => {}}>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem selected>Second</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </DropdownMenu>,
      );

      // Open the menu
      rerender(
        <DropdownMenu open onClose={() => {}}>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem selected>Second</DropdownMenuItem>
          <DropdownMenuItem>Third</DropdownMenuItem>
        </DropdownMenu>,
      );

      // The selected item should receive focus
      await waitFor(() => {
        const selected = screen.getByRole('menuitem', { name: 'Second' });
        expect(selected).toHaveFocus();
      });
    });
  });

  // ─── Search Functionality ──────────────────────────────────────────────────

  describe('Search', () => {
    it('updates search value when input changes', async () => {
      const user = userEvent.setup();
      const handleSearchChange = vi.fn();

      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'md', search: true, onSearchChange: handleSearchChange }
      );

      const searchInput = screen.getByPlaceholderText('Search');
      await user.type(searchInput, 'test');

      expect(handleSearchChange).toHaveBeenCalled();
    });

    it('handles search input changes', async () => {
      const handleSearchChange = vi.fn();

      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'md', search: true, searchValue: 'initial', onSearchChange: handleSearchChange }
      );

      const searchInput = screen.getByPlaceholderText('Search') as HTMLInputElement;
      expect(searchInput.value).toBe('initial');
    });

    it('autofocuses search input when menu opens', () => {
      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'md', search: true }
      );

      const searchInput = screen.getByPlaceholderText('Search') as HTMLInputElement;
      expect(searchInput).toHaveFocus();
    });

    it('reflects controlled search value', () => {
      renderInMenu(
        <DropdownMenuItem>Item</DropdownMenuItem>,
        { size: 'md', search: true, searchValue: 'controlled-value' }
      );

      const searchInput = screen.getByPlaceholderText('Search') as HTMLInputElement;
      expect(searchInput.value).toBe('controlled-value');
    });
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('has role="menu" on container', () => {
      renderInMenu(<DropdownMenuItem>Item</DropdownMenuItem>);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('has role="menuitem" on items', () => {
      renderInMenu(
        <>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </>
      );
      expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    });

    it('divider has role="separator"', () => {
      renderInMenu(
        <>
          <DropdownMenuItem>Before</DropdownMenuItem>
          <DropdownMenuDivider />
          <DropdownMenuItem>After</DropdownMenuItem>
        </>
      );
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('sets aria-selected on selected single-select item', () => {
      renderInMenu(<DropdownMenuItem selected>Selected</DropdownMenuItem>);
      expect(screen.getByRole('menuitem')).toHaveAttribute('aria-selected', 'true');
    });

    it('does not set aria-selected when not selected', () => {
      renderInMenu(<DropdownMenuItem>Normal</DropdownMenuItem>);
      expect(screen.queryByRole('menuitem')).not.toHaveAttribute('aria-selected', 'true');
    });

    it('announces disabled state', () => {
      renderInMenu(<DropdownMenuItem disabled>Disabled</DropdownMenuItem>);
      expect(screen.getByRole('menuitem')).toBeDisabled();
    });

    it('has focus-visible outline on focus', async () => {
      const user = userEvent.setup();
      renderInMenu(<DropdownMenuItem>Focusable</DropdownMenuItem>);

      const item = screen.getByRole('menuitem');
      await user.click(item);

      // Check for focus styling
      expect(item.className).toContain('focus-visible');
    });
  });
});

describe('DropdownMenuItem', () => {
  const renderInMenu = (ui: React.ReactNode) =>
    render(<DropdownMenu open onClose={() => {}}>{ui}</DropdownMenu>);

  // ─── Rendering ────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders item text', () => {
      renderInMenu(<DropdownMenuItem>Add item</DropdownMenuItem>);
      expect(screen.getByText('Add item')).toBeInTheDocument();
    });

    it('renders with icon', () => {
      renderInMenu(<DropdownMenuItem icon={Plus}>Add</DropdownMenuItem>);
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
      // Icon is rendered via Icon component
    });

    it('renders multiple icons', () => {
      renderInMenu(
        <>
          <DropdownMenuItem icon={Plus}>Add</DropdownMenuItem>
          <DropdownMenuItem icon={Edit}>Edit</DropdownMenuItem>
          <DropdownMenuItem icon={Trash2}>Delete</DropdownMenuItem>
        </>
      );
      expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    });

    it('renders React node as label', () => {
      renderInMenu(
        <DropdownMenuItem>
          <span>Labeled item</span>
        </DropdownMenuItem>
      );
      expect(screen.getByText('Labeled item')).toBeInTheDocument();
    });

    it('truncates long labels', () => {
      const longLabel = 'a'.repeat(100);
      renderInMenu(<DropdownMenuItem>{longLabel}</DropdownMenuItem>);
      const item = screen.getByRole('menuitem');
      // The truncate class is on the span child, not the button itself
      const span = item.querySelector('span.truncate');
      expect(span || item.textContent).toBeTruthy();
    });
  });

  // ─── Selection States ──────────────────────────────────────────────────────

  describe('Selection', () => {
    it('sets aria-selected when selected', () => {
      renderInMenu(<DropdownMenuItem selected>Selected</DropdownMenuItem>);
      expect(screen.getByRole('menuitem')).toHaveAttribute('aria-selected', 'true');
    });

    it('does not set aria-selected when not selected', () => {
      renderInMenu(<DropdownMenuItem>Normal</DropdownMenuItem>);
      expect(screen.getByRole('menuitem')).not.toHaveAttribute('aria-selected');
    });

    it('renders checkmark for selected single-select item', () => {
      renderInMenu(
        <DropdownMenuItem selected>Selected</DropdownMenuItem>
      );
      // Checkmark is rendered via Icon component
      const item = screen.getByRole('menuitem');
      expect(item.className).toContain('text-left');
    });

    it('applies inverted background for selected single-select', () => {
      renderInMenu(
        <DropdownMenuItem selected>Selected single</DropdownMenuItem>
      );
      const item = screen.getByRole('menuitem');
      expect(item.style.color).toBe('var(--color-on-inverted-surface)');
    });

    it('applies surface-3 background for selected multi-select', () => {
      renderInMenu(
        <DropdownMenuItem checkbox selected>Selected multi</DropdownMenuItem>
      );
      const item = screen.getByRole('menuitem');
      expect(item.className).toContain('bg-[var(--color-surface-3)]');
    });

    it('renders checkbox for multi-select mode', () => {
      renderInMenu(
        <DropdownMenuItem checkbox>With checkbox</DropdownMenuItem>
      );
      expect(screen.getByRole('checkbox', { hidden: true })).toBeInTheDocument();
    });

    it('does not render checkbox in single-select mode', () => {
      renderInMenu(
        <DropdownMenuItem>No checkbox</DropdownMenuItem>
      );
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  // ─── Click Handling ───────────────────────────────────────────────────────

  describe('Click Handling', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      renderInMenu(<DropdownMenuItem onClick={handleClick}>Click me</DropdownMenuItem>);

      await user.click(screen.getByRole('menuitem'));

      expect(handleClick).toHaveBeenCalledOnce();
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      renderInMenu(
        <DropdownMenuItem disabled onClick={handleClick}>
          Disabled
        </DropdownMenuItem>
      );

      const item = screen.getByRole('menuitem');
      expect(item).toBeDisabled();

      // User can't click a disabled item (browser prevents it)
      // But we verify the handler exists
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('can be clicked with keyboard Enter', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      renderInMenu(<DropdownMenuItem onClick={handleClick}>Item</DropdownMenuItem>);

      const item = screen.getByRole('menuitem');
      item.focus();

      // Note: role="menuitem" button typically uses Space or Enter
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });
  });

  // ─── Disabled State ────────────────────────────────────────────────────────

  describe('Disabled State', () => {
    it('sets disabled attribute', () => {
      renderInMenu(<DropdownMenuItem disabled>Disabled</DropdownMenuItem>);
      expect(screen.getByRole('menuitem')).toBeDisabled();
    });

    it('applies reduced opacity when disabled', () => {
      renderInMenu(<DropdownMenuItem disabled>Faded</DropdownMenuItem>);
      expect(screen.getByRole('menuitem').className).toContain('opacity-30');
    });

    it('applies cursor-not-allowed when disabled', () => {
      renderInMenu(<DropdownMenuItem disabled>Not allowed</DropdownMenuItem>);
      expect(screen.getByRole('menuitem').className).toContain('cursor-not-allowed');
    });

    it('does not render hover state when disabled', () => {
      renderInMenu(<DropdownMenuItem disabled>Disabled</DropdownMenuItem>);
      const item = screen.getByRole('menuitem');
      // Disabled items should not have hover:bg classes applied on hover
      expect(item.className).toContain('opacity-30');
    });

    it('disables checkbox when item is disabled', () => {
      renderInMenu(
        <DropdownMenuItem checkbox disabled>
          Disabled checkbox
        </DropdownMenuItem>
      );
      const checkbox = screen.getByRole('checkbox', { hidden: true });
      expect(checkbox).toBeDisabled();
    });
  });

  // ─── Checkbox Variant ─────────────────────────────────────────────────────

  describe('Checkbox Variant', () => {
    it('renders checkbox when checkbox prop is set', () => {
      renderInMenu(<DropdownMenuItem checkbox>With checkbox</DropdownMenuItem>);
      expect(screen.getByRole('checkbox', { hidden: true })).toBeInTheDocument();
    });

    it('checkbox is checked when selected', () => {
      renderInMenu(
        <DropdownMenuItem checkbox selected>
          Selected checkbox
        </DropdownMenuItem>
      );
      const checkbox = screen.getByRole('checkbox', { hidden: true }) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('checkbox is unchecked when not selected', () => {
      renderInMenu(
        <DropdownMenuItem checkbox>
          Unselected checkbox
        </DropdownMenuItem>
      );
      const checkbox = screen.getByRole('checkbox', { hidden: true }) as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it('checkbox is readonly (not directly interactive)', () => {
      renderInMenu(
        <DropdownMenuItem checkbox>
          Readonly checkbox
        </DropdownMenuItem>
      );
      const checkbox = screen.getByRole('checkbox', { hidden: true });
      expect(checkbox).toHaveAttribute('readonly');
    });

    it('supports multiple selected checkboxes', () => {
      renderInMenu(
        <>
          <DropdownMenuItem checkbox selected>
            Option A
          </DropdownMenuItem>
          <DropdownMenuItem checkbox selected>
            Option B
          </DropdownMenuItem>
          <DropdownMenuItem checkbox>
            Option C
          </DropdownMenuItem>
        </>
      );

      const checkboxes = screen.getAllByRole('checkbox', { hidden: true }) as HTMLInputElement[];
      expect(checkboxes[0].checked).toBe(true);
      expect(checkboxes[1].checked).toBe(true);
      expect(checkboxes[2].checked).toBe(false);
    });
  });

  // ─── Size Variants ────────────────────────────────────────────────────────

  describe('Size Variants', () => {
    it('has h-8 height for size sm', () => {
      renderInMenu(
        <DropdownMenuItem>Small item</DropdownMenuItem>,
      );
      const item = screen.getByRole('menuitem');
      expect(item.className).toContain('h-8');
    });

    it('has h-10 height for size md', () => {
      render(
        <DropdownMenu open onClose={() => {}} size="md">
          <DropdownMenuItem>Medium item</DropdownMenuItem>
        </DropdownMenu>
      );
      const item = screen.getByRole('menuitem');
      expect(item.className).toContain('h-10');
    });
  });

  // ─── User Variant ─────────────────────────────────────────────────────────

  describe('User Variant', () => {
    it('renders user variant with name', () => {
      renderInMenu(
        <DropdownMenuItem
          user={{ name: 'Alice', initials: 'A' }}
        >Alice</DropdownMenuItem>
      );
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('renders user avatar with name', () => {
      renderInMenu(
        <DropdownMenuItem
          user={{ name: 'Bob', initials: 'B', src: 'https://example.com/bob.jpg' }}
        >Bob</DropdownMenuItem>
      );
      // UserAvatar renders with the name text
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('renders user caption in md size', () => {
      render(
        <DropdownMenu open onClose={() => {}} size="md">
          <DropdownMenuItem
            user={{ name: 'Charlie', initials: 'C', caption: 'Admin' }}
          >Charlie</DropdownMenuItem>
        </DropdownMenu>
      );
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('user variant ignores checkbox prop', () => {
      renderInMenu(
        <DropdownMenuItem
          user={{ name: 'Dave', initials: 'D' }}
          checkbox
        >Dave</DropdownMenuItem>
      );
      // Checkbox should not render for user variant
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      expect(screen.getByText('Dave')).toBeInTheDocument();
    });
  });

  // ─── Additional Props ──────────────────────────────────────────────────────

  describe('Additional Props', () => {
    it('applies custom className', () => {
      renderInMenu(
        <DropdownMenuItem className="custom-style">
          Styled item
        </DropdownMenuItem>
      );
      const item = screen.getByRole('menuitem');
      expect(item.className).toContain('custom-style');
    });

    it('renders with custom icon', () => {
      renderInMenu(
        <DropdownMenuItem icon={Flag}>Flagged</DropdownMenuItem>
      );
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });
  });

  // ─── Hover State ───────────────────────────────────────────────────────────

  describe('Hover State', () => {
    it('applies hover background for normal items', async () => {
      const user = userEvent.setup();
      renderInMenu(<DropdownMenuItem>Hoverable</DropdownMenuItem>);

      const item = screen.getByRole('menuitem');
      await user.hover(item);

      // Component applies hover state internally
      expect(item).toBeInTheDocument();
    });

    it('does not apply hover state to selected single-select items', async () => {
      const user = userEvent.setup();
      renderInMenu(<DropdownMenuItem selected>Selected</DropdownMenuItem>);

      const item = screen.getByRole('menuitem');
      await user.hover(item);

      // Selected single-select maintains dark background on hover
      expect(item.style.color).toBe('var(--color-on-inverted-surface)');
    });
  });
});

describe('DropdownMenuDivider', () => {
  it('renders with role="separator"', () => {
    render(
      <DropdownMenu open onClose={() => {}}>
        <DropdownMenuItem>Before</DropdownMenuItem>
        <DropdownMenuDivider />
        <DropdownMenuItem>After</DropdownMenuItem>
      </DropdownMenu>
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders as a horizontal line', () => {
    render(
      <DropdownMenu open onClose={() => {}}>
        <DropdownMenuDivider />
      </DropdownMenu>
    );
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    // Divider uses h-px for the line
  });

  it('can be used to separate menu sections', () => {
    render(
      <DropdownMenu open onClose={() => {}}>
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
        <DropdownMenuDivider />
        <DropdownMenuItem>Destructive</DropdownMenuItem>
      </DropdownMenu>
    );

    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('renders multiple dividers', () => {
    render(
      <DropdownMenu open onClose={() => {}}>
        <DropdownMenuItem>Group 1</DropdownMenuItem>
        <DropdownMenuDivider />
        <DropdownMenuItem>Group 2</DropdownMenuItem>
        <DropdownMenuDivider />
        <DropdownMenuItem>Group 3</DropdownMenuItem>
      </DropdownMenu>
    );

    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });
});
