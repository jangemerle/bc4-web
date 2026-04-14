import { useRef, useState, useEffect } from 'react';
import { Type, Heading, AlignLeft } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle } from '../../layouts/DocHelpers';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';
import { Tooltip } from '../../components/Tooltip';
import { useSectionNav } from '../../hooks/useSectionNav';

function TruncatedLabel({ className, style, children, tooltip }: {
  className: string;
  style: React.CSSProperties;
  children: string;
  tooltip: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Tooltip content={tooltip} disabled={!truncated}>
      <span ref={ref} className={className} style={style}>{children}</span>
    </Tooltip>
  );
}

const headlines = [
  { name: 'Headline 5XL', cls: 'text-headline-5xl', px: '80', rem: '5',     leading: '1.2' },
  { name: 'Headline 4XL', cls: 'text-headline-4xl', px: '64', rem: '4',     leading: '1.2' },
  { name: 'Headline 3XL', cls: 'text-headline-3xl', px: '52', rem: '3.25',  leading: '1.2' },
  { name: 'Headline 2XL', cls: 'text-headline-2xl', px: '42', rem: '2.625', leading: '1.2' },
  { name: 'Headline XL',  cls: 'text-headline-xl',  px: '36', rem: '2.25',  leading: '1.2' },
  { name: 'Headline L',   cls: 'text-headline-l',   px: '28', rem: '1.75',  leading: '1.2' },
  { name: 'Headline M',   cls: 'text-headline-m',   px: '24', rem: '1.5',   leading: '1.2' },
  { name: 'Headline S',   cls: 'text-headline-s',   px: '20', rem: '1.25',  leading: '1.5' },
];

const bodyStyles = [
  { label: 'Body XL', rows: [
    { name: 'Body text XL (Medium)',   cls: 'font-medium'  },
    { name: 'Body text XL (SemiBold)', cls: 'font-semibold' },
    { name: 'Body text XL (Bold)',     cls: 'font-bold'    },
  ], sizeCls: 'text-lg', px: '18', rem: '1.125', leading: '1.2' },
  { label: 'Body L', rows: [
    { name: 'Body text L (Medium)',   cls: 'font-medium'   },
    { name: 'Body text L (SemiBold)', cls: 'font-semibold' },
    { name: 'Body text L (Bold)',     cls: 'font-bold'     },
  ], sizeCls: 'text-base', px: '16', rem: '1', leading: '1.2' },
  { label: 'Body M', rows: [
    { name: 'Body text M (Medium)',   cls: 'font-medium'   },
    { name: 'Body text M (SemiBold)', cls: 'font-semibold' },
    { name: 'Body text M (Bold)',     cls: 'font-bold'     },
  ], sizeCls: 'text-md', px: '14', rem: '0.875', leading: '1.2' },
  { label: 'Body S', rows: [
    { name: 'Body text S (Medium)',   cls: 'font-medium'   },
    { name: 'Body text S (SemiBold)', cls: 'font-semibold' },
    { name: 'Body text S (Bold)',     cls: 'font-bold'     },
  ], sizeCls: 'text-sm', px: '12', rem: '0.75', leading: '1.2' },
  { label: 'Body XS', rows: [
    { name: 'Body text XS (Medium)',   cls: 'font-medium'   },
    { name: 'Body text XS (SemiBold)', cls: 'font-semibold' },
    { name: 'Body text XS (Bold)',     cls: 'font-bold'     },
  ], sizeCls: 'text-xs', px: '10', rem: '0.625', leading: '1.2' },
  { label: 'Body 2XS', rows: [
    { name: 'Body text 2XS (Medium)',   cls: 'font-medium'   },
    { name: 'Body text 2XS (SemiBold)', cls: 'font-semibold' },
  ], sizeCls: 'text-2xs', px: '8', rem: '0.5', leading: '1.2' },
];

export default function TypographyPage() {
  const sectionNav = useSectionNav(['family', 'headlines', 'body'] as const);

  return (
    <section className="mb-24">
      <PageHero
        title="Typography"
        subtitle="Two fonts with assigned jobs. Neither freelancing."
        description="Borna carries the structure. Inter does the work. Separated by purpose — display for hierarchy, body for everything a user actually reads."
      />

      <div
        className="w-full overflow-hidden mb-12 grid grid-cols-2"
        style={{ backgroundColor: 'var(--color-surface-1)', borderRadius: 'var(--radius-lg)' }}
      >
        {/* Borna */}
        <div
          className="flex flex-col justify-between p-12"
          style={{ borderRight: '1px solid var(--color-surface-3)' }}
        >
          <div className="flex flex-col gap-10">
            <span
              aria-hidden="true"
              className="font-display font-bold block"
              style={{
                fontSize: 'clamp(160px, 18vw, 280px)',
                lineHeight: 0.8,
                letterSpacing: '-0.04em',
                color: 'var(--color-on-surface)',
              }}
            >
              Aa
            </span>
            <p
              className="font-display font-bold leading-[1.05]"
              style={{ fontSize: 'clamp(52px, 6vw, 88px)', color: 'var(--color-on-surface)' }}
            >
              Borna for the bold headlines.
            </p>
          </div>
          <span
            className="font-mono text-xs mt-8 block"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            Borna — display
          </span>
        </div>

        {/* Inter */}
        <div className="flex flex-col justify-between p-12">
          <div className="flex flex-col gap-10">
            <span
              aria-hidden="true"
              className="font-sans font-medium block"
              style={{
                fontSize: 'clamp(160px, 18vw, 280px)',
                lineHeight: 0.8,
                letterSpacing: '-0.03em',
                color: 'var(--color-on-surface)',
              }}
            >
              Aa
            </span>
            <p
              className="font-sans font-medium leading-relaxed"
              style={{ fontSize: '18px', color: 'var(--color-on-surface)' }}
            >
              Inter for the details. The labels, the helper text, the error messages — every sentence a user reads while they're actually doing something. Legible at any weight, invisible when it's working.
            </p>
          </div>
          <span
            className="font-mono text-xs mt-8 block"
            style={{ color: 'var(--color-on-surface-subtle-2)' }}
          >
            Inter — body
          </span>
        </div>
      </div>

      <FloatingSectionNav
        items={[
          { value: 'family',    label: 'Family',    icon: Type     },
          { value: 'headlines', label: 'Headlines', icon: Heading  },
          { value: 'body',      label: 'Body',      icon: AlignLeft },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      {/* ══ FAMILY ═══════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('family')} className="scroll-mt-8">
        <div className="mb-16">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            FAMILY
          </h2>
        </div>

        <SectionTitle>Font family & Weights</SectionTitle>
        <Card>
          <div className="flex items-center gap-10 mb-8">
            <span className="font-sans text-headline-2xl font-medium w-32 shrink-0" style={{ color: 'var(--color-on-surface)' }}>Inter</span>
            <div className="w-px self-stretch" style={{ backgroundColor: 'var(--color-border)' }} />
            <span className="font-sans text-headline-s font-medium" style={{ color: 'var(--color-on-surface)' }}>Medium (500)</span>
            <span className="font-sans text-headline-s font-semibold" style={{ color: 'var(--color-on-surface)' }}>SemiBold (600)</span>
            <span className="font-sans text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>Bold (700)</span>
          </div>
          <div className="flex items-center gap-10">
            <span className="font-display text-headline-2xl font-bold w-32 shrink-0" style={{ color: 'var(--color-on-surface)' }}>Borna</span>
            <div className="w-px self-stretch" style={{ backgroundColor: 'var(--color-border)' }} />
            <span className="font-display text-headline-s font-medium" style={{ color: 'var(--color-on-surface)' }}>Medium (500)</span>
            <span className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>Bold (700)</span>
          </div>
        </Card>
      </div>

      {/* ══ HEADLINES ════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('headlines')} className="scroll-mt-8">
        <div className="mb-16 mt-24">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            HEADLINES
          </h2>
        </div>

        <SectionTitle>Headlines</SectionTitle>
        <Card>
          <div className="flex gap-6 items-center mb-4">
            <span className="font-sans text-base font-medium flex-1 min-w-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Style — Bold</span>
            <span className="font-sans text-base font-medium flex-1 min-w-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Style — Medium</span>
            <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>px</span>
            <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>rem</span>
            <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>lh</span>
          </div>
          {headlines.map((h, i) => (
            <div key={h.name}>
              <div className="flex gap-6 items-center py-4">
                <TruncatedLabel
                  className={`font-display ${h.cls} font-bold flex-1 min-w-0 truncate`}
                  style={{ color: 'var(--color-on-surface)' }}
                  tooltip={h.name}
                >{h.name}</TruncatedLabel>
                <TruncatedLabel
                  className={`font-display ${h.cls} font-medium flex-1 min-w-0 truncate`}
                  style={{ color: 'var(--color-on-surface)' }}
                  tooltip={h.name}
                >{h.name}</TruncatedLabel>
                <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface)' }}>{h.px}</span>
                <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface)' }}>{h.rem}</span>
                <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface)' }}>{h.leading}</span>
              </div>
              {i < headlines.length - 1 && <div className="divider" />}
            </div>
          ))}
        </Card>
      </div>

      {/* ══ BODY ═════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('body')} className="scroll-mt-8">
        <div className="mb-16 mt-24">
          <h2
            className="font-brand font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
          >
            BODY
          </h2>
        </div>

        <SectionTitle>Body text</SectionTitle>
        <Card>
          <div className="flex gap-6 items-center mb-4">
            <span className="font-sans text-base font-medium flex-1 min-w-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Style</span>
            <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>px</span>
            <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>rem</span>
            <span className="font-sans text-base font-medium w-12 text-right shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>lh</span>
          </div>
          {bodyStyles.map((group, gi) => (
            <div key={group.label}>
              <div className="flex gap-6 items-start py-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  {group.rows.map((row) => (
                    <span key={row.name} className={`font-sans ${group.sizeCls} ${row.cls}`} style={{ color: 'var(--color-on-surface)' }}>{row.name}</span>
                  ))}
                </div>
                <span className="font-sans text-base font-medium w-12 text-right shrink-0 mt-0.5" style={{ color: 'var(--color-on-surface)' }}>{group.px}</span>
                <span className="font-sans text-base font-medium w-12 text-right shrink-0 mt-0.5" style={{ color: 'var(--color-on-surface)' }}>{group.rem}</span>
                <span className="font-sans text-base font-medium w-12 text-right shrink-0 mt-0.5" style={{ color: 'var(--color-on-surface)' }}>{group.leading}</span>
              </div>
              {gi < bodyStyles.length - 1 && <div className="divider" />}
            </div>
          ))}
        </Card>

        {/* ── Fonts with a story ─────────────────────────────────────────── */}
        <div className="mt-16" />
        <SectionTitle>Fonts with a story</SectionTitle>
        <p
          className="font-sans text-base mb-6 max-w-[720px]"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          Typography isn't just pixels — some fonts carry missions. Kvalt highlights projects we
          admire and quietly champion. These are the ones worth knowing about.
        </p>

        <Card>
          <div className="flex flex-col gap-5 max-w-[760px]">
            <div className="flex items-baseline gap-3">
              <h3
                className="font-display font-semibold text-headline-m"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Noto Sans
              </h3>
              <span
                className="font-mono text-xs tracking-wide uppercase"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                Google · Open Source
              </span>
            </div>

            <p
              className="font-sans text-base leading-relaxed"
              style={{ color: 'var(--color-on-surface)' }}
            >
              &ldquo;No Tofu.&rdquo; When a font can&apos;t render a character, you get a blank
              rectangle — tofu. Noto&apos;s mission is to eliminate it entirely: one font family
              covering every script in Unicode. Over 1,000 languages, 162 writing systems.
              Cherokee, Tifinagh, N&apos;Ko, cuneiform, Egyptian hieroglyphs — if Unicode
              encodes it, Noto renders it. The side effect: scripts that most platforms
              never bothered to support now display with the same typographic quality as Latin.
            </p>

            <p
              className="font-sans text-base leading-relaxed"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Kvalt ships a character called <span className="font-semibold">Babel</span> that
              uses Noto Sans for every headline — a nod to a project that decided universal
              coverage means universal, not just the scripts with the most speakers.
            </p>

            <div
              className="flex gap-4 pt-2"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <a
                href="https://fonts.google.com/noto"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-semibold"
                style={{ color: 'var(--color-on-secondary-1)' }}
              >
                fonts.google.com/noto →
              </a>
              <a
                href="https://github.com/notofonts"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-semibold"
                style={{ color: 'var(--color-on-secondary-1)' }}
              >
                github.com/notofonts →
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
