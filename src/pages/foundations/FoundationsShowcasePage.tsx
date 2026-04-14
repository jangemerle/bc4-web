import { PageHero } from '../../layouts/PageHero';
import { FoundationsBentoGrid } from '../../components/FoundationsBentoGrid';

interface FoundationsShowcasePageProps {
  onNavigate?: (pageId: string) => void;
}

export default function FoundationsShowcasePage({ onNavigate }: FoundationsShowcasePageProps) {
  const handleNavigate = (pageId: string) => {
    // Use query param navigation (Kvalt DS pattern)
    if (onNavigate) {
      onNavigate(pageId);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set('page', pageId);
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section className="mb-24">
      <PageHero
        title="Foundations"
        subtitle="The building blocks"
        description="Six interactive pillars that underpin every component in the system. Each card is a live playground — hover, click, and explore."
      />

      <div className="mt-16">
        <FoundationsBentoGrid onNavigate={handleNavigate} />
      </div>
    </section>
  );
}
