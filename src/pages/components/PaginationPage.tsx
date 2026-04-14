import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Pagination } from '../../components/Pagination';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { ExampleBlock } from '../../layouts/ExampleBlock';
import { CodeBlock } from '../../layouts/CodeBlock';
import { spring } from '../../tokens/motion';

/* ─── Reveal ─────────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ ...spring.default, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function PaginationPage() {
  // Basic
  const [basicPage, setBasicPage] = useState(1);

  // With row count
  const [rowCountPage, setRowCountPage] = useState(3);
  const rowCountRowsPerPage = 25;
  const rowCountTotal = 287;
  const rowCountTotalPages = Math.ceil(rowCountTotal / rowCountRowsPerPage);

  // With rows-per-page
  const [rppPage, setRppPage] = useState(1);
  const [rppRowsPerPage, setRppRowsPerPage] = useState(25);
  const rppTotalRows = 487;
  const rppTotalPages = Math.ceil(rppTotalRows / rppRowsPerPage);

  // Sizes
  const [xsPage, setXsPage] = useState(1);
  const [smPage, setSmPage] = useState(1);

  // Few pages
  const [fewPage, setFewPage] = useState(1);

  // Many pages
  const [manyPage, setManyPage] = useState(1);

  return (
    <>
      <PageHero
        title="Pagination"
        subtitle="Navigate large datasets without losing your place"
        description="Composable page controls with prev/next navigation, page number toggles, rows-per-page selector, and row count display. Built on DS buttons and toggle buttons for consistent sizing and interaction."
      />

      {/* ═══ BASIC ═══ */}
      <Reveal>
        <Section title="Basic" description="Simple page navigation. 12 pages, prev/next arrows, numbered buttons with ellipsis.">
          <ExampleBlock>
            <Pagination
              page={basicPage}
              totalPages={12}
              onPageChange={setBasicPage}
            />
          </ExampleBlock>
        </Section>
      </Reveal>

      {/* ═══ WITH ROW COUNT ═══ */}
      <Reveal>
        <Section title="With row count" description="Shows the current row range alongside page controls. Useful when users need to know exactly where they are in the dataset.">
          <ExampleBlock>
            <Pagination
              page={rowCountPage}
              totalPages={rowCountTotalPages}
              onPageChange={setRowCountPage}
              rowsPerPage={rowCountRowsPerPage}
              totalRows={rowCountTotal}
            />
          </ExampleBlock>
        </Section>
      </Reveal>

      {/* ═══ WITH ROWS-PER-PAGE ═══ */}
      <Reveal>
        <Section title="With rows-per-page" description="Full pagination with a rows-per-page toggle. Changing rows per page resets to page 1 automatically.">
          <ExampleBlock>
            <Pagination
              page={rppPage}
              totalPages={rppTotalPages}
              onPageChange={setRppPage}
              rowsPerPage={rppRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
              onRowsPerPageChange={setRppRowsPerPage}
              totalRows={rppTotalRows}
            />
          </ExampleBlock>
        </Section>
      </Reveal>

      {/* ═══ SIZES ═══ */}
      <Reveal>
        <Section title="Sizes" description="Two sizes for different density contexts. xs for compact tables, sm (default) for standard layouts.">
          <div className="flex flex-col gap-6">
            <ExampleBlock label="xs" description="Compact — for dense data tables and tight layouts.">
              <Pagination
                page={xsPage}
                totalPages={12}
                onPageChange={setXsPage}
                size="xs"
              />
            </ExampleBlock>
            <ExampleBlock label="sm (default)" description="Standard — the default size for most use cases.">
              <Pagination
                page={smPage}
                totalPages={12}
                onPageChange={setSmPage}
                size="sm"
              />
            </ExampleBlock>
          </div>
        </Section>
      </Reveal>

      {/* ═══ FEW PAGES ═══ */}
      <Reveal>
        <Section title="Few pages" description="With 3 pages or fewer, no ellipsis appears and first/last buttons are hidden automatically.">
          <ExampleBlock>
            <Pagination
              page={fewPage}
              totalPages={3}
              onPageChange={setFewPage}
            />
          </ExampleBlock>
        </Section>
      </Reveal>

      {/* ═══ MANY PAGES ═══ */}
      <Reveal>
        <Section title="Many pages" description="With 50 pages, ellipsis collapses the range and first/last buttons appear for quick jumps.">
          <ExampleBlock>
            <Pagination
              page={manyPage}
              totalPages={50}
              onPageChange={setManyPage}
              showFirstLast
            />
          </ExampleBlock>
        </Section>
      </Reveal>

      {/* ═══ USAGE ═══ */}
      <Reveal>
        <Section title="Usage">
          <CodeBlock label="Import and use">
{`import { Pagination } from '../components/Pagination';

// Basic
const [page, setPage] = useState(1);

<Pagination
  page={page}
  totalPages={12}
  onPageChange={setPage}
/>

// With rows-per-page and row count
const [page, setPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(25);
const totalRows = 487;
const totalPages = Math.ceil(totalRows / rowsPerPage);

<Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  rowsPerPage={rowsPerPage}
  rowsPerPageOptions={[10, 25, 50, 100]}
  onRowsPerPageChange={setRowsPerPage}
  totalRows={totalRows}
/>`}
          </CodeBlock>
        </Section>
      </Reveal>
    </>
  );
}
