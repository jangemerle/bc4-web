/**
 * ButtonCodePanel — floating persistent code reference for the Button page.
 *
 * Collapsed: a fixed circle icon button in the top-right corner.
 * Expanded:  a scrollable panel using surface-1 bg with on-surface token hierarchy.
 *
 * Colors use the DS token system so it works correctly across all Characters.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, X, Check, Copy } from 'lucide-react';
import { spring, duration, ease } from '../tokens/motion';
import { usePress } from '../hooks/usePress';

// ─── Individual snippet ───────────────────────────────────────────────────────

interface SnippetProps {
  label: string;
  code: string;
}

function Snippet({ label, code }: SnippetProps) {
  const [copied, setCopied] = useState(false);
  const { isPressed, pressHandlers } = usePress({});

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // silent
    }
  }, [code]);

  return (
    <div
      className="rounded-lg"
      style={{
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between px-8 py-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <span
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: 'var(--color-on-surface-subtle-2)' }}
        >
          {label}
        </span>

        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 cursor-pointer shrink-0"
          style={{
            background: copied
              ? 'var(--color-success-secondary-1)'
              : 'var(--color-surface-3)',
            color: copied
              ? 'var(--color-success-2)'
              : 'var(--color-on-surface-subtle-1)',
            borderRadius: 'var(--radius-m, 8px)',
            border: '1px solid var(--color-border)',
          }}
          whileHover={{ background: 'var(--color-surface-4)' }}
          animate={{ scale: isPressed ? 0.94 : 1 }}
          transition={{ duration: duration.fast, ease: ease.standard }}
          aria-label={`Copy ${label}`}
          {...pressHandlers}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={spring.snappy}
              >
                <Check size={12} strokeWidth={2.5} />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={spring.snappy}
              >
                <Copy size={12} strokeWidth={2} />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Code — JetBrains Mono 16px, on-surface for readability */}
      <pre
        className="px-8 py-5 overflow-x-auto font-mono text-md font-semibold leading-relaxed"
        style={{ color: 'var(--color-on-surface)' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── All snippets ─────────────────────────────────────────────────────────────

const SNIPPETS: SnippetProps[] = [
  {
    label: 'Import',
    code: `import { Button } from '../components/Button';
import { Plus, Trash2, ArrowRight, Settings } from 'lucide-react';`,
  },
  {
    label: 'Common usage',
    code: `// Primary CTA
<Button iconLeft={Plus}>Create new</Button>

// Destructive action
<Button variant="danger" iconLeft={Trash2}>Delete</Button>

// Navigation
<Button variant="link" iconRight={ArrowRight}>Continue</Button>

// Icon only with accessibility
<Button iconOnly={Plus} aria-label="Add item" size="sm" />

// Multichoice dropdown trigger
<Button variant="secondary" multichoice>Options</Button>`,
  },
  {
    label: 'All variants',
    code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="elevated">Elevated</Button>
<Button variant="link">Link</Button>
<Button variant="danger">Danger</Button>
<Button variant="danger-subtle">Danger subtle</Button>
<Button variant="success">Success</Button>
<Button variant="success-subtle">Success subtle</Button>`,
  },
  {
    label: 'All sizes',
    code: `<Button size="xs">Extra small — 24px</Button>
<Button size="sm">Small — 32px</Button>
<Button size="md">Medium — 40px</Button>
<Button size="lg">Large — 48px</Button>`,
  },
  {
    label: 'Content slots',
    code: `// Left icon + label
<Button iconLeft={Plus}>Create new</Button>

// Label + right icon
<Button iconRight={ArrowRight}>Continue</Button>

// Icon only (square)
<Button iconOnly={Settings} aria-label="Settings" />

// Multichoice (chevron appended)
<Button variant="secondary" iconLeft={Settings} multichoice>
  Sort by
</Button>`,
  },
  {
    label: 'Disabled state',
    code: `<Button disabled>Cannot click</Button>
<Button variant="danger" disabled iconLeft={Trash2}>Delete</Button>`,
  },
  {
    label: 'Motion implementation',
    code: `// All buttons use usePress — never whileTap directly.
// Guarantees 120ms visible press even on Magic Trackpad.

import { usePress } from '../hooks/usePress';

const { isPressed, pressHandlers } = usePress({ disabled });

<motion.button
  animate={{ scale: isPressed ? 0.97 : 1 }}
  transition={spring.snappy}
  {...pressHandlers}
/>`,
  },
];

// ─── Trigger button ───────────────────────────────────────────────────────────

function TriggerButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  const { isPressed, pressHandlers } = usePress({});

  return (
    <motion.button
      className="w-12 h-12 flex items-center justify-center cursor-pointer"
      style={{
        background: 'var(--color-inverted-surface)',
        color: 'var(--color-on-inverted-surface)',
        borderRadius: '9999px',
        border: 'none',
        boxShadow: 'var(--shadow-medium-2)',
      }}
      animate={{ scale: isPressed ? 0.94 : 1 }}
      whileHover={{ scale: isPressed ? 0.94 : 1.06 }}
      transition={spring.snappy}
      onClick={onClick}
      aria-label={isOpen ? 'Close code panel' : 'Open code reference'}
      {...pressHandlers}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="x"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={spring.snappy}
          >
            <X size={20} strokeWidth={2} />
          </motion.span>
        ) : (
          <motion.span
            key="code"
            initial={{ opacity: 0, rotate: 45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -45 }}
            transition={spring.snappy}
          >
            <Code size={20} strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

// Trigger height (48px) + gap (12px) + top offset (24px) = panel top = 84px
const PANEL_TOP = 84;

export function ButtonCodePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <>
      {/* Trigger — always pinned top-right, never moves */}
      <div className="fixed top-6 right-6 z-50">
        <TriggerButton isOpen={isOpen} onClick={toggle} />
      </div>

      {/* Panel — independently anchored below the trigger */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            className="fixed z-40 flex flex-col"
            style={{
              top: PANEL_TOP,
              right: 24,
              width: '560px',
              maxHeight: `calc(100vh - ${PANEL_TOP}px - 24px)`,
              background: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg, 12px)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-large-1)',
            }}
            initial={{ opacity: 0, scale: 0.95, y: -8, transformOrigin: 'top right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={spring.playful}
          >
            {/* Fixed header — never scrolls away */}
            <div className="shrink-0 px-12 pt-10 pb-5">
              <h3
                className="font-mono text-base font-bold tracking-wide"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Button — Code reference
              </h3>
              <p
                className="font-mono text-sm mt-1"
                style={{ color: 'var(--color-on-surface-subtle-2)' }}
              >
                All snippets · click any to copy
              </p>
              <div className="mt-5" style={{ height: '1px', background: 'var(--color-border)' }} />
            </div>

            {/* Scrollable snippets — owns the overflow */}
            <div
              className="flex flex-col gap-4 overflow-y-auto px-12 pb-10"
              style={{ minHeight: 0 }}
            >
              {SNIPPETS.map((s) => (
                <Snippet key={s.label} label={s.label} code={s.code} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
