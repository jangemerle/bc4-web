/**
 * Design System — Modal component
 * Source: Figma / Topic Board New / node 8851:27724
 *
 * Structure:  Overlay + centered panel with header, scrollable content, footer
 * Width:      600px (default), customizable
 * Corners:    radius-l (12px)
 * Shadow:     large-2 (0 20px 40px rgba(0,0,0,0.16))
 *
 * Animations (motion.dev):
 *   Enter — overlay fades in, panel springs up from slight offset + scale
 *   Exit  — overlay fades out, panel shrinks + fades (snappy, non-spring)
 *   Transitions are embedded in variants so enter and exit can differ.
 *
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="Topic settings">
 *     <p>Content here</p>
 *   </Modal>
 *
 *   <Modal open={open} onClose={close} title="Confirm" footer={<Button>Save</Button>}>
 *     <p>Are you sure?</p>
 *   </Modal>
 */

import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';
import { Typo } from './Typo';
import { cn } from '../lib/cn';
import { spring, ease, duration } from '../tokens/motion';
import { glass } from '../tokens/glass';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface ModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the user closes the modal (X button, overlay click, Escape) */
  onClose: () => void;
  /** Modal title displayed in the header */
  title: string;
  /** Content rendered in the scrollable body */
  children: React.ReactNode;
  /** Optional footer content (e.g. action buttons), pinned to the bottom */
  footer?: React.ReactNode;
  /** Width of the modal panel */
  width?: string;
  /** Additional className for the panel */
  className?: string;
  /**
   * When true, the modal positions absolutely within its nearest `position: relative`
   * ancestor instead of `position: fixed` over the full viewport.
   * Use for modals embedded inside a container (e.g. Screen Vault previews).
   */
  contained?: boolean;
  /**
   * When true, skips the title / close-button header entirely.
   * Children fill the panel directly — useful for command palettes and custom overlays.
   */
  bare?: boolean;
  /** Extra className applied to the dimmed overlay div */
  overlayClassName?: string;
  /** Extra className applied to the footer wrapper div */
  footerClassName?: string;
}

// ─── Animation variants ───────────────────────────────────────────────────────
//
// Motion picks up `transition` from the *target* variant, so:
//   entering → animates to "visible"  → uses visible.transition  (spring)
//   exiting  → animates to "hidden"   → uses hidden.transition   (snappy ease)

const overlayVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: duration.fast, ease: ease.exit },
  },
  visible: {
    opacity: 1,
    transition: { duration: duration.moderate, ease: ease.enter },
  },
};

// Panel: uses `transform` string so scale + y run together via WAAPI.
// Opacity has its own per-property timing.
const panelVariants = {
  hidden: {
    opacity: 0,
    transform: 'scale(0.95) translateY(8px)',
    transition: {
      opacity:   { duration: duration.fast, ease: ease.exit },
      transform: { duration: duration.fast, ease: ease.exit },
    },
  },
  visible: {
    opacity: 1,
    transform: 'scale(1) translateY(0px)',
    transition: {
      opacity:   { duration: duration.base, ease: ease.enter },
      transform: spring.default,
    },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = '600px',
  className,
  contained = false,
  bare = false,
  overlayClassName,
  footerClassName,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Focus trap — cycle Tab within the modal panel
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab' || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [onClose]);

  // Keyboard listener + focus management
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement;
    document.addEventListener('keydown', handleKeyDown);

    // Move focus into the modal
    requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to trigger element
      triggerRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            contained ? 'absolute' : 'fixed',
            'inset-0 z-50 flex items-center justify-center',
          )}
        >

          {/* Overlay */}
          <motion.div
            className={cn('absolute inset-0', overlayClassName)}
            style={{
              backgroundColor: 'var(--color-modal-overlay)',
              backdropFilter: glass.default.blur,
              WebkitBackdropFilter: glass.default.blur,
            }}
            variants={reducedMotion ? undefined : overlayVariants}
            initial={reducedMotion ? { opacity: 1 } : "hidden"}
            animate={reducedMotion ? { opacity: 1 } : "visible"}
            exit={reducedMotion ? { opacity: 0 } : "hidden"}
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal
            aria-label={title || undefined}
            className={cn(
              'relative flex flex-col overflow-hidden',
              'rounded-2xl shadow-large-2',
              'bg-[var(--color-surface-1)]',
              'max-h-[85vh]',
              className,
            )}
            style={{ width }}
            variants={reducedMotion ? undefined : panelVariants}
            initial={reducedMotion ? { opacity: 1 } : "hidden"}
            animate={reducedMotion ? { opacity: 1 } : "visible"}
            exit={reducedMotion ? { opacity: 0 } : "hidden"}
          >
            {/* Header — hidden in bare mode */}
            {!bare && (
              <div
                className="flex items-center shrink-0 pl-6 pr-[14px] py-5 z-10"
                style={{ backgroundColor: 'var(--color-surface-1)' }}
              >
                <h2
                  className="font-display text-headline-m font-bold flex-1"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  <Typo>{title}</Typo>
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-center p-[10px] rounded-m',
                    'cursor-pointer transition-colors duration-150',
                    'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
                    'hover:bg-[var(--color-surface-3)]',
                  )}
                  style={{ color: 'var(--color-on-surface)' }}
                  aria-label="Close"
                >
                  <Icon icon={X} size="md" />
                </button>
              </div>
            )}

            {/* Content — scrollable (no padding in bare mode — consumer controls it) */}
            <div className={cn('flex-1 overflow-y-auto', !bare && 'px-6 pb-6')}>
              {children}
            </div>

            {/* Footer — sticky bottom */}
            {footer && (
              <div
                className={cn(
                  'shrink-0 flex items-center justify-end p-5 z-10',
                  footerClassName,
                )}
                style={{ backgroundColor: 'var(--color-surface-1)' }}
              >
                {footer}
              </div>
            )}
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
