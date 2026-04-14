/**
 * Design System — Button component
 * Source: Figma / Topic Board New / node 8848:48381
 *
 * Variants:  primary | secondary | elevated | link | danger | danger-subtle | success | success-subtle
 * Sizes:     sm (32px) | md (40px) | lg (48px)
 * States:    default | hover | active | disabled  (CSS :hover/:active/:disabled)
 * Content:   text | iconLeft | iconRight | iconOnly | multichoice (appends ChevronDown)
 *
 * Usage:
 *   <Button>Save</Button>
 *   <Button variant="secondary" size="sm">Cancel</Button>
 *   <Button variant="danger" iconLeft={Trash2}>Delete</Button>
 *   <Button variant="primary" iconOnly={Plus} aria-label="Add item" />
 *   <Button variant="secondary" multichoice>Options</Button>
 */

import { motion } from 'motion/react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { Typo } from './Typo';
import type { IconSize } from '../tokens/icons';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { spring } from '../tokens/motion';

// ─── Public types ─────────────────────────────────────────────────────────────

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'elevated'
  | 'special'
  | 'special-primary'
  | 'link'
  | 'danger'
  | 'danger-subtle'
  | 'success'
  | 'success-subtle';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Prepend an icon to the left of the label */
  iconLeft?: LucideIcon;
  /** Append an icon to the right of the label */
  iconRight?: LucideIcon;
  /**
   * Render an icon-only button (square). Pass aria-label for accessibility.
   * When set, any children are ignored.
   */
  iconOnly?: LucideIcon;
  /** Append a ChevronDown for dropdown / select triggers */
  multichoice?: boolean;
  /** Forward HTML button type (defaults to "button") */
  type?: 'button' | 'submit' | 'reset';
  /** Disable typography fix on label (for raw strings: token names, code) */
  typo?: boolean;
}

// ─── Variant styles ───────────────────────────────────────────────────────────
// All strings are STATIC — required for Tailwind JIT scanning.
// Maps Figma variables to our --color-* CSS custom properties.
//
//  Primary:        solid green fill
//  Secondary:      outline (border + transparent bg), fills blue on hover
//  Elevated:       white bg, no border, shadow — for use on grey/colored backgrounds
//  Link:           no border no fill, blue text, fills blue on hover
//  Danger:         solid red fill
//  Danger Subtle:  outline, red text, fills danger-secondary on hover
//  Success:        solid green fill
//  Success Subtle: outline, success text, fills success-secondary on hover

// Variant styles — split into base, hover, and active so we can drive
// active state via usePress instead of CSS :active (which exits in 10-50ms
// on Magic Trackpad, making the color change invisible).

interface VariantStyle {
  base: string;
  hover: string;
  active: string;
}

const variantStyles: Record<ButtonVariant, VariantStyle> = {
  primary: {
    base: 'bg-[var(--color-primary-1)] text-[var(--color-on-primary)]',
    hover: 'hover:bg-[var(--color-primary-2)]',
    active: 'bg-[var(--color-primary-3)]',
  },
  secondary: {
    base: 'border border-[var(--color-surface-4)] text-[var(--color-on-surface)]',
    hover: 'hover:bg-[var(--color-secondary-1)] hover:border-transparent',
    active: 'bg-[var(--color-secondary-2)] border-transparent',
  },
  elevated: {
    base: 'bg-[var(--color-surface-1)] text-[var(--color-on-surface)]',
    hover: 'hover:text-[var(--color-on-secondary-2)]',
    active: 'text-[var(--color-on-secondary-2)]',
  },
  special: {
    base: 'bg-[var(--color-surface-1)] text-[var(--color-on-surface)]',
    hover: '',
    active: '',
  },
  'special-primary': {
    base: 'bg-[var(--color-primary-1)] text-[var(--color-on-primary)]',
    hover: 'hover:bg-[var(--color-primary-2)]',
    active: 'bg-[var(--color-primary-3)]',
  },
  link: {
    base: 'text-[var(--color-on-secondary-1)]',
    hover: 'hover:bg-[var(--color-secondary-1)]',
    active: 'bg-[var(--color-secondary-2)]',
  },
  danger: {
    base: 'bg-[var(--color-danger-1)] text-[var(--color-on-danger)]',
    hover: 'hover:bg-[var(--color-danger-2)]',
    active: 'bg-[var(--color-danger-3)]',
  },
  'danger-subtle': {
    base: 'border border-[var(--color-surface-4)] text-[var(--color-danger-1)]',
    hover: 'hover:bg-[var(--color-danger-secondary-1)] hover:border-transparent',
    active: 'bg-[var(--color-danger-secondary-2)] border-transparent',
  },
  success: {
    base: 'bg-[var(--color-success-1)] text-[var(--color-on-success)]',
    hover: 'hover:bg-[var(--color-success-2)]',
    active: 'bg-[var(--color-success-3)]',
  },
  'success-subtle': {
    base: 'border border-[var(--color-surface-4)] text-[var(--color-success-1)]',
    hover: 'hover:bg-[var(--color-success-secondary-1)] hover:border-transparent',
    active: 'bg-[var(--color-success-secondary-2)] border-transparent',
  },
};

// ─── Size styles ──────────────────────────────────────────────────────────────
// Heights: xs=24px  sm=32px  md=40px  lg=48px  (all ÷4)
// Padding for text buttons (py drives the height):
//   xs  py-0.5=2px → 2 + 20 + 2 = 24 ✓
//   sm  py-1=4px   → 4 + 24 + 4 = 32 ✓
//   md  py-2=8px   → 8 + 24 + 8 = 40 ✓
//   lg  py-3=12px  → 12 + 24 + 12 = 48 ✓
// Padding for icon-only buttons:
//   xs  p-1=4px    → 4 + 16 + 4 = 24 ✓  (icon sm=16px)
//   sm  p-2=8px    → 8 + 16 + 8 = 32 ✓  (icon sm=16px)
//   md  p-[10px]   → 10 + 20 + 10 = 40 ✓ (icon md=20px, 10 is ÷2)
//   lg  p-3=12px   → 12 + 24 + 12 = 48 ✓ (icon lg=24px)

const sizeTextPadding: Record<ButtonSize, string> = {
  xs: 'px-2 py-0.5', // 8px / 2px
  sm: 'px-3 py-1',    // 12px / 4px
  md: 'px-4 py-2',    // 16px / 8px
  lg: 'px-6 py-3',    // 24px / 12px
};

// Optically balanced padding for buttons with an icon on one side.
// The icon side gets reduced padding because the icon's solid mass
// creates more visual weight than the text side's open letterforms.
const sizeTextPaddingWithIconLeft: Record<ButtonSize, string> = {
  xs: 'pl-1.5 pr-2 py-0.5',   // 6px / 8px
  sm: 'pl-2 pr-3 py-1',        // 8px / 12px
  md: 'pl-3 pr-4 py-2',        // 12px / 16px
  lg: 'pl-4 pr-6 py-3',        // 16px / 24px
};

const sizeTextPaddingWithIconRight: Record<ButtonSize, string> = {
  xs: 'pl-2 pr-1.5 py-0.5',   // 8px / 6px
  sm: 'pl-3 pr-2 py-1',        // 12px / 8px
  md: 'pl-4 pr-3 py-2',        // 16px / 12px
  lg: 'pl-6 pr-4 py-3',        // 24px / 16px
};

const sizeIconPadding: Record<ButtonSize, string> = {
  xs: 'p-1',       // 4px all — 4+16+4=24 ✓
  sm: 'p-2',       // 8px all — 8+16+8=32 ✓
  md: 'p-[10px]',  // 10px all — 10+20+10=40 ✓
  lg: 'p-3',       // 12px all — 12+24+12=48 ✓
};

// Icon size per button size
const sizeIconSize: Record<ButtonSize, IconSize> = {
  xs: 'sm',   // 16px
  sm: 'sm',   // 16px
  md: 'md',   // 20px
  lg: 'lg',   // 24px
};

// Font size per button size
const sizeFontClass: Record<ButtonSize, string> = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-base',
  lg: 'text-base',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  iconOnly,
  multichoice = false,
  children,
  className,
  type = 'button',
  disabled,
  typo = true,
  ...rest
}: ButtonProps) {
  const isIconOnly = !!iconOnly;
  const iconSize = sizeIconSize[size];
  const isPrimary = variant === 'primary';
  const isElevated = variant === 'elevated';
  const isSpecial = variant === 'special' || variant === 'special-primary';

  const { isPressed, pressHandlers } = usePress({ disabled });
  const reducedMotion = useReducedMotion();

  const style = variantStyles[variant];

  const classes = [
    // Base layout
    'inline-flex items-center justify-center gap-2',
    // Shape — pill (from Figma --radius-xl)
    'rounded-xl',
    // Typography
    isSpecial
      ? `font-mono font-medium ${sizeFontClass[size]} leading-normal tracking-[0.08em] uppercase whitespace-nowrap`
      : `font-sans font-bold ${sizeFontClass[size]} leading-normal tracking-[0.16px] whitespace-nowrap`,
    // Transition (colors + shadow — shadow uses CSS vars, transitions browser-side)
    'transition-[color,background-color,border-color,box-shadow] duration-150',
    // Cursor
    'cursor-pointer',
    // Focus ring
    'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
    // Disabled state
    'disabled:opacity-40 disabled:cursor-not-allowed',
    // Padding
    isIconOnly
      ? sizeIconPadding[size]
      : iconLeft && !(iconRight || multichoice)
        ? sizeTextPaddingWithIconLeft[size]
        : (iconRight || multichoice) && !iconLeft
          ? sizeTextPaddingWithIconRight[size]
          : sizeTextPadding[size],
    // Variant — active is driven by usePress (not CSS :active) so trackpad
    // taps hold the color for the full 120ms minimum
    style.base,
    isPressed ? style.active : style.hover,
    // Shadow — token-based Tailwind classes (CSS vars resolve per theme)
    isPrimary
      ? 'shadow-none hover:shadow-medium-1'
      : (isElevated || isSpecial)
        ? 'shadow-small-2 hover:shadow-medium-2'
        : '',
    // Consumer overrides
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const pressScale = reducedMotion ? 1 : isPressed ? 0.97 : 1;

  const motionProps = {
    animate: { scale: pressScale },
    transition: { scale: spring.snappy },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, onAnimationIteration, ...safeRest } = rest;

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled}
      {...motionProps}
      {...pressHandlers}
      {...safeRest}
    >
      {isIconOnly ? (
        <Icon icon={iconOnly} size={iconSize} />
      ) : (
        <>
          {iconLeft && <Icon icon={iconLeft} size={iconSize} />}
          {typo ? <Typo>{children}</Typo> : children}
          {iconRight && <Icon icon={iconRight} size={iconSize} />}
          {multichoice && <Icon icon={ChevronDown} size={iconSize} />}
        </>
      )}
    </motion.button>
  );
}
