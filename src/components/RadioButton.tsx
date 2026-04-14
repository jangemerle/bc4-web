/**
 * Design System — RadioButton component
 * Source: Figma / Topic Board New / node 1928:9703
 *
 * Sizes:     sm (16px) | md (20px) | lg (24px)
 * Shape:     fully round (border-radius: 100px)
 * States:    default | hover | active | disabled | invalid
 *
 * Checked:   inverted-surface fill + white inner dot (50% of box)
 *            Hover/Active: #4571ab (secondary-700)
 *            Disabled: #c0c8c8   Invalid: #d23031
 *
 * Unchecked hover: ghost dot appears inside (~62% inset)
 *
 * Animations (motion.dev):
 *   Dot in     — scale spring (0 → 1)
 *   Dot out    — scale shrink + fade
 *   Ring fill  — background color spring
 *   Ring pulse — subtle scale bump on select
 *
 * Usage:
 *   <RadioGroup name="plan" value={plan} onChange={setPlan}>
 *     <RadioButton value="free" label="Free" />
 *     <RadioButton value="pro" label="Pro" />
 *     <RadioButton value="team" label="Team" />
 *   </RadioGroup>
 *
 *   <RadioButton name="solo" checked={on} onChange={toggle} label="Enable" />
 */

import { createContext, forwardRef, useContext, type InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';
import { cn } from '../lib/cn';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';
import { spring, ease, duration } from '../tokens/motion';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Context (for RadioGroup) ────────────────────────────────────────────────

interface RadioGroupContext {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: RadioButtonSize;
  disabled?: boolean;
  invalid?: boolean;
}

const GroupCtx = createContext<RadioGroupContext | null>(null);

// ─── Public types ────────────────────────────────────────────────────────────

export type RadioButtonSize = 'sm' | 'md' | 'lg';

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /** Size of the radio circle */
  size?: RadioButtonSize;
  /** Label text */
  label?: string;
  /** Value for radio group */
  value?: string;
  /** Invalid state */
  invalid?: boolean;
  /** Error message shown when invalid */
  errorMessage?: string;
  /** Change handler — receives the value string when used in a group */
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
}

export interface RadioGroupProps {
  /** Group name for all child radio buttons */
  name: string;
  /** Currently selected value */
  value?: string;
  /** Called with the new value when selection changes */
  onChange?: (value: string) => void;
  /** Size applied to all children */
  size?: RadioButtonSize;
  /** Disable all children */
  disabled?: boolean;
  /** Invalid state for all children */
  invalid?: boolean;
  /** Layout direction */
  direction?: 'row' | 'column';
  /** Radio buttons */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig: Record<RadioButtonSize, {
  box: string;
  boxPx: number;
  dotScale: number;     // dot diameter as fraction of box
  ghostScale: number;   // ghost dot fraction
  labelText: string;
}> = {
  sm: { box: 'size-4',  boxPx: 16, dotScale: 0.5,   ghostScale: 0.375, labelText: 'text-md tracking-[0.14px]'  },
  md: { box: 'size-5',  boxPx: 20, dotScale: 0.5,   ghostScale: 0.4,   labelText: 'text-md tracking-[0.14px]'  },
  lg: { box: 'size-6',  boxPx: 24, dotScale: 0.5,   ghostScale: 0.375, labelText: 'text-base tracking-[0.16px]' },
};

// ─── Animation presets ───────────────────────────────────────────────────────

const dotSpring = spring.snappy;

const ringTransition = {
  duration: duration.instant,
  ease: ease.standard,
};

// ─── RadioButton ─────────────────────────────────────────────────────────────

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(function RadioButton(
  {
    size: sizeProp,
    checked: checkedProp,
    label,
    value,
    invalid: invalidProp,
    errorMessage,
    disabled: disabledProp,
    name: nameProp,
    onChange,
    className,
    ...rest
  },
  ref,
) {
  const locale = useLocale();
  const group = useContext(GroupCtx);

  const size = sizeProp ?? group?.size ?? 'sm';
  const disabled = disabledProp ?? group?.disabled ?? false;
  const invalid = invalidProp ?? group?.invalid ?? false;
  const name = nameProp ?? group?.name;
  const isChecked = group ? group.value === value : !!checkedProp;

  const cfg = sizeConfig[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (group?.onChange && value !== undefined) {
      group.onChange(value);
    } else if (onChange) {
      onChange(e);
    }
  };

  // ── Colors ──────────────────────────────────────────────────────────
  const getBgColor = () => {
    if (!isChecked) return 'rgba(0,0,0,0)';
    if (disabled) return 'var(--color-surface-5)';
    if (invalid) return 'var(--color-danger-1)';
    return 'var(--color-inverted-surface)';
  };

  const getBorder = () => {
    if (isChecked) return 'none';
    if (disabled) return '1px solid var(--color-surface-4)';
    if (invalid) return '2px solid var(--color-danger-1)';
    return '1px solid var(--color-on-surface-subtle-2)';
  };

  const dotPx = Math.round(cfg.boxPx * cfg.dotScale);
  const ghostPx = Math.round(cfg.boxPx * cfg.ghostScale);

  const { isPressed, pressHandlers } = usePress({ disabled });
  const reducedMotion = useReducedMotion();
  const errorId = `radio-${name}-${value}-error`;

  return (
    <div className={cn('inline-flex flex-col', className)}>
      <label
        className={cn(
          'group inline-flex items-center select-none',
          label ? 'gap-2' : '',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        {...pressHandlers}
      >
        {/* Hidden native input */}
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
          className="sr-only peer"
          {...rest}
        />

        {/* Visual circle — animated bg + subtle scale pulse on check */}
        <motion.div
          className={cn(
            'relative shrink-0 rounded-full flex items-center justify-center overflow-hidden',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-primary-1)] peer-focus-visible:outline-offset-2',
            cfg.box,
            // Hover color change for checked non-disabled
            isChecked && !disabled && !invalid && 'hover:!bg-[var(--color-on-secondary-1)] active:!bg-[var(--color-on-secondary-1)]',
          )}
          animate={{
            backgroundColor: getBgColor(),
            border: getBorder(),
            scale: reducedMotion ? 1 : isPressed ? 0.9 : 1,
          }}
          transition={reducedMotion ? { duration: 0 } : {
            ...ringTransition,
            scale: spring.snappy,
          }}
        >
          <AnimatePresence mode="wait">
            {/* Inner dot — animated spring in/out */}
            {isChecked && (
              <motion.div
                key="dot"
                className="rounded-full bg-white"
                style={{ width: dotPx, height: dotPx }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={dotSpring}
              />
            )}

            {/* Ghost dot — visible on hover when unchecked */}
            {!isChecked && !disabled && (
              <motion.div
                key="ghost"
                className="rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-150"
                style={{
                  width: ghostPx,
                  height: ghostPx,
                  backgroundColor: 'var(--color-on-surface-subtle-2)',
                }}
              />
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
        <div
          id={errorId}
          className="flex items-center gap-1 mt-1"
          style={{
            marginLeft: label
              ? `calc(${cfg.boxPx}px + 8px)`
              : undefined,
            color: 'var(--color-danger-1)',
          }}
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

// ─── RadioGroup ──────────────────────────────────────────────────────────────

export function RadioGroup({
  name,
  value,
  onChange,
  size,
  disabled,
  invalid,
  direction = 'column',
  children,
  className,
}: RadioGroupProps) {
  return (
    <GroupCtx.Provider value={{ name, value, onChange, size, disabled, invalid }}>
      <div
        role="radiogroup"
        className={cn(
          'flex',
          direction === 'column' ? 'flex-col gap-3' : 'flex-row gap-6',
          className,
        )}
      >
        {children}
      </div>
    </GroupCtx.Provider>
  );
}
