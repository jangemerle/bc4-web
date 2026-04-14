/**
 * Design System — Select component
 * Source: Figma / Topic Board New / node 1945:8305
 *
 * Sizes:     sm (32px) | md (40px) | lg (48px)
 * States:    default | hover | focus | disabled | readonly | invalid
 * Slots:     label | caption | options
 *
 * Uses the DropdownMenu component for the options panel.
 *
 * Usage:
 *   <Select label="Country" placeholder="Select..." options={[{ value: 'us', label: 'USA' }]} />
 *   <Select label="Size" placeholder="Pick one" size="sm" options={options} />
 *   <Select label="Role" invalid errorMessage="Nope nope nope" options={options} />
 */

import { forwardRef, useState, useId, useCallback, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Icon } from './Icon';
import { DropdownMenu, DropdownMenuItem } from './DropdownMenu';
import { FormLabel, FormCaption, getFormBorderShadow, getFormBorderClass } from './FormParts';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';
import { cn } from '../lib/cn';

// ─── Public types ─────────────────────────────────────────────────────────────

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Label text above the field */
  label?: string;
  /** Helper text below the field */
  caption?: string;
  /** Error message — shown instead of caption when invalid */
  errorMessage?: string;
  /** Mark the field as invalid */
  invalid?: boolean;
  /** Field size */
  size?: SelectSize;
  /** Placeholder text */
  placeholder?: string;
  /** Available options */
  options?: SelectOption[];
  /** Selected value */
  value?: string;
  /** Default selected value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Read-only state */
  readOnly?: boolean;
  /** Additional CSS class */
  className?: string;
  /** HTML id */
  id?: string;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const sizeConfig: Record<SelectSize, {
  height: string;
  textSize: string;
  labelSize: string;
  captionSize: string;
  gap: string;
  paddingLeft: string;
  chevronSize: 'sm' | 'md' | 'lg';
  chevronOffset: string;
  iconSize: 'sm' | 'md' | 'lg';
  dropdownSize: 'sm' | 'md';
}> = {
  sm: {
    height: 'h-8',
    textSize: 'text-md',
    labelSize: 'text-sm',
    captionSize: 'text-sm',
    gap: 'gap-1',
    paddingLeft: 'left-3',
    chevronSize: 'sm',
    chevronOffset: 'right-2',
    iconSize: 'sm',
    dropdownSize: 'sm',
  },
  md: {
    height: 'h-10',
    textSize: 'text-base',
    labelSize: 'text-md',
    captionSize: 'text-md',
    gap: 'gap-1',
    paddingLeft: 'left-4',
    chevronSize: 'md',
    chevronOffset: 'right-[10px]',
    iconSize: 'md',
    dropdownSize: 'sm',
  },
  lg: {
    height: 'h-12',
    textSize: 'text-base',
    labelSize: 'text-md',
    captionSize: 'text-md',
    gap: 'gap-2',
    paddingLeft: 'left-4',
    chevronSize: 'lg',
    chevronOffset: 'right-[13px]',
    iconSize: 'md',
    dropdownSize: 'md',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    label,
    caption,
    errorMessage,
    invalid = false,
    size = 'md',
    placeholder = 'Select...',
    options = [],
    value: controlledValue,
    defaultValue,
    onChange,
    disabled,
    readOnly,
    className,
    id: idProp,
  },
  ref,
) {
  const locale = useLocale();
  const autoId = useId();
  const id = idProp ?? autoId;
  const captionId = `${id}-caption`;

  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const closedAtRef = useRef(0);

  const currentValue = controlledValue ?? internalValue;
  const selectedOption = options.find(o => o.value === currentValue);
  const isFilled = !!selectedOption;

  const cfg = sizeConfig[size];
  const showError = invalid && errorMessage;

  const handleSelect = useCallback((optionValue: string) => {
    if (controlledValue == null) setInternalValue(optionValue);
    onChange?.(optionValue);
    setOpen(false);
    setFocused(false);
  }, [controlledValue, onChange]);

  const handleClose = useCallback(() => {
    closedAtRef.current = Date.now();
    setOpen(false);
    setFocused(false);
  }, []);

  // Border style based on state priority: invalid > focus/open > hover > filled > default
  // Uses inset box-shadow instead of border so the 1px→2px transition animates smoothly
  const borderShadow = getFormBorderShadow({ invalid, focused, disabled, readOnly, hovered, filled: isFilled, open });
  const borderClass = getFormBorderClass({ disabled, readOnly });

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
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Trigger button */}
        <button
          ref={ref}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={invalid || undefined}
          aria-describedby={caption || showError ? captionId : undefined}
          disabled={disabled}
          onClick={() => {
            if (!readOnly && !disabled) {
              // Ignore if dropdown just closed via click-outside (which hit this button)
              if (Date.now() - closedAtRef.current < 50) return;
              setOpen(!open);
              setFocused(!open);
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            if (!open) setFocused(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleClose();
            if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !open && !readOnly && !disabled) {
              e.preventDefault();
              setOpen(true);
              setFocused(true);
            }
          }}
          className={cn(
            'relative w-full bg-transparent text-left',
            'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
            cfg.height,
            disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {/* Border */}
          <div className={cn('absolute inset-0', borderClass)} style={{ boxShadow: borderShadow }} />

          {/* Value / Placeholder */}
          <span
            className={cn(
              'absolute top-1/2 -translate-y-1/2 font-sans leading-normal truncate',
              cfg.paddingLeft,
              cfg.textSize,
              isFilled ? 'font-semibold' : 'font-medium',
            )}
            style={{
              color: isFilled
                ? (readOnly ? 'var(--color-on-surface-subtle-1)' : 'var(--color-on-surface)')
                : 'var(--color-on-surface-subtle-1)',
              right: size === 'sm' ? '28px' : size === 'lg' ? '42px' : '36px',
            }}
          >
            {fixTypo(selectedOption?.label ?? placeholder, locale)}
          </span>

          {/* Chevron */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 ease-in-out',
              cfg.chevronOffset,
              (disabled || readOnly) && 'opacity-50',
              open && 'rotate-180',
            )}
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            <Icon icon={ChevronDown} size={cfg.chevronSize} />
          </div>
        </button>

        {/* Dropdown — uses DropdownMenu component */}
        <DropdownMenu
          open={open}
          onClose={handleClose}
          size={cfg.dropdownSize}
          width="100%"
          className="top-full mt-1 left-0"
        >
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              selected={option.value === currentValue}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
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
