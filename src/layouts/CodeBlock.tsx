/**
 * CodeBlock — styled code snippet display with copy button.
 *
 * size="md"   → 14px  (for inline, in-page usage)
 * size="base" → 16px  (for the floating panel)
 */

import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring } from '../tokens/motion';
import { usePress } from '../hooks/usePress';

interface CodeBlockProps {
  children: string;
  label?: string;
  /** Font size token. Defaults to "md" (14px) for in-page use. */
  size?: 'md' | 'base';
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const { isPressed, pressHandlers } = usePress({});

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: select text
    }
  }, [code]);

  return (
    <motion.button
      onClick={handleCopy}
      className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 cursor-pointer shrink-0"
      style={{
        background: copied ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.08)',
        color: copied ? '#4ade80' : 'rgba(255,255,255,0.7)',
        borderRadius: 'var(--radius-s)',
        border: 'none',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.12)' }}
      animate={{ scale: isPressed ? 0.94 : 1 }}
      transition={spring.snappy}
      aria-label="Copy code"
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
  );
}

export function CodeBlock({ children, label, size = 'md' }: CodeBlockProps) {
  const fontSizeClass = size === 'base' ? 'text-base' : 'text-md';

  return (
    <div>
      {label && (
        <p className="font-sans text-sm font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>
          {label}
        </p>
      )}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: '#1a1e2e',
        }}
      >
        {/* Top bar: label + copy */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {label || 'code'}
          </span>
          <CopyButton code={children} />
        </div>

        {/* Code */}
        <pre
          className={`px-6 py-5 overflow-x-auto font-mono ${fontSizeClass} leading-relaxed`}
          style={{ color: '#d6deeb' }}
        >
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}
