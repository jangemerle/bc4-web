import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePress } from './usePress';

describe('usePress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createPointerEvent = (isPrimary = true) =>
    ({ isPrimary } as React.PointerEvent);

  it('starts with isPressed = false', () => {
    const { result } = renderHook(() => usePress());
    expect(result.current.isPressed).toBe(false);
  });

  it('sets isPressed = true on pointerDown', () => {
    const { result } = renderHook(() => usePress());
    act(() => {
      result.current.pressHandlers.onPointerDown(createPointerEvent());
    });
    expect(result.current.isPressed).toBe(true);
  });

  it('holds isPressed for at least 120ms (default minDuration)', () => {
    const { result } = renderHook(() => usePress());

    // Press and immediately release
    act(() => {
      result.current.pressHandlers.onPointerDown(createPointerEvent());
    });
    act(() => {
      result.current.pressHandlers.onPointerUp(createPointerEvent());
    });

    // Should still be pressed (within 120ms)
    expect(result.current.isPressed).toBe(true);

    // After 119ms — still pressed
    act(() => {
      vi.advanceTimersByTime(119);
    });
    expect(result.current.isPressed).toBe(true);

    // After 120ms — released
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('releases immediately if held longer than minDuration', () => {
    const { result } = renderHook(() => usePress());

    act(() => {
      result.current.pressHandlers.onPointerDown(createPointerEvent());
    });

    // Hold for 200ms (longer than 120ms default)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Release — should clear immediately (remaining = 0)
    act(() => {
      result.current.pressHandlers.onPointerUp(createPointerEvent());
    });

    // Timer fires at 0ms remaining
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('does not activate when disabled', () => {
    const { result } = renderHook(() => usePress({ disabled: true }));
    act(() => {
      result.current.pressHandlers.onPointerDown(createPointerEvent());
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('ignores non-primary pointer events', () => {
    const { result } = renderHook(() => usePress());
    act(() => {
      result.current.pressHandlers.onPointerDown(createPointerEvent(false));
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('releases on pointerLeave', () => {
    const { result } = renderHook(() => usePress());
    act(() => {
      result.current.pressHandlers.onPointerDown(createPointerEvent());
    });
    act(() => {
      result.current.pressHandlers.onPointerLeave(createPointerEvent());
    });
    // Held for minDuration
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('releases on pointerCancel', () => {
    const { result } = renderHook(() => usePress());
    act(() => {
      result.current.pressHandlers.onPointerDown(createPointerEvent());
    });
    act(() => {
      result.current.pressHandlers.onPointerCancel(createPointerEvent());
    });
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('respects custom minDuration', () => {
    const { result } = renderHook(() => usePress({ minDuration: 300 }));

    act(() => {
      result.current.pressHandlers.onPointerDown(createPointerEvent());
    });
    act(() => {
      result.current.pressHandlers.onPointerUp(createPointerEvent());
    });

    // Still pressed at 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.isPressed).toBe(true);

    // Released at 300ms
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('returns stable pressHandlers object shape', () => {
    const { result } = renderHook(() => usePress());
    const handlers = result.current.pressHandlers;
    expect(handlers).toHaveProperty('onPointerDown');
    expect(handlers).toHaveProperty('onPointerUp');
    expect(handlers).toHaveProperty('onPointerLeave');
    expect(handlers).toHaveProperty('onPointerCancel');
  });
});
