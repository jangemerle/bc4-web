import { Link } from '../../components/Link';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function LinkPage() {
  return (
    <>
      <PageHero
        title="Link"
        subtitle="The honest way to say 'go there'"
        description="Inline text links for navigation. Always underlined, always an <a>. If it performs an action instead of navigating, use Button variant='link' instead. If it matters, it shouldn't be hidden behind a hover — put it inline."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'base', 'lg'], Variants: ['default', 'monochrome'], Props: ['external'] }} />

      {/* ── Default ────────────────────────────────────────────────────── */}

      <SectionTitle>Default</SectionTitle>
      <Card>
        <Spec>Blue (on-secondary-1) · always underlined · hover darkens · inherits parent size</Spec>
        <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
          Read our <Link href="#">motion guidelines</Link> before building any animation.
          The <Link href="#">token system</Link> handles all timing values automatically.
        </p>
      </Card>

      {/* ── Sizes ──────────────────────────────────────────────────────── */}

      <div className="mt-12" />
      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (12px) · md (14px) · base (16px) · lg (18px) — or inherit from parent</Spec>
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-6">
            <span className="w-12 font-mono text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>sm</span>
            <Link href="#" size="sm">Small link text</Link>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="w-12 font-mono text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>md</span>
            <Link href="#" size="md">Medium link text</Link>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="w-12 font-mono text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>base</span>
            <Link href="#" size="base">Base link text</Link>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="w-12 font-mono text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>lg</span>
            <Link href="#" size="lg">Large link text</Link>
          </div>
        </div>
      </Card>

      {/* ── Inline in different body sizes ─────────────────────────────── */}

      <div className="mt-12" />
      <SectionTitle>Inline in body text</SectionTitle>
      <Card>
        <Spec>No size prop — inherits font-size and line-height from parent paragraph</Spec>
        <div className="flex flex-col gap-6">
          <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>
            Body S (12px) — Components use <Link href="#">design tokens</Link> for all visual properties.
          </p>
          <p className="font-sans text-md" style={{ color: 'var(--color-on-surface)' }}>
            Body M (14px) — Check the <Link href="#">accessibility guidelines</Link> for contrast requirements.
          </p>
          <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
            Body L (16px) — The <Link href="#">character system</Link> lets you swap the entire visual personality.
          </p>
          <p className="font-sans text-lg" style={{ color: 'var(--color-on-surface)' }}>
            Body XL (18px) — Read the <Link href="#">motion philosophy</Link> before adding animations.
          </p>
        </div>
      </Card>

      {/* ── Monochrome ─────────────────────────────────────────────────── */}

      <div className="mt-12" />
      <SectionTitle>Monochrome</SectionTitle>
      <Card>
        <Spec>Inherits text color · underline-only differentiation · for dense text contexts</Spec>
        <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
          See the <Link href="#" monochrome>full changelog</Link> for details on what shipped
          in the <Link href="#" monochrome>latest release</Link>.
        </p>
        <div className="mt-4">
          <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Works in subtle text too — <Link href="#" monochrome>terms of service</Link> · <Link href="#" monochrome>privacy policy</Link>
          </p>
        </div>
      </Card>

      {/* ── External ───────────────────────────────────────────────────── */}

      <div className="mt-12" />
      <SectionTitle>External links</SectionTitle>
      <Card>
        <Spec>external prop adds target="_blank" rel="noopener noreferrer"</Spec>
        <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
          Built on <Link href="https://motion.dev" external>Motion</Link> for
          animations and <Link href="https://tailwindcss.com" external>Tailwind</Link> for styling.
        </p>
      </Card>

      {/* ── Writing rules ──────────────────────────────────────────────── */}

      <Section title="Usage rules" level="minor">
        <div className="flex flex-col gap-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Link = navigation.</strong> If clicking changes the URL, use Link. If it triggers an action (delete, toggle, submit), use Button variant="link".</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Always underlined.</strong> Underline is the universal link affordance. Don't remove it — WCAG requires non-color cues.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Descriptive text.</strong> "Read the motion guidelines" not "click here". Screen readers list links out of context.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>External = new tab.</strong> Always use the external prop for URLs leaving the app. Users expect same-domain links to stay in-tab.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Monochrome = dense text.</strong> Use when blue links would overwhelm — footer, legal text, dense reference lists.</p>
        </div>
      </Section>
    </>
  );
}
