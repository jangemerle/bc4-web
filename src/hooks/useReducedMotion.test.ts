import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  let listeners: Map<string, (e: MediaQueryListEvent) => void>;
  let matchesValue: boolean;

  beforeEach(() => {
    listeners = new Map();
    matchesValue = false;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: matchesValue,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_: string, handler: (e: MediaQueryListEvent) => void) => {
          listeners.set(query, handler);
        },
        removeEventListener: () => {
          listeners.delete(query);
        },
        dispatchEvent: () => false,
      }),
    });
  });

  it('returns false when motion is not reduced', () => {
    matchesValue = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when motion is reduced', () => {
    matchesValue = true;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when preference changes', () => {
    matchesValue = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    // Simulate OS preference change
    const handler = listeners.get('(prefers-reduced-motion: reduce)');
    expect(handler).toBeDefined();

    act(() => {
      handler!({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    // After unmount, the listener should be removed
    expect(listeners.has('(prefers-reduced-motion: reduce)')).toBe(false);
  });
});
