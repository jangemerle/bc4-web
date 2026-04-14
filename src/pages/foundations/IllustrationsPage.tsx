/**
 * IllustrationsPage — Foundations catalog of all available illustrations.
 *
 * Browsable grid with animated GIF toggle, search/filter, and copy-friendly
 * component snippets. This is the dev-facing "what's available" page.
 * The Philosophy → Illustration page covers the editorial "how to use" guidelines.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Play, Grid2X2, List, GalleryHorizontalEnd, BookOpen } from 'lucide-react';
import { Illustration } from '../../components/Illustration';
import { SearchInput } from '../../components/SearchInput';
import { Button } from '../../components/Button';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';
import { spring } from '../../tokens/motion';

// ─── Catalog data ─────────────────────────────────────────────────────────────

interface CatalogEntry {
  file: string;
  name: string;
  tags: string[];
  context: string;
  animated: boolean;
}

const catalog: CatalogEntry[] = [
  {
    file: 'building-blocks-assembled-creative-project-planning-finding-solutions-and-fixing-problems',
    name: 'Building Blocks',
    tags: ['build', 'create', 'planning', 'solution', 'project', 'blocks'],
    context: 'Project planning, creative process, assembling components',
    animated: true,
  },
  {
    file: 'checklist-with-all-tasks-marked-complete-productivity-and-goal-achievement',
    name: 'Checklist Complete',
    tags: ['checklist', 'tasks', 'complete', 'done', 'productivity', 'goal'],
    context: 'Task completion, productivity features, all-done states',
    animated: true,
  },
  {
    file: 'delivering-or-sending-a-letter-email-that-is-a-flying-hot-air-balloon-2',
    name: 'Hot Air Balloon Letter',
    tags: ['email', 'letter', 'send', 'deliver', 'balloon', 'fly'],
    context: 'Email delivery, sending messages, newsletter features',
    animated: false,
  },
  {
    file: 'envelope',
    name: 'Envelope',
    tags: ['email', 'message', 'mail', 'notification', 'inbox', 'verify'],
    context: 'Email features, messaging, contact forms, email verification',
    animated: true,
  },
  {
    file: 'eyes-following-star-goal-tracking-and-achievement-focus-trend-monitoring-and-analysis',
    name: 'Eyes Following Star',
    tags: ['goal', 'track', 'achievement', 'focus', 'star', 'trend'],
    context: 'Goal tracking, analytics, trend monitoring',
    animated: true,
  },
  {
    file: 'finishing-a-puzzle-brainstorm-coming-up-with-the-ideas-working-on-a-project-or-solutions-to-a-problem',
    name: 'Finishing Puzzle',
    tags: ['puzzle', 'brainstorm', 'idea', 'solution', 'project', 'think'],
    context: 'Brainstorming, idea generation, problem-solving',
    animated: true,
  },
  {
    file: 'hand-drawn-circle-avatars-outline-minimalist-portraits',
    name: 'Circle Avatars',
    tags: ['avatar', 'portrait', 'user', 'profile', 'people', 'team'],
    context: 'User profiles, team pages, avatar placeholders',
    animated: true,
  },
  {
    file: 'hand-drawn-high-five-gesture-celebrating-achievement-peer-encouragement-and-recognition-1',
    name: 'High Five',
    tags: ['celebrate', 'achievement', 'high-five', 'encouragement', 'success'],
    context: 'Success celebrations, team achievements, peer recognition',
    animated: true,
  },
  {
    file: 'hand-flipping-through-documents-contract-analysis-or-paperwork-review',
    name: 'Flipping Documents',
    tags: ['document', 'contract', 'review', 'paperwork', 'analysis'],
    context: 'Document review, contract analysis, browsing content',
    animated: true,
  },
  {
    file: 'hand-walking-on-analog-clock-time-management-planning-tasks-and-doing-work-on-time',
    name: 'Walking on Clock',
    tags: ['time', 'clock', 'management', 'planning', 'schedule', 'deadline'],
    context: 'Time management, scheduling, deadlines',
    animated: true,
  },
  {
    file: 'megaphone-with-social-media-reactions-digital-marketing-and-online-promotion',
    name: 'Megaphone Reactions',
    tags: ['megaphone', 'social', 'marketing', 'announcement', 'broadcast'],
    context: 'Announcements, social features, marketing pages',
    animated: true,
  },
  {
    file: 'number-one-trophy-cup-achievement-and-success-award-celebration-and-leadership-motivation',
    name: 'Trophy Cup',
    tags: ['trophy', 'award', 'achievement', 'success', 'winner', 'first'],
    context: 'Achievements, leaderboards, awards, gamification',
    animated: true,
  },
  {
    file: 'open-file-cabinet-with-drawers-data-storage-and-document-organization',
    name: 'File Cabinet',
    tags: ['file', 'cabinet', 'storage', 'data', 'organize', 'archive'],
    context: 'File management, data storage, document organization',
    animated: true,
  },
  {
    file: 'open-gift-box-with-confetti-burst-celebration-and-surprise-event',
    name: 'Gift Box Confetti',
    tags: ['gift', 'confetti', 'celebration', 'surprise', 'reward'],
    context: 'Rewards, surprise reveals, celebration moments',
    animated: true,
  },
  {
    file: 'open-treasure-chest-with-sparkles-reward-or-achievement-unlocked',
    name: 'Treasure Chest',
    tags: ['treasure', 'chest', 'reward', 'achievement', 'unlock', 'sparkle'],
    context: 'Achievement unlocked, reward systems, premium content',
    animated: true,
  },
  {
    file: 'outstretched-hand-holding-key-access-or-security-concept',
    name: 'Hand Holding Key',
    tags: ['key', 'access', 'security', 'unlock', 'permission', 'auth'],
    context: 'Authentication, access control, security features',
    animated: true,
  },
  {
    file: 'people-facing-each-other-and-talking-mental-health-counseling-session',
    name: 'People Talking',
    tags: ['people', 'talk', 'conversation', 'meeting', 'discuss', 'chat'],
    context: 'Conversations, meetings, collaboration, chat',
    animated: true,
  },
  {
    file: 'person-looking-at-the-phone-scrolling-living-in-a-cyber-space-digital-immersion-and-screen-time',
    name: 'Person Scrolling Phone',
    tags: ['phone', 'scroll', 'mobile', 'digital', 'browse', 'app'],
    context: 'Mobile experience, app browsing, digital engagement',
    animated: true,
  },
  {
    file: 'person-looking-through-a-magnifying-glass-to-find-information-searching-for-something',
    name: 'Magnifying Glass Search',
    tags: ['search', 'find', 'magnifying', 'glass', 'discover', 'explore'],
    context: 'Search features, discovery, no-results states',
    animated: true,
  },
  {
    file: 'person-with-tangled-thoughts-problem-solving-and-brainstorming',
    name: 'Tangled Thoughts',
    tags: ['think', 'thought', 'problem', 'brainstorm', 'confused'],
    context: 'Complex problems, brainstorming, confusion, error states',
    animated: true,
  },
  {
    file: 'simple-flower-in-hand-mental-health-support-and-encouragement-wellness-and-emotional-care-concept',
    name: 'Flower in Hand',
    tags: ['flower', 'care', 'support', 'wellness', 'encouragement'],
    context: 'Wellness features, support pages, encouragement',
    animated: true,
  },
  {
    file: 'simple-hand-drawn-handshake-business-agreement-and-partnership-successful-deal-and-cooperation-1',
    name: 'Handshake',
    tags: ['handshake', 'agreement', 'partnership', 'deal', 'welcome'],
    context: 'Partnerships, agreements, onboarding welcome',
    animated: true,
  },
  {
    file: 'success-finishing-a-project-reaching-a-top-of-a-mountain-and-putting-a-flag',
    name: 'Mountain Flag',
    tags: ['success', 'finish', 'project', 'mountain', 'flag', 'milestone'],
    context: 'Project completion, milestones, success states',
    animated: true,
  },
  {
    file: 'walking-up-the-stairs-climbing-to-success-personal-development-and-progress',
    name: 'Walking Up Stairs',
    tags: ['stairs', 'climb', 'success', 'progress', 'loading', 'growth'],
    context: 'Loading states, progress indicators, onboarding flows',
    animated: true,
  },
];

// ─── IllustrationCard ─────────────────────────────────────────────────────────

function IllustrationCard({ entry }: { entry: CatalogEntry }) {
  const [hovering, setHovering] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = `<Illustration name="${entry.file}" width={200}${entry.animated ? ' animated' : ''} />`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Animated illustrations play on hover
  const isPlaying = entry.animated && hovering;

  return (
    <motion.div
      className="rounded-lg overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.default}
    >
      {/* Preview area — hover to play animated illustrations */}
      <div
        className="relative flex items-center justify-center p-6"
        style={{
          backgroundColor: 'var(--color-bg)',
          minHeight: 180,
          cursor: entry.animated ? 'pointer' : undefined,
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Illustration
          name={entry.file}
          width={200}
          animated={entry.animated}
          autoplay={isPlaying}
          alt={entry.name}
          style={{ width: 140, height: 'auto' }}
        />

        {/* Small play icon in corner — indicates animation is available */}
        {entry.animated && (
          <div
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center pointer-events-none"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-on-surface-subtle-1)',
              opacity: isPlaying ? 0.4 : 0.8,
              transition: 'opacity 0.15s ease',
            }}
            aria-hidden="true"
          >
            <Play size={10} fill="currentColor" />
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-sans text-sm font-bold leading-tight"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {entry.name}
          </h3>

          {/* Copy snippet button */}
          <Button
            variant={copied ? 'success' : 'link'}
            size="xs"
            iconOnly={copied ? Check : Copy}
            aria-label="Copy component snippet"
            onClick={handleCopy}
          />
        </div>

        <p
          className="font-sans text-xs leading-relaxed"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          {entry.context}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          {entry.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="font-mono text-2xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-on-surface-subtle-1)',
              }}
            >
              {tag}
            </span>
          ))}
          {entry.animated && (
            <span
              className="font-mono text-2xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--color-primary-1-alpha-10, rgba(59,130,246,0.1))',
                color: 'var(--color-primary-1)',
              }}
            >
              animated
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IllustrationsPage() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterAnimated, setFilterAnimated] = useState(false);
  const sectionNav = useSectionNav(['gallery', 'usage'] as const);

  const filtered = useMemo(() => {
    let results = catalog;
    if (filterAnimated) {
      results = results.filter((e) => e.animated);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.tags.some((t) => t.includes(q)) ||
          e.context.toLowerCase().includes(q),
      );
    }
    return results;
  }, [query, filterAnimated]);

  return (
    <>
      <PageHero
        title="Illustrations"
        subtitle={`${catalog.length} illustrations that know their place in the hierarchy`}
        description="Not every empty state deserves a full illustration. Not every transition needs just a spinner. The catalog below is Tier 2 — spot illustrations for moments of pause. Hand-drawn, recolored to fit, ready at the right size."
      />

      <FloatingSectionNav
        items={[
          { value: 'gallery', label: 'Gallery', icon: GalleryHorizontalEnd },
          { value: 'usage', label: 'Usage', icon: BookOpen },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      {/* ══ GALLERY ══════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('gallery')} className="scroll-mt-8">
        <div className="mb-16">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            GALLERY
          </h2>
          <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Hand-drawn watercolors with personality. Each illustration is tagged, searchable, and ready to drop into any empty state, onboarding flow, or celebration moment.
          </p>
        </div>

      {/* ── Search + filters ─────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-8">
        {/* Search — using Kvalt SearchInput */}
        <div className="flex-1">
          <SearchInput
            placeholder="Search by name, tag, or context…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            size="md"
          />
        </div>

        {/* Animated filter */}
        <Button
          variant={filterAnimated ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilterAnimated((f) => !f)}
        >
          Animated only
        </Button>

        {/* View toggle */}
        <div className="flex gap-1">
          <Button
            variant={view === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            iconOnly={Grid2X2}
            aria-label="Grid view"
            onClick={() => setView('grid')}
          />
          <Button
            variant={view === 'list' ? 'primary' : 'secondary'}
            size="sm"
            iconOnly={List}
            aria-label="List view"
            onClick={() => setView('list')}
          />
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────── */}
      <p
        className="font-sans text-sm font-medium mb-6"
        style={{ color: 'var(--color-on-surface-subtle-1)' }}
      >
        {filtered.length === catalog.length
          ? `${catalog.length} illustrations`
          : `${filtered.length} of ${catalog.length} illustrations`}
      </p>

      {/* ── Grid view ────────────────────────────────────────────── */}
      {view === 'grid' && (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((entry) => (
              <IllustrationCard key={entry.file} entry={entry} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* ── List view ────────────────────────────────────────────── */}
      {view === 'list' && (
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          {filtered.map((entry, i) => (
            <ListRow key={entry.file} entry={entry} isEven={i % 2 === 0} />
          ))}
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Illustration
            name="person-looking-through-a-magnifying-glass-to-find-information-searching-for-something"
            width={200}
            animated
            autoplay
            style={{ width: 120, height: 'auto' }}
          />
          <p
            className="font-sans text-md font-medium"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            No illustrations match "{query}"
          </p>
        </div>
      )}

      </div>{/* end gallery */}

      {/* ══ USAGE ════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('usage')} className="scroll-mt-8">
        <div className="mb-16 mt-24">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            USAGE
          </h2>
          <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            How to bring them into your code. Component API, optimization pipeline, and the Sharp-based processing that keeps every illustration crisp at any size.
          </p>
        </div>

      <SectionTitle>Usage</SectionTitle>
      <Card>
        <Spec>Import the Illustration component and pass the file name (without extension)</Spec>
        <div
          className="rounded-lg p-5 font-mono text-sm leading-relaxed overflow-x-auto"
          style={{
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-on-surface-subtle-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <code>{`import { Illustration } from '../components/Illustration';

// Static
<Illustration name="envelope" width={200} />

// Animated — controlled externally (e.g. hover-to-play)
<Illustration name="envelope" width={200} animated autoplay={isHovering} />

// Always animating
<Illustration name="envelope" width={200} animated autoplay />

// Eager loading (above-fold)
<Illustration name="envelope" width={200} loading="eager" />`}</code>
        </div>
      </Card>

      {/* ── Optimization details ─────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Optimization pipeline</SectionTitle>
      <Card>
        <Spec>All illustrations are processed through the Kvalt image optimizer before use</Spec>
        <div className="grid grid-cols-2 gap-6">
          {[
            {
              label: 'Resize',
              value: '400px wide',
              detail: '200px CSS @2x retina',
            },
            {
              label: 'Formats',
              value: 'PNG + WebP + GIF',
              detail: '<picture> with WebP fallback',
            },
            {
              label: 'Recolor',
              value: 'Hue -154° / Sat 60%',
              detail: 'Kvalt brand palette applied',
            },
            {
              label: 'Compression',
              value: '~98% reduction',
              detail: '409 MB → 7.8 MB total',
            },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 items-start">
              <span
                className="font-mono text-xs font-bold px-2 py-1 rounded shrink-0"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-on-surface)',
                }}
              >
                {item.label}
              </span>
              <div>
                <p
                  className="font-sans text-sm font-semibold"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {item.value}
                </p>
                <p
                  className="font-sans text-xs"
                  style={{ color: 'var(--color-on-surface-subtle-1)' }}
                >
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      </div>{/* end usage */}
    </>
  );
}

// ─── List row component ───────────────────────────────────────────────────────

function ListRow({
  entry,
  isEven,
}: {
  entry: CatalogEntry;
  isEven: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const snippet = `<Illustration name="${entry.file}" width={200}${entry.animated ? ' animated' : ''} />`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="flex items-center gap-5 px-5 py-3"
      style={{
        backgroundColor: isEven
          ? 'var(--color-surface-1)'
          : 'transparent',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="w-14 h-14 shrink-0 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <Illustration name={entry.file} width={200} alt={entry.name} style={{ width: 28, height: 'auto' }} />
      </div>

      {/* Name + context */}
      <div className="flex-1 min-w-0">
        <p
          className="font-sans text-sm font-bold truncate"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {entry.name}
        </p>
        <p
          className="font-sans text-xs truncate"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          {entry.context}
        </p>
      </div>

      {/* Tags */}
      <div className="flex gap-1 shrink-0">
        {entry.animated && (
          <span
            className="font-mono text-2xs px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--color-primary-1-alpha-10, rgba(59,130,246,0.1))',
              color: 'var(--color-primary-1)',
            }}
          >
            GIF
          </span>
        )}
      </div>

      {/* Copy */}
      <Button
        variant={copied ? 'success' : 'link'}
        size="xs"
        iconOnly={copied ? Check : Copy}
        aria-label="Copy component snippet"
        onClick={handleCopy}
      />
    </div>
  );
}
