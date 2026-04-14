import { Settings, Share2, Trash2, Info, Bold, Italic, Underline, AlignLeft, MessageSquare, Sparkles } from 'lucide-react';
import { Tooltip } from '../../components/Tooltip';
import { Button } from '../../components/Button';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { useSectionNav } from '../../hooks/useSectionNav';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function TooltipPage() {
  const sectionNav = useSectionNav(['plain', 'rich'] as const);

  return (
    <section className="mb-24 relative">
      <PageHero
        title="Tooltip"
        subtitle="The whisper next to the button"
        description="Contextual help that appears on hover or focus. Plain tooltips label icon buttons. Rich tooltips explain features and offer actions. Never hide critical information in a tooltip — if it matters, put it inline."
      />

      <TokenChips tokens={{ Types: ['plain', 'rich'], Sides: ['top', 'bottom', 'left', 'right'] }} />

      <FloatingSectionNav
        items={[
          { value: 'plain', label: 'Plain', icon: MessageSquare },
          { value: 'rich', label: 'Rich', icon: Sparkles },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      {/* ══ PLAIN ═══════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('plain')} className="scroll-mt-[120px]">

        <div className="mb-16">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            PLAIN
          </h2>
          <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Brief labels for unlabeled elements. Dark inverted surface, text only, appears on hover or focus. The primary use case is icon-only buttons — if the button already has a label, you don't need a tooltip.
          </p>
        </div>

        <SectionTitle>Basic usage</SectionTitle>
        <Card>
          <Spec>Dark inverted surface · text only · hover/focus triggered · 300ms delay</Spec>
          <div className="flex items-center gap-4">
            <Tooltip content="Settings">
              <Button variant="secondary" iconOnly={Settings} aria-label="Settings" />
            </Tooltip>
            <Tooltip content="Share">
              <Button variant="secondary" iconOnly={Share2} aria-label="Share" />
            </Tooltip>
            <Tooltip content="Delete">
              <Button variant="danger-subtle" iconOnly={Trash2} aria-label="Delete" />
            </Tooltip>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Icon toolbar</SectionTitle>
        <Card>
          <Spec>The primary use case — labeling icon-only buttons · warm-up skips delay between items</Spec>
          <div
            className="inline-flex items-center gap-1 p-1 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <Tooltip content="Bold">
              <Button variant="secondary" size="sm" iconOnly={Bold} aria-label="Bold" />
            </Tooltip>
            <Tooltip content="Italic">
              <Button variant="secondary" size="sm" iconOnly={Italic} aria-label="Italic" />
            </Tooltip>
            <Tooltip content="Underline">
              <Button variant="secondary" size="sm" iconOnly={Underline} aria-label="Underline" />
            </Tooltip>
            <Tooltip content="Align left">
              <Button variant="secondary" size="sm" iconOnly={AlignLeft} aria-label="Align left" />
            </Tooltip>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Placement</SectionTitle>
        <Card>
          <Spec>4 sides · auto-flips when hitting viewport edge · 8px offset</Spec>
          <div className="flex items-center gap-6 py-8 justify-center">
            <Tooltip content="Top (default)" side="top">
              <Button variant="secondary" size="sm">Top</Button>
            </Tooltip>
            <Tooltip content="Bottom" side="bottom">
              <Button variant="secondary" size="sm">Bottom</Button>
            </Tooltip>
            <Tooltip content="Left" side="left">
              <Button variant="secondary" size="sm">Left</Button>
            </Tooltip>
            <Tooltip content="Right" side="right">
              <Button variant="secondary" size="sm">Right</Button>
            </Tooltip>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Alignment</SectionTitle>
        <Card>
          <Spec>start · center (default) · end — along the cross axis</Spec>
          <div className="flex items-center gap-6 py-4 justify-center">
            <Tooltip content="Aligned start" align="start">
              <Button variant="secondary" size="sm">Start</Button>
            </Tooltip>
            <Tooltip content="Aligned center" align="center">
              <Button variant="secondary" size="sm">Center</Button>
            </Tooltip>
            <Tooltip content="Aligned end" align="end">
              <Button variant="secondary" size="sm">End</Button>
            </Tooltip>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Text wrapping</SectionTitle>
        <Card>
          <Spec>Max-width 240px · text wraps naturally at boundary</Spec>
          <div className="flex items-center gap-6 py-4">
            <Tooltip content="This is a longer tooltip that will wrap to multiple lines at the max width boundary">
              <Button variant="secondary" size="sm">Long text</Button>
            </Tooltip>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Disabled</SectionTitle>
        <Card>
          <Spec>disabled prop prevents tooltip from appearing</Spec>
          <div className="flex items-center gap-6 py-4">
            <Tooltip content="You won't see this" disabled>
              <Button variant="secondary" size="sm">Disabled tooltip</Button>
            </Tooltip>
          </div>
        </Card>

      </div>

      {/* ══ RICH ════════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('rich')} className="scroll-mt-[120px] mt-24">

        <div className="mb-16">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            RICH
          </h2>
          <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Longer explanations with optional title and action buttons. Light surface with border and shadow. Use for feature announcements, contextual help, or anything that needs more than two words.
          </p>
        </div>

        <SectionTitle>Basic usage</SectionTitle>
        <Card>
          <Spec>Light surface · title + description · hover triggered · border + shadow</Spec>
          <div className="flex items-center gap-6 py-4">
            <Tooltip
              rich
              title="Share with team"
              content="Send this document directly to your team members or create a public link anyone can access."
              side="bottom"
            >
              <Button variant="secondary" iconLeft={Share2}>Share</Button>
            </Tooltip>

            <Tooltip
              rich
              content="This action cannot be undone. The item will be permanently removed."
              side="bottom"
            >
              <Button variant="danger-subtle" iconLeft={Trash2}>Delete</Button>
            </Tooltip>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>With actions</SectionTitle>
        <Card>
          <Spec>Up to 2 text buttons · primary color · brief labels</Spec>
          <div className="flex items-center gap-6 py-4">
            <Tooltip
              rich
              title="New sharing options"
              content="Share directly with teams or create a shareable public link."
              actions={[
                { label: 'Learn more', onClick: () => {} },
                { label: 'Dismiss', onClick: () => {} },
              ]}
              side="bottom"
            >
              <Button variant="secondary" iconLeft={Info}>Feature info</Button>
            </Tooltip>

            <Tooltip
              rich
              content="Your trial ends in 3 days. Upgrade to keep all features."
              actions={[
                { label: 'Upgrade', onClick: () => {} },
              ]}
              side="bottom"
            >
              <Button variant="secondary" iconLeft={Sparkles}>Trial notice</Button>
            </Tooltip>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Persistent (click-triggered)</SectionTitle>
        <Card>
          <Spec>Click to open · stays until dismissed or click outside · for onboarding callouts</Spec>
          <div className="flex items-center gap-6 py-4">
            <Tooltip
              rich
              persistent
              title="What's new"
              content="We've added team sharing. You can now invite collaborators directly from this menu."
              actions={[
                { label: 'Got it', onClick: () => {} },
              ]}
              side="bottom"
            >
              <Button variant="secondary" iconLeft={Info}>Click me</Button>
            </Tooltip>
          </div>
        </Card>

        <div className="mt-12" />
        <SectionTitle>Text wrapping</SectionTitle>
        <Card>
          <Spec>Max-width 320px · text wraps naturally at boundary</Spec>
          <div className="flex items-center gap-6 py-4">
            <Tooltip
              rich
              title="Extended description"
              content="This rich tooltip contains a longer description that demonstrates how text wrapping works within the 320px max-width container. The content flows naturally."
              side="bottom"
            >
              <Button variant="secondary" size="sm">Long text</Button>
            </Tooltip>
          </div>
        </Card>

      </div>

      {/* ── Writing rules (always visible) ─────────────────────────────── */}

      <Section title="Writing rules" level="minor">
        <div className="flex flex-col gap-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Label, don't repeat.</strong> If the button already says "Settings", don't tooltip "Settings". Explain what it does: "Manage workspace preferences".</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Plain = the what.</strong> "Bold", "Settings", "Delete". One or two words.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Rich = the why.</strong> Explain the value: "Share directly with teams or create a public link." Not just "Sharing options".</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Never essential.</strong> If the user can't complete their task without reading the tooltip, the information belongs inline.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Sentence case.</strong> "Learn more", not "Learn More".</p>
        </div>
      </Section>
    </section>
  );
}
