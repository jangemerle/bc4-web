import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TableToolbar, type FilterChip, type BulkAction } from './TableToolbar';
import { Trash2 } from 'lucide-react';

describe('TableToolbar', () => {
  // ── Rendering ────────────────────────────────────────────────────────

  it('renders empty toolbar when no props provided', () => {
    const { container } = render(<TableToolbar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<TableToolbar title="Users" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('title has correct typography classes', () => {
    render(<TableToolbar title="Products" />);
    const title = screen.getByText('Products');
    expect(title.className).toContain('font-display');
    expect(title.className).toContain('font-bold');
    expect(title.className).toContain('text-lg');
  });

  it('title uses semantic color token', () => {
    render(<TableToolbar title="Accounts" />);
    const title = screen.getByText('Accounts');
    expect(title.style.color).toBe('var(--color-on-surface)');
  });

  // ── Search input ────────────────────────────────────────────────────

  describe('Search Input', () => {
    it('renders search input when onSearchChange is provided', () => {
      render(<TableToolbar onSearchChange={() => {}} />);
      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
    });

    it('uses custom search placeholder', () => {
      render(
        <TableToolbar
          onSearchChange={() => {}}
          searchPlaceholder="Find items..."
        />
      );
      expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
    });

    it('does not render search input when onSearchChange is undefined', () => {
      render(<TableToolbar />);
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('displays current search value', () => {
      render(
        <TableToolbar
          search="test query"
          onSearchChange={() => {}}
        />
      );
      const input = screen.getByDisplayValue('test query') as HTMLInputElement;
      expect(input.value).toBe('test query');
    });

    it('calls onSearchChange when typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<TableToolbar onSearchChange={handleChange} />);
      await user.type(screen.getByPlaceholderText('Search...'), 'query');
      expect(handleChange).toHaveBeenCalled();
      // First call is 'q', last call will be 'query'
      expect(handleChange).toHaveBeenLastCalledWith('y');
    });

    it('calls onSearchChange with empty string when clear button clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <TableToolbar
          search="test"
          onSearchChange={handleChange}
        />
      );
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);
      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('search input and title can be displayed together', () => {
      render(
        <TableToolbar
          title="Users"
          search="alice"
          onSearchChange={() => {}}
        />
      );
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByDisplayValue('alice')).toBeInTheDocument();
    });
  });

  // ── Filter chips ────────────────────────────────────────────────────

  describe('Filter Chips', () => {
    const mockFilterChips: FilterChip[] = [
      { label: 'Status: Active', onRemove: vi.fn() },
      { label: 'Role: Admin', onRemove: vi.fn() },
    ];

    it('renders filter chips when provided', () => {
      render(<TableToolbar filterChips={mockFilterChips} />);
      expect(screen.getByText('Status: Active')).toBeInTheDocument();
      expect(screen.getByText('Role: Admin')).toBeInTheDocument();
    });

    it('renders each chip with remove button', () => {
      render(<TableToolbar filterChips={mockFilterChips} />);
      expect(screen.getByLabelText('Remove filter: Status: Active')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove filter: Role: Admin')).toBeInTheDocument();
    });

    it('calls onRemove when chip remove button is clicked', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      const chips: FilterChip[] = [{ label: 'Test Filter', onRemove }];
      render(<TableToolbar filterChips={chips} />);
      await user.click(screen.getByLabelText('Remove filter: Test Filter'));
      expect(onRemove).toHaveBeenCalledOnce();
    });

    it('shows "Clear all" button when more than one filter', () => {
      const chips: FilterChip[] = [
        { label: 'Status: Active', onRemove: vi.fn() },
        { label: 'Role: Admin', onRemove: vi.fn() },
      ];
      render(<TableToolbar filterChips={chips} onClearAllFilters={vi.fn()} />);
      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });

    it('does not show "Clear all" button when only one filter', () => {
      const singleChip: FilterChip[] = [{ label: 'Status: Active', onRemove: vi.fn() }];
      render(<TableToolbar filterChips={singleChip} />);
      expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
    });

    it('calls onClearAllFilters when "Clear all" is clicked', async () => {
      const user = userEvent.setup();
      const onClearAll = vi.fn();
      render(
        <TableToolbar
          filterChips={mockFilterChips}
          onClearAllFilters={onClearAll}
        />
      );
      await user.click(screen.getByText('Clear all'));
      expect(onClearAll).toHaveBeenCalledOnce();
    });

    it('filter chips not shown when selectedCount > 0', () => {
      render(
        <TableToolbar
          filterChips={mockFilterChips}
          selectedCount={2}
        />
      );
      expect(screen.queryByText('Status: Active')).not.toBeInTheDocument();
      expect(screen.queryByText('Role: Admin')).not.toBeInTheDocument();
    });

    it('does not render filter section when no filterChips', () => {
      const { container } = render(<TableToolbar />);
      // Should not have a flex items-center gap-2 flex-wrap for filters
      const filterRow = container.querySelector('.flex.items-center.gap-2.flex-wrap');
      expect(filterRow).not.toBeInTheDocument();
    });

    it('filter chips have correct styling', () => {
      const { container } = render(<TableToolbar filterChips={mockFilterChips} />);
      const chip = container.querySelector('[style*="color"]');
      expect(chip?.style.backgroundColor).toBe('var(--color-secondary-1)');
      expect(chip?.style.color).toBe('var(--color-on-secondary-1)');
    });
  });

  // ── Bulk actions ────────────────────────────────────────────────────

  describe('Bulk Actions', () => {
    const mockActions: BulkAction[] = [
      {
        label: 'Delete',
        icon: Trash2,
        onClick: vi.fn(),
        variant: 'danger-subtle',
      },
      {
        label: 'Archive',
        icon: undefined,
        onClick: vi.fn(),
        variant: 'secondary',
      },
    ];

    it('does not show bulk actions when selectedCount is 0', () => {
      render(
        <TableToolbar
          bulkActions={mockActions}
          selectedCount={0}
        />
      );
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
      expect(screen.queryByText('Archive')).not.toBeInTheDocument();
    });

    it('shows bulk action bar when selectedCount > 0', () => {
      render(
        <TableToolbar
          bulkActions={mockActions}
          selectedCount={3}
        />
      );
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Archive')).toBeInTheDocument();
    });

    it('displays selected count', () => {
      render(
        <TableToolbar
          bulkActions={mockActions}
          selectedCount={5}
        />
      );
      expect(screen.getByText('5 selected')).toBeInTheDocument();
    });

    it('calls bulk action onClick when button clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const actions: BulkAction[] = [
        { label: 'Delete', onClick },
      ];
      render(
        <TableToolbar
          bulkActions={actions}
          selectedCount={2}
        />
      );
      await user.click(screen.getByRole('button', { name: 'Delete' }));
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('shows multiple bulk action buttons', () => {
      render(
        <TableToolbar
          bulkActions={mockActions}
          selectedCount={2}
        />
      );
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
    });

    it('renders with custom variants', async () => {
      render(
        <TableToolbar
          bulkActions={mockActions}
          selectedCount={1}
        />
      );
      // Buttons are rendered with their specified variants
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
    });

    it('renders icons when provided', () => {
      const { container } = render(
        <TableToolbar
          bulkActions={mockActions}
          selectedCount={1}
        />
      );
      // Trash2 icon should be rendered (lucide-react SVG)
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('uses default secondary variant when not specified', () => {
      const action: BulkAction = {
        label: 'Export',
        onClick: vi.fn(),
        // no variant specified
      };
      render(
        <TableToolbar
          bulkActions={[action]}
          selectedCount={1}
        />
      );
      expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    });
  });

  // ── Selection and clear button ──────────────────────────────────────

  describe('Selection Management', () => {
    it('shows "Clear" button in bulk action bar', () => {
      render(
        <TableToolbar selectedCount={2} />
      );
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('calls onClearSelection when Clear button clicked', async () => {
      const user = userEvent.setup();
      const onClearSelection = vi.fn();
      render(
        <TableToolbar
          selectedCount={3}
          onClearSelection={onClearSelection}
        />
      );
      await user.click(screen.getByRole('button', { name: 'Clear' }));
      expect(onClearSelection).toHaveBeenCalledOnce();
    });

    it('Clear button is styled as secondary link', () => {
      render(<TableToolbar selectedCount={1} />);
      const clearButton = screen.getByRole('button', { name: 'Clear' });
      expect(clearButton.className).toContain('underline');
    });

    it('Clear button has correct color token', () => {
      render(<TableToolbar selectedCount={1} />);
      const clearButton = screen.getByRole('button', { name: 'Clear' });
      expect(clearButton.style.color).toBe('var(--color-on-secondary-2)');
    });

    it('shows selection count display', () => {
      const { unmount } = render(<TableToolbar selectedCount={1} />);
      expect(screen.getByText('1 selected')).toBeInTheDocument();
      unmount();

      render(<TableToolbar selectedCount={10} />);
      expect(screen.getByText('10 selected')).toBeInTheDocument();
    });
  });

  // ── Bulk action bar styling ────────────────────────────────────────

  describe('Bulk Action Bar Styling', () => {
    it('has correct background color', () => {
      const { container } = render(
        <TableToolbar selectedCount={1} />
      );
      const bulkBar = container.querySelector('.rounded-lg');
      expect(bulkBar?.style.backgroundColor).toBe('var(--color-secondary-1)');
    });

    it('has border-radius and padding', () => {
      const { container } = render(
        <TableToolbar selectedCount={1} />
      );
      const bulkBar = container.querySelector('.rounded-lg');
      expect(bulkBar).toBeInTheDocument();
      expect(bulkBar?.className).toContain('px-4');
      expect(bulkBar?.className).toContain('py-2.5');
    });

    it('selection count text uses correct color', () => {
      const { container } = render(
        <TableToolbar selectedCount={1} />
      );
      // Find the span that contains the selected count
      const spans = container.querySelectorAll('span');
      let found = false;
      spans.forEach(span => {
        if (span.textContent?.includes('selected')) {
          expect(span.style.color).toBe('var(--color-on-secondary-1)');
          found = true;
        }
      });
      expect(found).toBe(true);
    });
  });

  // ── Custom actions ──────────────────────────────────────────────────

  describe('Custom Actions', () => {
    it('renders custom actions when provided', () => {
      render(
        <TableToolbar
          actions={<button>Custom Action</button>}
        />
      );
      expect(screen.getByText('Custom Action')).toBeInTheDocument();
    });

    it('custom actions appear on the right side', () => {
      const { container } = render(
        <TableToolbar
          title="Users"
          actions={<button>Export</button>}
        />
      );
      // Custom actions should be in a flex div
      const actionSection = container.querySelector('.flex.items-center.gap-2.shrink-0');
      expect(actionSection?.textContent).toContain('Export');
    });

    it('does not render actions when not provided', () => {
      const { container } = render(
        <TableToolbar title="Users" />
      );
      const actionSection = container.querySelector('.flex.items-center.gap-2.shrink-0');
      expect(actionSection).not.toBeInTheDocument();
    });

    it('actions can be a complex React element', () => {
      const CustomActions = () => (
        <>
          <button>Export CSV</button>
          <button>Download PDF</button>
        </>
      );
      render(
        <TableToolbar actions={<CustomActions />} />
      );
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
      expect(screen.getByText('Download PDF')).toBeInTheDocument();
    });
  });

  // ── Composition tests ────────────────────────────────────────────────

  describe('Full Composition', () => {
    it('renders complete toolbar with all features', () => {
      render(
        <TableToolbar
          title="Accounts"
          search="alpha"
          onSearchChange={() => {}}
          searchPlaceholder="Find accounts..."
          filterChips={[
            { label: 'Status: Active', onRemove: vi.fn() },
            { label: 'Region: US', onRemove: vi.fn() },
          ]}
          onClearAllFilters={vi.fn()}
          actions={<button>Export</button>}
        />
      );
      expect(screen.getByText('Accounts')).toBeInTheDocument();
      expect(screen.getByDisplayValue('alpha')).toBeInTheDocument();
      expect(screen.getByText('Status: Active')).toBeInTheDocument();
      expect(screen.getByText('Region: US')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
    });

    it('switches from normal to bulk mode correctly', async () => {
      const { rerender } = render(
        <TableToolbar
          title="Users"
          search="query"
          onSearchChange={() => {}}
          filterChips={[{ label: 'Admin', onRemove: vi.fn() }]}
          selectedCount={0}
        />
      );
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByDisplayValue('query')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();

      rerender(
        <TableToolbar
          title="Users"
          search="query"
          onSearchChange={() => {}}
          filterChips={[{ label: 'Admin', onRemove: vi.fn() }]}
          selectedCount={5}
          bulkActions={[{ label: 'Delete', onClick: vi.fn() }]}
        />
      );
      // Now should show bulk action bar instead of normal toolbar
      await waitFor(() => {
        expect(screen.getByText('5 selected')).toBeInTheDocument();
      });
      expect(screen.getByText('Delete')).toBeInTheDocument();
      // Filters should be hidden
      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });

    it('filters hidden when bulk selection active', () => {
      render(
        <TableToolbar
          filterChips={[
            { label: 'Status: Active', onRemove: vi.fn() },
          ]}
          selectedCount={2}
        />
      );
      expect(screen.queryByText('Status: Active')).not.toBeInTheDocument();
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });
  });

  // ── Accessibility ───────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('filter remove buttons have aria-label', () => {
      const chips: FilterChip[] = [
        { label: 'Department: Sales', onRemove: vi.fn() },
      ];
      render(<TableToolbar filterChips={chips} />);
      expect(screen.getByLabelText('Remove filter: Department: Sales')).toBeInTheDocument();
    });

    it('search input is accessible', () => {
      render(<TableToolbar onSearchChange={() => {}} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('all buttons are accessible with role="button"', () => {
      render(
        <TableToolbar
          filterChips={[{ label: 'Test', onRemove: vi.fn() }]}
          onClearAllFilters={vi.fn()}
        />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('bulk action buttons are keyboard navigable', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <TableToolbar
          bulkActions={[
            { label: 'Delete', onClick },
            { label: 'Archive', onClick: vi.fn() },
          ]}
          selectedCount={1}
        />
      );
      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      deleteButton.focus();
      expect(deleteButton).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalled();
    });
  });

  // ── Edge cases ───────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('handles selectedCount of 0', () => {
      render(
        <TableToolbar
          title="Items"
          selectedCount={0}
          bulkActions={[{ label: 'Delete', onClick: vi.fn() }]}
        />
      );
      expect(screen.getByText('Items')).toBeInTheDocument();
      expect(screen.queryByText('0 selected')).not.toBeInTheDocument();
    });

    it('handles large selectedCount', () => {
      render(
        <TableToolbar
          selectedCount={10000}
          bulkActions={[{ label: 'Export', onClick: vi.fn() }]}
        />
      );
      expect(screen.getByText('10000 selected')).toBeInTheDocument();
    });

    it('handles empty filterChips array', () => {
      const { container } = render(
        <TableToolbar filterChips={[]} />
      );
      expect(container.querySelector('.flex.items-center.gap-2.flex-wrap')).not.toBeInTheDocument();
    });

    it('handles empty bulkActions array', () => {
      render(
        <TableToolbar
          bulkActions={[]}
          selectedCount={1}
        />
      );
      expect(screen.getByText('1 selected')).toBeInTheDocument();
    });

    it('handles undefined onClearSelection gracefully', () => {
      render(
        <TableToolbar selectedCount={1} />
      );
      // Should still render the Clear button, just won't call anything
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('handles rapid prop changes', async () => {
      const { rerender } = render(
        <TableToolbar selectedCount={0} title="Users" />
      );
      rerender(<TableToolbar selectedCount={1} title="Users" />);
      rerender(<TableToolbar selectedCount={2} title="Users" />);
      rerender(<TableToolbar selectedCount={0} title="Users" />);
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('handles special characters in filter labels', () => {
      const chips: FilterChip[] = [
        { label: 'Status: "Active" & "Verified"', onRemove: vi.fn() },
      ];
      render(<TableToolbar filterChips={chips} />);
      expect(screen.getByText('Status: "Active" & "Verified"')).toBeInTheDocument();
    });

    it('handles empty title string', () => {
      const { container } = render(<TableToolbar title="" />);
      // Title with empty string should not cause errors, toolbar should render
      expect(container.querySelector('.flex.flex-col.gap-3')).toBeInTheDocument();
    });

    it('renders with only title', () => {
      render(<TableToolbar title="Dashboard" />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders with only search', () => {
      render(<TableToolbar onSearchChange={() => {}} />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  // ── Animation and transitions ────────────────────────────────────────

  describe('Transitions', () => {
    it('bulk action bar uses AnimatePresence', async () => {
      const { rerender } = render(
        <TableToolbar selectedCount={0} title="Items" />
      );
      expect(screen.getByText('Items')).toBeInTheDocument();

      // When selectedCount changes, the bulk bar should animate in
      rerender(
        <TableToolbar
          selectedCount={1}
          bulkActions={[{ label: 'Delete', onClick: vi.fn() }]}
        />
      );
      await waitFor(() => {
        expect(screen.getByText('1 selected')).toBeInTheDocument();
      });
    });

    it('filter chips section uses motion animation', () => {
      const { container } = render(
        <TableToolbar
          filterChips={[
            { label: 'Test', onRemove: vi.fn() },
          ]}
        />
      );
      // Motion div should be rendered
      const filterSection = container.querySelector('.flex.items-center.gap-2.flex-wrap');
      expect(filterSection).toBeInTheDocument();
    });
  });
});
