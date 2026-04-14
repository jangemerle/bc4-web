/**
 * Design System — SplitButton component
 * Inspired by Google Material split button.
 *
 * Two visually separate buttons with a 2px gap:
 *   - Action button: icon + label (pill left, 4px radius right)
 *   - Chevron button: dropdown trigger (4px radius left, pill right)
 *
 * Both parts hover-highlight. Variant states match regular Button exactly.
 *
 * Variants: primary | secondary | elevated
 * Sizes:    sm (32px) | md (40px) | lg (48px)
 *
 * Usage:
 *   <SplitButton iconLeft={Play} onClick={handleStart} onChevronClick={openMenu}>
 *     Start
 *   </SplitButton>
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import type { IconSize } from '../tokens/icons';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { spring } from '../tokens/motion';

// ─── Public types ─────────────────────────────────────────────────────────────

export type SplitButtonVariant = 'primary' | 'secondary' | 'elevated';
export type SplitButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface SplitButtonProps {
  variant?: SplitButtonVariant;
  size?: SplitButtonSize;
  iconLeft?: LucideIcon;
  onClick?: () => void;
  onChevronClick?: () => void;
  chevronOpen?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

// ─── Variant tokens ──────────────────────────────────────────────────────────

interface VariantTokens {
  bg: string;
  text: string;
  hoverBg: string;
  activeBg: string;
  border?: string;
  shadow?: string;
}

const variants: Record<SplitButtonVariant, VariantTokens> = {
  primary: {
    bg: 'var(--color-primary-1)',
    text: 'var(--color-on-primary)',
    hoverBg: 'var(--color-primary-2)',
    activeBg: 'var(--color-primary-3)',
  },
  secondary: {
    bg: 'transparent',
    text: 'var(--color-on-surface)',
    hoverBg: 'var(--color-secondary-1)',
    activeBg: 'var(--color-secondary-2)',
    border: 'var(--color-surface-4)',
  },
  elevated: {
    bg: 'var(--color-surface-1)',
    text: 'var(--color-on-surface)',
    hoverBg: 'var(--color-surface-1)',
    activeBg: 'var(--color-surface-1)',
    shadow: 'var(--shadow-small-2)',
  },
};

// ─── Size tokens ──────────────────────────────────────────────────────────────

const sizes: Record<SplitButtonSize, {
  height: number;
  actionPad: string;
  actionPadIcon: string;
  chevronPad: string;
  font: string;
  icon: IconSize;
  gap: number;
  innerR: number;
}> = {
  xs: { height: 24, actionPad: '0 8px', actionPadIcon: '0 8px 0 6px', chevronPad: '0 7px', font: '12px', icon: 'sm', gap: 4, innerR: 4 },
  sm: { height: 32, actionPad: '0 12px', actionPadIcon: '0 12px 0 8px', chevronPad: '0 10px', font: '14px', icon: 'sm', gap: 6, innerR: 4 },
  md: { height: 40, actionPad: '0 16px', actionPadIcon: '0 16px 0 12px', chevronPad: '0 14px', font: '16px', icon: 'md', gap: 8, innerR: 4 },
  lg: { height: 48, actionPad: '0 24px', actionPadIcon: '0 24px 0 16px', chevronPad: '0 18px', font: '16px', icon: 'lg', gap: 8, innerR: 6 },
};

// ─── Resolve styles for a segment ────────────────────────────────────────────

function resolveSegment(
  v: VariantTokens,
  variant: SplitButtonVariant,
  pressed: boolean,
  hovered: boolean,
): { bg: string; border: string; text: string; shadow?: string } {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isElevated = variant === 'elevated';
  const active = pressed || hovered;

  const border = isSecondary
    ? active ? '1px solid transparent' : `1px solid ${v.border}`
    : v.border ? `1px solid ${v.border}` : 'none';

  const text = isElevated && active
    ? 'var(--color-on-secondary-2)'
    : v.text;

  const shadow = isPrimary
    ? hovered ? 'var(--shadow-medium-1)' : 'none'
    : isElevated
    ? active ? 'var(--shadow-medium-2)' : 'var(--shadow-small-2)'
    : v.shadow;

  let bg = v.bg;
  if (pressed) bg = v.activeBg;
  else if (hovered) bg = v.hoverBg;

  return { bg, border, text, shadow };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SplitButton({
  variant = 'primary',
  size = 'md',
  iconLeft,
  onClick,
  onChevronClick,
  chevronOpen = false,
  disabled = false,
  children,
  className,
}: SplitButtonProps) {
  const v = variants[variant];
  const s = sizes[size];
  const reducedMotion = useReducedMotion();
  const [actionHovered, setActionHovered] = useState(false);
  const [chevronHovered, setChevronHovered] = useState(false);

  const actionPress = usePress({ disabled });
  const chevronPress = usePress({ disabled });

  const actionStyles = resolveSegment(v, variant, actionPress.isPressed, actionHovered);
  const chevronStyles = resolveSegment(v, variant, chevronPress.isPressed, chevronHovered);

  const shared: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: s.height,
    fontSize: s.font,
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    letterSpacing: '0.16px',
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    outline: 'none',
    transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
  };

  return (
    <div
      className={['inline-flex items-center', className].filter(Boolean).join(' ')}
      style={{ gap: 2 }}
    >
      {/* ── Action ── */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => !disabled && setActionHovered(true)}
        onMouseLeave={() => setActionHovered(false)}
        style={{
          ...shared,
          gap: s.gap,
          padding: iconLeft ? s.actionPadIcon : s.actionPad,
          borderRadius: `${s.height / 2}px ${s.innerR}px ${s.innerR}px ${s.height / 2}px`,
          backgroundColor: actionStyles.bg,
          border: actionStyles.border,
          color: actionStyles.text,
          boxShadow: actionStyles.shadow,
        }}
        animate={{ scale: reducedMotion ? 1 : actionPress.isPressed ? 0.97 : 1 }}
        transition={spring.snappy}
        {...actionPress.pressHandlers}
      >
        {iconLeft && <Icon icon={iconLeft} size={s.icon} />}
        {children}
      </motion.button>

      {/* ── Chevron ── */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onChevronClick}
        onMouseEnter={() => !disabled && setChevronHovered(true)}
        onMouseLeave={() => setChevronHovered(false)}
        style={{
          ...shared,
          padding: s.chevronPad,
          borderRadius: `${s.innerR}px ${s.height / 2}px ${s.height / 2}px ${s.innerR}px`,
          backgroundColor: chevronStyles.bg,
          border: chevronStyles.border,
          color: chevronStyles.text,
          boxShadow: chevronStyles.shadow,
        }}
        animate={{ scale: reducedMotion ? 1 : chevronPress.isPressed ? 0.95 : 1 }}
        transition={spring.snappy}
        aria-label="More options"
        aria-expanded={chevronOpen}
        {...chevronPress.pressHandlers}
      >
        <motion.span
          animate={{ rotate: chevronOpen ? 180 : 0 }}
          transition={spring.snappy}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
        >
          <Icon icon={ChevronDown} size={s.icon} />
        </motion.span>
      </motion.button>
    </div>
  );
}
