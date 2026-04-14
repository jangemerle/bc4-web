/**
 * usePress — reliable press state with a minimum visible duration.
 *
 * Problem: whileTap exits the moment pointerup fires. On a Magic Trackpad
 * "tap to click" sends pointerdown + pointerup within ~10–50 ms, so the
 * animation is cancelled before it's perceptible.
 *
 * Solution: keep isPressed = true for at least `minDuration` ms after
 * pointerdown, regardless of how quickly pointerup arrives. This guarantees
 * the press animation always plays to a visible point before snapping back.
 *
 * Usage:
 *   const { isPressed, pressHandlers } = usePress();
 *   <motion.button animate={{ scale: isPressed ? 0.97 : 1 }} {...pressHandlers} />
 *
 * Use in any interactive component that needs a press/active animation:
 *   Button, IconButton, Card (clickable), ListItem (clickable), etc.
 */

import { useState, useRef, useCallback } from 'react';

export interface UsePressOptions {
  /** Minimum ms to hold the pressed state. Default: 120 */
  minDuration?: number;
  /** Skip press behaviour (e.g. disabled state) */
  disabled?: boolean;
}

export interface UsePressResult {
  isPressed: boolean;
  pressHandlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
}

export function usePress({
  minDuration = 120,
  disabled = false,
}: UsePressOptions = {}): UsePressResult {
  const [isPressed, setIsPressed] = useState(false);
  const pressedAt = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const press = useCallback(() => {
    if (disabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    pressedAt.current = Date.now();
    setIsPressed(true);
  }, [disabled]);

  const release = useCallback(() => {
    if (!isPressed) return;
    const elapsed = Date.now() - pressedAt.current;
    const remaining = Math.max(0, minDuration - elapsed);
    timerRef.current = setTimeout(() => setIsPressed(false), remaining);
  }, [isPressed, minDuration]);

  const pressHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      // Only respond to primary pointer (left click / first touch)
      if (e.isPrimary) press();
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (e.isPrimary) release();
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.isPrimary) release();
    },
    onPointerCancel: (e: React.PointerEvent) => {
      if (e.isPrimary) release();
    },
  };

  return { isPressed, pressHandlers };
}
