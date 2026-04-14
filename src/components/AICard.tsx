/**
 * Design System — AICard component
 *
 * A card that signals AI-powered content through gradient treatments:
 *   - Gradient border (lavender→peach, 1px, using padding-box/border-box trick)
 *   - Subtle gradient background tint (--gradient-ai-subtle)
 *   - AI chip with vivid gradient fill
 *
 * Usage:
 *   <AICard title="Smart suggestions" description="Generated from your data.">
 *     {children}
 *   </AICard>
 *
 *   <AICard chip="Copilot" title="..." />   — custom chip label
 *   <AICard chip={null} title="..." />       — no chip
 */

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { spring, duration, ease } from '../tokens/motion';

export interface AICardProps {
  /** Card heading */
  title?: React.ReactNode;
  /** Supporting text below the title */
  description?: React.ReactNode;
  /** Chip label — defaults to "AI", pass null to hide */
  chip?: React.ReactNode | null;
  /** Card body content */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
}

export function AICard({
  title,
  description,
  chip = 'AI',
  children,
  className,
}: AICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...spring.default,
        opacity: { duration: duration.base, ease: ease.enter },
      }}
      whileHover={{ y: -2, transition: { ...spring.snappy } }}
      className={className}
      style={{
        // Gradient border via padding-box / border-box layering
        background: `
          var(--gradient-ai-subtle) padding-box,
          var(--gradient-ai-border) border-box
        `,
        border: '1px solid transparent',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Chip */}
      {chip !== null && (
        <div style={{ display: 'flex' }}>
          <span
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold"
            style={{
              background: 'var(--gradient-ai-vivid)',
              color: 'var(--color-on-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '3px 10px',
            }}
          >
            <Sparkles size={11} strokeWidth={2.5} />
            {chip}
          </span>
        </div>
      )}

      {/* Title + description */}
      {(title || description) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {title && (
            <p
              className="font-display font-semibold text-headline-s"
              style={{ color: 'var(--color-on-surface)' }}
            >
              {title}
            </p>
          )}
          {description && (
            <p
              className="font-sans text-md"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Body */}
      {children && (
        <div style={{ color: 'var(--color-on-surface)' }}>
          {children}
        </div>
      )}
    </motion.div>
  );
}
