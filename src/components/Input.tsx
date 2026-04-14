/**
 * Design System — Input component
 * Source: Figma / Topic Board New / nodes 1937:7489, 1935:0
 *
 * Sizes:     sm (32px) | md (40px) | lg (48px)
 * States:    default | hover | focus | disabled | readonly | invalid
 * Slots:     label | caption | iconLeft | icon (right) | buttonRight
 *
 * Usage:
 *   <Input label="Email" placeholder="you@example.com" />
 *   <Input label="Name" placeholder="Enter name" caption="Required" />
 *   <Input label="Password" icon={Eye} placeholder="••••••••" />
 *   <Input label="Search" iconLeft={Search} placeholder="Search…" />
 *   <Input label="Email" invalid errorMessage="Nope nope nope" />
 *   <Input iconLeft={Search} buttonRight={<Button size="xs" iconOnly={X} variant="link" />} />
 */

import { forwardRef, useState, useId, type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { cn } from '../lib/cn';
import { FormLabel, FormCaption, getFormBorderShadow, getFormBorderClass } from './FormParts';

// ─── Public types ─────────────────────────────────────────────────────────────

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text above the field */
  label?: string;
  /** Helper text below the field */
  caption?: string;
  /** Error message — shown instead of caption when invalid */
  errorMessage?: string;
  /** Mark the field as invalid */
  invalid?: boolean;
  /** Field size */
  size?: InputSize;
  /** Icon rendered on the left side of the field */
  iconLeft?: LucideIcon;
  /** Icon rendered on the right side of the field */
  icon?: LucideIcon;
  /** Callback when the right icon is clicked */
  onIconClick?: () => void;
  /** Button or element rendered on the right side inside the field */
  buttonRight?: ReactNode;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const sizeConfig: Record<InputSize, {
  height: string;
  textSize: string;
  basePaddingLeft: number;      // px — without left icon
  basePaddingRight: number;     // px — without right icon/button
  iconSize: 'sm' | 'md' | 'lg';
  iconBoxPx: number;
  iconLeftOffset: string;       // Tailwind left-* class
  leftIconPaddingLeft: number;  // px — with left icon
  rightSlotPaddingRight: number; // px — with right icon/button
}> = {
  sm: {
    height: 'h-8',        // 32px
    textSize: 'text-md',  // 14px
    basePaddingLeft: 12,
    basePaddingRight: 12,
    iconSize: 'sm',       // 16px
    iconBoxPx: 16,
    iconLeftOffset: 'left-3',    // 12px
    leftIconPaddingLeft: 36,     // 12 + 16 + 8
    rightSlotPaddingRight: 36,   // 16 (icon) + 12 (base) + 8 (gap)
  },
  md: {
    height: 'h-10',        // 40px
    textSize: 'text-base', // 16px
    basePaddingLeft: 16,
    basePaddingRight: 16,
    iconSize: 'md',        // 20px
    iconBoxPx: 20,
    iconLeftOffset: 'left-4',    // 16px
    leftIconPaddingLeft: 44,     // 16 + 20 + 8
    rightSlotPaddingRight: 40,   // 20 (icon) + 12 (gap) + 8 (edge)
  },
  lg: {
    height: 'h-12',        // 48px
    textSize: 'text-base', // 16px
    basePaddingLeft: 16,
    basePaddingRight: 16,
    iconSize: 'md',        // 20px
    iconBoxPx: 20,
    iconLeftOffset: 'left-4',    // 16px
    leftIconPaddingLeft: 48,     // 16 + 20 + 12
    rightSlotPaddingRight: 40,   // 20 (icon) + 12 (gap) + 8 (edge)
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    caption,
    errorMessage,
    invalid = false,
    size = 'md',
    iconLeft,
    icon,
    onIconClick,
    buttonRight,
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

  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hasValue, setHasValue] = useState(
    () => rest.defaultValue != null && rest.defaultValue !== '',
  );

  const cfg = sizeConfig[size];
  const showError = invalid && errorMessage;

  // Border style based on state priority: invalid > focus > hover > filled > default
  // Uses inset box-shadow instead of border so the 1px→2px transition animates smoothly
  const borderShadow = getFormBorderShadow({
    invalid,
    focused,
    disabled,
    readOnly,
    hovered,
    filled: hasValue || (rest.value != null && rest.value !== ''),
  });
  const borderClass = getFormBorderClass({ disabled, readOnly });

  // Dynamic padding based on slots — all values from sizeConfig, no magic numbers
  const hasRightSlot = icon || buttonRight;
  const paddingLeft = iconLeft ? cfg.leftIconPaddingLeft : cfg.basePaddingLeft;
  const paddingRight = hasRightSlot ? cfg.rightSlotPaddingRight : cfg.basePaddingRight;

  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
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

        {/* Left icon */}
        {iconLeft && (
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none',
              cfg.iconLeftOffset,
            )}
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            <Icon icon={iconLeft} size={cfg.iconSize} />
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          readOnly={readOnly}
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
            setHasValue(e.target.value !== '');
            rest.onChange?.(e);
          }}
          className={cn(
            'absolute inset-0 w-full h-full bg-transparent outline-none rounded-m',
            'font-sans leading-normal',
            cfg.textSize,
            'placeholder:font-medium font-semibold',
            disabled || readOnly ? 'cursor-not-allowed' : 'cursor-text',
          )}
          style={{
            color: 'var(--color-on-surface)',
            paddingLeft: `${paddingLeft}px`,
            paddingRight: `${paddingRight}px`,
          }}
          {...rest}
        />

        {/* Placeholder color override */}
        <style>{`
          #${CSS.escape(id)}::placeholder {
            color: var(--color-on-surface-subtle-1);
          }
        `}</style>

        {/* Right icon */}
        {icon && !buttonRight && (
          <button
            type="button"
            tabIndex={-1}
            onClick={onIconClick}
            disabled={disabled}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 right-[10px]',
              'flex items-center justify-center',
              onIconClick && !disabled ? 'cursor-pointer' : 'cursor-default pointer-events-none',
            )}
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
            aria-hidden={!onIconClick}
          >
            <Icon icon={icon} size={cfg.iconSize} />
          </button>
        )}

        {/* Right button slot */}
        {buttonRight && (
          <div className="absolute top-1/2 -translate-y-1/2 right-1 flex items-center">
            {buttonRight}
          </div>
        )}
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
