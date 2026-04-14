/**
 * useSectionNav — reusable hook for floating section navigation.
 *
 * Tracks which section is in view and pins a floating ContentSwitcher
 * when the inline one scrolls out of the viewport.
 *
 * Works with both window scroll and a scrollable container (e.g. <main>).
 * Auto-detects the nearest scrollable ancestor of the inline ref.
 *
 * Usage:
 *   const { activeSection, pinned, inlineRef, setSectionRef, handleChange } = useSectionNav(['tokens', 'palettes']);
 */

import { useState, useRef, useCallback, useEffect } from 'react';

/** Walk up the DOM to find the nearest scrollable ancestor. */
function findScrollParent(el: HTMLElement | null): HTMLElement | Window {
  let node = el?.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return window;
}

function getViewportHeight(target: HTMLElement | Window): number {
  return target instanceof Window ? window.innerHeight : target.clientHeight;
}

export function useSectionNav<T extends string>(sectionKeys: readonly T[]) {
  const [activeSection, setActiveSection] = useState<T>(sectionKeys[0]);
  const [pinned, setPinned] = useState(false);
  const inlineRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<T, HTMLDivElement | null>>(
    Object.fromEntries(sectionKeys.map(k => [k, null])) as Record<T, HTMLDivElement | null>,
  );

  // Resolve scroll container once the inline ref mounts
  const scrollParentRef = useRef<HTMLElement | Window | null>(null);

  const getScrollParent = useCallback(() => {
    if (!scrollParentRef.current && inlineRef.current) {
      scrollParentRef.current = findScrollParent(inlineRef.current);
    }
    return scrollParentRef.current || window;
  }, []);

  const handleChange = useCallback((value: string) => {
    setActiveSection(value as T);
    const el = sectionRefs.current[value as T];
    if (!el) return;

    const container = getScrollParent();
    if (container instanceof Window) {
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    } else {
      // Scroll within the container
      const offset = 140;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const top = elRect.top - containerRect.top + container.scrollTop - offset;
      container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }, [getScrollParent]);

  // Pin when inline switcher has fully scrolled above the container viewport.
  useEffect(() => {
    const container = getScrollParent();

    const update = () => {
      const el = inlineRef.current;
      if (!el) return;

      if (container instanceof Window) {
        setPinned(el.getBoundingClientRect().bottom < 0);
      } else {
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setPinned(elRect.bottom < containerRect.top);
      }
    };

    container.addEventListener('scroll', update, { passive: true });
    update();
    return () => container.removeEventListener('scroll', update);
  }, [getScrollParent]);

  // Track which section is visible via scroll position.
  useEffect(() => {
    const container = getScrollParent();

    const handleScroll = () => {
      const viewportH = getViewportHeight(container);
      const threshold = container instanceof Window
        ? window.scrollY + viewportH * 0.35
        : container.scrollTop + viewportH * 0.35;

      let active: T = sectionKeys[0];
      let closestDist = Infinity;

      for (const key of sectionKeys) {
        const el = sectionRefs.current[key];
        if (!el) continue;

        let top: number;
        if (container instanceof Window) {
          top = el.getBoundingClientRect().top + window.scrollY;
        } else {
          const containerRect = (container as HTMLElement).getBoundingClientRect();
          top = el.getBoundingClientRect().top - containerRect.top + container.scrollTop;
        }

        if (top <= threshold) {
          const dist = threshold - top;
          if (dist < closestDist) {
            closestDist = dist;
            active = key;
          }
        }
      }
      setActiveSection(active);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sectionKeys, getScrollParent]);

  const setSectionRef = useCallback((key: T) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  }, []);

  return {
    activeSection,
    pinned,
    inlineRef,
    setSectionRef,
    handleChange,
  };
}
