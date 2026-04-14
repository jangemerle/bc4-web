/**
 * Design System — UserAvatar component
 * Source: Figma / Topic Board New / node 5240:30710
 *
 * Sizes:     xs (20px) | sm (24px) | md (32px) | lg (40px)
 * Types:     initials | icon | photo
 * Compound:  UserAvatarLabel — avatar + name + optional caption
 *
 * Usage:
 *   <UserAvatar initials="TV" />
 *   <UserAvatar initials="DT" size="lg" />
 *   <UserAvatar src="/photos/jane.jpg" alt="Jane" size="md" />
 *   <UserAvatar icon={User} size="sm" />
 *
 *   <UserAvatarLabel initials="TV" name="Thomas Vybert" />
 *   <UserAvatarLabel initials="TV" name="Thomas Vybert" caption="donda@grouweapps.com" size="lg" />
 */

import { User, Users, type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';
import { cn } from '../lib/cn';

// ─── Public types ─────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

export interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  /** 1–2 character initials */
  initials?: string;
  /** Photo URL */
  src?: string;
  /** Alt text for photo */
  alt?: string;
  /** Icon to display (defaults to User icon if no initials or src) */
  icon?: LucideIcon;
  /** Show group icon variant */
  group?: boolean;
}

export interface UserAvatarLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  /** 1–2 character initials */
  initials?: string;
  /** Photo URL */
  src?: string;
  /** Icon for avatar */
  icon?: LucideIcon;
  /** Display name */
  name: string;
  /** Caption text (e.g. email) */
  caption?: string;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const avatarSizeConfig: Record<AvatarSize, {
  container: string;
  textSize: string;
  iconSize: 'sm' | 'md' | 'lg';
}> = {
  xs: {
    container: 'size-5',    // 20px
    textSize: 'text-2xs tracking-[0.32px]',  // 8px
    iconSize: 'sm',         // 16px
  },
  sm: {
    container: 'size-6',    // 24px
    textSize: 'text-xs tracking-[0.4px]',    // 10px
    iconSize: 'sm',         // 16px
  },
  md: {
    container: 'size-8',    // 32px
    textSize: 'text-sm tracking-[0.48px]',   // 12px
    iconSize: 'md',         // 20px
  },
  lg: {
    container: 'size-10',   // 40px
    textSize: 'text-base tracking-[0.16px]', // 16px
    iconSize: 'lg',         // 24px
  },
};

const labelSizeConfig: Record<AvatarSize, {
  gap: string;
  nameSize: string;
  captionSize: string;
}> = {
  xs: {
    gap: 'gap-[6px]',
    nameSize: 'text-md tracking-[0.14px]',   // 14px
    captionSize: 'text-sm tracking-[0.48px]', // 12px
  },
  sm: {
    gap: 'gap-2',
    nameSize: 'text-md tracking-[0.14px]',   // 14px
    captionSize: 'text-sm tracking-[0.48px]',
  },
  md: {
    gap: 'gap-2',
    nameSize: 'text-base tracking-[0.16px]', // 16px
    captionSize: 'text-sm tracking-[0.48px]',
  },
  lg: {
    gap: 'gap-3',
    nameSize: 'text-lg',                     // 18px
    captionSize: 'text-sm tracking-[0.48px]',
  },
};

// ─── UserAvatar ───────────────────────────────────────────────────────────────

export function UserAvatar({
  size = 'xs',
  initials,
  src,
  alt,
  icon,
  group = false,
  className,
  style,
  ...rest
}: UserAvatarProps) {
  const cfg = avatarSizeConfig[size];

  // Determine what to render
  const hasPhoto = !!src;
  const hasInitials = !!initials;
  const resolvedIcon = group ? Users : (icon ?? User);

  return (
    <div
      className={cn(
        'relative rounded-xl shrink-0 overflow-hidden',
        'shadow-small-1',
        hasPhoto ? '' : 'bg-[var(--color-surface-1)]',
        cfg.container,
        className,
      )}
      style={style}
      {...rest}
    >
      {hasPhoto ? (
        <img
          src={src}
          alt={alt ?? ''}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : hasInitials ? (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'font-sans font-bold leading-normal',
            cfg.textSize,
          )}
          style={{ color: 'var(--color-on-surface)' }}
        >
          {initials}
        </div>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          <Icon icon={resolvedIcon} size={cfg.iconSize} />
        </div>
      )}
    </div>
  );
}

// ─── UserAvatarLabel ──────────────────────────────────────────────────────────

export function UserAvatarLabel({
  size = 'xs',
  initials,
  src,
  icon,
  name,
  caption,
  className,
  ...rest
}: UserAvatarLabelProps) {
  const lcfg = labelSizeConfig[size];

  return (
    <div
      className={cn('flex items-center', lcfg.gap, className)}
      {...rest}
    >
      <UserAvatar size={size} initials={initials} src={src} icon={icon} />

      <div className={cn('flex flex-col justify-center', caption ? 'gap-0' : '')}>
        <span
          className={cn('font-sans font-bold leading-normal', lcfg.nameSize)}
          style={{ color: 'var(--color-on-surface)' }}
        >
          {name}
        </span>
        {caption && (
          <span
            className={cn('font-sans font-medium leading-normal', lcfg.captionSize)}
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
