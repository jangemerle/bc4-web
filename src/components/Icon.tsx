/**
 * Design System — Icon component
 *
 * Thin wrapper around lucide-react icons that enforces:
 *   - Standard size scale (sm / md / lg / xl)
 *   - strokeWidth locked to 2 (matches Untitled UI Figma)
 *   - Color via `currentColor` (inherits from CSS)
 *
 * Usage:
 *   import { Search } from 'lucide-react';
 *   <Icon icon={Search} />
 *   <Icon icon={Search} size="sm" />
 *   <Icon icon={Search} size="xl" className="text-color-primary-1" />
 *
 * Or use lucide-react directly for one-offs:
 *   <Search size={24} strokeWidth={1.5} />
 */

import { type LucideIcon, type LucideProps } from 'lucide-react';
import { iconSize, type IconSize } from '../tokens/icons';

interface IconProps extends Omit<LucideProps, 'size' | 'strokeWidth'> {
  /** Any lucide-react icon component */
  icon: LucideIcon;
  /** Size variant — defaults to 'lg' (24px, the Figma native grid size) */
  size?: IconSize;
  /** Override pixel size directly (bypasses size scale) */
  sizePx?: number;
  /** Override strokeWidth — defaults to 2 */
  strokeWidth?: number;
  /** Accessible label — set when icon has meaning without surrounding text */
  'aria-label'?: string;
}

export function Icon({ icon: LucideIconComponent, size = 'lg', sizePx, strokeWidth = 2, 'aria-label': ariaLabel, ...rest }: IconProps) {
  return (
    <LucideIconComponent
      size={sizePx ?? iconSize[size]}
      strokeWidth={strokeWidth}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      {...rest}
    />
  );
}
