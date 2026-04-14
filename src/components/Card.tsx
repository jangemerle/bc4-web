/* eslint-disable react-refresh/only-export-components */
/**
 * Card — composable surface component with semantic spacing tokens.
 *
 * Surface variants:
 *   elevated  — shadow, surface-1 bg, no border (default)
 *   outlined  — border, transparent bg, no shadow
 *   filled    — surface-2 bg, no border, no shadow
 *   ai        — gradient border + subtle tint, AI chip
 *
 * Density:
 *   default   — space-lg padding
 *   compact   — space-md padding
 *   flush     — 0 padding, no radius, no shadow
 *
 * Clickable:
 *   as="div"     — static (default)
 *   as="a"       — anchor, whole card is a link
 *   as="button"  — button, whole card is clickable
 *
 * Composition:
 *   <Card>
 *     <Card.Media><img ... /></Card.Media>
 *     <Card.Header icon={Icon} title="..." description="..." chip={} actions={} />
 *     <Card.Body>{content}</Card.Body>
 *     <Card.Footer>{buttons}</Card.Footer>
 *   </Card>
 */

import { forwardRef, createContext, useContext } from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { spring } from '../tokens/motion';
import { usePress } from '../hooks/usePress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Typo } from './Typo';

// ─── Types ───────────────────────────────────────────────────────────────────

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ai';
type CardDensity = 'default' | 'compact' | 'flush';
type CardAs = 'div' | 'a' | 'button';

interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  variant?: CardVariant;
  density?: CardDensity;
  /** Render as div (default), a, or button for clickable cards */
  as?: CardAs;
  /** href when as="a" */
  href?: string;
  /** target when as="a" */
  target?: string;
  children?: React.ReactNode;
}

interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Lucide icon rendered before the title */
  icon?: LucideIcon;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Chip element rendered after the title */
  chip?: React.ReactNode;
  /** Actions rendered at the end of the title row */
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Align footer content */
  align?: 'start' | 'end' | 'between';
  children?: React.ReactNode;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CardContext = createContext<{ variant: CardVariant; density: CardDensity }>({
  variant: 'elevated',
  density: 'default',
});

// ─── Density token overrides ─────────────────────────────────────────────────

const densityTokens: Record<CardDensity, React.CSSProperties> = {
  default: {
    '--card-padding': 'var(--space-lg)',
    '--card-gap': 'var(--space-md)',
    '--card-inner-padding': 'var(--space-md)',
    '--card-header-gap': 'var(--space-sm)',
    '--card-body-gap': 'var(--space-sm)',
  } as React.CSSProperties,
  compact: {
    '--card-padding': 'var(--space-md)',
    '--card-gap': 'var(--space-sm)',
    '--card-inner-padding': 'var(--space-sm)',
    '--card-header-gap': 'var(--space-xs)',
    '--card-body-gap': 'var(--space-xs)',
  } as React.CSSProperties,
  flush: {
    '--card-padding': '0px',
    '--card-gap': 'var(--space-sm)',
    '--card-inner-padding': 'var(--space-md)',
    '--card-header-gap': 'var(--space-sm)',
    '--card-body-gap': 'var(--space-sm)',
  } as React.CSSProperties,
};

// ─── Variant visual styles ───────────────────────────────────────────────────

function variantStyle(variant: CardVariant, density: CardDensity): React.CSSProperties {
  const isFlush = density === 'flush';

  const base: React.CSSProperties = {
    borderRadius: isFlush ? 0 : 'var(--radius-lg)',
  };

  switch (variant) {
    case 'elevated':
      return {
        ...base,
        backgroundColor: 'var(--color-surface-1)',
        border: 'none',
        boxShadow: isFlush ? 'none' : 'var(--shadow-small-1)',
      };
    case 'outlined':
      return {
        ...base,
        backgroundColor: 'transparent',
        border: isFlush ? 'none' : '1px solid var(--color-border)',
        boxShadow: 'none',
      };
    case 'filled':
      return {
        ...base,
        backgroundColor: 'var(--color-surface-2)',
        border: 'none',
        boxShadow: 'none',
      };
    case 'ai':
      return {
        ...base,
        background: isFlush
          ? 'var(--gradient-ai-subtle)'
          : `var(--gradient-ai-subtle) padding-box, var(--gradient-ai-border) border-box`,
        border: isFlush ? 'none' : '1px solid transparent',
        boxShadow: 'none',
      };
  }
}

// ─── Hover styles per variant ────────────────────────────────────────────────

function hoverShadow(variant: CardVariant): string {
  switch (variant) {
    case 'elevated': return 'var(--shadow-medium-1)';
    case 'outlined': return 'var(--shadow-small-1)';
    case 'filled': return 'var(--shadow-small-1)';
    case 'ai': return 'var(--shadow-small-1)';
  }
}

// ─── Card ────────────────────────────────────────────────────────────────────

const CardRoot = forwardRef<HTMLElement, CardProps>(
  ({
    variant = 'elevated',
    density = 'default',
    as = 'div',
    href,
    target,
    className,
    style,
    children,
    onClick,
    ...rest
  }, ref) => {
    const isClickable = as !== 'div';
    const reducedMotion = useReducedMotion();
    const { isPressed, pressHandlers } = usePress({ disabled: !isClickable });

    const baseStyle: React.CSSProperties = {
      ...densityTokens[density],
      ...variantStyle(variant, density),
      padding: 'var(--card-padding)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--card-gap)',
      textDecoration: 'none',
      color: 'inherit',
      textAlign: 'left',
      cursor: isClickable ? 'pointer' : undefined,
      // Focus ring for clickable cards
      outline: 'none',
      ...style,
    };

    // Focus ring class for clickable
    const focusClass = isClickable
      ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-1)] focus-visible:outline-offset-2'
      : '';

    const classes = [className, focusClass].filter(Boolean).join(' ') || undefined;

    // Animated wrapper for clickable cards
    if (isClickable) {
      const MotionComponent = as === 'a' ? motion.a : motion.button;

      const linkProps = as === 'a'
        ? { href, target, ...(target === '_blank' ? { rel: 'noopener noreferrer' } : {}) }
        : {};

      const motionProps = {
        ref,
        className: classes,
        style: baseStyle,
        onClick,
        animate: {
          scale: isPressed ? 0.98 : 1,
          y: 0,
        },
        whileHover: reducedMotion
          ? {}
          : { y: -2, boxShadow: hoverShadow(variant) },
        transition: spring.snappy,
        ...pressHandlers,
        ...rest,
        ...linkProps,
      };

      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <MotionComponent {...(motionProps as any)}>
          <CardContext.Provider value={{ variant, density }}>
            {children}
          </CardContext.Provider>
        </MotionComponent>
      );
    }

    // Static div
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={classes} style={baseStyle} {...rest}>
        <CardContext.Provider value={{ variant, density }}>
          {children}
        </CardContext.Provider>
      </div>
    );
  }
);
CardRoot.displayName = 'Card';

// ─── Card.Media ──────────────────────────────────────────────────────────────

function CardMedia({ className, style, children, ...rest }: CardMediaProps) {
  const { density } = useContext(CardContext);

  return (
    <div
      className={className}
      style={{
        // Negative margin to make media full-bleed within card padding
        // Only for non-flush cards that have padding
        ...(density !== 'flush' ? {
          marginTop: 'calc(-1 * var(--card-padding))',
          marginLeft: 'calc(-1 * var(--card-padding))',
          marginRight: 'calc(-1 * var(--card-padding))',
        } : {}),
        overflow: 'hidden',
        borderRadius: density !== 'flush'
          ? 'var(--radius-lg) var(--radius-lg) 0 0'
          : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Card.Header ─────────────────────────────────────────────────────────────

function CardHeader({
  icon: Icon,
  title,
  description,
  chip,
  actions,
  className,
  style,
  children,
  ...rest
}: CardHeaderProps) {
  const { variant } = useContext(CardContext);

  // AI variant gets a default chip if none provided
  const showAiChip = variant === 'ai' && chip === undefined;
  const chipElement = showAiChip ? (
    <span
      className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold"
      style={{
        background: 'var(--gradient-ai-vivid)',
        color: 'var(--color-on-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: '3px 10px',
      }}
    >
      <Sparkles size={11} strokeWidth={2.5} />
      AI
    </span>
  ) : chip;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--card-header-gap)',
        ...style,
      }}
      {...rest}
    >
      {/* Chip row (AI variant or custom chip) */}
      {chipElement && (
        <div style={{ display: 'flex' }}>
          {chipElement}
        </div>
      )}

      {/* Title row: icon + title + actions */}
      {(Icon || title || actions) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', minWidth: 0 }}>
            {Icon && (
              <div
                style={{
                  flexShrink: 0,
                  color: variant === 'ai' ? undefined : 'var(--color-on-surface-subtle-1)',
                }}
              >
                <Icon size={20} />
              </div>
            )}
            {title && (
              <h3
                className="font-display font-semibold text-headline-s"
                style={{ color: 'var(--color-on-surface)', minWidth: 0 }}
              >
                <Typo>{title}</Typo>
              </h3>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexShrink: 0 }}>
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <p
          className="font-sans text-md"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          <Typo>{description}</Typo>
        </p>
      )}

      {children}
    </div>
  );
}

// ─── Card.Body ───────────────────────────────────────────────────────────────

function CardBody({ className, style, children, ...rest }: CardBodyProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--card-body-gap)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Card.Footer ─────────────────────────────────────────────────────────────

const footerAlignMap = {
  start: 'flex-start',
  end: 'flex-end',
  between: 'space-between',
} as const;

function CardFooter({ align = 'end', className, style, children, ...rest }: CardFooterProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: footerAlignMap[align],
        gap: 'var(--space-sm)',
        paddingTop: 'var(--card-header-gap)',
        borderTop: '1px solid var(--color-border)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Card.Divider ────────────────────────────────────────────────────────────

interface CardDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Inset divider respects card padding; full-width bleeds to edges */
  inset?: boolean;
}

function CardDivider({ inset = false, className, style, ...rest }: CardDividerProps) {
  const { density } = useContext(CardContext);

  return (
    <hr
      className={className}
      style={{
        border: 'none',
        height: 1,
        backgroundColor: 'var(--color-border)',
        // Full-width: negative margin to bleed to card edges
        ...(!inset && density !== 'flush' ? {
          marginLeft: 'calc(-1 * var(--card-padding))',
          marginRight: 'calc(-1 * var(--card-padding))',
        } : {}),
        ...style,
      }}
      {...rest}
    />
  );
}

// ─── Compose ─────────────────────────────────────────────────────────────────

export const Card = Object.assign(CardRoot, {
  Media: CardMedia,
  Header: CardHeader,
  Body: CardBody,
  Divider: CardDivider,
  Footer: CardFooter,
});

export type {
  CardProps,
  CardHeaderProps,
  CardMediaProps,
  CardBodyProps,
  CardDividerProps,
  CardFooterProps,
  CardVariant,
  CardDensity,
  CardAs,
};
