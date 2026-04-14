/**
 * Design System — Accordion component
 *
 * Collapsible sections for progressive disclosure.
 *
 * Usage:
 *   <Accordion type="single" defaultValue="faq-1">
 *     <AccordionItem value="faq-1" title="What is Kvalt?">
 *       A design system built from scratch...
 *     </AccordionItem>
 *   </Accordion>
 *
 * Keyboard:
 *   Enter/Space — toggle focused item
 *   ArrowDown / ArrowUp — navigate items
 *   Home / End — jump to first/last item
 */

import {
  createContext,
  useContext,
  useId,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { Typo } from './Typo';
import { cn } from '../lib/cn';
import { spring, transition } from '../tokens/motion';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccordionType = 'single' | 'multiple';
export type AccordionVariant = 'default' | 'flush';

interface AccordionContextValue {
  type: AccordionType;
  variant: AccordionVariant;
  openValue: string | string[];
  onValueChange: (value: string | string[]) => void;
  reducedMotion: boolean;
  triggerRefsRef: React.MutableRefObject<Map<string, HTMLButtonElement>>;
}

interface AccordionProps {
  type: AccordionType;
  variant?: AccordionVariant;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children: ReactNode;
}

export interface AccordionItemProps {
  value: string;
  title: string | ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AccordionCtx = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionCtx);
  if (!ctx) {
    throw new Error('AccordionItem must be used within Accordion');
  }
  return ctx;
}

// ─── Accordion container ──────────────────────────────────────────────────────

export function Accordion({
  type,
  variant = 'default',
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
}: AccordionProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(
    defaultValue ?? (type === 'single' ? '' : []),
  );

  const openValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = useCallback(
    (newValue: string | string[]) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  const reducedMotion = useReducedMotion();
  const triggerRefsRef = useRef(new Map<string, HTMLButtonElement>());

  const contextValue: AccordionContextValue = {
    type,
    variant,
    openValue,
    onValueChange: handleValueChange,
    reducedMotion,
    triggerRefsRef,
  };

  const variantClasses = {
    default: 'rounded-lg border border-[var(--color-border)]',
    flush: '',
  };

  return (
    <AccordionCtx.Provider value={contextValue}>
      <div className={cn(variantClasses[variant], className)}>
        {children}
      </div>
    </AccordionCtx.Provider>
  );
}

// ─── AccordionItem ────────────────────────────────────────────────────────────

export function AccordionItem({
  value,
  title,
  icon: IconComponent,
  disabled = false,
  className,
  children,
}: AccordionItemProps) {
  const { type, variant, openValue, onValueChange, reducedMotion, triggerRefsRef } =
    useAccordionContext();

  const triggerId = useId();
  const contentId = useId();

  const isOpen = Array.isArray(openValue) ? openValue.includes(value) : openValue === value;

  const { isPressed, pressHandlers } = usePress({ disabled });

  const handleClick = useCallback(() => {
    if (type === 'single') {
      onValueChange(isOpen ? '' : value);
    } else {
      const current = Array.isArray(openValue) ? openValue : [];
      const newValue = isOpen
        ? current.filter((v) => v !== value)
        : [...current, value];
      onValueChange(newValue);
    }
  }, [type, isOpen, value, openValue, onValueChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const triggers = Array.from(triggerRefsRef.current.values());
      if (triggers.length === 0) return;

      const currentIdx = triggers.indexOf(e.currentTarget);
      let nextIdx: number | null = null;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleClick();
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextIdx = currentIdx < triggers.length - 1 ? currentIdx + 1 : 0;
          triggers[nextIdx]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIdx = currentIdx > 0 ? currentIdx - 1 : triggers.length - 1;
          triggers[nextIdx]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          triggers[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          triggers[triggers.length - 1]?.focus();
          break;
      }
    },
    [triggerRefsRef, handleClick],
  );

  const variantClasses = {
    default: {
      trigger: 'px-4 py-3',
      content: 'px-4 pb-4',
      divider: 'border-b border-[var(--color-border)] last:border-b-0',
    },
    flush: {
      trigger: 'px-3 py-2.5',
      content: 'px-3 pb-3',
      divider: 'last:border-b-0',
    },
  };

  const cfg = variantClasses[variant];

  const pressScale = reducedMotion ? 1 : isPressed ? 0.98 : 1;

  return (
    <div className={cn(cfg.divider, className)}>
      {/* Trigger button */}
      <motion.button
        type="button"
        ref={(el) => {
          if (el) triggerRefsRef.current.set(value, el);
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={triggerId}
        animate={{ scale: pressScale }}
        transition={spring.snappy}
        {...pressHandlers}
        className={cn(
          'w-full flex items-center justify-between gap-3',
          'cursor-pointer transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2',
          cfg.trigger,
          disabled && 'cursor-not-allowed opacity-40',
          'hover:bg-[var(--color-surface-2)]',
        )}
      >
        {/* Left side: icon + title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {IconComponent && (
            <Icon
              icon={IconComponent}
              size="md"
              className="shrink-0 text-[var(--color-on-surface-subtle-1)]"
            />
          )}
          <span className="text-md font-semibold text-[var(--color-on-surface)] text-left">
            <Typo>{title}</Typo>
          </span>
        </div>

        {/* Right side: chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={reducedMotion ? { duration: 0 } : spring.snappy}
          className="shrink-0 flex items-center justify-center"
        >
          <Icon
            icon={ChevronDown}
            size="md"
            className="text-[var(--color-on-surface-subtle-1)]"
          />
        </motion.div>
      </motion.button>

      {/* Content area */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : transition.expand
            }
            style={{ overflow: 'hidden' }}
          >
            <div
              role="region"
              aria-labelledby={triggerId}
              id={contentId}
              className={cn(cfg.content)}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
