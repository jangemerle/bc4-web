import { useState } from 'react';
import { Toggle } from '../../components/Toggle';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

/** Self-contained toggle demo — each instance owns its state */
function ToggleDemo({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const [on, setOn] = useState(false);
  return <Toggle size={size} checked={on} onChange={(e) => setOn(e.target.checked)} />;
}

export default function TogglePage() {
  const [toggleOn2, setToggleOn2] = useState(true);
  const [toggleOn3, setToggleOn3] = useState(false);

  return (
    <>
      <PageHero
        title="Toggle"
        subtitle="3 sizes (28x16 / 36x20 / 44x24px) · spring thumb slide · instant track color"
        description="A binary switch for enabling or disabling settings, with spring-driven thumb animation, press scale feedback, and inline validation support."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['off', 'on', 'hover', 'active', 'disabled', 'invalid'], Slots: ['label', 'errorMessage'] }} />

      {/* ══ SIZES ════════════════════════════════════════════════════════════ */}
      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm · md · lg — click to toggle</Spec>
        <div className="flex items-center gap-10">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <ToggleDemo size={s} />
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />

      {/* ══ STATES ═══════════════════════════════════════════════════════════ */}
      <SectionTitle>States — off</SectionTitle>
      <Card>
        <Spec>Default (#c8d1d1) · Disabled · Invalid</Spec>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Toggle size="lg" checked={false} onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Toggle size="lg" checked={false} disabled onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Toggle size="lg" checked={false} invalid onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Invalid</span>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>States — on</SectionTitle>
      <Card>
        <Spec>Default (inverted-surface) · Hover (#4571ab) · Disabled (#c0c8c8) · Invalid (#d23031)</Spec>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Toggle size="lg" checked={true} onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Toggle size="lg" checked={true} disabled onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Toggle size="lg" checked={true} invalid onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Invalid</span>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>With label</SectionTitle>
      <Card>
        <Spec>8px gap · Inter SemiBold · interactive labels</Spec>
        <div className="flex flex-col gap-4">
          <Toggle
            size="lg"
            label="Enable notifications"
            checked={toggleOn2}
            onChange={(e) => setToggleOn2(e.target.checked)}
          />
          <Toggle
            size="lg"
            label="Dark mode"
            checked={toggleOn3}
            onChange={(e) => setToggleOn3(e.target.checked)}
          />
          <Toggle size="lg" label="Disabled option" disabled />
          <Toggle
            size="lg"
            label="Invalid toggle"
            checked={false}
            invalid
            errorMessage="This setting is required"
            onChange={() => {}}
          />
        </div>
      </Card>
    </>
  );
}
