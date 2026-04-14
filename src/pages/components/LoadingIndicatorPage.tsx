/**
 * LoadingIndicatorPage — Kvalt DS documentation for LoadingIndicator component
 */

import { useState } from 'react';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

const SIZES = ['sm', 'md', 'lg'] as const;

export default function LoadingIndicatorPage() {
  const [activeSize, setActiveSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showLabel, setShowLabel] = useState(true);

  return (
    <>
      <PageHero
        title="Loading Indicator"
        subtitle="Spinner + illustration · Motion-powered · 3 sizes"
        description="Animated feedback for asynchronous operations. The spinner variant suits quick loads; the illustration variant adds personality to longer waits."
      />

      <TokenChips
        tokens={{
          Variants: ['spinner', 'illustration'],
          Sizes: ['sm', 'md', 'lg'],
          Props: ['label', 'illustrationName'],
        }}
      />

      {/* ══ VARIANTS ═════════════════════════════════════════════════════════ */}
      {/* ── Spinner variant ─────────────────────────────────────── */}
      <SectionTitle>Spinner</SectionTitle>
      <Card>
        <Spec>Single circle with stretchy arc · spring bounce (0.35) · breathes as it rotates</Spec>
        <div className="flex items-end gap-16">
          {SIZES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-4">
              <LoadingIndicator size={s} />
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Spinner with label ─────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>With label</SectionTitle>
      <Card>
        <Spec>Optional text below the indicator · scales with size</Spec>
        <div className="flex items-start gap-16">
          <LoadingIndicator size="sm" label="Loading…" />
          <LoadingIndicator size="md" label="Fetching data…" />
          <LoadingIndicator size="lg" label="Preparing your report…" />
        </div>
      </Card>

      {/* ── Illustration variant ────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Illustration</SectionTitle>
      <Card>
        <Spec>Animated GIF from the illustration library · autoplay · default: walking-up-stairs</Spec>
        <div className="flex items-end gap-16">
          {SIZES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-4">
              <LoadingIndicator variant="illustration" size={s} />
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Rotating messages ──────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Rotating messages</SectionTitle>
      <Card>
        <Spec>No label prop → cycles through 20 quirky messages with animated trailing dots. New message every 3s (configurable via messageInterval prop).</Spec>
        <div className="flex items-start gap-16">
          <LoadingIndicator
            variant="illustration"
            size="lg"
          />
          <LoadingIndicator
            variant="illustration"
            size="md"
            messageInterval={2000}
          />
        </div>
      </Card>

      {/* ── Illustration with fixed label ──────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Illustration with fixed label</SectionTitle>
      <Card>
        <Spec>Pass a label prop to override rotating messages with a static string</Spec>
        <div className="flex items-start gap-16">
          <LoadingIndicator
            variant="illustration"
            size="lg"
            label="Uploading your files"
          />
          <LoadingIndicator
            variant="illustration"
            size="md"
            label="Saving changes"
          />
        </div>
      </Card>

      {/* ── Custom illustration ──────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Custom illustration</SectionTitle>
      <Card>
        <Spec>Any animated illustration from the catalog via illustrationName prop</Spec>
        <div className="flex items-start gap-16">
          <LoadingIndicator
            variant="illustration"
            size="lg"
            illustrationName="eyes-following-star-goal-tracking-and-achievement-focus-trend-monitoring-and-analysis"
            label="Tracking progress…"
          />
          <LoadingIndicator
            variant="illustration"
            size="lg"
            illustrationName="hand-flipping-through-documents-contract-analysis-or-paperwork-review"
            label="Reviewing documents…"
          />
          <LoadingIndicator
            variant="illustration"
            size="lg"
            illustrationName="person-looking-through-a-magnifying-glass-to-find-information-searching-for-something"
            label="Searching…"
          />
        </div>
      </Card>

      <div className="mt-12" />
      {/* ══ PLAYGROUND ═══════════════════════════════════════════════════════ */}
      <SectionTitle>Playground</SectionTitle>
      <Card>
        <Spec>Toggle size and label to preview combinations</Spec>
        <div className="flex flex-col gap-8">
          {/* Controls */}
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-3">
              <span
                className="font-sans text-sm font-semibold"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                Size
              </span>
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSize(s)}
                  className="font-mono text-xs px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                  style={{
                    backgroundColor:
                      activeSize === s
                        ? 'var(--color-primary-1)'
                        : 'var(--color-surface-2)',
                    color:
                      activeSize === s
                        ? 'var(--color-on-primary)'
                        : 'var(--color-on-surface)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span
                className="font-sans text-sm font-semibold"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                Label
              </span>
              <button
                onClick={() => setShowLabel((l) => !l)}
                className="font-mono text-xs px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                style={{
                  backgroundColor: showLabel
                    ? 'var(--color-primary-1)'
                    : 'var(--color-surface-2)',
                  color: showLabel
                    ? 'var(--color-on-primary)'
                    : 'var(--color-on-surface)',
                }}
              >
                {showLabel ? 'on' : 'off'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div
            className="flex items-center justify-around rounded-lg py-12"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <LoadingIndicator
              variant="spinner"
              size={activeSize}
              label={showLabel ? 'Loading…' : undefined}
            />
            <LoadingIndicator
              variant="illustration"
              size={activeSize}
              label={showLabel ? 'Loading…' : undefined}
            />
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      {/* ══ ACCESSIBILITY ════════════════════════════════════════════════════ */}
      <SectionTitle>Accessibility</SectionTitle>
      <Card>
        <div className="flex flex-col gap-4 max-w-[600px]">
          <div className="flex gap-3 items-start">
            <span
              className="font-mono text-xs px-2 py-0.5 rounded shrink-0"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-on-surface)',
              }}
            >
              role="status"
            </span>
            <p
              className="font-sans text-sm"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Screen readers announce the loading indicator as a live region — content updates are announced automatically.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span
              className="font-mono text-xs px-2 py-0.5 rounded shrink-0"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-on-surface)',
              }}
            >
              aria-label
            </span>
            <p
              className="font-sans text-sm"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Defaults to "Loading" when no label is provided. When a label prop is set, it becomes the accessible name.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span
              className="font-mono text-xs px-2 py-0.5 rounded shrink-0"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-on-surface)',
              }}
            >
              prefers-reduced-motion
            </span>
            <p
              className="font-sans text-sm"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Spinner degrades to a gentle opacity pulse — no rotation. Illustration variant still shows the static image.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Shimmer label</SectionTitle>
      <Card>
        <Spec>shimmerLabel prop · gradient sweep across rotating text · respects reduced motion</Spec>
        <div className="flex items-start gap-12">
          <div className="flex flex-col items-center">
            <LoadingIndicator variant="illustration" size="md" shimmerLabel />
          </div>
          <div className="flex flex-col items-center">
            <LoadingIndicator variant="spinner" size="md" label="Loading data…" shimmerLabel />
          </div>
        </div>
      </Card>
    </>
  );
}
