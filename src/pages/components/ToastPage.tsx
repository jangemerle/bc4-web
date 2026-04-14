import { useState } from 'react';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';
import { Button } from '../../components/Button';
import { toast } from '../../components/Toast';
import type { ToastPosition } from '../../components/Toast';

// ─── Position options ────────────────────────────────────────────────────────

const POSITIONS: ToastPosition[] = [
  'top-left', 'top-center', 'top-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

// ─── Fake async ──────────────────────────────────────────────────────────────

const fakePromise = (shouldFail = false) =>
  new Promise<{ name: string }>((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail) reject(new Error('Network timeout'));
      else resolve({ name: 'document.pdf' });
    }, 2000)
  );

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToastPage() {
  const [position, setPosition] = useState<ToastPosition>('bottom-right');

  return (
    <section className="mb-24">
      <PageHero
        title="Toast"
        subtitle={"Temporary feedback.\nNon-blocking. Dismissible."}
        description="Toast notifications surface brief messages without interrupting the user's flow. Auto-dismiss, swipe to dismiss, stacking, and promise states — built from scratch, zero dependencies."
      />

      {/* ── Types ──────────────────────────────────────────────────── */}
      <SectionTitle>Toast types</SectionTitle>
      <Card>
        <Spec>Six types for different feedback contexts. Each gets its own icon and color accent.</Spec>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast('Document saved to drafts')}
          >
            Default
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.success('Changes saved successfully')}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.error('Failed to upload file', { description: 'Check your connection and try again.' })}
          >
            Error
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.warning('Storage almost full', { description: '92% of 10 GB used.' })}
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.info('New version available', { description: 'Refresh to update.' })}
          >
            Info
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.loading('Uploading document...')}
          >
            Loading
          </Button>
        </div>
      </Card>

      {/* ── With description ───────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>With description</SectionTitle>
      <Card>
        <Spec>Add a secondary line for context. Title is bold, description is subtle.</Spec>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.success('Team member added', {
              description: 'jane@company.com now has editor access.',
            })}
          >
            With description
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.error('Import failed', {
              description: '3 rows had invalid email addresses. Download the error report for details.',
            })}
          >
            Long description
          </Button>
        </div>
      </Card>

      {/* ── Actions ────────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>With action</SectionTitle>
      <Card>
        <Spec>Attach an undo or follow-up action. Clicking the action auto-dismisses the toast.</Spec>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast('Email archived', {
              action: {
                label: 'Undo',
                onClick: () => toast.success('Email restored'),
              },
            })}
          >
            With undo
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.success('Report generated', {
              description: '14 pages, 3.2 MB',
              action: {
                label: 'Download',
                onClick: () => toast.info('Download started'),
              },
            })}
          >
            With download
          </Button>
        </div>
      </Card>

      {/* ── Promise ────────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Promise</SectionTitle>
      <Card>
        <Spec>Track an async operation. Loading → success or error, all in the same toast slot.</Spec>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.promise(fakePromise(), {
              loading: 'Uploading document...',
              success: (data) => `${data.name} uploaded`,
              error: 'Upload failed',
            })}
          >
            Promise (success)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.promise(fakePromise(true), {
              loading: 'Uploading document...',
              success: 'Uploaded',
              error: 'Upload failed. Check connection.',
            })}
          >
            Promise (fail)
          </Button>
        </div>
      </Card>

      {/* ── Stacking ───────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Stacking</SectionTitle>
      <Card>
        <Spec>Multiple toasts stack visually. Hover to expand and see all. Newest is always on top.</Spec>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            toast('First notification');
            setTimeout(() => toast.success('Second notification'), 200);
            setTimeout(() => toast.info('Third notification', { description: 'Hover the stack to expand' }), 400);
          }}
        >
          Trigger 3 toasts
        </Button>
      </Card>

      {/* ── Position ───────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Position</SectionTitle>
      <Card>
        <Spec>Six placement options. The Toaster position is set once at the app root.</Spec>

        <div className="grid grid-cols-3 gap-2 max-w-sm mb-6">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => {
                setPosition(pos);
                // Temporarily change position by re-mounting toaster
                // For demo purposes, just show a toast at the info level
                toast.info(`Position: ${pos}`);
              }}
              className="px-3 py-2 rounded-m font-mono text-xs font-medium transition-colors text-center"
              style={{
                backgroundColor: position === pos ? 'var(--color-primary-1)' : 'var(--color-surface-2)',
                color: position === pos ? 'var(--color-on-primary)' : 'var(--color-on-surface-subtle-1)',
              }}
            >
              {pos}
            </button>
          ))}
        </div>

        <p className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Note: Position is configured on the {'<Toaster>'} component in your app root, not per-toast. This demo shows the grid but all toasts use the app's configured position.
        </p>
      </Card>

      {/* ── Swipe ──────────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Swipe to dismiss</SectionTitle>
      <Card>
        <Spec>Drag any toast horizontally to dismiss it. Velocity-based — a quick flick works even for short drags.</Spec>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toast('Try swiping me left or right', { duration: 10000 })}
        >
          Long-lived toast (10s)
        </Button>
      </Card>

      {/* ── API reference ──────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>API</SectionTitle>
      <Card>
        <div className="font-mono text-xs p-4 rounded-m mb-6" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-subtle-1)' }}>
          <span style={{ color: 'var(--color-primary-1)' }}>import</span>
          {" { toast } "}
          <span style={{ color: 'var(--color-primary-1)' }}>from</span>
          {" '../components/Toast';"}
        </div>

        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { method: "toast('msg')", desc: 'Default toast' },
            { method: "toast.success('msg')", desc: 'Success with check icon' },
            { method: "toast.error('msg')", desc: 'Error with X icon' },
            { method: "toast.warning('msg')", desc: 'Warning with triangle icon' },
            { method: "toast.info('msg')", desc: 'Info with i icon' },
            { method: "toast.loading('msg')", desc: 'Loading spinner, no auto-dismiss' },
            { method: "toast.promise(p, {...})", desc: 'Track async: loading → success/error' },
            { method: "toast.dismiss(id?)", desc: 'Dismiss by ID, or all if no ID' },
          ].map(({ method, desc }) => (
            <div key={method} className="flex items-center gap-4 py-3">
              <code className="font-mono text-xs font-semibold w-56 shrink-0" style={{ color: 'var(--color-on-secondary-1)' }}>{method}</code>
              <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
