/**
 * Design System — SearchInput component
 * Thin wrapper around Input with search icon (left) and clear button (right).
 *
 * Usage:
 *   <SearchInput placeholder="Search" />
 *   <SearchInput placeholder="Search" size="sm" />
 *   <SearchInput value={query} onChange={e => setQuery(e.target.value)} onClear={() => setQuery('')} />
 */

import { forwardRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input, type InputSize } from './Input';
import { Button } from './Button';

// ─── Public types ─────────────────────────────────────────────────────────────

export type SearchInputSize = 'sm' | 'md' | 'lg';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Field size */
  size?: SearchInputSize;
  /** Callback when the clear button is clicked */
  onClear?: () => void;
}

// ─── Clear button size mapping ───────────────────────────────────────────────

const clearBtnSize: Record<InputSize, 'xs' | 'sm' | 'md'> = {
  sm: 'xs',
  md: 'xs',
  lg: 'sm',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    size = 'md',
    onClear,
    disabled,
    readOnly,
    ...rest
  },
  ref,
) {
  const [hasValue, setHasValue] = useState(
    () => rest.defaultValue != null && rest.defaultValue !== '',
  );

  const isFilled = hasValue || (rest.value != null && rest.value !== '');

  return (
    <Input
      ref={ref}
      size={size}
      iconLeft={Search}
      disabled={disabled}
      readOnly={readOnly}
      buttonRight={
        isFilled && !disabled && !readOnly ? (
          <Button
            size={clearBtnSize[size]}
            variant="link"
            iconOnly={X}
            aria-label="Clear search"
            tabIndex={-1}
            onClick={() => {
              onClear?.();
              setHasValue(false);
            }}
          />
        ) : undefined
      }
      onChange={(e) => {
        setHasValue(e.target.value !== '');
        rest.onChange?.(e);
      }}
      {...rest}
    />
  );
});
