/**
 * Design System — Tooltip component
 * Spec: specs/tooltip.md
 *
 * Two types:
 *   Plain — dark inverted surface, text only, hover/focus triggered
 *   Rich  — light surface with optional title, description, action buttons
 *
 * Positioning: manual with viewport collision detection, portaled to body
 * Motion: subtle scale(0.96→1) + opacity, transform origin follows side
 *
 * Usage:
 *   <Tooltip content="Settings">
 *     <IconButton icon={Settings} />
 *   </Tooltip>
 *
 *   <Tooltip rich title="New feature" content="Share with teams." actions={[{ label: 'Learn more', onClick: fn }]}>
 *     <Button>Share</Button>
 *   </Tooltip>
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
  useLayoutEffect,
  type ReactNode,
  type ReactElement,
  cloneElement,
  isValidElement,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/cn';
import { duration, ease, spring, transition } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Button } from './Button';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TooltipAction {
  label: string;
  onClick: () => void;
}

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  /** Tooltip text (plain) or description (rich) */
  content: string;
  /** Trigger element — must accept ref */
  children: ReactNode;
  /** Enable rich variant with light bg, structured content */
  rich?: boolean;
  /** Rich only — optional subhead */
  title?: string;
  /** Rich only — up to 2 action buttons */
  actions?: TooltipAction[];
  /** Rich only — click-triggered, stays until dismissed */
  persistent?: boolean;
  /** Preferred placement side */
  side?: TooltipSide;
  /** Alignment along the side axis */
  align?: TooltipAlign;
  /** Delay before showing (ms) */
  delayOpen?: number;
  /** Delay before hiding (ms) */
  delayClose?: number;
  /** Distance from trigger (px) */
  offset?: number;
  /** Disable tooltip */
  disabled?: boolean;
  /** Portal to document.body */
  portal?: boolean;
  /** Additional class on tooltip container */
  className?: string;
  /** Override z-index (default 9999) */
  zIndex?: number;
}

// ─── Singleton: only one tooltip at a time ──────────────────────────────────

let globalCloseRef: (() => void) | null = null;

// ─── Warm-up: skip delay when moving between triggers ───────────────────

const WARMUP_WINDOW = 500; // ms — if a tooltip was visible within this window, skip delay
let lastTooltipHideTime = 0;

// ─── Viewport margin ───────────────────────────────────────────────────────

const VIEWPORT_MARGIN = 16;

// ─── Transform origins per side ─────────────────────────────────────────────

const ORIGINS: Record<TooltipSide, string> = {
  top: 'bottom center',
  bottom: 'top center',
  left: 'center right',
  right: 'center left',
};

const SLIDE_FROM: Record<TooltipSide, { x: number; y: number }> = {
  top:    { x: 0, y: 6 },
  bottom: { x: 0, y: -6 },
  left:   { x: 6, y: 0 },
  right:  { x: -6, y: 0 },
};

// ─── Position calculator ────────────────────────────────────────────────────

/** Calculates fixed position (viewport-relative) for the tooltip. */
function calcPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: TooltipSide,
  align: TooltipAlign,
  offset: number,
): { top: number; left: number; actualSide: TooltipSide } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Try preferred side, flip if no space
  let actualSide = side;

  if (side === 'top' && triggerRect.top < tooltipRect.height + offset + VIEWPORT_MARGIN) {
    actualSide = 'bottom';
  } else if (side === 'bottom' && vh - triggerRect.bottom < tooltipRect.height + offset + VIEWPORT_MARGIN) {
    actualSide = 'top';
  } else if (side === 'left' && triggerRect.left < tooltipRect.width + offset + VIEWPORT_MARGIN) {
    actualSide = 'right';
  } else if (side === 'right' && vw - triggerRect.right < tooltipRect.width + offset + VIEWPORT_MARGIN) {
    actualSide = 'left';
  }

  let top = 0;
  let left = 0;

  // Main axis (fixed = viewport-relative, no scroll offset)
  switch (actualSide) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - offset;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset;
      break;
    case 'left':
      left = triggerRect.left - tooltipRect.width - offset;
      break;
    case 'right':
      left = triggerRect.right + offset;
      break;
  }

  // Cross axis alignment
  if (actualSide === 'top' || actualSide === 'bottom') {
    switch (align) {
      case 'start':
        left = triggerRect.left;
        break;
      case 'center':
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'end':
        left = triggerRect.right - tooltipRect.width;
        break;
    }
  } else {
    switch (align) {
      case 'start':
        top = triggerRect.top;
        break;
      case 'center':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'end':
        top = triggerRect.bottom - tooltipRect.height;
        break;
    }
  }

  // Clamp to viewport
  left = Math.max(VIEWPORT_MARGIN, Math.min(vw - tooltipRect.width - VIEWPORT_MARGIN, left));
  top = Math.max(VIEWPORT_MARGIN, Math.min(vh - tooltipRect.height - VIEWPORT_MARGIN, top));

  return { top, left, actualSide };
}

// ─── Tooltip ────────────────────────────────────────────────────────────────

export function Tooltip({
  content,
  children,
  rich = false,
  title,
  actions,
  persistent = false,
  side = 'top',
  align = 'center',
  delayOpen = 120,
  delayClose = 100,
  offset = 8,
  disabled = false,
  portal = true,
  className,
  zIndex = 9999,
}: TooltipProps) {
  const locale = useLocale();
  const fixedContent = fixTypo(content, locale);
  const fixedTitle = title ? fixTypo(title, locale) : undefined;
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualSide, setActualSide] = useState(side);

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<number | undefined>(undefined);
  const closeTimerRef = useRef<number | undefined>(undefined);

  const tooltipId = useId();
  const reducedMotion = useReducedMotion();

  // ── Show / Hide ──────────────────────────────────────────────────────
  // Use a ref to avoid stale closure issues between show/hide

  const hideRef = useRef<(() => void) | undefined>(undefined);

  const hide = useCallback(() => {
    clearTimeout(openTimerRef.current);
    clearTimeout(closeTimerRef.current);
    setVisible(false);
    lastTooltipHideTime = Date.now();
    if (globalCloseRef === hideRef.current) globalCloseRef = null;
  }, []);

  useEffect(() => { hideRef.current = hide; });

  const show = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    // Warm-up: skip delay if a tooltip was recently visible
    const isWarmedUp = Date.now() - lastTooltipHideTime < WARMUP_WINDOW;
    const delay = isWarmedUp ? 0 : delayOpen;
    openTimerRef.current = setTimeout(() => {
      if (globalCloseRef && globalCloseRef !== hideRef.current) globalCloseRef();
      globalCloseRef = hideRef.current!;
      setVisible(true);
    }, delay);
  }, [delayOpen]);

  const showImmediate = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    clearTimeout(openTimerRef.current);
    if (globalCloseRef && globalCloseRef !== hideRef.current) globalCloseRef();
    globalCloseRef = hideRef.current!;
    setVisible(true);
  }, []);

  const hideDelayed = useCallback(() => {
    clearTimeout(openTimerRef.current);
    closeTimerRef.current = setTimeout(hide, delayClose);
  }, [hide, delayClose]);

  // ── Position update ──────────────────────────────────────────────────

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const { top, left, actualSide: newSide } = calcPosition(
      triggerRect, tooltipRect, side, align, offset,
    );

    setPosition({ top, left });
    setActualSide(newSide);
  }, [visible, side, align, offset]);

  // ── Escape key ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, hide]);

  // ── Scroll dismisses transient tooltips ──────────────────────────────

  useEffect(() => {
    if (!visible || (rich && persistent)) return;
    const handler = () => hide();
    window.addEventListener('scroll', handler, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', handler, true);
  }, [visible, rich, persistent, hide]);

  // ── Click outside dismisses persistent rich tooltip ──────────────────

  useEffect(() => {
    if (!visible || !persistent) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        tooltipRef.current?.contains(target)
      ) return;
      hide();
    };
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handler);
    }, 0);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handler);
    };
  }, [visible, persistent, hide]);

  // ── Cleanup timers on unmount ────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
      if (globalCloseRef === hideRef.current) globalCloseRef = null;
    };
  }, []);

  // ── Disabled: don't render tooltip ───────────────────────────────────

  if (disabled) {
    return <>{children}</>;
  }

  // ── Trigger props ────────────────────────────────────────────────────

  const triggerProps: Record<string, unknown> = {
    'aria-describedby': visible ? tooltipId : undefined,
  };

  if (rich && persistent) {
    // Click-triggered persistent rich tooltip
    triggerProps.onClick = (e: React.MouseEvent) => {
      // Call child's onClick too
      if (isValidElement(children) && (children.props as Record<string, unknown>).onClick) {
        ((children.props as Record<string, unknown>).onClick as (e: React.MouseEvent) => void)(e);
      }
      if (visible) hide();
      else showImmediate();
    };
  } else {
    // Hover/focus triggered
    triggerProps.onMouseEnter = show;
    triggerProps.onMouseLeave = hideDelayed;
    triggerProps.onFocus = (e: React.FocusEvent) => {
      // Only show on keyboard focus, not mouse focus
      if (e.target.matches(':focus-visible')) show();
    };
    triggerProps.onBlur = hide;
  }

  // ── Clone trigger with ref + props ───────────────────────────────────

  let trigger: ReactNode = children;
  if (isValidElement(children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/refs
    trigger = cloneElement(children as ReactElement<any>, { ref: triggerRef, ...triggerProps });
  }

  // ── Motion config ────────────────────────────────────────────────────

  const slide = SLIDE_FROM[actualSide];

  const motionInitial = reducedMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.96, x: slide.x, y: slide.y };

  const motionAnimate = reducedMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, x: 0, y: 0 };

  const motionExit = reducedMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.96, x: slide.x, y: slide.y };

  const motionTransition = rich
    ? transition.reveal
    : {
        opacity: { duration: duration.instant, ease: ease.enter },
        default: spring.snappy,
      };

  // ── Tooltip element ──────────────────────────────────────────────────

  const tooltipContent = (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          initial={motionInitial}
          animate={motionAnimate}
          exit={motionExit}
          transition={motionTransition}
          className={cn(
            'fixed pointer-events-auto',
            rich
              ? 'rounded-lg bg-[var(--color-surface-1)]'
              : 'rounded-m bg-[var(--color-inverted-surface)]',
            className,
          )}
          style={{
            top: position.top,
            left: position.left,
            zIndex,
            transformOrigin: ORIGINS[actualSide],
            maxWidth: rich ? 320 : 240,
            ...(rich
              ? {
                  padding: '12px 16px',
                  border: '1px solid var(--color-border)',
                  boxShadow: shadows['medium-1'],
                }
              : {
                  padding: '6px 12px 7px',
                }),
          }}
          onMouseEnter={() => {
            // WCAG 1.4.13: hoverable — keep tooltip open when cursor moves onto it
            if (!persistent) clearTimeout(closeTimerRef.current);
          }}
          onMouseLeave={() => {
            if (!persistent) hideDelayed();
          }}
        >
          {rich ? (
            // Rich tooltip content
            <div className="flex flex-col gap-2">
              {title && (
                <span
                  className="font-sans text-sm font-semibold"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {fixedTitle}
                </span>
              )}
              <span
                className="font-sans text-sm font-medium"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {fixedContent}
              </span>
              {actions && actions.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {actions.slice(0, 2).map((action) => (
                    <Button
                      key={action.label}
                      variant="link"
                      size="sm"
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Plain tooltip content
            <span
              className="font-sans text-sm font-medium"
              style={{ color: 'var(--color-on-inverted-surface)' }}
            >
              {fixedContent}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {trigger}
      {portal ? createPortal(tooltipContent, document.body) : tooltipContent}
    </>
  );
}
