/**
 * Design System — Toggle component
 *
 * Sizes:     sm (28×16px) | md (36×20px) | lg (44×24px)
 * States:    default | hover | active | disabled | invalid
 *
 * Off:  neutral track (#c8d1d1) + white thumb (left)
 * On:   inverted-surface track + white thumb (right)
 * Hover off: #b0bcbc (darker neutral) + thumb scale 1.18
 * Hover on:  #4571ab (secondary-700) + thumb scale 1.18
 *
 * Animations (motion.dev):
 *   Thumb slide  — x spring.default (smooth lateral movement)
 *   Track color  — duration.instant + ease.standard
 *   Press        — track + thumb scale via spring.snappy
 *
 * Usage:
 *   <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} label="Dark mode" />
 *   <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} size="lg" />
 */

import { forwardRef, useState, useRef, useEffect, type InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Icon } from './Icon';
import { cn } from '../lib/cn';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';
import { spring, ease, duration } from '../tokens/motion';
import { shadows } from '../tokens/shadows';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Public types ────────────────────────────────────────────────────────────

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size variant */
  size?: ToggleSize;
  /** Label text */
  label?: string;
  /** Invalid state */
  invalid?: boolean;
  /** Error message shown below label when invalid */
  errorMessage?: string;
}

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig: Record<ToggleSize, {
  trackW: number;     // track width in px
  trackH: number;     // track height in px
  thumbSize: number;  // thumb diameter in px
  margin: number;     // thumb inset from edges
  track: string;      // Tailwind w/h classes
  labelText: string;  // font size class
}> = {
  sm: { trackW: 28, trackH: 16, thumbSize: 10, margin: 3, track: 'w-7 h-4',   labelText: 'text-md tracking-[0.14px]'  },
  md: { trackW: 36, trackH: 20, thumbSize: 14, margin: 3, track: 'w-9 h-5',   labelText: 'text-md tracking-[0.14px]'  },
  lg: { trackW: 44, trackH: 24, thumbSize: 18, margin: 3, track: 'w-11 h-6',  labelText: 'text-base tracking-[0.16px]' },
};

// ─── Animation presets ───────────────────────────────────────────────────────

const trackColorTransition = { duration: duration.instant, ease: ease.standard };

// ─── Component ───────────────────────────────────────────────────────────────

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  {
    size = 'md',
    checked,
    label,
    invalid,
    errorMessage,
    disabled,
    onChange,
    className,
    ...rest
  },
  ref,
) {
  const locale = useLocale();
  const cfg = sizeConfig[size];
  const isChecked = !!checked;

  // How far the thumb travels from its resting (left) position
  const travelX = cfg.trackW - cfg.thumbSize - cfg.margin * 2;

  const [isHovered, setIsHovered] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const prevChecked = useRef(isChecked);
  const { isPressed, pressHandlers } = usePress({ disabled });
  const reducedMotion = useReducedMotion();

  // Detect toggle and briefly enlarge thumb
  useEffect(() => {
    if (prevChecked.current !== isChecked) {
      prevChecked.current = isChecked;
      setIsToggling(true); // eslint-disable-line react-hooks/set-state-in-effect
      const timer = setTimeout(() => setIsToggling(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isChecked]);
  const errorId = `toggle-${rest.id || 'default'}-error`;

  // ── Track background color ─────────────────────────────────────────
  // Figma: ON = primary-1, hover = primary-2, active = inverted-surface
  //         OFF = surface-5, hover = surface-6, active = surface-7
  const getTrackColor = () => {
    if (!isChecked) {
      if (disabled) return 'var(--color-surface-5)';
      if (invalid)  return 'var(--color-danger-secondary-1)';
      if (!isToggling && isPressed) return 'var(--color-surface-7)';
      if (isHovered) return 'var(--color-surface-6)';
      return 'var(--color-surface-5)';
    }
    // checked
    if (disabled) return 'var(--color-primary-1)';
    if (invalid)  return 'var(--color-danger-1)';
    if (!isToggling && isPressed) return 'var(--color-inverted-surface)';
    if (isHovered) return 'var(--color-primary-2)';
    return 'var(--color-primary-1)';
  };

  return (
    <div className={cn('inline-flex flex-col', className)}>
      <label
        className={cn(
          'inline-flex items-center select-none',
          label ? 'gap-2' : '',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...pressHandlers}
      >
        {/* Hidden native input — provides accessibility + form value */}
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          aria-checked={isChecked}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
          className="sr-only peer"
          {...rest}
        />

        {/* Track — animated background color + press scale */}
        <motion.div
          className={cn(
            'relative shrink-0 rounded-full',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-primary-1)] peer-focus-visible:outline-offset-2',
            cfg.track,
          )}
          animate={{
            backgroundColor: getTrackColor(),
            scale: reducedMotion ? 1 : isPressed ? 0.93 : 1,
          }}
          transition={reducedMotion ? { duration: 0 } : {
            backgroundColor: trackColorTransition,
            scale: spring.snappy,
          }}
        >
          {/* Thumb — slides left ↔ right via spring, scales up + shadow on hover */}
          <motion.div
            className="absolute rounded-full bg-white"
            style={{
              width: cfg.thumbSize,
              height: cfg.thumbSize,
              top: cfg.margin,
              left: cfg.margin,
            }}
            animate={{
              x: isChecked ? travelX : 0,
              scale: reducedMotion ? 1 : isToggling ? 1.1 : isHovered && !disabled ? 0.85 : 1,
              boxShadow: isHovered && !disabled
                ? shadows['small-3']
                : isChecked ? shadows['small-2'] : shadows['small-1'],
            }}
            transition={reducedMotion ? { duration: 0 } : {
              x: spring.playful,
              scale: spring.playful,
              boxShadow: { duration: duration.fast, ease: ease.standard },
            }}
          />
        </motion.div>

        {/* Label */}
        {label && (
          <span
            className={cn('font-sans font-semibold leading-normal', cfg.labelText)}
            style={{ color: disabled ? 'var(--color-on-surface-subtle-1)' : 'var(--color-on-surface)' }}
          >
            {fixTypo(label, locale)}
          </span>
        )}
      </label>

      {/* Error message */}
      {invalid && errorMessage && (
        <div
          id={errorId}
          className="flex items-center gap-1 mt-1"
          style={{ marginLeft: label ? `calc(${cfg.trackW}px + 8px)` : undefined, color: 'var(--color-danger-1)' }}
        >
          <Icon icon={AlertCircle} size="sm" />
          <span className="font-sans text-sm font-medium leading-normal">
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
});
