/**
 * Design System — Checkbox component
 * Source: Figma / Topic Board New / node 1928:9605
 *
 * Sizes:     sm (16px) | md (20px) | lg (24px)
 * Types:     unchecked | checked (check icon) | indeterminate (minus icon)
 * States:    default | hover | active | disabled | invalid
 *
 * Hover behavior:
 *   Unchecked — ghost check icon appears at 50% opacity
 *   Checked   — bg shifts to on-secondary-2, check/minus icon fades to 50% opacity
 *
 * Animations (motion.dev):
 *   Check in   — stroke draws from start to finish via pathLength
 *   Minus in   — stroke draws left to right via pathLength
 *   Check out  — stroke erases + fade
 *   Box fill   — background color transition
 *
 * Usage:
 *   <Checkbox />
 *   <Checkbox checked onChange={toggle} />
 *   <Checkbox checked indeterminate />
 *   <Checkbox label="Accept terms" />
 *   <Checkbox checked invalid errorMessage="Required" />
 */

import { forwardRef, useEffect, useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';
import { cn } from '../lib/cn';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';
import { duration, ease } from '../tokens/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Public types ────────────────────────────────────────────────────────────

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size of the checkbox box */
  size?: CheckboxSize;
  /** Indeterminate state — shows minus icon instead of check when checked */
  indeterminate?: boolean;
  /** Label text */
  label?: string;
  /** Invalid state */
  invalid?: boolean;
  /** Error message shown below label when invalid */
  errorMessage?: string;
  /** Externally controlled hover state (e.g. when embedded in another component) */
  hovered?: boolean;
}

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig: Record<CheckboxSize, {
  box: string;        // w/h class
  boxPx: number;      // for motion layout
  radius: number;     // border-radius px — scales with box size
  iconSize: number;   // svg viewBox px
  strokeWidth: number; // stroke weight
  labelText: string;  // font size class
}> = {
  sm: { box: 'size-4',  boxPx: 16, radius: 4, iconSize: 10, strokeWidth: 2.5, labelText: 'text-md tracking-[0.14px]'  },
  md: { box: 'size-5',  boxPx: 20, radius: 5, iconSize: 12, strokeWidth: 2.5, labelText: 'text-md tracking-[0.14px]'  },
  lg: { box: 'size-6',  boxPx: 24, radius: 6, iconSize: 14, strokeWidth: 2.5, labelText: 'text-base tracking-[0.16px]' },
};

// ─── Animated SVG icons ──────────────────────────────────────────────────────

const strokeDrawTransition = {
  pathLength: { duration: duration.base, ease: ease.stroke },
  opacity: { duration: duration.instant * 0.5 },
};

/** Animated check mark — stroke draws from bottom-left to top-right */
function AnimatedCheck({ size, strokeWidth, color }: { size: number; strokeWidth: number; color: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M4 12.5L9.5 18L20 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={strokeDrawTransition}
      />
    </motion.svg>
  );
}

/** Animated minus — stroke draws left to right */
function AnimatedMinus({ size, strokeWidth, color }: { size: number; strokeWidth: number; color: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M5 12H19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={strokeDrawTransition}
      />
    </motion.svg>
  );
}

// ─── Animation presets ───────────────────────────────────────────────────────

const bgTransition = {
  duration: duration.base,
  ease: ease.standard,
};

// ─── Component ───────────────────────────────────────────────────────────────

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size = 'sm',
    checked,
    indeterminate = false,
    label,
    invalid,
    errorMessage,
    disabled,
    hovered: hoveredProp,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const locale = useLocale();
  const internalRef = useRef<HTMLInputElement>(null);
  const cfg = sizeConfig[size];

  // Sync indeterminate property (not controllable via HTML attribute)
  useEffect(() => {
    const el = internalRef.current;
    if (el) el.indeterminate = indeterminate && !!checked;
  }, [indeterminate, checked]);

  // Merge refs
  const setRef = (el: HTMLInputElement | null) => {
    internalRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
  };

  const autoId = useId();
  const resolvedId = idProp ?? autoId;

  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = hoveredProp ?? internalHovered;
  const reducedMotion = useReducedMotion();
  const errorId = `${resolvedId}-error`;

  const isChecked = !!checked;
  const isIndeterminate = isChecked && indeterminate;

  // ── Background color ─────────────────────────────────────────────────
  const getBgColor = () => {
    if (!isChecked) return 'rgba(0,0,0,0)';
    if (disabled) return 'var(--color-surface-5)';
    if (invalid) return 'var(--color-danger-1)';
    if (hovered) return 'var(--color-on-secondary-2)';
    return 'var(--color-inverted-surface)';
  };

  // ── Border ───────────────────────────────────────────────────────────
  const getBorder = () => {
    if (isChecked) return 'none';
    if (disabled) return '1px solid var(--color-surface-4)';
    if (invalid) return '2px solid var(--color-danger-1)';
    return '1px solid var(--color-on-surface-subtle-2)';
  };

  const iconColor = 'var(--color-on-inverted-surface)';

  return (
    <div className={cn('inline-flex flex-col leading-none', className)}>
      <label
        htmlFor={resolvedId}
        className={cn(
          'group inline-flex items-center select-none',
          label ? 'gap-2' : '',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        onMouseEnter={() => setInternalHovered(true)}
        onMouseLeave={() => setInternalHovered(false)}
      >
        {/* Hidden native input */}
        <input
          ref={setRef}
          id={resolvedId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
          className="sr-only peer"
          {...rest}
        />

        {/* Visual box — animated background */}
        <motion.div
          className={cn(
            'relative shrink-0 overflow-hidden',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-primary-1)] peer-focus-visible:outline-offset-2',
            cfg.box,
          )}
          style={{ borderRadius: cfg.radius, border: getBorder() }}
          animate={{ backgroundColor: getBgColor() }}
          transition={reducedMotion ? { duration: 0 } : bgTransition}
        >
          <AnimatePresence>
            {/* Check mark — stroke draws in */}
            {isChecked && !isIndeterminate && (
              <motion.div
                key="check"
                className={cn(
                  'absolute inset-0 flex items-center justify-center',
                  !disabled && 'group-hover:opacity-50 transition-opacity duration-150',
                )}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.instant }}
              >
                <AnimatedCheck
                  size={cfg.iconSize}
                  strokeWidth={cfg.strokeWidth}
                  color={iconColor}
                />
              </motion.div>
            )}

            {/* Minus — stroke draws in */}
            {isIndeterminate && (
              <motion.div
                key="minus"
                className={cn(
                  'absolute inset-0 flex items-center justify-center',
                  !disabled && 'group-hover:opacity-50 transition-opacity duration-150',
                )}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.instant }}
              >
                <AnimatedMinus
                  size={cfg.iconSize}
                  strokeWidth={cfg.strokeWidth}
                  color={iconColor}
                />
              </motion.div>
            )}

            {/* Ghost check — stroke draws in on hover when unchecked */}
            {!isChecked && !disabled && hovered && (
              <motion.div
                key="ghost"
                className="absolute inset-0 flex items-center justify-center opacity-50"
                exit={{ opacity: 0 }}
                transition={{ duration: duration.instant }}
              >
                <AnimatedCheck
                  size={cfg.iconSize}
                  strokeWidth={cfg.strokeWidth}
                  color="var(--color-on-surface-subtle-2)"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Label */}
        {label && (
          <span
            className={cn(
              'font-sans font-semibold leading-normal',
              cfg.labelText,
            )}
            style={{
              color: disabled
                ? 'var(--color-surface-5)'
                : 'var(--color-on-surface)',
            }}
          >
            {fixTypo(label, locale)}
          </span>
        )}
      </label>

      {/* Error message */}
      {invalid && errorMessage && (
        <div id={errorId} className="flex items-center gap-1 mt-1" style={{ marginLeft: label ? `calc(${cfg.boxPx}px + 8px)` : undefined, color: 'var(--color-danger-1)' }}>
          <Icon icon={AlertCircle} size="sm" />
          <span
            className="font-sans text-sm font-medium leading-normal"
          >
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
});
