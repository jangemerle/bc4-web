/**
 * useReducedMotion — returns true when the OS has prefers-reduced-motion enabled.
 * Use this to skip spatial animations (scale, translate, rotate) in components.
 * Opacity-only fades under 200ms are acceptable even with reduced motion.
 */

import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}
