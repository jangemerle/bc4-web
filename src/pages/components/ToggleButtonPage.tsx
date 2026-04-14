import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Grid2X2, List,
} from 'lucide-react';
import { ToggleButton, type ToggleButtonSize } from '../../components/ToggleButton';
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function ToggleButtonPage() {
  /* ── States section ── */
  const [statesPressed, setStatesPressed] = useState<Record<string, boolean>>({
    xs: false, sm: true, md: false, lg: true,
  });

  /* ── Icon variants section ── */
  const [iconLeftPressed, setIconLeftPressed] = useState(true);
  const [gridPressed, setGridPressed] = useState(true);
  const [listPressed, setListPressed] = useState(false);

  /* ── Button groups section ── */
  const [boldOn, setBoldOn] = useState(true);
  const [italicOn, setItalicOn] = useState(false);
  const [underlineOn, setUnderlineOn] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

  const [disabledPressed] = useState(true);

  /* ── Hero section ── */
  const [heroBold, setHeroBold] = useState(true);
  const [heroItalic, setHeroItalic] = useState(false);
  const [heroUnderline, setHeroUnderline] = useState(false);

  const heroToggles = [
    { label: 'Bold', icon: Bold, pressed: heroBold, onChange: setHeroBold },
    { label: 'Italic', icon: Italic, pressed: heroItalic, onChange: setHeroItalic },
    { label: 'Underline', icon: Underline, pressed: heroUnderline, onChange: setHeroUnderline },
  ] as const;

  return (
    <>
      {/* ═══ HERO ═══ */}
      <PageHero
        title="Toggle Button"
        subtitle="A button that remembers. Press once to activate, again to release."
        description="Toggle buttons hold a persistent pressed state — bold on, filter active, view selected. They use aria-pressed so assistive tech announces the current state. Unpressed is a secondary outline; pressed fills with secondary-1."
        visual={
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            {heroToggles.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...spring.default, delay: 0.2 + i * 0.08 }}
              >
                <ToggleButton
                  pressed={t.pressed}
                  onPressedChange={t.onChange}
                  iconOnly={t.icon}
                  size="lg"
                  aria-label={t.label}
                />
              </motion.div>
            ))}
          </div>
        }
      />

      {/* ═══ STATES ═══ */}
      <Reveal>
        <Section
          title="States"
          description="Unpressed shows a secondary outline. Pressed fills with secondary-1 background. All four sizes, side by side."
        >
          <ExampleBlock label="Unpressed vs pressed across sizes" centered>
            <div className="flex flex-col gap-6">
              {(['xs', 'sm', 'md', 'lg'] as ToggleButtonSize[]).map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <span
                    className="font-mono text-[10px] w-6 text-right"
                    style={{ color: 'var(--color-on-surface-subtle-2)' }}
                  >
                    {s}
                  </span>
                  <ToggleButton
                    pressed={false}
                    size={s}
                  >
                    Off
                  </ToggleButton>
                  <ToggleButton
                    pressed={true}
                    size={s}
                  >
                    On
                  </ToggleButton>
                  <div className="w-px h-6" style={{ backgroundColor: 'var(--color-border)' }} />
                  <ToggleButton
                    pressed={statesPressed[s]}
                    onPressedChange={(v) => setStatesPressed((prev) => ({ ...prev, [s]: v }))}
                    size={s}
                  >
                    Interactive
                  </ToggleButton>
                </div>
              ))}
            </div>
          </ExampleBlock>
        </Section>
      </Reveal>

      {/* ═══ ICON VARIANTS ═══ */}
      <Reveal>
        <Section
          title="Icon variants"
          description="Icon-left pairs a label with reinforcing glyph. Icon-only goes square — always add aria-label."
        >
          <div className="flex flex-col gap-6">
            <ExampleBlock label="Icon left + text">
              <div className="flex items-center gap-3 flex-wrap">
                <ToggleButton
                  pressed={iconLeftPressed}
                  onPressedChange={setIconLeftPressed}
                  iconLeft={Bold}
                  size="md"
                >
                  Bold
                </ToggleButton>
                <ToggleButton
                  pressed={false}
                  iconLeft={Italic}
                  size="md"
                >
                  Italic
                </ToggleButton>
              </div>
            </ExampleBlock>

            <ExampleBlock label="Icon only">
              <div className="flex items-center gap-3 flex-wrap">
                <ToggleButton
                  pressed={gridPressed}
                  onPressedChange={(v) => { setGridPressed(v); if (v) setListPressed(false); }}
                  iconOnly={Grid2X2}
                  aria-label="Grid view"
                />
                <ToggleButton
                  pressed={listPressed}
                  onPressedChange={(v) => { setListPressed(v); if (v) setGridPressed(false); }}
                  iconOnly={List}
                  aria-label="List view"
                />
              </div>
            </ExampleBlock>
          </div>
        </Section>
      </Reveal>

      {/* ═══ BUTTON GROUPS ═══ */}
      <Reveal>
        <Section
          title="Button groups"
          description="Multiple toggle buttons in a row form a toolbar. Independent toggles (bold/italic) can be on simultaneously. Exclusive toggles (alignment) allow only one."
        >
          <div className="flex flex-col gap-6">
            <ExampleBlock label="Independent — multiple can be active" description="Each toggle is independent. Bold and italic can both be on at once.">
              <div className="flex items-center gap-1">
                <ToggleButton
                  pressed={boldOn}
                  onPressedChange={setBoldOn}
                  iconOnly={Bold}
                  size="sm"
                  aria-label="Bold"
                />
                <ToggleButton
                  pressed={italicOn}
                  onPressedChange={setItalicOn}
                  iconOnly={Italic}
                  size="sm"
                  aria-label="Italic"
                />
                <ToggleButton
                  pressed={underlineOn}
                  onPressedChange={setUnderlineOn}
                  iconOnly={Underline}
                  size="sm"
                  aria-label="Underline"
                />
              </div>
            </ExampleBlock>

            <ExampleBlock label="Exclusive — only one active at a time" description="Selecting one deselects the others. Enforce this in your state handler.">
              <div className="flex items-center gap-1">
                <ToggleButton
                  pressed={alignment === 'left'}
                  onPressedChange={() => setAlignment('left')}
                  iconOnly={AlignLeft}
                  size="sm"
                  aria-label="Align left"
                />
                <ToggleButton
                  pressed={alignment === 'center'}
                  onPressedChange={() => setAlignment('center')}
                  iconOnly={AlignCenter}
                  size="sm"
                  aria-label="Align center"
                />
                <ToggleButton
                  pressed={alignment === 'right'}
                  onPressedChange={() => setAlignment('right')}
                  iconOnly={AlignRight}
                  size="sm"
                  aria-label="Align right"
                />
              </div>
            </ExampleBlock>
          </div>
        </Section>
      </Reveal>

      {/* ═══ DISABLED ═══ */}
      <Reveal>
        <Section
          title="Disabled"
          description="opacity-40, cursor-not-allowed. Works in both pressed and unpressed states."
        >
          <ExampleBlock centered>
            <div className="flex items-center gap-3 flex-wrap">
              <ToggleButton pressed={false} disabled size="md">
                Unpressed
              </ToggleButton>
              <ToggleButton pressed={disabledPressed} disabled size="md">
                Pressed
              </ToggleButton>
              <ToggleButton pressed={false} disabled iconOnly={Bold} aria-label="Bold" />
              <ToggleButton pressed={true} disabled iconOnly={Italic} aria-label="Italic" />
            </div>
          </ExampleBlock>
        </Section>
      </Reveal>

      {/* ═══ USAGE ═══ */}
      <Reveal>
        <Section title="Usage">
          <CodeBlock label="Import and use">
{`import { ToggleButton } from '../components/ToggleButton';
import { Bold, Italic, Grid2X2, List } from 'lucide-react';

// Basic text toggle
const [active, setActive] = useState(false);
<ToggleButton pressed={active} onPressedChange={setActive}>
  Filter
</ToggleButton>

// Icon-left with label
<ToggleButton pressed={isBold} onPressedChange={setIsBold} iconLeft={Bold}>
  Bold
</ToggleButton>

// Icon-only (always add aria-label)
<ToggleButton
  pressed={isGrid}
  onPressedChange={setIsGrid}
  iconOnly={Grid2X2}
  aria-label="Grid view"
/>

// Exclusive group — enforce single selection in state
<ToggleButton pressed={view === 'grid'} onPressedChange={() => setView('grid')} iconOnly={Grid2X2} aria-label="Grid" />
<ToggleButton pressed={view === 'list'} onPressedChange={() => setView('list')} iconOnly={List} aria-label="List" />

// Size variants
<ToggleButton pressed={on} onPressedChange={setOn} size="xs">XS</ToggleButton>
<ToggleButton pressed={on} onPressedChange={setOn} size="sm">SM</ToggleButton>
<ToggleButton pressed={on} onPressedChange={setOn} size="md">MD</ToggleButton>
<ToggleButton pressed={on} onPressedChange={setOn} size="lg">LG</ToggleButton>`}
          </CodeBlock>
        </Section>
      </Reveal>
    </>
  );
}
