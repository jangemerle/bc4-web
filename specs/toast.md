# Toast — Component Spec

**Status:** Not started
**Figma node:** TBD
**Dependencies:** Icon, Button, cn(), motion tokens, useReducedMotion

---

## Overview

Ephemeral feedback messages for background operations, confirmations, warnings, and errors. Non-blocking, auto-dismissing, stackable.

---

## Architecture

Three parts:

1. **ToastProvider** — Context + portal. Wraps app, manages queue, renders stack.
2. **toast()** — Imperative API to dispatch toasts from anywhere.
3. **Toast** — Individual toast UI component (internal).

```tsx
// Setup
<ToastProvider position="bottom-right">
  <App />
</ToastProvider>

// Usage anywhere
toast.success('File uploaded', 'document.pdf is ready');
toast.danger('Delete failed', { duration: 7000 });
toast({ variant: 'warning', title: 'Offline', action: { label: 'Retry', onAction: reconnect } });
```

---

## Props API

```typescript
type ToastVariant = 'info' | 'success' | 'warning' | 'danger';
type ToastPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top-center' | 'bottom-center';

interface ToastData {
  variant?: ToastVariant;           // default: 'info'
  title: string;
  description?: string;
  icon?: LucideIcon;                // override default variant icon
  action?: { label: string; onAction: () => void };
  dismissible?: boolean;            // default: true
  duration?: number;                // default: 5000ms, 0 = manual only
  onDismiss?: () => void;
}

interface ToastProviderProps {
  position?: ToastPosition;         // default: 'bottom-right'
  maxVisible?: number;              // default: 3
  children: React.ReactNode;
}
```

---

## Variants

| Variant | Icon | Accent color | ARIA |
|---------|------|-------------|------|
| info | `Info` (Lucide) | `var(--color-secondary-1)` | `role="status"` `aria-live="polite"` |
| success | `CheckCircle` | `var(--color-success-1)` | `role="status"` `aria-live="polite"` |
| warning | `AlertTriangle` | `var(--color-warning-1)` | `role="alert"` `aria-live="assertive"` |
| danger | `AlertCircle` | `var(--color-danger-1)` | `role="alert"` `aria-live="assertive"` |

---

## Visual Spec

### Anatomy
```
┌──────────────────────────────────────┐
│ [icon]  Title              [action] [✕] │
│         Description (optional)          │
└──────────────────────────────────────┘
```

- Background: `var(--color-surface-1)`
- Border: `1px solid var(--color-border)`
- Shadow: `shadow-medium-2`
- Border radius: `rounded-lg` (12px)
- Padding: 16px
- Gap: 12px between icon and text, 8px between action and dismiss
- Max width: 360px
- Icon size: `md` (20px)
- Title: `text-md`, `font-semibold`, `var(--color-on-surface)`
- Description: `text-sm`, `font-medium`, `var(--color-on-surface-subtle-1)`
- Dismiss X: Icon `sm` (16px), `var(--color-on-surface-subtle-1)`

---

## Animation

### Enter
```typescript
initial: { opacity: 0, x: '100%' }  // slide from right
animate: { opacity: 1, x: 0 }
transition: transition.reveal  // spring.default + ease.enter fade
```

### Exit
```typescript
exit: { opacity: 0, x: '100%' }
transition: transition.dismiss  // spring.snappy + ease.exit fade
```

### Stack reorder (layout animation)
```typescript
layout: true
transition: spring.default  // smooth position changes when toasts enter/exit
```

### Success icon celebration
```typescript
initial: { scale: 0.6 }
animate: { scale: 1 }
transition: transition.celebrate  // spring.playful + ease.enter
```

### Stagger
50ms delay between each toast entry when multiple arrive simultaneously.

### Reduced motion
Opacity only (no slide, no scale). `duration.base` tween.

---

## Stacking Behavior

- Newest toast on top
- Max 3 visible (configurable via provider)
- Older visible toasts scale down: `scale(0.95)`, `opacity: 0.8`
- 4th+ toast queued invisibly, slides in when a slot opens
- Stack gap: 8px between toasts

---

## Auto-Dismiss

- Default: 5000ms
- Per-toast configurable via `duration` prop
- `duration: 0` = never auto-dismiss
- Timer pauses on mouse hover, resumes on mouse leave
- Timer pauses when window loses focus

---

## Accessibility

- info/success: `role="status"` + `aria-live="polite"`
- warning/danger: `role="alert"` + `aria-live="assertive"`
- Dismiss button: `aria-label="Dismiss notification"`
- Action button is keyboard-focusable
- Icon is decorative (no aria-label)

---

## Keyboard

- **Tab**: Cycle through action → dismiss within toast
- **Escape**: Dismiss most recent toast (LIFO order)
- No auto-focus on toast appearance (non-intrusive)

---

## Edge Cases

- Rapid fire (10+ toasts/sec): queue with 50ms stagger, max 3 visible
- Long text: title max 2 lines, description wraps freely
- Action callback errors: log error, toast remains visible
- `duration: 0` + `dismissible: false`: toast persists until programmatic removal
- Provider unmount: clear all pending toasts
- Multiple providers: not supported, warn in dev

---

## Showcase (App.tsx)

1. All 4 variants with default icons
2. Toast with action button (e.g. "Undo")
3. Auto-dismiss timer (hover to pause, resume on leave)
4. Stacking demo: fire 5+ toasts rapidly
5. Success icon celebration animation
6. Keyboard dismissal (Escape key)
7. Long text wrapping
8. Custom duration (2s vs 10s)
