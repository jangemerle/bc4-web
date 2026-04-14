/**
 * cn() — class name utility
 * Merges Tailwind classes safely, resolving conflicts (e.g. p-2 vs p-4 → p-4)
 * Usage: cn('base-class', condition && 'conditional-class', props.className)
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
