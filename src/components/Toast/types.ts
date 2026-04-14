import type { LucideIcon } from 'lucide-react';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: string | number;
  type: ToastType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  action?: ToastAction;
  /** Auto-dismiss duration in ms. Infinity = no auto-dismiss. */
  duration?: number;
  /** Set by dismiss() — triggers exit animation */
  dismiss?: boolean;
  /** Set after exit animation — ready to unmount */
  removed?: boolean;
  /** Timestamp of creation */
  createdAt: number;
}

export type ToastInput = Omit<ToastData, 'id' | 'type' | 'createdAt'>;

export interface PromiseOptions<T> {
  loading: React.ReactNode;
  success: React.ReactNode | ((data: T) => React.ReactNode);
  error: React.ReactNode | ((err: unknown) => React.ReactNode);
  description?: React.ReactNode;
  duration?: number;
}
