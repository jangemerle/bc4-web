/**
 * Toaster — container for toast notifications.
 *
 * Place once in your app root:
 *   <Toaster position="top-right" />
 *
 * Then use toast() from anywhere:
 *   import { toast } from '../components/Toast';
 *   toast.success('Saved');
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import type { ToastData, ToastPosition } from './types';
import { observer } from './state';
import { ToastItem } from './ToastItem';

const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 4000;
const TOAST_WIDTH = 360;
const GAP = 12;

// ─── Position → CSS ──────────────────────────────────────────────────────────

function positionStyle(position: ToastPosition): React.CSSProperties {
  const [y, x] = position.split('-') as [string, string];

  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 999999,
    display: 'flex',
    flexDirection: 'column',
    width: TOAST_WIDTH,
    padding: 'var(--space-lg)',
    pointerEvents: 'none',
  };

  // Vertical
  if (y === 'top') {
    base.top = 0;
  } else {
    base.bottom = 0;
  }

  // Horizontal
  if (x === 'left') {
    base.left = 0;
  } else if (x === 'right') {
    base.right = 0;
  } else {
    // center
    base.left = '50%';
    base.transform = 'translateX(-50%)';
  }

  return base;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ToasterProps {
  position?: ToastPosition;
  /** Default auto-dismiss duration in ms */
  duration?: number;
}

export function Toaster({
  position = 'bottom-right',
  duration = DEFAULT_DURATION,
}: ToasterProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [heights, setHeights] = useState<Map<string | number, number>>(new Map());
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  // ─── Subscribe to observer ─────────────────────────────────────────────
  useEffect(() => {
    const unsub = observer.subscribe((incoming) => {
      // Use setTimeout + flushSync to prevent React batching
      // (needed for accurate height measurements between consecutive toasts)
      setTimeout(() => {
        flushSync(() => {
          setToasts(prev => {
            // Dismiss
            if (incoming.dismiss) {
              return prev.map(t =>
                t.id === incoming.id ? { ...t, dismiss: true } : t
              );
            }

            // Update existing (promise transitions)
            const existing = prev.findIndex(t => t.id === incoming.id);
            if (existing !== -1) {
              const updated = [...prev];
              updated[existing] = { ...updated[existing], ...incoming };
              return updated;
            }

            // Add new
            return [incoming, ...prev];
          });
        });
      }, 0);
    });
    return unsub;
  }, []);

  // ─── Height tracking ───────────────────────────────────────────────────
  const handleHeightChange = useCallback((id: string | number, height: number) => {
    setHeights(prev => {
      const next = new Map(prev);
      next.set(id, height);
      return next;
    });
  }, []);

  const handleRemoveHeight = useCallback((id: string | number) => {
    setHeights(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // ─── Dismiss / remove ──────────────────────────────────────────────────
  const handleDismiss = useCallback((id: string | number) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, dismiss: true } : t))
    );
  }, []);

  const handleRemove = useCallback((id: string | number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Expand on hover ───────────────────────────────────────────────────
  const handleMouseEnter = () => setExpanded(true);
  const handleMouseLeave = () => setExpanded(false);

  // ─── Compute offsets ───────────────────────────────────────────────────
  const visibleToasts = toasts.slice(0, MAX_VISIBLE);
  const frontHeight = heights.get(visibleToasts[0]?.id) ?? 0;

  const offsets = visibleToasts.map((_, i) => {
    let offset = 0;
    for (let j = 0; j < i; j++) {
      offset += (heights.get(visibleToasts[j]?.id) ?? 0) + GAP;
    }
    return offset;
  });

  if (visibleToasts.length === 0) return null;

  return (
    <section
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
      style={positionStyle(position)}
    >
      <ol
        ref={listRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          width: '100%',
          // Reserve space for the front toast + collapsed stack peek
          minHeight: frontHeight + (expanded
            ? offsets[offsets.length - 1] ?? 0
            : Math.min(visibleToasts.length - 1, 2) * 8),
          transition: 'min-height 300ms cubic-bezier(0, 0, 0.2, 1)',
          pointerEvents: 'auto',
        }}
      >
        {visibleToasts.map((t, i) => (
          <ToastItem
            key={t.id}
            toast={t}
            index={i}
            expanded={expanded}
            frontHeight={frontHeight}
            offset={offsets[i]}
            totalCount={visibleToasts.length}
            position={position}
            defaultDuration={duration}
            onHeightChange={handleHeightChange}
            onRemoveHeight={handleRemoveHeight}
            onDismiss={handleDismiss}
            onRemove={handleRemove}
          />
        ))}
      </ol>
    </section>
  );
}
