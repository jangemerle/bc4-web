/**
 * Design System — ModalFullscreen component
 *
 * A viewport-filling overlay inspired by the Ancestry "Stories of Us" gallery.
 * Content slides up from below with a slight rotation, over a themed background.
 *
 * Motion:
 *   Enter — content slides up from 50vh with -5° rotation + fades in (navigate spring)
 *   Exit  — reverse (snappy ease)
 *   Background — color cross-fades over 600ms (easeInOutQuart)
 *
 * Layout:
 *   Desktop — split view: left slot (image/media) + right slot (text content)
 *   Mobile  — stacked vertically, scrollable
 *
 * Usage:
 *   <ModalFullscreen open={open} onClose={() => setOpen(false)}>
 *     <ModalFullscreen.Media>
 *       <img src="..." alt="..." />
 *     </ModalFullscreen.Media>
 *     <ModalFullscreen.Content>
 *       <h2>Title</h2>
 *       <p>Description</p>
 *     </ModalFullscreen.Content>
 *   </ModalFullscreen>
 *
 *   // With navigation:
 *   <ModalFullscreen open={open} onClose={close} onPrev={prev} onNext={next}>
 *     ...
 *   </ModalFullscreen>
 *
 *   // With themed background:
 *   <ModalFullscreen open={open} onClose={close} bgColor="#c8dbe5">
 *     ...
 *   </ModalFullscreen>
 */

import { useEffect, useRef, useCallback, createContext } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { cn } from '../lib/cn';
import { spring, ease, duration } from '../tokens/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ModalFullscreenProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the user closes the modal */
  onClose: () => void;
  /** Content (use ModalFullscreen.Media and ModalFullscreen.Content) */
  children: React.ReactNode;
  /** Navigate to previous item */
  onPrev?: () => void;
  /** Navigate to next item */
  onNext?: () => void;
  /** Themed background color (e.g. "#c8dbe5") */
  bgColor?: string;
  /** Accessible label for the modal */
  'aria-label'?: string;
  /** Label for the close button (defaults to "Close") */
  closeLabel?: React.ReactNode;
  /** Additional actions rendered to the left of the close button */
  actions?: React.ReactNode;
  /** Additional className for the content container */
  className?: string;
}

// ─── Context for sub-components ─────────────────────────────────────────────

const ModalFullscreenContext = createContext<{ open: boolean }>({ open: false });

// Suppress unused variable warning — context is exported for potential sub-component use
void ModalFullscreenContext;

// ─── Animation variants ─────────────────────────────────────────────────────
//
// Entry: slide up from 50vh + slight rotation + fade (Ancestry pattern)
// Exit: slide down + fade (snappy, no spring)

const overlayVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: duration.fast, ease: ease.exit },
  },
  visible: {
    opacity: 1,
    transition: { duration: duration.slow, ease: ease.enter },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    transform: 'translateY(50vh) rotate(-5deg)',
    transition: {
      opacity: { duration: duration.fast, ease: ease.exit },
      transform: { duration: duration.base, ease: ease.exit },
    },
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0) rotate(0deg)',
    transition: {
      opacity: { duration: duration.moderate, ease: ease.enter },
      transform: spring.default,
    },
  },
};

const navVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: duration.fast, ease: ease.exit },
  },
  visible: {
    opacity: 1,
    transition: { duration: duration.moderate, ease: ease.enter, delay: 0.15 },
  },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function Media({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'col-span-full lg:col-span-4',
        'p-6 lg:p-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
Media.displayName = 'ModalFullscreen.Media';

function Content({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-4',
        'col-span-full lg:col-start-6 lg:col-span-4',
        'px-6 pb-12 lg:px-0 lg:py-12',
        className,
      )}
    >
      {children}
    </div>
  );
}
Content.displayName = 'ModalFullscreen.Content';

// ─── Nav button ─────────────────────────────────────────────────────────────

function NavButton({
  direction,
  onClick,
  reducedMotion,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-50',
        direction === 'prev' ? 'left-4 lg:left-8' : 'right-4 lg:right-8',
      )}
      variants={reducedMotion ? undefined : navVariants}
      initial={reducedMotion ? { opacity: 1 } : 'hidden'}
      animate={reducedMotion ? { opacity: 1 } : 'visible'}
      exit={reducedMotion ? { opacity: 0 } : 'hidden'}
    >
      <Button
        variant="elevated"
        size="lg"
        iconOnly={direction === 'prev' ? ChevronLeft : ChevronRight}
        onClick={onClick}
        aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      />
    </motion.div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ModalFullscreen({
  open,
  onClose,
  children,
  onPrev,
  onNext,
  bgColor,
  closeLabel = 'Close',
  actions,
  'aria-label': ariaLabel,
  className,
}: ModalFullscreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  // ── Keyboard ────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
        return;
      }
      if (e.key === 'ArrowRight' && onNext) {
        onNext();
        return;
      }
      // Focus trap
      if (e.key !== 'Tab' || !containerRef.current) return;
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
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
    },
    [onClose, onPrev, onNext],
  );

  // ── Focus management ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement;
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      const firstFocusable = containerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    });
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  // ── Prevent body scroll (preserve original overflow on unmount) ──────────
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <ModalFullscreenContext.Provider value={{ open }}>
      <AnimatePresence>
        {open && (
          <div
            ref={containerRef}
            role="dialog"
            aria-modal
            aria-label={ariaLabel || 'Fullscreen view'}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            {/* Background overlay — themed color or dark */}
            <motion.div
              className="fixed inset-0"
              style={{
                backgroundColor: bgColor || 'var(--color-inverted-surface)',
              }}
              variants={reducedMotion ? undefined : overlayVariants}
              initial={reducedMotion ? { opacity: 1 } : 'hidden'}
              animate={reducedMotion ? { opacity: 1 } : 'visible'}
              exit={reducedMotion ? { opacity: 0 } : 'hidden'}
              onClick={onClose}
              aria-hidden
            />

            {/* Close button (+ optional actions) — fixed top-right */}
            <motion.div
              className="fixed top-6 right-6 lg:top-8 lg:right-8 z-50 flex items-center gap-5"
              variants={reducedMotion ? undefined : navVariants}
              initial={reducedMotion ? { opacity: 1 } : 'hidden'}
              animate={reducedMotion ? { opacity: 1 } : 'visible'}
              exit={reducedMotion ? { opacity: 0 } : 'hidden'}
            >
              {actions}
              <Button
                variant="special"
                size="sm"
                iconRight={X}
                onClick={onClose}
                aria-label="Close"
              >
                {closeLabel}
              </Button>
            </motion.div>

            {/* Navigation arrows */}
            {onPrev && (
              <NavButton direction="prev" onClick={onPrev} reducedMotion={reducedMotion} />
            )}
            {onNext && (
              <NavButton direction="next" onClick={onNext} reducedMotion={reducedMotion} />
            )}

            {/* Content — slides up with rotation */}
            <motion.div
              className={cn(
                'relative min-h-svh',
                'flex items-center justify-center',
                'px-4 lg:px-20',
              )}
              variants={reducedMotion ? undefined : contentVariants}
              initial={reducedMotion ? { opacity: 1 } : 'hidden'}
              animate={reducedMotion ? { opacity: 1 } : 'visible'}
              exit={reducedMotion ? { opacity: 0 } : 'hidden'}
            >
              <div
                className={cn(
                  'grid grid-cols-1 lg:grid-cols-9 gap-6 lg:gap-0',
                  'w-full max-w-7xl',
                  'items-center',
                  className,
                )}
              >
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalFullscreenContext.Provider>
  );
}

// Attach sub-components
ModalFullscreen.Media = Media;
ModalFullscreen.Content = Content;
