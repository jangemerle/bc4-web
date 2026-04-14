/* eslint-disable react-refresh/only-export-components */
/**
 * Design System — Shared form primitives
 * Source: Figma / Topic Board New / node 1937:7489 (Forms base components)
 *
 * These components are shared across Input, NumberInput, TextArea, and Select.
 * Changing a style here updates all form components that use it.
 *
 * Components:
 *   FormLabel   — label text above the field
 *   FormCaption — helper text or error message below the field
 *   FormBorder  — inset box-shadow border overlay with state-driven styling
 */

import { AlertCircle } from 'lucide-react';
import { Icon } from './Icon';
import { Typo } from './Typo';
import { fixTypo } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';
import { cn } from '../lib/cn';

// ─── Shared size config ──────────────────────────────────────────────────────

export type FormSize = 'sm' | 'md' | 'lg';

const labelSizeClass: Record<FormSize, string> = {
  sm: 'text-sm',   // 12px
  md: 'text-md',   // 14px
  lg: 'text-md',   // 14px
};

const captionSizeClass: Record<FormSize, string> = {
  sm: 'text-sm',   // 12px
  md: 'text-md',   // 14px
  lg: 'text-md',   // 14px
};

const captionIconSize: Record<FormSize, 'sm' | 'md'> = {
  sm: 'sm',
  md: 'md',
  lg: 'md',
};

// ─── FormLabel ───────────────────────────────────────────────────────────────

export interface FormLabelProps {
  htmlFor: string;
  size?: FormSize;
  disabled?: boolean;
  readOnly?: boolean;
  children: React.ReactNode;
}

export function FormLabel({ htmlFor, size = 'md', disabled, readOnly, children }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'font-sans font-medium leading-normal',
        labelSizeClass[size],
      )}
      style={{
        color: disabled || readOnly
          ? 'var(--color-on-surface-subtle-1)'
          : 'var(--color-on-surface)',
      }}
    >
      <Typo>{children}</Typo>
    </label>
  );
}

// ─── FormCaption ─────────────────────────────────────────────────────────────

export interface FormCaptionProps {
  id: string;
  size?: FormSize;
  caption?: string;
  errorMessage?: string;
  invalid?: boolean;
}

export function FormCaption({ id, size = 'md', caption, errorMessage, invalid }: FormCaptionProps) {
  const locale = useLocale();
  const showError = invalid && errorMessage;
  if (!caption && !showError) return null;

  return (
    <div id={id} className="flex items-center gap-1">
      {showError ? (
        <div className="flex items-center gap-1" style={{ color: 'var(--color-danger-1)' }}>
          <Icon icon={AlertCircle} size={captionIconSize[size]} />
          <span className={cn('font-sans font-medium leading-normal', captionSizeClass[size])}>
            {fixTypo(errorMessage!, locale)}
          </span>
        </div>
      ) : (
        <span
          className={cn('font-sans font-medium leading-normal', captionSizeClass[size])}
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          {fixTypo(caption!, locale)}
        </span>
      )}
    </div>
  );
}

// ─── FormBorder ──────────────────────────────────────────────────────────────

export interface FormBorderState {
  invalid?: boolean;
  focused?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hovered?: boolean;
  filled?: boolean;
  /** For Select: treat open dropdown as focused */
  open?: boolean;
}

/** Compute the inset box-shadow for a form field border. */
export function getFormBorderShadow(state: FormBorderState): string {
  const { invalid, focused, disabled, readOnly, hovered, filled, open } = state;

  if (invalid) return 'inset 0 0 0 2px var(--color-danger-1)';
  if (focused || open) return 'inset 0 0 0 2px var(--color-primary-1)';
  if (disabled || readOnly) return 'inset 0 0 0 1px var(--color-surface-5)';
  if (hovered) return 'inset 0 0 0 1px var(--color-surface-6)';
  if (filled) return 'inset 0 0 0 1px var(--color-surface-7)';
  return 'inset 0 0 0 1px var(--color-surface-5)';
}

/** CSS classes for the border overlay div. */
export function getFormBorderClass(state: Pick<FormBorderState, 'disabled' | 'readOnly'>): string {
  return cn(
    'rounded-m transition-shadow duration-200',
    (state.disabled || state.readOnly) && 'opacity-50',
  );
}
