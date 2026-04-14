/**
 * ScreenVaultFrame — shared layout for Screen Vault doc pages.
 *
 * Renders a title + description header row, then a thick-bordered
 * rounded container with a subtle grid pattern background that
 * contains the actual screen preview, vertically centered.
 *
 * Matches: Figma / Topic Board New / node 9012:31806
 */

import { type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../components/Button';

interface ScreenVaultFrameProps {
  /** Page title (e.g. "Email verification prompt") */
  title: string;
  /** Description text shown next to the title */
  description: string;
  /** The standalone screen component to render inside the frame */
  children: ReactNode;
  /** Optional link to open the standalone version */
  standaloneId?: string;
  /** Override the content area background style */
  contentStyle?: React.CSSProperties;
  /**
   * @deprecated No longer used — frame now fills the viewport.
   * Kept for backwards compatibility; will be ignored.
   */
  frameHeight?: number;
}

export function ScreenVaultFrame({
  title,
  description,
  children,
  standaloneId,
  contentStyle,
}: ScreenVaultFrameProps) {
  return (
    <div className="flex flex-col gap-10 w-full flex-1 min-h-0">
      {/* Header row: title + description + open-standalone button */}
      <div className="flex gap-[50px] items-start w-full">
        <h1
          className="flex-1 font-display text-headline-m font-semibold leading-[1.2]"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {title}
        </h1>
        <p
          className="flex-1 font-sans text-md font-medium leading-[1.5] tracking-[0.14px]"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          {description}
        </p>
        {standaloneId && (
          <Button
            variant="elevated"
            size="md"
            iconOnly={ExternalLink}
            aria-label="Open standalone"
            onClick={() => window.open(`?standalone=${standaloneId}`, '_blank')}
          />
        )}
      </div>

      {/* Framed screen preview — grows to fill remaining viewport space */}
      <div
        className="w-full rounded-[40px] border-8 overflow-hidden relative flex-1 min-h-0"
        style={{
          borderColor: 'var(--color-inverted-surface)',
          minHeight: 680,
        }}
      >
        {/* Screen content — absolute fills the flex-sized parent reliably */}
        <div
          className="absolute inset-0 overflow-auto"
          style={{ backgroundColor: 'var(--color-bg)', ...contentStyle }}
        >
          {/* Grid overlay — absolute bottom layer behind all screen content */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              opacity: 0.06,
              zIndex: 0,
            }}
          />
          <div className="relative w-full h-full flex items-center justify-center" style={{ zIndex: 1 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
