import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Plus, Upload, Download, ExternalLink,
  ArrowRight, Trash2, Check, Settings, SlidersHorizontal,
  ChevronDown, Play, Save, FileUp, Copy, FileSpreadsheet, Sliders, Bell, User,
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Grid2X2, List,
  MousePointerClick, Columns2, ToggleLeft,
} from 'lucide-react';
import { Button, type ButtonVariant, type ButtonSize } from '../../components/Button';
import { SplitButton } from '../../components/SplitButton';
import { DropdownMenu, DropdownMenuItem, DropdownMenuDivider } from '../../components/DropdownMenu';
import { ToggleButton, type ToggleButtonSize } from '../../components/ToggleButton';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { ExampleBlock } from '../../layouts/ExampleBlock';
import { CodeBlock } from '../../layouts/CodeBlock';
import { DosDonts } from '../../layouts/DosDonts';
import { TokenChips } from '../../layouts/DocHelpers';
import { ButtonCodePanel } from '../../components/ButtonCodePanel';
import { CodePanel } from '../../components/CodePanel';
import { spring } from '../../tokens/motion';
import { useSectionNav } from '../../hooks/useSectionNav';
import { FloatingSectionNav } from '../../components/FloatingSectionNav';

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

/* ─── Interactive variant switcher ───────────────────────────────────────── */

const ALL_VARIANTS: ButtonVariant[] = [
  'primary', 'secondary', 'elevated', 'link',
  'danger', 'danger-subtle', 'success', 'success-subtle',
];

const VARIANT_DESCRIPTIONS: Record<ButtonVariant, string> = {
  primary: 'Solid green fill. The main call to action.',
  secondary: 'Outline with border. Secondary actions, cancels.',
  elevated: 'White fill, shadow lift. Use on grey backgrounds.',
  special: 'Monospace uppercase text on neutral background.',
  'special-primary': 'Monospace uppercase text with primary fill.',
  link: 'No border, no fill. Inline text actions.',
  danger: 'Solid red fill. Destructive confirms.',
  'danger-subtle': 'Outline, red text. Softer destructive option.',
  success: 'Solid green fill. Confirmation actions.',
  'success-subtle': 'Outline, green text. Softer confirmations.',
};

function VariantShowcase() {
  const [activeVariant, setActiveVariant] = useState<ButtonVariant>('primary');

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
      {/* Variant selector tabs */}
      <div className="flex flex-wrap gap-0 border-b" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        {ALL_VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => setActiveVariant(v)}
            className="font-mono text-xs font-semibold px-4 py-3 cursor-pointer transition-colors relative"
            style={{
              color: activeVariant === v ? 'var(--color-primary-1)' : 'var(--color-on-surface-subtle-2)',
              backgroundColor: activeVariant === v ? 'var(--color-surface-1)' : 'transparent',
            }}
          >
            {v}
            {activeVariant === v && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: 'var(--color-primary-1)' }}
                layoutId="variant-tab"
                transition={spring.snappy}
              />
            )}
          </button>
        ))}
      </div>

      {/* Demo area */}
      <div className="p-10" style={{ backgroundColor: activeVariant === 'elevated' ? 'var(--color-bg)' : 'var(--color-surface-1)' }}>
        {/* Large specimen */}
        <div className="flex items-center justify-center gap-6 mb-10 py-6">
          <Button variant={activeVariant} size="lg" iconLeft={Plus}>
            Create new
          </Button>
          <Button variant={activeVariant} size="lg">
            {activeVariant.charAt(0).toUpperCase() + activeVariant.slice(1).replace('-', ' ')}
          </Button>
          <Button variant={activeVariant} size="lg" iconOnly={ArrowRight} aria-label="Next" />
        </div>

        {/* Size scale */}
        <div className="flex items-end justify-center gap-4 mb-8">
          {(['xs', 'sm', 'md', 'lg'] as ButtonSize[]).map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <Button variant={activeVariant} size={s}>
                {s.toUpperCase()}
              </Button>
              <span className="font-mono text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                {s === 'xs' ? '24px' : s === 'sm' ? '32px' : s === 'md' ? '40px' : '48px'}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="font-sans text-sm text-center max-w-md mx-auto" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          {VARIANT_DESCRIPTIONS[activeVariant]}
        </p>
      </div>
    </div>
  );
}

/* ─── Intent grid (Gestalt: proximity groups by purpose) ─────────────────── */

const intents = [
  {
    verb: 'Build',
    tagline: 'The ones that mean it.',
    variants: ['primary', 'success', 'success-subtle'] as ButtonVariant[],
    labels: ['Create new', 'Confirm', 'Approve'],
    icons: [Plus, Check, Check],
  },
  {
    verb: 'Break',
    tagline: 'The point of no return.',
    variants: ['danger', 'danger-subtle'] as ButtonVariant[],
    labels: ['Delete', 'Remove'],
    icons: [Trash2, Trash2],
  },
  {
    verb: 'Move',
    tagline: 'Barely there. Still working.',
    variants: ['secondary', 'elevated', 'link'] as ButtonVariant[],
    labels: ['Cancel', 'Open', 'View all'],
    icons: [undefined, ExternalLink, ArrowRight],
  },
];

function IntentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
      {intents.map((intent, i) => (
        <div
          key={intent.verb}
          className="flex flex-col items-center py-16 px-8 gap-8"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-display text-3xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
              {intent.verb}
            </h3>
            <p className="font-sans text-sm italic" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
              {intent.tagline}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            {intent.variants.map((v, j) => (
              <Button key={v} variant={v} size="lg" iconLeft={intent.icons[j]}>
                {intent.labels[j]}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Size crescendo — whisper, speak, state, declare ───────────────────── */

const sizeVoices: { size: ButtonSize; word: string }[] = [
  { size: 'xs', word: 'whisper' },
  { size: 'sm', word: 'speak' },
  { size: 'md', word: 'state' },
  { size: 'lg', word: 'declare' },
];

function SizeCrescendo() {
  return (
    <div className="flex items-end justify-between py-20 px-6 md:px-20 rounded-lg" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
      {sizeVoices.map(({ size, word }, i) => (
        <motion.div
          key={size}
          className="flex flex-col items-center"
          style={{ gap: 12 + i * 4 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ ...spring.default, delay: i * 0.1 }}
        >
          <Button variant="primary" size={size}>
            {word.charAt(0).toUpperCase() + word.slice(1)}
          </Button>
          <span
            className="font-mono italic"
            style={{
              fontSize: 10 + i * 2,
              color: 'var(--color-on-surface-subtle-2)',
              opacity: 0.5 + i * 0.15,
            }}
          >
            {word}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Exploded anatomy (parts fly apart on scroll) ──────────────────────── */

function ExplodedAnatomy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const spread = inView ? 1 : 0;

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center py-24 rounded-lg" style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
      <div className="relative flex items-center">
        {/* Icon part */}
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={{ x: spread * -60 }}
          initial={{ x: 0 }}
          transition={spring.default}
        >
          <motion.span
            className="font-mono text-[10px] px-2 py-0.5 rounded"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-primary-1)' }}
            animate={{ opacity: spread }}
            transition={{ delay: 0.3 }}
          >
            iconLeft
          </motion.span>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }}
          >
            <Plus size={20} />
          </div>
        </motion.div>

        {/* Label part */}
        <motion.div className="flex flex-col items-center gap-3">
          <motion.span
            className="font-mono text-[10px] px-2 py-0.5 rounded"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-primary-1)' }}
            animate={{ opacity: spread }}
            transition={{ delay: 0.4 }}
          >
            label
          </motion.span>
          <div
            className="flex items-center justify-center h-10 px-6 rounded-lg font-sans font-bold text-base"
            style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }}
          >
            Create new
          </div>
        </motion.div>

        {/* Chevron part */}
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={{ x: spread * 60 }}
          initial={{ x: 0 }}
          transition={spring.default}
        >
          <motion.span
            className="font-mono text-[10px] px-2 py-0.5 rounded"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-primary-1)' }}
            animate={{ opacity: spread }}
            transition={{ delay: 0.5 }}
          >
            multichoice
          </motion.span>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary-1)', color: 'var(--color-on-primary)' }}
          >
            <ChevronDown size={20} />
          </div>
        </motion.div>

        {/* Dashed pill outline */}
        <motion.div
          className="absolute -inset-4 rounded-2xl pointer-events-none"
          style={{ border: '2px dashed var(--color-border)' }}
          animate={{ opacity: spread * 0.6, scale: 1 + spread * 0.08 }}
          transition={{ ...spring.default, delay: 0.2 }}
        />
      </div>

      {/* Bottom annotation */}
      <motion.p
        className="mt-12 font-mono text-[10px]"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
        animate={{ opacity: spread }}
        transition={{ delay: 0.6 }}
      >
        rounded-xl · pill shape · spring.snappy press
      </motion.p>
    </div>
  );
}

/* ─── Motion X-ray — interactive annotation playground ──────────────────── */

function MotionXRay() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center py-24 gap-12 rounded-lg"
      style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
    >
      <div className="relative">
        <Button
          size="lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
        >
          Interact with me
        </Button>

        {/* Top annotation — shadow */}
        <motion.div
          className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ opacity: isHovered ? 1 : 0.2, y: isHovered ? 0 : 4 }}
          transition={spring.snappy}
        >
          <span
            className="font-mono text-[10px] px-3 py-1 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: isHovered ? 'var(--color-primary-1)' : 'var(--color-surface-2)',
              color: isHovered ? 'var(--color-on-primary)' : 'var(--color-on-surface-subtle-2)',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            shadow lifts
          </span>
          <div className="w-px h-3" style={{ backgroundColor: 'var(--color-border)' }} />
        </motion.div>

        {/* Bottom annotation — scale */}
        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ opacity: isPressed ? 1 : 0.2, y: isPressed ? 0 : -4 }}
          transition={spring.snappy}
        >
          <div className="w-px h-3" style={{ backgroundColor: 'var(--color-border)' }} />
          <span
            className="font-mono text-[10px] px-3 py-1 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: isPressed ? '#ef4444' : 'var(--color-surface-2)',
              color: isPressed ? '#fff' : 'var(--color-on-surface-subtle-2)',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            scale 0.97x
          </span>
        </motion.div>

        {/* Right annotation — spring */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -right-32 flex items-center gap-1"
          animate={{ opacity: isHovered || isPressed ? 1 : 0.15, x: isHovered || isPressed ? 0 : -4 }}
          transition={spring.snappy}
        >
          <div className="h-px w-3" style={{ backgroundColor: 'var(--color-border)' }} />
          <span
            className="font-mono text-[10px] px-3 py-1 rounded-full whitespace-nowrap"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-subtle-2)' }}
          >
            spring.snappy
          </span>
        </motion.div>
      </div>

      {/* Live status */}
      <p className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
        {isPressed ? '↓ pressed — scale shrinks' : isHovered ? '→ hovering — shadow rises' : '· idle — try hovering, then pressing'}
      </p>
    </div>
  );
}

/* ─── SplitWithMenu helper ───────────────────────────────────────────────── */

function SplitWithMenu({
  children,
  variant,
  size,
  iconLeft,
  menuContent,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'elevated';
  size?: 'xs' | 'sm' | 'md' | 'lg';
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

/* ─── Split button menu content factories ────────────────────────────────── */

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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function ButtonPage() {
  const sectionNav = useSectionNav(['button', 'split', 'toggle'] as const);

  /* ── Toggle button states ── */
  const [statesPressed, setStatesPressed] = useState<Record<string, boolean>>({
    xs: false, sm: true, md: false, lg: true,
  });
  const [iconLeftPressed, setIconLeftPressed] = useState(true);
  const [gridPressed, setGridPressed] = useState(true);
  const [listPressed, setListPressed] = useState(false);
  const [boldOn, setBoldOn] = useState(true);
  const [italicOn, setItalicOn] = useState(false);
  const [underlineOn, setUnderlineOn] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [disabledPressed] = useState(true);
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
      {/* ═══ FLOATING CODE PANEL — always visible, top-right ═══ */}
      <ButtonCodePanel />

      {/* ═══ HERO ═══ */}
      <PageHero
        title="Button"
        subtitle="Eight variants. One rule about who's in charge."
        description="Primary is always the main action. One per context. The rest exist to support it — secondary as the cancel, danger as the consequence, link as the afterthought. Eight variants because products have eight distinct kinds of moments."
        visual={
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            {ALL_VARIANTS.map((v, i) => (
              <motion.div
                key={v}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...spring.default, delay: 0.2 + i * 0.06 }}
              >
                <Button variant={v} size="lg">
                  {v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}
                </Button>
              </motion.div>
            ))}
          </div>
        }
      />

      <TokenChips tokens={{
        Variants: ['primary', 'secondary', 'elevated', 'link', 'danger', 'danger-subtle', 'success', 'success-subtle'],
        Sizes: ['xs · 24px', 'sm · 32px', 'md · 40px', 'lg · 48px'],
        Content: ['text', 'icon-left', 'icon-right', 'icon-only', 'multichoice'],
      }} />

      <FloatingSectionNav
        items={[
          { value: 'button', label: 'Button', icon: MousePointerClick },
          { value: 'split', label: 'Split Button', icon: Columns2 },
          { value: 'toggle', label: 'Toggle Button', icon: ToggleLeft },
        ]}
        activeSection={sectionNav.activeSection}
        pinned={sectionNav.pinned}
        inlineRef={sectionNav.inlineRef}
        onChange={sectionNav.handleChange}
      />

      {/* ══════════════════════════════════════════════════════════════════════
         BUTTON
      ═══════════════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('button')} className="scroll-mt-8">

        {/* ═══ VARIANT SHOWCASE ═══ */}
        <Reveal>
          <Section title="Variants" description="Click any variant tab to see it in context — large specimen, all four sizes, with icons.">
            <VariantShowcase />
          </Section>
        </Reveal>

        {/* ═══ INTENT GRID ═══ */}
        <Reveal>
          <Section
            title="Every button is a promise"
            description="Some create. Some destroy. Some just point the way."
          >
            <IntentGrid />
          </Section>
        </Reveal>

        {/* ═══ ANATOMY — EXPLODED VIEW ═══ */}
        <Reveal>
          <Section title="Anatomy" description="Three parts. One shape. Scroll to disassemble.">
            <ExplodedAnatomy />
          </Section>
        </Reveal>

        {/* ═══ CONTENT TYPES ═══ */}
        <Reveal>
          <Section title="Content types" description="Five content modes covering every use case.">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-start">
                <ExampleBlock label="Text only" description="The default. Label centered in the pill.">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button>Button</Button>
                    <Button variant="secondary">Button</Button>
                    <Button variant="elevated">Button</Button>
                    <Button variant="link">Button</Button>
                  </div>
                </ExampleBlock>
                <CodePanel
                  code={`<Button>Button</Button>
<Button variant="secondary">Button</Button>
<Button variant="elevated">Button</Button>
<Button variant="link">Button</Button>`}
                />
              </div>

              <ExampleBlock label="Left icon + text" description="Icon reinforces the action. Always use iconLeft prop, not manual children.">
                <div className="flex items-center gap-3 flex-wrap">
                  <Button iconLeft={Plus}>Create new</Button>
                  <Button variant="secondary" iconLeft={Upload}>Upload</Button>
                  <Button variant="elevated" iconLeft={ExternalLink}>Open</Button>
                  <Button variant="danger" iconLeft={Trash2}>Delete</Button>
                  <Button variant="success" iconLeft={Check}>Confirm</Button>
                </div>
              </ExampleBlock>

              <ExampleBlock label="Text + right icon" description="Typically ArrowRight for navigation, Download for export, Check for confirm.">
                <div className="flex items-center gap-3 flex-wrap">
                  <Button iconRight={ArrowRight}>Continue</Button>
                  <Button variant="secondary" iconRight={Download}>Download</Button>
                  <Button variant="success" iconRight={Check}>Done</Button>
                </div>
              </ExampleBlock>

              <ExampleBlock label="Icon only" description="Square button with aria-label. Four sizes for different density contexts.">
                <div className="flex items-end gap-3 flex-wrap">
                  {(['xs', 'sm', 'md', 'lg'] as ButtonSize[]).map((s) => (
                    <Button key={`p-${s}`} iconOnly={Plus} size={s} aria-label="Add" />
                  ))}
                  <div className="w-4" />
                  {(['xs', 'sm', 'md', 'lg'] as ButtonSize[]).map((s) => (
                    <Button key={`s-${s}`} variant="secondary" iconOnly={Settings} size={s} aria-label="Settings" />
                  ))}
                </div>
              </ExampleBlock>

              <ExampleBlock label="Multichoice" description="Appends ChevronDown for dropdown triggers. Works with all variants.">
                <div className="flex items-center gap-3 flex-wrap">
                  <Button multichoice>Options</Button>
                  <Button variant="secondary" multichoice>Filter</Button>
                  <Button variant="secondary" iconLeft={SlidersHorizontal} multichoice>Sort by</Button>
                  <Button variant="link" multichoice>More</Button>
                </div>
              </ExampleBlock>
            </div>
          </Section>
        </Reveal>

        {/* ═══ SIZES — CRESCENDO ═══ */}
        <Reveal>
          <Section title="Four sizes. Same promise. Different volume." description="">
            <SizeCrescendo />
          </Section>
        </Reveal>

        {/* ═══ MOTION X-RAY ═══ */}
        <Reveal>
          <Section title="Motion behavior" description="Hover to see the shadow rise. Press to feel the scale. The annotations light up as you interact.">
            <MotionXRay />
          </Section>
        </Reveal>

        {/* ═══ ELEVATED ═══ */}
        <Reveal>
          <Section title="Floats above the noise" description="Elevated is secondary's twin — same role, different surface. On grey backgrounds, secondary's border vanishes. Elevated lifts with shadow instead.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ExampleBlock label="On white — secondary works fine" bg="surface" centered>
                <Button variant="secondary">Cancel</Button>
              </ExampleBlock>
              <div className="flex flex-col gap-2">
                <ExampleBlock label="On grey — secondary disappears" bg="bg" centered>
                  <div className="relative">
                    <Button variant="secondary">Cancel</Button>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: '#ef4444' }}>border blends in</span>
                    </div>
                  </div>
                </ExampleBlock>
                <ExampleBlock label="On grey — elevated stands out" bg="bg" centered>
                  <div className="relative">
                    <Button variant="elevated">Cancel</Button>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: 'var(--color-primary-1)' }}>shadow lifts it</span>
                    </div>
                  </div>
                </ExampleBlock>
              </div>
            </div>
          </Section>
        </Reveal>

        {/* ═══ DISABLED ═══ */}
        <Reveal>
          <Section title="Not now. Maybe later." description="opacity-40, cursor-not-allowed. The promise is paused, not broken.">
            <ExampleBlock centered>
              <div className="flex flex-wrap gap-3">
                {ALL_VARIANTS.map((v) => (
                  <Button key={v} variant={v} disabled>
                    {v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </ExampleBlock>
          </Section>
        </Reveal>

        {/* ═══ USAGE ═══ */}
        <Reveal>
          <Section title="Usage">
            <CodeBlock label="Import and use">
{`import { Button } from '../components/Button';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

// Primary CTA
<Button iconLeft={Plus}>Create new</Button>

// Destructive action
<Button variant="danger" iconLeft={Trash2}>Delete</Button>

// Navigation
<Button variant="link" iconRight={ArrowRight}>Continue</Button>

// Icon only with accessibility
<Button iconOnly={Plus} aria-label="Add item" size="sm" />

// Multichoice dropdown trigger
<Button variant="secondary" multichoice>Options</Button>`}
            </CodeBlock>

            <div className="mt-8" />
            <DosDonts
              do={{
                visual: (
                  <div className="flex gap-3">
                    <Button size="sm">Save</Button>
                    <Button variant="secondary" size="sm">Cancel</Button>
                  </div>
                ),
                caption: 'One primary action per context. Secondary for alternatives.',
              }}
              dont={{
                visual: (
                  <div className="flex gap-3">
                    <Button size="sm">Save</Button>
                    <Button size="sm">Also Save</Button>
                    <Button size="sm">Save Too</Button>
                  </div>
                ),
                caption: 'Multiple primary buttons compete for attention and confuse hierarchy.',
              }}
            />
          </Section>
        </Reveal>

        {/* ═══ WRITING RULES ═══ */}
        <Reveal>
          <Section title="What goes on the button" level="minor">
            <div className="flex flex-col gap-3 mb-6" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Verb + noun.</strong> "Save changes", "Create project", "Delete record". Not "Submit", not "OK", not "Continue".</p>
              <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Present tense.</strong> "Export CSV" not "Exporting" (that's loading state). Not "Exported" (that's a toast).</p>
              <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>No articles.</strong> "Add member" not "Add a member". The button is a command, not a sentence.</p>
              <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Destructive = specific.</strong> "Delete project" not "Delete". The danger variant signals risk — the label explains what's at stake.</p>
            </div>
            <div className="p-5 rounded-lg" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th className="text-left pb-3 font-semibold" style={{ color: 'var(--color-on-surface)' }}>Avoid</th>
                    <th className="text-left pb-3 font-semibold" style={{ color: 'var(--color-on-surface)' }}>Use instead</th>
                    <th className="text-left pb-3 font-semibold" style={{ color: 'var(--color-on-surface)' }}>Why</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                  {[
                    ['Submit', 'Save / Create / Send', 'Describes mechanism, not outcome'],
                    ['OK', 'Done / Got it / Save', 'Always a placeholder someone forgot to change'],
                    ['Yes, continue', 'Continue', '"Yes," adds zero information'],
                    ['Please confirm', 'Confirm', '"Please" is never appropriate on a button'],
                  ].map(([avoid, use, why]) => (
                    <tr key={avoid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="py-3 pr-4 font-mono text-xs" style={{ color: 'var(--color-danger-1)' }}>{avoid}</td>
                      <td className="py-3 pr-4">{use}</td>
                      <td className="py-3">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </Reveal>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         SPLIT BUTTON
      ═══════════════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('split')} className="scroll-mt-8">
        <Reveal>
          <div className="mb-16 mt-24">
            <h2
              className="font-display font-bold leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
            >
              SPLIT BUTTON
            </h2>
            <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Two actions, one shape. The primary action fires on click. The chevron opens a menu of alternatives.
            </p>
          </div>
        </Reveal>

        {/* ══ VARIANTS ═════════════════════════════════════════════════════════ */}
        <Reveal>
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
        </Reveal>

        {/* ══ SIZES ════════════════════════════════════════════════════════════ */}
        <Reveal>
          <Section title="Sizes">
            <ExampleBlock label="xs / sm / md / lg" centered>
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-3">
                  <SplitWithMenu size="xs" iconLeft={Plus} menuContent={createMenu}>Create</SplitWithMenu>
                  <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>xs</span>
                </div>
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
        </Reveal>

        {/* ══ WITH ICON ════════════════════════════════════════════════════════ */}
        <Reveal>
          <Section title="With icon">
            <ExampleBlock label="iconLeft paired with contextual labels" centered>
              <div className="flex flex-wrap items-center gap-6">
                <SplitWithMenu iconLeft={Plus} menuContent={createMenu}>Create</SplitWithMenu>
                <SplitWithMenu variant="secondary" iconLeft={Download} menuContent={exportMenu}>Export</SplitWithMenu>
                <SplitWithMenu variant="elevated" iconLeft={Play} menuContent={createMenu}>Start</SplitWithMenu>
              </div>
            </ExampleBlock>
          </Section>
        </Reveal>

        {/* ══ DISABLED ═════════════════════════════════════════════════════════ */}
        <Reveal>
          <Section title="Disabled">
            <ExampleBlock label="disabled across all variants" centered>
              <div className="flex flex-wrap items-center gap-6">
                <SplitButton variant="primary" iconLeft={Save} disabled>Save</SplitButton>
                <SplitButton variant="secondary" iconLeft={Settings} disabled>Options</SplitButton>
                <SplitButton variant="elevated" iconLeft={Download} disabled>Export</SplitButton>
              </div>
            </ExampleBlock>
          </Section>
        </Reveal>

        {/* ══ USAGE ════════════════════════════════════════════════════════════ */}
        <Reveal>
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
        </Reveal>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         TOGGLE BUTTON
      ═══════════════════════════════════════════════════════════════════════ */}
      <div ref={sectionNav.setSectionRef('toggle')} className="scroll-mt-8">
        <Reveal>
          <div className="mb-16 mt-24">
            <h2
              className="font-display font-bold leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(56px, 7vw, 104px)', color: 'var(--color-on-surface)' }}
            >
              TOGGLE BUTTON
            </h2>
            <p className="font-sans text-lg max-w-2xl" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              A button that remembers. Press once to activate, again to release. Uses aria-pressed so assistive tech announces the current state.
            </p>
          </div>
        </Reveal>

        {/* ═══ HERO DEMO ═══ */}
        <Reveal>
          <Section title="At a glance">
            <ExampleBlock centered>
              <div className="flex flex-wrap gap-3 items-center">
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
            </ExampleBlock>
          </Section>
        </Reveal>

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
      </div>
    </>
  );
}
