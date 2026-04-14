/**
 * Design System — NumberInput component
 * Source: Figma / Topic Board New / node 1935:3232
 *
 * Sizes:     sm (32px) | md (40px) | lg (48px)
 * States:    default | hover | focus | disabled | readonly | invalid
 * Slots:     label | caption
 *
 * Usage:
 *   <NumberInput label="Quantity" />
 *   <NumberInput label="Amount" value={42} min={0} max={100} step={1} />
 *   <NumberInput label="Count" size="sm" caption="Min 0" />
 *   <NumberInput label="Age" invalid errorMessage="Nope nope nope" />
 */

import { forwardRef, useState, useId, useCallback } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Icon } from './Icon';
import { FormLabel, FormCaption, getFormBorderShadow, getFormBorderClass } from './FormParts';
import { cn } from '../lib/cn';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { spring } from '../tokens/motion';

// ─── Public types ─────────────────────────────────────────────────────────────

export type NumberInputSize = 'sm' | 'md' | 'lg';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /** Label text above the field */
  label?: string;
  /** Helper text below the field */
  caption?: string;
  /** Error message — shown instead of caption when invalid */
  errorMessage?: string;
  /** Mark the field as invalid */
  invalid?: boolean;
  /** Field size */
  size?: NumberInputSize;
  /** Current value (controlled) */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Minimum allowed value (default: 0) */
  min?: number;
  /** Maximum allowed value (default: no limit) */
  max?: number;
  /** Step increment */
  step?: number;
  /** Allow negative values — when true, min defaults to -Infinity instead of 0 */
  allowNegative?: boolean;
  /** Change handler */
  onChange?: (value: number) => void;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const sizeConfig: Record<NumberInputSize, {
  height: string;
  textSize: string;
  labelSize: string;
  captionSize: string;
  gap: string;
  buttonSize: number;
  buttonOffset: string;
  iconSize: 'sm' | 'md' | 'lg';
}> = {
  sm: {
    height: 'h-8',         // 32px
    textSize: 'text-md',   // 14px
    labelSize: 'text-sm',  // 12px
    captionSize: 'text-sm',
    gap: 'gap-1',          // 4px
    buttonSize: 20,
    buttonOffset: '6px',
    iconSize: 'sm',
  },
  md: {
    height: 'h-10',         // 40px
    textSize: 'text-base',  // 16px
    labelSize: 'text-md',   // 14px
    captionSize: 'text-md',
    gap: 'gap-1',           // 4px
    buttonSize: 24,
    buttonOffset: '8px',
    iconSize: 'md',
  },
  lg: {
    height: 'h-12',         // 48px
    textSize: 'text-base',  // 16px
    labelSize: 'text-md',   // 14px
    captionSize: 'text-md',
    gap: 'gap-2',           // 8px
    buttonSize: 28,
    buttonOffset: '10px',
    iconSize: 'md',
  },
};

// ─── Step button (plus/minus) ─────────────────────────────────────────────────

interface StepButtonProps {
  icon: typeof Plus;
  onClick: () => void;
  disabled: boolean;
  size: number;
  iconPx: number;
  'aria-label': string;
}

function StepButton({ icon, onClick, disabled, size, iconPx, 'aria-label': ariaLabel }: StepButtonProps) {
  const { isPressed, pressHandlers } = usePress({ disabled });
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-m',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: isPressed
          ? 'var(--color-secondary-2)'
          : 'var(--color-secondary-1)',
        color: 'var(--color-on-secondary-1)',
        transition: 'background-color 0.15s ease',
      }}
      whileHover={
        disabled || reducedMotion
          ? undefined
          : { backgroundColor: 'var(--color-secondary-2)' }
      }
      animate={{ scale: reducedMotion ? 1 : isPressed ? 0.85 : 1 }}
      transition={spring.snappy}
      aria-label={ariaLabel}
      {...pressHandlers}
    >
      <Icon icon={icon} sizePx={iconPx} strokeWidth={2} />
    </motion.button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    label,
    caption,
    errorMessage,
    invalid = false,
    size = 'md',
    value: controlledValue,
    defaultValue = 0,
    min: minProp,
    max,
    step = 1,
    allowNegative = false,
    onChange,
    disabled,
    readOnly,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const captionId = `${id}-caption`;

  // min defaults to 0 unless allowNegative is true or an explicit min is provided
  const min = minProp ?? (allowNegative ? undefined : 0);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const currentValue = controlledValue ?? internalValue;
  const isFilled = currentValue !== 0;

  const cfg = sizeConfig[size];
  const showError = invalid && errorMessage;

  const canDecrement = min == null || currentValue > min;
  const canIncrement = max == null || currentValue < max;

  const updateValue = useCallback((newValue: number) => {
    const clamped = Math.min(Math.max(newValue, min ?? -Infinity), max ?? Infinity);
    if (controlledValue == null) setInternalValue(clamped);
    onChange?.(clamped);
  }, [controlledValue, min, max, onChange]);

  // Border style based on state priority: invalid > focus > hover > filled > default
  // Uses inset box-shadow instead of border so the 1px→2px transition animates smoothly
  const borderShadow = getFormBorderShadow({ invalid, focused, disabled, readOnly, hovered, filled: isFilled });
  const borderClass = getFormBorderClass({ disabled, readOnly });

  const buttonIconPx = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <div className={cn('flex flex-col w-full', cfg.gap, className)}>
      {/* Label */}
      {label && (
        <FormLabel htmlFor={id} size={size} disabled={disabled} readOnly={readOnly}>
          {label}
        </FormLabel>
      )}

      {/* Field wrapper */}
      <div
        className={cn('relative', cfg.height)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Border */}
        <div className={cn('absolute inset-0', borderClass)} style={{ boxShadow: borderShadow }} />

        {/* Minus button — z-10 to sit above the full-bleed input */}
        <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ left: cfg.buttonOffset }}>
          <StepButton
            icon={Minus}
            onClick={() => updateValue(currentValue - step)}
            disabled={!!(disabled || readOnly || !canDecrement)}
            size={cfg.buttonSize}
            iconPx={buttonIconPx}
            aria-label="Decrease"
          />
        </div>

        {/* Input */}
        <input
          ref={ref}
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={disabled}
          readOnly={readOnly}
          value={currentValue}
          aria-invalid={invalid || undefined}
          aria-describedby={caption || showError ? captionId : undefined}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            if (!isNaN(parsed)) updateValue(parsed);
            else if (e.target.value === '' || e.target.value === '-') {
              if (controlledValue == null) setInternalValue(0);
              onChange?.(0);
            }
          }}
          className={cn(
            'absolute inset-0 w-full h-full bg-transparent outline-none text-center rounded-m',
            'font-sans leading-normal',
            cfg.textSize,
            isFilled ? 'font-semibold' : 'font-medium',
            disabled || readOnly ? 'cursor-not-allowed' : 'cursor-text',
          )}
          style={{
            color: isFilled ? 'var(--color-on-surface)' : 'var(--color-on-surface-subtle-1)',
          }}
          {...rest}
        />

        {/* Plus button — z-10 to sit above the full-bleed input */}
        <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ right: cfg.buttonOffset }}>
          <StepButton
            icon={Plus}
            onClick={() => updateValue(currentValue + step)}
            disabled={!!(disabled || readOnly || !canIncrement)}
            size={cfg.buttonSize}
            iconPx={buttonIconPx}
            aria-label="Increase"
          />
        </div>
      </div>

      {/* Caption / Error */}
      <FormCaption
        id={captionId}
        size={size}
        caption={caption}
        errorMessage={errorMessage}
        invalid={invalid}
      />
    </div>
  );
});
