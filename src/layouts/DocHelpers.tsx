/**
 * DocHelpers — shared presentational helpers used across documentation pages.
 * Extracted from App.tsx to enable page splitting.
 */

import { ExternalLink } from 'lucide-react';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { Typo } from '../components/Typo';

/** Reusable section card */
export function Card({ children, bg }: { children: React.ReactNode; bg?: 'surface' | 'bg' }) {
  return (
    <div
      className="rounded-lg px-10 py-10"
      style={{
        backgroundColor: bg === 'bg' ? 'var(--color-bg)' : 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, typo = true }: { children: React.ReactNode; typo?: boolean }) {
  return (
    <h2
      className="font-display text-headline-l font-bold mb-8"
      style={{ color: 'var(--color-on-surface)' }}
    >
      {typo ? <Typo>{children}</Typo> : children}
    </h2>
  );
}

export function Spec({ children, typo = true }: { children: React.ReactNode; typo?: boolean }) {
  return (
    <p className="font-sans text-md font-semibold mb-6" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
      {typo ? <Typo>{children}</Typo> : children}
    </p>
  );
}

export function PageOpenButton({ pageId }: { pageId: string }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      iconLeft={ExternalLink}
      onClick={() => window.open(`/?standalone=${pageId}`, '_blank')}
    >
      Open in new tab
    </Button>
  );
}

export function TokenChips({ tokens }: { tokens: Record<string, string[]> }) {
  return (
    <div className="flex flex-col gap-3 mb-16">
      {Object.entries(tokens).map(([label, values]) => (
        <div key={label} className="flex items-center gap-2 flex-wrap">
          <span className="font-sans text-sm font-semibold w-[72px] shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{label}</span>
          {values.map(v => <Chip key={v} size="sm" clickable={false}>{v}</Chip>)}
        </div>
      ))}
    </div>
  );
}
