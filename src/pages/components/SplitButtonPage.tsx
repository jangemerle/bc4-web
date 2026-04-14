import { useState, useRef } from 'react';
import { Plus, Download, Play, Settings, Save, FileUp, Copy, FileSpreadsheet, Sliders, Bell, User } from 'lucide-react';
import { SplitButton } from '../../components/SplitButton';
import { DropdownMenu, DropdownMenuItem, DropdownMenuDivider } from '../../components/DropdownMenu';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { ExampleBlock } from '../../layouts/ExampleBlock';
import { CodeBlock } from '../../layouts/CodeBlock';

// ─── Reusable split + dropdown wrapper ───────────────────────────────────────

function SplitWithMenu({
  children,
  variant,
  size,
  iconLeft,
  menuContent,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: typeof Plus;
  menuContent: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <SplitButton
        variant={variant}
        size={size}
        iconLeft={iconLeft}
        chevronOpen={open}
        onClick={() => {}}
        onChevronClick={() => setOpen((o) => !o)}
      >
        {children}
      </SplitButton>
      <DropdownMenu
        open={open}
        onClose={close}
        triggerRef={containerRef}
        className="top-full mt-2 left-0"
        width="200px"
      >
        {menuContent(close)}
      </DropdownMenu>
    </div>
  );
}

// ─── Menu content factories ──────────────────────────────────────────────────

const createMenu = (close: () => void) => (
  <>
    <DropdownMenuItem icon={Plus} onClick={close}>Blank project</DropdownMenuItem>
    <DropdownMenuItem icon={Copy} onClick={close}>From template</DropdownMenuItem>
    <DropdownMenuDivider />
    <DropdownMenuItem icon={FileUp} onClick={close}>Import from file</DropdownMenuItem>
  </>
);

const exportMenu = (close: () => void) => (
  <>
    <DropdownMenuItem icon={FileSpreadsheet} onClick={close}>Export as CSV</DropdownMenuItem>
    <DropdownMenuItem icon={FileUp} onClick={close}>Export as Excel</DropdownMenuItem>
    <DropdownMenuItem icon={Copy} onClick={close}>Copy to clipboard</DropdownMenuItem>
  </>
);

const settingsMenu = (close: () => void) => (
  <>
    <DropdownMenuItem icon={Sliders} onClick={close}>Preferences</DropdownMenuItem>
    <DropdownMenuItem icon={Bell} onClick={close}>Notifications</DropdownMenuItem>
    <DropdownMenuItem icon={User} onClick={close}>Account</DropdownMenuItem>
  </>
);

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SplitButtonPage() {
  return (
    <>
      <PageHero
        title="Split button"
        subtitle="Two actions, one shape. The primary action fires on click. The chevron opens a menu of alternatives."
      />

      {/* ══ VARIANTS ═════════════════════════════════════════════════════════ */}
      <Section title="Variants">
        <ExampleBlock label="primary / secondary / elevated" centered>
          <div className="flex flex-wrap items-center gap-6">
            <SplitWithMenu variant="primary" iconLeft={Plus} menuContent={createMenu}>
              Create
            </SplitWithMenu>
            <SplitWithMenu variant="secondary" iconLeft={Download} menuContent={exportMenu}>
              Export
            </SplitWithMenu>
            <SplitWithMenu variant="elevated" iconLeft={Settings} menuContent={settingsMenu}>
              Settings
            </SplitWithMenu>
          </div>
        </ExampleBlock>
      </Section>

      {/* ══ SIZES ════════════════════════════════════════════════════════════ */}
      <Section title="Sizes">
        <ExampleBlock label="sm / md / lg" centered>
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col items-center gap-3">
              <SplitWithMenu size="sm" iconLeft={Plus} menuContent={createMenu}>Create</SplitWithMenu>
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>sm</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <SplitWithMenu size="md" iconLeft={Plus} menuContent={createMenu}>Create</SplitWithMenu>
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>md</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <SplitWithMenu size="lg" iconLeft={Plus} menuContent={createMenu}>Create</SplitWithMenu>
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>lg</span>
            </div>
          </div>
        </ExampleBlock>
      </Section>

      {/* ══ WITH ICON ════════════════════════════════════════════════════════ */}
      <Section title="With icon">
        <ExampleBlock label="iconLeft paired with contextual labels" centered>
          <div className="flex flex-wrap items-center gap-6">
            <SplitWithMenu iconLeft={Plus} menuContent={createMenu}>Create</SplitWithMenu>
            <SplitWithMenu variant="secondary" iconLeft={Download} menuContent={exportMenu}>Export</SplitWithMenu>
            <SplitWithMenu variant="elevated" iconLeft={Play} menuContent={createMenu}>Start</SplitWithMenu>
          </div>
        </ExampleBlock>
      </Section>

      {/* ══ DISABLED ═════════════════════════════════════════════════════════ */}
      <Section title="Disabled">
        <ExampleBlock label="disabled across all variants" centered>
          <div className="flex flex-wrap items-center gap-6">
            <SplitButton variant="primary" iconLeft={Save} disabled>Save</SplitButton>
            <SplitButton variant="secondary" iconLeft={Settings} disabled>Options</SplitButton>
            <SplitButton variant="elevated" iconLeft={Download} disabled>Export</SplitButton>
          </div>
        </ExampleBlock>
      </Section>

      {/* ══ USAGE ════════════════════════════════════════════════════════════ */}
      <Section title="Usage">
        <CodeBlock label="Compose with DropdownMenu">{`import { SplitButton } from '@kvalt/ds';
import { DropdownMenu, DropdownMenuItem } from '@kvalt/ds';
import { Plus, Copy, FileUp } from 'lucide-react';

const [open, setOpen] = useState(false);

<div className="relative">
  <SplitButton
    iconLeft={Plus}
    chevronOpen={open}
    onClick={() => createBlank()}
    onChevronClick={() => setOpen(!open)}
  >
    Create
  </SplitButton>
  <DropdownMenu open={open} onClose={() => setOpen(false)}>
    <DropdownMenuItem icon={Copy}>From template</DropdownMenuItem>
    <DropdownMenuItem icon={FileUp}>Import from file</DropdownMenuItem>
  </DropdownMenu>
</div>`}</CodeBlock>
      </Section>
    </>
  );
}
