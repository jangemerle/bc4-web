/**
 * HelloPage — landing page for the Kvalt Design System
 */

import { PageHero } from '../layouts/PageHero';
import { FoundationsBentoGrid } from '../components/FoundationsBentoGrid';

interface HelloPageProps {
  onNavigate?: (pageId: string) => void;
}

export default function HelloPage({ onNavigate }: HelloPageProps) {
  return (
    <section className="mb-24">
      <PageHero
        title="Kvalt means speed"
        subtitle="A design system that ships and doesn't apologise for it"
        description="Every token, component, and spring is calibrated. Pick a component, read the rules, build the thing. That's the whole pitch."
      />

      <p
        className="font-sans text-lg font-medium mb-12 max-w-[600px]"
        style={{ color: 'var(--color-on-surface-subtle-1)' }}
      >
        Opinionated by default. Overridable by request. Documented either way.
      </p>

      <div className="mt-16">
        <FoundationsBentoGrid onNavigate={onNavigate} />
      </div>
    </section>
  );
}
