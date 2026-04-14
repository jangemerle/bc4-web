/**
 * Design System — TextArea component
 * Source: Figma / Topic Board New / node 1935:2175
 *
 * Sizes:     sm (32px row-height) | md (40px) | lg (48px)
 * States:    default | hover | focus | disabled | readonly | invalid
 * Slots:     label | caption
 *
 * Usage:
 *   <TextArea label="Description" placeholder="Placeholder" />
 *   <TextArea label="Notes" placeholder="Placeholder" caption="Optional" />
 *   <TextArea label="Bio" invalid errorMessage="Nope nope nope" />
 *   <TextArea label="Small" size="sm" placeholder="Placeholder" />
 */

import { forwardRef, useState, useId, useRef, useCallback } from 'react';
import { FormLabel, FormCaption, getFormBorderShadow } from './FormParts';
import { cn } from '../lib/cn';

// ─── Public types ─────────────────────────────────────────────────────────────

export type TextAreaSize = 'sm' | 'md' | 'lg';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Label text above the field */
  label?: string;
  /** Helper text below the field */
  caption?: string;
  /** Error message — shown instead of caption when invalid */
  errorMessage?: string;
  /** Mark the field as invalid */
  invalid?: boolean;
  /** Field size — affects text size and padding */
  size?: TextAreaSize;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const sizeConfig: Record<TextAreaSize, {
  textSize: string;
  gap: string;
}> = {
  sm: {
    textSize: 'text-md',   // 14px
    gap: 'gap-1',          // 4px
  },
  md: {
    textSize: 'text-base', // 16px
    gap: 'gap-1',          // 4px
  },
  lg: {
    textSize: 'text-base', // 16px
    gap: 'gap-2',          // 8px
  },
};

const MIN_HEIGHT = 80;

// ─── Component ────────────────────────────────────────────────────────────────

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    caption,
    errorMessage,
    invalid = false,
    size = 'md',
    disabled,
    readOnly,
    className,
    id: idProp,
    ...rest
  },
  forwardedRef,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const captionId = `${id}-caption`;

  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [gripHovered, setGripHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasValue, setHasValue] = useState(
    () => rest.defaultValue != null && rest.defaultValue !== '',
  );

  // Internal ref for resize — merged with forwarded ref via callback
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      internalRef.current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    },
    [forwardedRef],
  );

  const cfg = sizeConfig[size];
  const interactive = !disabled && !readOnly;

  const isFilled = hasValue || (rest.value != null && rest.value !== '');
  const borderShadow = getFormBorderShadow({ invalid, focused, disabled, readOnly, hovered, filled: isFilled });

  // ── Custom resize drag ────────────────────────────────────────────────────

  const handleGripMouseDown = useCallback((e: React.MouseEvent) => {
    if (!interactive) return;
    e.preventDefault();

    const startY = e.clientY;
    const startH = internalRef.current?.offsetHeight ?? MIN_HEIGHT;

    setIsDragging(true);
    document.body.style.cursor = 'se-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: MouseEvent) => {
      const newH = Math.max(MIN_HEIGHT, startH + (ev.clientY - startY));
      if (internalRef.current) internalRef.current.style.height = `${newH}px`;
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [interactive]);

  return (
    <div className={cn('flex flex-col w-full', cfg.gap, className)}>
      {/* Label */}
      {label && (
        <FormLabel htmlFor={id} size={size} disabled={disabled} readOnly={readOnly}>
          {label}
        </FormLabel>
      )}

      {/* Field wrapper — border lives here so it grows with the textarea */}
      <div
        className={cn(
          'relative rounded-m transition-shadow duration-200',
          (disabled || readOnly) && 'opacity-50',
        )}
        style={{ boxShadow: borderShadow }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Textarea */}
        <textarea
          ref={mergedRef}
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={caption || (invalid && errorMessage) ? captionId : undefined}
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
            'w-full bg-transparent outline-none resize-none rounded-m',
            'font-sans leading-normal',
            cfg.textSize,
            'placeholder:font-medium font-semibold',
            interactive ? 'cursor-text' : 'cursor-not-allowed',
          )}
          style={{
            minHeight: MIN_HEIGHT,
            color: interactive ? 'var(--color-on-surface)' : 'var(--color-on-surface-subtle-1)',
            padding: size === 'sm' ? '5.5px 12px' : size === 'lg' ? '11.5px 16px' : '8px 16px',
            paddingBottom: size === 'sm' ? '18px' : size === 'lg' ? '24px' : '20px',
          }}
          {...rest}
        />

        {/* Resize grip */}
        {interactive && (
          <div
            onMouseDown={handleGripMouseDown}
            onMouseEnter={() => setGripHovered(true)}
            onMouseLeave={() => setGripHovered(false)}
            className="absolute bottom-0 right-0 p-1.5 select-none"
            style={{
              cursor: 'se-resize',
              color: gripHovered || isDragging
                ? 'var(--color-on-surface-subtle-1)'
                : 'var(--color-on-surface-subtle-2)',
              transition: 'color 0.15s ease',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="8.5" cy="8.5" r="1.1" />
              <circle cx="5"   cy="8.5" r="1.1" />
              <circle cx="8.5" cy="5"   r="1.1" />
            </svg>
          </div>
        )}

        {/* Placeholder color */}
        <style>{`
          #${CSS.escape(id)}::placeholder { color: var(--color-on-surface-subtle-1); }
        `}</style>
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
