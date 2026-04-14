/**
 * ToastItem — renders a single toast notification.
 *
 * Visual rules:
 * - No border. Edge comes from shadow-medium-2.
 * - Surface-1 bg, rounded-lg (12px), 16px padding.
 * - Title text-md/semibold, description text-sm/on-surface-subtle-1.
 * - Muted close button matching Modal's pattern.
 * - Icon vertically centered on title line-height via wrapper box.
 */

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { spring as motionSpring } from 'motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react';
import type { ToastData, ToastType } from './types';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Typo } from '../Typo';
import { cn } from '../../lib/cn';
import {
  duration as motionDuration,
  ease,
  cssEase,
  spring as dsSpring,
} from '../../tokens/motion';
import { glass, glassBackground } from '../../tokens/glass';

const SWIPE_THRESHOLD = 45;
const REMOVE_DELAY = 200;

// Duration in ms for CSS transitions (from motion tokens)
const ENTER_MS = Math.round(motionDuration.base * 1000);  // 240ms
const EXIT_MS = Math.round(motionDuration.fast * 1000);    // 160ms

// Bounce transform — generated at module load from the DS `spring.playful`
// token (the canonical spring for toasts per tokens.md). Motion's spring()
// emits `{ms}ms linear(…)` which is directly usable as a CSS transition
// shorthand, so we get real spring physics with zero runtime JS cost.
const BOUNCE_TRANSFORM = motionSpring({
  visualDuration: dsSpring.playful.visualDuration,
  bounce: dsSpring.playful.bounce,
  keyframes: [0, 1],
}).toString();

// CSS transition string using motion tokens
const TRANSITION = [
  `transform ${BOUNCE_TRANSFORM}`,
  `opacity ${EXIT_MS}ms ${cssEase(ease.exit)}`,
  `height ${ENTER_MS}ms ${cssEase(ease.enter)}`,
].join(', ');

interface ToastItemProps {
  toast: ToastData;
  index: number;
  expanded: boolean;
  frontHeight: number;
  offset: number;
  totalCount: number;
  position: string;
  defaultDuration: number;
  onHeightChange: (id: string | number, height: number) => void;
  onRemoveHeight: (id: string | number) => void;
  onDismiss: (id: string | number) => void;
  onRemove: (id: string | number) => void;
}

// ─── Type → lucide icon mapping ──────────────────────────────────────────────

const typeIconMap: Record<ToastType, typeof CheckCircle2 | null> = {
  default: null,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const typeColor: Record<ToastType, string> = {
  default: 'var(--color-on-surface)',
  success: 'var(--color-success-1)',
  error: 'var(--color-danger-1)',
  warning: 'var(--color-warning-1)',
  info: 'var(--color-on-secondary-1)',
  loading: 'var(--color-on-surface-subtle-1)',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ToastItem({
  toast,
  index,
  expanded,
  frontHeight,
  offset,
  totalCount,
  position,
  defaultDuration,
  onHeightChange,
  onRemoveHeight,
  onDismiss,
  onRemove,
}: ToastItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [mounted, setMounted] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [swipeAmount, setSwipeAmount] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const remainingRef = useRef(toast.duration ?? defaultDuration);
  const timerStartRef = useRef(0);

  const isFront = index === 0;
  const isTop = position.startsWith('top');
  const lift = isTop ? 1 : -1;

  // ─── Mount ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // ─── Height measurement ────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!ref.current) return;
    const h = ref.current.getBoundingClientRect().height;
    onHeightChange(toast.id, h);
  }, [toast.id, toast.title, toast.description, toast.type, onHeightChange]);

  // ─── Timer ─────────────────────────────────────────────────────────────
  const dur = toast.duration ?? defaultDuration;
  const isLoading = toast.type === 'loading';

  const startTimer = useCallback(() => {
    if (isLoading || dur === Infinity) return;
    timerStartRef.current = Date.now();
    timerRef.current = setTimeout(() => onDismiss(toast.id), remainingRef.current);
  }, [isLoading, dur, toast.id, onDismiss]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - timerStartRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
  }, []);

  useEffect(() => { remainingRef.current = dur; }, [dur, toast.type]);

  useEffect(() => {
    if (expanded || toast.dismiss) pauseTimer();
    else startTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [expanded, toast.dismiss, startTimer, pauseTimer]);

  // ─── Dismiss lifecycle ─────────────────────────────────────────────────
  useEffect(() => {
    if (toast.dismiss && !removed) {
      onRemoveHeight(toast.id);
      setTimeout(() => {
        setRemoved(true);
        onRemove(toast.id);
      }, REMOVE_DELAY);
    }
  }, [toast.dismiss, removed, toast.id, onRemoveHeight, onRemove]);

  // ─── Swipe ─────────────────────────────────────────────────────────────
  const swipeStartRef = useRef({ x: 0, y: 0, time: 0 });
  const swipeLockedRef = useRef<'x' | 'y' | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    swipeStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    swipeLockedRef.current = null;
    setSwiping(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!swiping || !e.isPrimary) return;
    const dx = e.clientX - swipeStartRef.current.x;
    const dy = e.clientY - swipeStartRef.current.y;
    if (!swipeLockedRef.current) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        swipeLockedRef.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      return;
    }
    if (swipeLockedRef.current === 'x') setSwipeAmount(dx);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!swiping || !e.isPrimary) return;
    setSwiping(false);
    const dx = e.clientX - swipeStartRef.current.x;
    const elapsed = Date.now() - swipeStartRef.current.time;
    const velocity = Math.abs(dx) / elapsed;
    if (Math.abs(dx) >= SWIPE_THRESHOLD || velocity > 0.11) {
      setSwipeAmount(dx > 0 ? 400 : -400);
      setTimeout(() => onDismiss(toast.id), 150);
    } else {
      setSwipeAmount(0);
    }
    swipeLockedRef.current = null;
  };

  // ─── Render ────────────────────────────────────────────────────────────
  const lucideIcon = toast.icon || typeIconMap[toast.type];

  // Front = solid surface. Back (2nd/3rd) = frosted glass so the peek strip
  // blurs whatever sits behind on the page, giving the stack a sense of depth.
  //
  // The recession fade is baked into the tint's alpha (not a separate
  // `opacity` property) — `opacity < 1` creates a stacking context that
  // diminishes backdrop-filter compositing. `surface-3` is visibly distinct
  // from `surface-1`, so the back toasts read as a different shade even
  // when there's no colourful content behind the peek to blur.
  const tintAlpha = isFront ? 1 : index === 1 ? 0.72 : 0.44;
  const background = isFront
    ? 'var(--color-surface-1)'
    : glassBackground('var(--color-surface-3)', tintAlpha);
  const backdropBlur = isFront ? undefined : 'blur(3px)';

  const dynamicStyle: React.CSSProperties = {
    position: 'absolute',
    ...(isTop ? { top: 0 } : { bottom: 0 }),
    left: 0,
    right: 0,
    zIndex: totalCount - index,
    // Mount/unmount fade only — recession is in the background alpha.
    opacity: mounted && !removed ? 1 : 0,
    background,
    backdropFilter: backdropBlur,
    WebkitBackdropFilter: backdropBlur,
    transform: swiping
      ? `translateX(${swipeAmount}px) translateY(calc(${lift} * ${expanded ? `${offset}px` : `${index * 8}px`}))`
      : removed
        ? `translateY(calc(${lift} * -100%))`
        : mounted
          ? expanded
            ? `translateY(calc(${lift} * ${offset}px))`
            : isFront
              ? 'translateY(0)'
              : `translateY(calc(${lift} * ${index * 8}px)) scale(${1 - index * 0.04})`
          : `translateY(calc(${lift} * ${isTop ? '-100%' : '100%'}))`,
    height: !expanded && !isFront && mounted && !removed ? frontHeight : undefined,
    overflow: !expanded && !isFront ? 'hidden' : undefined,
    transition: swiping ? 'none' : TRANSITION,
    cursor: swiping ? 'grabbing' : 'grab',
  };

  return (
    <li
      ref={ref}
      role="status"
      aria-live="polite"
      data-type={toast.type}
      style={dynamicStyle}
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg',
        'shadow-medium-2',
        'select-none touch-none',
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Type icon — height matches title line-height (text-md × 1.5 = 21px)
          so items-start row + flex-centered box gives perfect optical alignment
          with the first line of text without off-grid margins. */}
      {lucideIcon && (
        <div
          className={cn(
            'shrink-0 flex items-center h-[21px]',
            toast.type === 'loading' && 'animate-spin',
          )}
          style={{ color: typeColor[toast.type] }}
        >
          <Icon icon={lucideIcon} size="sm" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p
            className="font-sans text-md font-semibold"
            style={{ color: 'var(--color-on-surface)' }}
          >
            <Typo>{toast.title}</Typo>
          </p>
        )}
        {toast.description && (
          <p
            className="font-sans text-sm mt-1"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            <Typo>{toast.description}</Typo>
          </p>
        )}
        {toast.action && (
          <div className="mt-2">
            <Button
              variant="link"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast.action!.onClick();
                onDismiss(toast.id);
              }}
            >
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* Close — muted icon button matching Modal's pattern (not Button variant="link"
          which renders in primary-1 blue; close should recede, not shout). */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(toast.id);
        }}
        aria-label="Close toast"
        className={cn(
          'shrink-0 flex items-center justify-center h-[21px] w-[21px] rounded-m',
          'cursor-pointer bg-transparent border-none p-0',
          'hover:bg-[var(--color-surface-3)]',
          'outline-none focus-visible:outline focus-visible:outline-2',
          'focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
          'transition-colors',
        )}
        style={{
          color: 'var(--color-on-surface-subtle-1)',
          transitionDuration: `${Math.round(motionDuration.fast * 1000)}ms`,
          transitionTimingFunction: cssEase(ease.standard),
        }}
      >
        <Icon icon={X} size="sm" />
      </button>

    </li>
  );
}
