/**
 * Toast state — module-level singleton with Observer pattern.
 *
 * The `toast()` function works outside React because it mutates
 * a singleton store and notifies subscribers. The <Toaster> component
 * subscribes in useEffect and syncs to React state.
 */

import type { ToastData, ToastInput, ToastType, PromiseOptions } from './types';

type Subscriber = (toast: ToastData) => void;

let toastCounter = 0;

class ToastObserver {
  private subscribers: Subscriber[] = [];
  private dismissedIds = new Set<string | number>();

  subscribe(fn: Subscriber) {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private publish(toast: ToastData) {
    for (const fn of this.subscribers) fn(toast);
  }

  create(type: ToastType, opts: ToastInput): string | number {
    const id = ++toastCounter;
    const toast: ToastData = {
      ...opts,
      id,
      type,
      createdAt: Date.now(),
    };
    this.publish(toast);
    return id;
  }

  /** Update an existing toast (e.g. promise transition) */
  update(id: string | number, updates: Partial<ToastData>) {
    if (this.dismissedIds.has(id)) return;
    this.publish({ id, type: 'default', createdAt: Date.now(), ...updates } as ToastData);
  }

  dismiss(id?: string | number) {
    if (id !== undefined) {
      this.dismissedIds.add(id);
    }
    // Notify subscribers — they handle the exit animation
    requestAnimationFrame(() => {
      if (id !== undefined) {
        this.publish({ id, type: 'default', dismiss: true, createdAt: 0 } as ToastData);
      }
    });
  }
}

export const observer = new ToastObserver();

// ─── Public toast() API ──────────────────────────────────────────────────────

function createToast(title: React.ReactNode, opts?: Partial<ToastInput>): string | number {
  return observer.create('default', { title, ...opts });
}

function success(title: React.ReactNode, opts?: Partial<ToastInput>) {
  return observer.create('success', { title, ...opts });
}

function error(title: React.ReactNode, opts?: Partial<ToastInput>) {
  return observer.create('error', { title, ...opts });
}

function warning(title: React.ReactNode, opts?: Partial<ToastInput>) {
  return observer.create('warning', { title, ...opts });
}

function info(title: React.ReactNode, opts?: Partial<ToastInput>) {
  return observer.create('info', { title, ...opts });
}

function loading(title: React.ReactNode, opts?: Partial<ToastInput>) {
  return observer.create('loading', { title, ...opts });
}

function promise<T>(
  promise: Promise<T>,
  opts: PromiseOptions<T>,
): { id: string | number; unwrap: () => Promise<T> } {
  const id = observer.create('loading', {
    title: opts.loading,
    description: opts.description,
    duration: Infinity,
  });

  promise
    .then((data) => {
      const title = typeof opts.success === 'function'
        ? (opts.success as (d: T) => React.ReactNode)(data)
        : opts.success;
      observer.update(id, {
        type: 'success',
        title,
        duration: opts.duration,
      });
    })
    .catch((err) => {
      const title = typeof opts.error === 'function'
        ? (opts.error as (e: unknown) => React.ReactNode)(err)
        : opts.error;
      observer.update(id, {
        type: 'error',
        title,
        duration: opts.duration,
      });
    });

  return {
    id,
    unwrap: () => promise,
  };
}

function dismiss(id?: string | number) {
  observer.dismiss(id);
}

export const toast = Object.assign(createToast, {
  success,
  error,
  warning,
  info,
  loading,
  promise,
  dismiss,
});
