import { useState, useMemo } from 'react';
import { Search, Pencil, Trash2, Download } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Table, type ColumnDef, type SortDirection } from '../../components/Table';
import { Pagination } from '../../components/Pagination';
import { TableToolbar, type FilterChip } from '../../components/TableToolbar';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';
import { demoTeamRows, type DemoTeamRow } from '../../data/demo';

// ─── Columns ──────────────────────────────────────────────────────────────────

const baseCols: ColumnDef<DemoTeamRow>[] = [
  { key: 'name',       header: 'Name',       width: '20%' },
  { key: 'email',      header: 'Email',      width: '28%' },
  { key: 'role',       header: 'Role',       width: '18%' },
  { key: 'department', header: 'Department', width: '14%' },
  { key: 'status',     header: 'Status',     width: '10%' },
  { key: 'joined',     header: 'Joined',     width: '10%' },
];

// ─── Component ────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sortableCols: ColumnDef<DemoTeamRow>[]  = baseCols.map(c => ({ ...c, sortable: true }));
const filterableCols: ColumnDef<DemoTeamRow>[] = baseCols.map(c => ({ ...c, sortable: true, filterable: true }));

const customCols: ColumnDef<DemoTeamRow>[] = [
  { key: 'name',       header: 'Name',       width: '20%', sortable: true },
  { key: 'email',      header: 'Email',      width: '28%', sortable: true },
  { key: 'role',       header: 'Role',       width: '18%' },
  { key: 'department', header: 'Department', width: '14%' },
  { key: 'status',     header: 'Status',     width: '10%', render: (val) => (
    <Badge variant={
      val === 'Active'    ? 'accent' :
      val === 'Inactive'  ? 'neutral'  :
      val === 'Suspended' ? 'neutral'  : 'neutral'
    }>{String(val)}</Badge>
  )},
  { key: 'actions', header: '', width: 80, align: 'right', render: () => (
    <div className="flex items-center gap-1">
      <Button variant="link" size="xs" iconOnly={Pencil} aria-label="Edit row" />
      <Button variant="link" size="xs" iconOnly={Trash2} aria-label="Delete row" />
    </div>
  )},
];

// Pre-compute unique values so filter dropdowns always show all options
const allFilterOptions: Record<string, string[]> = {};
for (const col of baseCols) {
  allFilterOptions[col.key] = Array.from(
    new Set(demoTeamRows.map(row => String(row[col.key as keyof DemoTeamRow] ?? ''))),
  ).sort();
}

/** Hook for sort + optional filter state — each table section gets its own */
function useTableState() {
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState<SortDirection>('none');
  const [columnFilters, setColumnFilters] = useState<Record<string, Set<string>>>({});

  const handleSort = (col: string, dir: SortDirection) => { setSortCol(col); setSortDir(dir); };
  const handleColumnFilterChange = (col: string, values: Set<string>) => {
    setColumnFilters(prev => ({ ...prev, [col]: values }));
  };

  const sorted = [...demoTeamRows].sort((a, b) => {
    if (!sortCol || sortDir === 'none') return 0;
    const av = String(a[sortCol as keyof DemoTeamRow]);
    const bv = String(b[sortCol as keyof DemoTeamRow]);
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const filtered = sorted.filter(row => {
    for (const [col, values] of Object.entries(columnFilters)) {
      if (values.size === 0) continue;
      const cellValue = String(row[col as keyof DemoTeamRow] ?? '');
      if (!values.has(cellValue)) return false;
    }
    return true;
  });

  return { sortCol, sortDir, handleSort, columnFilters, handleColumnFilterChange, sorted, filtered };
}

// ─── Paginated table demo ────────────────────────────────────────────────────

function PaginatedTableDemo() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const allData = [...demoTeamRows, ...demoTeamRows]; // 20 rows
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const paged = allData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Table
      columns={baseCols}
      data={paged}
      footer={
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onRowsPerPageChange={setRowsPerPage}
          totalRows={allData.length}
        />
      }
    />
  );
}

// ─── Toolbar table demo ──────────────────────────────────────────────────────

function ToolbarTableDemo() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = demoTeamRows;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      );
    }
    if (statusFilter) {
      result = result.filter(r => r.status === statusFilter);
    }
    return result;
  }, [search, statusFilter]);

  const chips: FilterChip[] = [];
  if (statusFilter) {
    chips.push({ label: `Status: ${statusFilter}`, onRemove: () => setStatusFilter(null) });
  }

  return (
    <div>
      <TableToolbar
        title="Team members"
        search={search}
        onSearchChange={setSearch}
        filterChips={chips}
        onClearAllFilters={() => setStatusFilter(null)}
        selectedCount={selected.size}
        bulkActions={[
          { label: 'Export', icon: Download, onClick: () => {}, variant: 'secondary' },
          { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger-subtle' },
        ]}
        onClearSelection={() => setSelected(new Set())}
        actions={
          <div className="flex gap-1">
            <Button variant="secondary" size="sm" onClick={() => setStatusFilter('Active')}>Active only</Button>
            <Button variant="secondary" size="sm" onClick={() => setStatusFilter('On Leave')}>On leave</Button>
          </div>
        }
      />
      <Table
        columns={baseCols}
        data={filtered}
        selectable
        selectedRows={selected}
        onSelectionChange={(indices) => setSelected(new Set(indices))}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataTablePage() {
  const sortable = useTableState();
  const custom = useTableState();
  const filter = useTableState();
  const kitchen = useTableState();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [kitchenSelected, setKitchenSelected] = useState<Set<number>>(new Set());

  return (
    <>
      <PageHero
        title="Data Table"
        subtitle="Sortable, filterable, selectable"
        description="Full-featured data table with sorting, filtering, selection, sticky headers, zebra striping, and custom cell rendering."
      />

      {/* ══ BASICS ═══════════════════════════════════════════════════════════ */}
      <SectionTitle>Basic table</SectionTitle>
      <Card>
        <Spec>6 columns · 10 rows · horizontalLines (default on)</Spec>
        <Table columns={baseCols} data={demoTeamRows} />
      </Card>

      <div className="mt-12" />
      <SectionTitle>Zebra stripe</SectionTitle>
      <Card>
        <Spec>zebraStripe + horizontalLines · Alternating surface-2 rows</Spec>
        <Table columns={baseCols} data={demoTeamRows} zebraStripe />
      </Card>

      <div className="mt-12" />
      <SectionTitle>Compact</SectionTitle>
      <Card>
        <Spec>compact · 36px row height · 12px cell padding · Dense layout</Spec>
        <Table columns={baseCols} data={demoTeamRows} compact />
      </Card>

      <div className="mt-12" />
      <SectionTitle>With vertical lines</SectionTitle>
      <Card>
        <Spec>horizontalLines + verticalLines · Grid appearance</Spec>
        <Table columns={baseCols} data={demoTeamRows} verticalLines />
      </Card>

      <div className="mt-12" />
      {/* ══ FEATURES ═════════════════════════════════════════════════════════ */}
      <SectionTitle>Sortable</SectionTitle>
      <Card>
        <Spec>Click headers to cycle: none → asc → desc → none · Animated sort indicator</Spec>
        <Table columns={sortableCols} data={sortable.sorted} sortColumn={sortable.sortCol} sortDirection={sortable.sortDir} onSort={sortable.handleSort} />
      </Card>

      <div className="mt-12" />
      <SectionTitle>With selection</SectionTitle>
      <Card>
        <Spec>Checkbox column · Select-all with indeterminate · Selected row highlight</Spec>
        <Table
          columns={baseCols}
          data={demoTeamRows}
          selectable
          selectedRows={selected}
          onSelectionChange={(indices) => setSelected(new Set(indices))}
        />
      </Card>

      <div className="mt-12" />
      <SectionTitle>Column filter</SectionTitle>
      <Card>
        <Spec>Filter icons open a DropdownMenu with checkbox multi-select · Unique values extracted from data · Rows filter in real-time</Spec>
        <Table
          columns={filterableCols}
          data={filter.filtered}
          sortColumn={filter.sortCol}
          sortDirection={filter.sortDir}
          onSort={filter.handleSort}
          columnFilters={filter.columnFilters}
          onColumnFilterChange={filter.handleColumnFilterChange}
          filterOptions={allFilterOptions}
        />
      </Card>

      <div className="mt-12" />
      <SectionTitle>Custom cell rendering</SectionTitle>
      <Card>
        <Spec>Badge for status · Icon buttons for actions · render() per column</Spec>
        <Table columns={customCols} data={custom.sorted} sortColumn={custom.sortCol} sortDirection={custom.sortDir} onSort={custom.handleSort} />
      </Card>

      <div className="mt-12" />
      {/* ══ STATES ═══════════════════════════════════════════════════════════ */}
      <SectionTitle>Loading state</SectionTitle>
      <Card>
        <Spec>Skeleton rows · aria-busy · No hover/selection during loading</Spec>
        <Table columns={baseCols} data={[]} loading />
      </Card>

      <div className="mt-12" />
      <SectionTitle>Empty state</SectionTitle>
      <Card>
        <Spec>Icon + title + description + action button · role="status" · Fade in animation</Spec>
        <Table
          columns={baseCols}
          data={[]}
          emptyState={{
            icon: Search,
            title: 'No contracts found',
            description: 'Try adjusting your search or filters to find what you need.',
            action: { label: 'Clear filters', onClick: () => {} },
          }}
        />
      </Card>

      <div className="mt-12" />
      {/* ══ ADVANCED ═════════════════════════════════════════════════════════ */}
      <SectionTitle>Sticky header</SectionTitle>
      <Card>
        <Spec>stickyHeader · max-h-[300px] scrollable container · Header stays fixed</Spec>
        <div className="max-h-[300px] overflow-auto rounded-lg" style={{ border: '1px solid var(--color-border)' }}>
          <Table columns={baseCols} data={[...demoTeamRows, ...demoTeamRows, ...demoTeamRows]} stickyHeader />
        </div>
      </Card>

      {/* ══ V1 FEATURES ═══════════════════════════════════════════════════ */}
      <div className="mt-12" />
      <SectionTitle>Pagination</SectionTitle>
      <Card>
        <Spec>Pagination in footer slot · ToggleButton for page numbers · Rows-per-page selector</Spec>
        <PaginatedTableDemo />
      </Card>

      <div className="mt-12" />
      <SectionTitle>Table toolbar</SectionTitle>
      <Card>
        <Spec>Title + global search + filter chips + bulk actions toolbar · Animated mode switch</Spec>
        <ToolbarTableDemo />
      </Card>

      <div className="mt-12" />
      <SectionTitle>Cell truncation</SectionTitle>
      <Card>
        <Spec>truncate: true on ColumnDef · Ellipsis + native title tooltip · Prevents layout blow-outs</Spec>
        <Table
          columns={[
            { key: 'name', header: 'Name', width: '20%', sortable: true },
            { key: 'email', header: 'Email', width: '25%', truncate: true },
            { key: 'role', header: 'Role', width: '15%' },
            { key: 'department', header: 'Department', width: '15%' },
            { key: 'status', header: 'Status', width: '10%' },
            { key: 'joined', header: 'Joined', width: '15%' },
          ]}
          data={demoTeamRows}
        />
      </Card>

      <div className="mt-12" />
      <SectionTitle>Kitchen sink</SectionTitle>
      <Card>
        <Spec>All features: selectable + sortable + filterable + zebra stripe + sticky header</Spec>
        <div className="max-h-[400px] overflow-auto rounded-lg" style={{ border: '1px solid var(--color-border)' }}>
          <Table
            columns={filterableCols}
            data={kitchen.filtered}
            selectable
            selectedRows={kitchenSelected}
            onSelectionChange={(indices) => setKitchenSelected(new Set(indices))}
            sortColumn={kitchen.sortCol}
            sortDirection={kitchen.sortDir}
            onSort={kitchen.handleSort}
            columnFilters={kitchen.columnFilters}
            onColumnFilterChange={kitchen.handleColumnFilterChange}
            filterOptions={allFilterOptions}
            zebraStripe
            stickyHeader
          />
        </div>
      </Card>
    </>
  );
}
