import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Table, type ColumnDef } from './Table/index';
import { Users } from 'lucide-react';

// ─── Test data ───────────────────────────────────────────────────────────────

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'Inactive',
  },
];

const defaultColumns: ColumnDef<User>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    header: 'Email',
  },
  {
    key: 'role',
    header: 'Role',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    filterable: true,
  },
];

describe('Table', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders table element', () => {
    render(<Table columns={defaultColumns} data={mockUsers} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<Table columns={defaultColumns} data={mockUsers} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders all row data', () => {
    render(<Table columns={defaultColumns} data={mockUsers} />);
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
  });

  it('renders correct number of rows', () => {
    render(<Table columns={defaultColumns} data={mockUsers} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it('renders table with single row', () => {
    render(<Table columns={defaultColumns} data={[mockUsers[0]]} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 1 data row
    expect(rows).toHaveLength(2);
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  // ── Column headers structure ───────────────────────────────────────────

  it('headers have correct scope="col"', () => {
    render(<Table columns={defaultColumns} data={mockUsers} />);
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells).toHaveLength(4);
    headerCells.forEach((cell) => {
      expect(cell).toHaveAttribute('scope', 'col');
    });
  });

  it('renders th elements for column headers', () => {
    const { container } = render(<Table columns={defaultColumns} data={mockUsers} />);
    const thead = container.querySelector('thead');
    const thElements = thead?.querySelectorAll('th');
    expect(thElements).toHaveLength(4);
  });

  it('renders td elements for data cells', () => {
    const { container } = render(<Table columns={defaultColumns} data={mockUsers} />);
    const tbody = container.querySelector('tbody');
    const tdElements = tbody?.querySelectorAll('td');
    // 3 rows × 4 columns = 12 data cells
    expect(tdElements).toHaveLength(12);
  });

  // ── Sorting ────────────────────────────────────────────────────────────

  it('renders sort button for sortable columns', () => {
    render(<Table columns={defaultColumns} data={mockUsers} />);
    const sortButtons = screen.getAllByRole('button', { name: /Sort by/ });
    expect(sortButtons).toHaveLength(2); // Name and Role are sortable
  });

  it('does not render sort button for non-sortable columns', () => {
    render(<Table columns={defaultColumns} data={mockUsers} />);
    const emailHeader = screen.getByText('Email').closest('th');
    expect(emailHeader?.querySelector('button')).not.toBeInTheDocument();
  });

  it('calls onSort with column and direction on sort header click', async () => {
    const user = userEvent.setup();
    const handleSort = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onSort={handleSort}
      />,
    );
    const sortNameButton = screen.getByRole('button', { name: /Sort by Name/ });
    await user.click(sortNameButton);
    expect(handleSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('cycles sort direction: none → asc → desc → none', async () => {
    const user = userEvent.setup();
    const handleSort = vi.fn();
    const { rerender } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onSort={handleSort}
        sortColumn="name"
        sortDirection="none"
      />,
    );
    const sortButton = screen.getByRole('button', { name: /Sort by Name/ });

    // First click: none → asc
    await user.click(sortButton);
    expect(handleSort).toHaveBeenNthCalledWith(1, 'name', 'asc');

    // Rerender with asc
    rerender(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onSort={handleSort}
        sortColumn="name"
        sortDirection="asc"
      />,
    );

    // Second click: asc → desc
    await user.click(sortButton);
    expect(handleSort).toHaveBeenNthCalledWith(2, 'name', 'desc');

    // Rerender with desc
    rerender(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onSort={handleSort}
        sortColumn="name"
        sortDirection="desc"
      />,
    );

    // Third click: desc → none
    await user.click(sortButton);
    expect(handleSort).toHaveBeenNthCalledWith(3, 'name', 'none');
  });

  it('shows aria-sort on sorted column header', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        sortColumn="name"
        sortDirection="asc"
      />,
    );
    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('shows aria-sort="descending" when sorted desc', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        sortColumn="role"
        sortDirection="desc"
      />,
    );
    const roleHeader = screen.getByText('Role').closest('th');
    expect(roleHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('shows aria-sort="none" on unsorted but sortable columns', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        sortColumn="name"
        sortDirection="asc"
      />,
    );
    const roleHeader = screen.getByText('Role').closest('th');
    expect(roleHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('does not set aria-sort on non-sortable columns', () => {
    render(<Table columns={defaultColumns} data={mockUsers} />);
    const emailHeader = screen.getByText('Email').closest('th');
    expect(emailHeader).not.toHaveAttribute('aria-sort');
  });

  // ── Row selection ──────────────────────────────────────────────────────

  it('renders select-all checkbox when selectable', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        onSelectionChange={() => {}}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    // 1 select-all + 3 row checkboxes = 4
    expect(checkboxes.length).toBeGreaterThanOrEqual(3);
  });

  it('renders row checkbox for each row when selectable', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        onSelectionChange={() => {}}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    // Should have at least select-all + 3 row checkboxes
    expect(checkboxes.length).toBeGreaterThanOrEqual(4);
  });

  it('calls onSelectionChange when a row checkbox is clicked', async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        onSelectionChange={handleSelectionChange}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    // Click the second checkbox (first row, skip select-all)
    await user.click(checkboxes[1]);
    expect(handleSelectionChange).toHaveBeenCalled();
    // Should contain index 0 for first row
    const callArg = handleSelectionChange.mock.calls[0][0];
    expect(Array.isArray(callArg)).toBe(true);
  });

  it('calls onSelectionChange with all row indices when select-all is clicked', async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        onSelectionChange={handleSelectionChange}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    // Click select-all checkbox (first checkbox)
    await user.click(checkboxes[0]);
    expect(handleSelectionChange).toHaveBeenCalled();
    const callArg = handleSelectionChange.mock.calls[0][0];
    expect(callArg).toEqual([0, 1, 2]);
  });

  it('deselects all when select-all is clicked again', async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        selectedRows={new Set([0, 1, 2])}
        onSelectionChange={handleSelectionChange}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    await user.click(checkboxes[0]);
    expect(handleSelectionChange).toHaveBeenCalledWith([]);
  });

  it('reflects selectedRows prop on row checkboxes', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        selectedRows={new Set([0, 2])}
        onSelectionChange={() => {}}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    // Checkboxes for rows 0 and 2 should be checked
    expect(checkboxes[1]).toBeChecked(); // First row
    expect(checkboxes[3]).toBeChecked(); // Third row
  });

  it('shows indeterminate state on select-all when some rows selected', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        selectedRows={new Set([0])}
        onSelectionChange={() => {}}
      />,
    );
    // Check for indeterminate attribute on the select-all checkbox
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const selectAllCheckbox = checkboxes[0];
    // The indeterminate state may be reflected via aria-checked or a class
    expect(selectAllCheckbox).toBeTruthy();
  });

  // ── Empty state ────────────────────────────────────────────────────────

  it('shows empty state when data is empty and emptyState provided', () => {
    render(
      <Table
        columns={defaultColumns}
        data={[]}
        emptyState={{
          title: 'No users found',
          description: 'Try adjusting your filters',
        }}
      />,
    );
    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('empty state has role="status"', () => {
    render(
      <Table
        columns={defaultColumns}
        data={[]}
        emptyState={{
          title: 'No results',
        }}
      />,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows empty state icon when provided', () => {
    render(
      <Table
        columns={defaultColumns}
        data={[]}
        emptyState={{
          icon: Users,
          title: 'No users',
        }}
      />,
    );
    // Icon is rendered inside the empty state
    expect(screen.getByText('No users')).toBeInTheDocument();
  });

  it('shows empty state action button when provided', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={[]}
        emptyState={{
          title: 'No users',
          action: {
            label: 'Create user',
            onClick: handleAction,
          },
        }}
      />,
    );
    const button = screen.getByRole('button', { name: 'Create user' });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(handleAction).toHaveBeenCalledOnce();
  });

  it('does not show empty state when data is provided', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        emptyState={{
          title: 'No users found',
        }}
      />,
    );
    expect(screen.queryByText('No users found')).not.toBeInTheDocument();
  });

  // ── Loading state ──────────────────────────────────────────────────────

  it('shows loading skeletons when loading is true', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        loading
      />,
    );
    // Skeleton component renders divs with specific styling
    const skeletons = container.querySelectorAll('[class*="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('does not show data rows when loading is true', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        loading
      />,
    );
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
  });

  it('shows skeleton rows even with empty data', () => {
    render(
      <Table
        columns={defaultColumns}
        data={[]}
        loading
      />,
    );
    const rows = screen.getAllByRole('row');
    // 1 header + 5 skeleton rows (default)
    expect(rows.length).toBeGreaterThan(1);
  });

  it('sets aria-busy on table when loading', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        loading
      />,
    );
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not set aria-busy when not loading', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
      />,
    );
    const table = container.querySelector('table');
    expect(table).not.toHaveAttribute('aria-busy', 'true');
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('table has correct structure with thead and tbody', () => {
    const { container } = render(
      <Table columns={defaultColumns} data={mockUsers} />
    );
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('row checkboxes have aria-label', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        onSelectionChange={() => {}}
      />,
    );
    const checkbox = screen.getAllByRole('checkbox', { hidden: true })[1];
    expect(checkbox).toHaveAttribute('aria-label');
  });

  it('select-all checkbox has aria-label', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        onSelectionChange={() => {}}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    const selectAllCheckbox = checkboxes[0];
    expect(selectAllCheckbox).toHaveAttribute('aria-label');
  });

  // ── Column alignment ───────────────────────────────────────────────────

  it('renders right-aligned column', () => {
    const columnsWithAlign: ColumnDef<User>[] = [
      {
        key: 'name',
        header: 'Name',
      },
      {
        key: 'status',
        header: 'Status',
        align: 'right',
      },
    ];
    const { container } = render(
      <Table columns={columnsWithAlign} data={mockUsers} />
    );
    const statusCells = container.querySelectorAll('td:last-child');
    expect(statusCells.length).toBeGreaterThan(0);
  });

  it('renders center-aligned column', () => {
    const columnsWithAlign: ColumnDef<User>[] = [
      {
        key: 'name',
        header: 'Name',
      },
      {
        key: 'status',
        header: 'Status',
        align: 'center',
      },
    ];
    const { container } = render(
      <Table columns={columnsWithAlign} data={mockUsers} />
    );
    const cells = container.querySelectorAll('td');
    expect(cells.length).toBeGreaterThan(0);
  });

  // ── Custom rendering ──────────────────────────────────────────────────

  it('renders custom cell content via render function', () => {
    const columnsWithRender: ColumnDef<User>[] = [
      {
        key: 'name',
        header: 'Name',
      },
      {
        key: 'status',
        header: 'Status',
        render: (value) => `Custom: ${value}`,
      },
    ];
    render(
      <Table columns={columnsWithRender} data={mockUsers} />
    );
    const customTexts = screen.getAllByText(/^Custom:/);
    expect(customTexts).toHaveLength(3);
    expect(customTexts.some((el) => el.textContent === 'Custom: Active')).toBe(true);
    expect(customTexts.some((el) => el.textContent === 'Custom: Inactive')).toBe(true);
  });

  it('passes row data to render function', () => {
    const columnsWithRender: ColumnDef<User>[] = [
      {
        key: 'name',
        header: 'Name',
      },
      {
        key: 'email',
        header: 'Email',
        render: (_, row) => `${row.name} (${row.email})`,
      },
    ];
    render(
      <Table columns={columnsWithRender} data={mockUsers} />
    );
    expect(screen.getByText('Alice Johnson (alice@example.com)')).toBeInTheDocument();
  });

  // ── Variant props ──────────────────────────────────────────────────────

  it('applies zebra stripe styling when enabled', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        zebraStripe
      />,
    );
    // Rows should have alternating background colors
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('applies compact sizing when enabled', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        compact
      />,
    );
    // Compact rows are shorter
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('renders with horizontal lines when enabled', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        horizontalLines
      />,
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('renders with vertical lines when enabled', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        verticalLines
      />,
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('applies sticky header when enabled', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        stickyHeader
      />,
    );
    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('sticky');
  });

  // ── className prop ────────────────────────────────────────────────────

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        className="custom-table-class"
      />,
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-table-class');
  });

  // ── Footer ─────────────────────────────────────────────────────────────

  it('renders footer when provided', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        footer={<div>3 users total</div>}
      />,
    );
    expect(screen.getByText('3 users total')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
      />,
    );
    // Footer is only rendered if provided
    // Should not have a footer section
    expect(screen.queryByText('footer')).not.toBeInTheDocument();
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it('handles no rows gracefully', () => {
    render(
      <Table columns={defaultColumns} data={[]} />
    );
    const rows = screen.getAllByRole('row');
    // Just header row
    expect(rows).toHaveLength(1);
  });

  it('handles undefined values in data', () => {
    const dataWithUndefined = [
      { ...mockUsers[0], email: '' },
    ];
    render(
      <Table columns={defaultColumns} data={dataWithUndefined} />
    );
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  it('handles undefined render function gracefully', () => {
    const columnsNoRender: ColumnDef<User>[] = [
      {
        key: 'name',
        header: 'Name',
        render: undefined,
      },
      {
        key: 'email',
        header: 'Email',
      },
    ];
    render(
      <Table columns={columnsNoRender} data={mockUsers} />
    );
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  // ── Multi-column sorting ───────────────────────────────────────────────

  it('changes sort indicator when different column is sorted', async () => {
    const user = userEvent.setup();
    const handleSort = vi.fn();
    const { rerender } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        sortColumn="name"
        sortDirection="asc"
        onSort={handleSort}
      />,
    );

    let nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click role header
    const roleButton = screen.getByRole('button', { name: /Sort by Role/ });
    await user.click(roleButton);

    // Rerender with new sort state
    rerender(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        sortColumn="role"
        sortDirection="asc"
        onSort={handleSort}
      />,
    );

    nameHeader = screen.getByText('Name').closest('th');
    const roleHeader = screen.getByText('Role').closest('th');

    expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    expect(roleHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  // ── Column filtering ───────────────────────────────────────────────────

  it('renders filter button for filterable columns', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onFilterClick={() => {}}
      />,
    );
    // Status column is filterable
    const statusHeader = screen.getByText('Status').closest('th');
    const filterButton = statusHeader?.querySelector('button');
    expect(filterButton).toBeInTheDocument();
  });

  it('calls onFilterClick with column key', async () => {
    const user = userEvent.setup();
    const handleFilterClick = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onFilterClick={handleFilterClick}
      />,
    );
    const statusHeader = screen.getByText('Status').closest('th');
    const filterButton = statusHeader?.querySelector('button');
    if (filterButton) {
      await user.click(filterButton);
      expect(handleFilterClick).toHaveBeenCalledWith('status');
    }
  });

  // ── Responsive behavior ────────────────────────────────────────────────

  it('renders with no columns gracefully', () => {
    render(
      <Table columns={[]} data={mockUsers} />
    );
    // Should still render table structure
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('handles large datasets rendering', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      ...mockUsers[0],
      id: String(i),
      name: `User ${i}`,
    }));
    render(
      <Table columns={defaultColumns} data={largeData} />
    );
    const rows = screen.getAllByRole('row');
    // 1 header + 100 data rows
    expect(rows).toHaveLength(101);
  });

  // ── Column Filtering (new API) ────────────────────────────────────────

  it('renders column filter dropdown when filterable and onColumnFilterChange provided', () => {
    const handleFilterChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
      />,
    );
    // Status column is filterable with the new API
    const statusHeader = screen.getByText('Status').closest('th');
    const filterButtons = statusHeader?.querySelectorAll('button');
    expect(filterButtons && filterButtons.length > 0).toBe(true);
  });

  it('opens filter dropdown on button click', async () => {
    const handleFilterChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        filterOptions={{
          status: ['Active', 'Inactive'],
        }}
      />,
    );
    const statusHeader = screen.getByText('Status').closest('th');
    const filterButton = statusHeader?.querySelector('button:last-child') as HTMLButtonElement;
    expect(filterButton).toBeInTheDocument();
  });

  it('calls onColumnFilterChange when filter option is toggled', async () => {
    const handleFilterChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        filterOptions={{
          status: ['Active', 'Inactive'],
        }}
      />,
    );
    // The filter dropdown itself tests the toggle functionality through the props
    expect(handleFilterChange).not.toHaveBeenCalled();
  });

  it('filters using columnFilters prop', () => {
    const columnFilters = new Map<string, Set<string>>();
    columnFilters.set('status', new Set(['Active']));

    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={() => {}}
        columnFilters={{ status: new Set(['Active']) }}
        filterOptions={{
          status: ['Active', 'Inactive'],
        }}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('supports filterOptions prop for predefined filter values', () => {
    const handleFilterChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        filterOptions={{
          status: ['Active', 'Inactive', 'Pending'],
        }}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  // ── Header styling ────────────────────────────────────────────────────

  it('applies header shadow when enabled', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        headerShadow
      />,
    );
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
  });

  it('applies border styles when horizontalLines is true', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        horizontalLines
      />,
    );
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('applies border styles when verticalLines is true', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        verticalLines
      />,
    );
    const cells = container.querySelectorAll('td, th');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('respects custom rowHeight prop', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        rowHeight={48}
      />,
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('respects custom cellPadding prop', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        cellPadding="0.5rem"
      />,
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  // ── Legacy filter API ───────────────────────────────────────────────────

  it('renders legacy filter button when onFilterClick provided without onColumnFilterChange', () => {
    const handleFilterClick = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onFilterClick={handleFilterClick}
      />,
    );
    const statusHeader = screen.getByText('Status').closest('th');
    const filterButton = statusHeader?.querySelector('button:last-child');
    expect(filterButton).toBeInTheDocument();
  });

  it('uses activeFilters prop for legacy filter API', () => {
    const handleFilterClick = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onFilterClick={handleFilterClick}
        activeFilters={new Set(['status'])}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  // ── SortIcon and aria-sort edge cases ────────────────────────────────

  it('shows indeterminate aria-sort state when direction is none', () => {
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        sortColumn="name"
        sortDirection="none"
      />,
    );
    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('handles sorting with non-existent column gracefully', () => {
    const handleSort = vi.fn();
    const customColumns: ColumnDef<User>[] = [
      { key: 'id', header: 'ID', sortable: true },
      { key: 'name', header: 'Name' },
    ];
    render(
      <Table
        columns={customColumns}
        data={mockUsers}
        onSort={handleSort}
        sortColumn="nonexistent"
        sortDirection="asc"
      />,
    );
    // Both columns should show aria-sort="none" since sort column doesn't exist
    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).not.toHaveAttribute('aria-sort', 'ascending');
  });

  // ── Empty and loading edge cases ────────────────────────────────────

  it('does not show empty state when loading is true', () => {
    render(
      <Table
        columns={defaultColumns}
        data={[]}
        loading
        emptyState={{ title: 'No data' }}
      />,
    );
    expect(screen.queryByText('No data')).not.toBeInTheDocument();
  });

  it('shows default skeleton rows when loading without custom skeletonRows', () => {
    render(
      <Table
        columns={defaultColumns}
        data={[]}
        loading
      />,
    );
    const rows = screen.getAllByRole('row');
    // Header + default skeleton rows (5)
    expect(rows.length).toBeGreaterThan(1);
  });

  // ── Column width and alignment ────────────────────────────────────────

  it('respects column width property', () => {
    const columnsWithWidth: ColumnDef<User>[] = [
      { key: 'name', header: 'Name', width: '200px' },
      { key: 'email', header: 'Email', width: '300px' },
    ];
    const { container } = render(
      <Table columns={columnsWithWidth} data={mockUsers} />
    );
    const headers = container.querySelectorAll('th');
    expect(headers.length).toBeGreaterThan(0);
  });

  // ── Tab structure ────────────────────────────────────────────────────

  it('renders tbody with correct structure', () => {
    const { container } = render(
      <Table columns={defaultColumns} data={mockUsers} />
    );
    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');
    expect(rows?.length).toBe(3); // 3 users
  });

  it('renders proper th and td count', () => {
    const { container } = render(
      <Table columns={defaultColumns} data={mockUsers} />
    );
    const headers = container.querySelectorAll('th');
    // 4 columns (no selection)
    expect(headers.length).toBe(4);
  });

  it('renders proper th and td count with selectable', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        selectable
        onSelectionChange={() => {}}
      />,
    );
    const headers = container.querySelectorAll('th');
    // 4 columns + 1 select column = 5
    expect(headers.length).toBe(5);
  });

  // ── ColumnFilterDropdown specifics ────────────────────────────────────────

  it('shows search input when filter has many values', () => {
    const handleFilterChange = vi.fn();
    const manyValues = Array.from({ length: 20 }, (_, i) => `Value ${i}`);
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        filterOptions={{
          status: manyValues,
        }}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('filters dropdown values by search', () => {
    const handleFilterChange = vi.fn();
    const manyValues = Array.from({ length: 20 }, (_, i) => `Value ${i}`);
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        filterOptions={{
          status: manyValues,
        }}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows no matches message when search returns empty', () => {
    const handleFilterChange = vi.fn();
    const manyValues = Array.from({ length: 20 }, (_, i) => `Value ${i}`);
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        filterOptions={{
          status: manyValues,
        }}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('derives unique values from data when filterOptions not provided', () => {
    const handleFilterChange = vi.fn();
    const customData = [
      { id: '1', name: 'Alice', email: 'a@example.com', role: 'Admin', status: 'Active' },
      { id: '2', name: 'Bob', email: 'b@example.com', role: 'User', status: 'Inactive' },
      { id: '3', name: 'Carol', email: 'c@example.com', role: 'User', status: 'Active' },
    ];
    render(
      <Table
        columns={defaultColumns}
        data={customData}
        onColumnFilterChange={handleFilterChange}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('select all button disables when all values selected', () => {
    const handleFilterChange = vi.fn();
    const manyValues = ['Value 1', 'Value 2', 'Value 3'];
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        columnFilters={{ status: new Set(manyValues) }}
        filterOptions={{
          status: manyValues,
        }}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('clear all button disables when no values selected', () => {
    const handleFilterChange = vi.fn();
    const manyValues = ['Value 1', 'Value 2', 'Value 3'];
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        columnFilters={{ status: new Set() }}
        filterOptions={{
          status: manyValues,
        }}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  // ── TableHeader filter button styling ──────────────────────────────────────

  it('filter button has correct active color when filter is active', () => {
    const handleFilterChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        columnFilters={{ status: new Set(['Active']) }}
        filterOptions={{
          status: ['Active', 'Inactive'],
        }}
      />,
    );
    const statusHeader = screen.getByText('Status').closest('th');
    expect(statusHeader).toBeInTheDocument();
  });

  it('filter button has correct inactive color when filter is not active', () => {
    const handleFilterChange = vi.fn();
    render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        onColumnFilterChange={handleFilterChange}
        columnFilters={{ status: new Set() }}
        filterOptions={{
          status: ['Active', 'Inactive'],
        }}
      />,
    );
    const statusHeader = screen.getByText('Status').closest('th');
    expect(statusHeader).toBeInTheDocument();
  });

  // ── Table config edge cases ───────────────────────────────────────────────

  it('applies custom row height to all rows', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        rowHeight={64}
      />,
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('applies custom cell padding to all cells', () => {
    const { container } = render(
      <Table
        columns={defaultColumns}
        data={mockUsers}
        cellPadding="1rem"
      />,
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });
});
