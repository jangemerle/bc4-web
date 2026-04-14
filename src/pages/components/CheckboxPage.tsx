import { useState } from 'react';
import { Checkbox } from '../../components/Checkbox';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

/** Self-contained checkbox demo — each instance owns its state */
function CheckboxDemo({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const [checked, setChecked] = useState(false);
  return <Checkbox size={size} checked={checked} onChange={() => setChecked(!checked)} />;
}

export default function CheckboxPage() {
  const [cbChecked2, setCbChecked2] = useState(true);
  const [cbChecked3, setCbChecked3] = useState(true);

  return (
    <>
      <PageHero
        title="Checkbox"
        subtitle="3 sizes (16/20/24px) · 4px radius · hover ghost-check · checked: inverted-surface fill"
        description="A selection control for toggling binary choices or managing multi-select lists, with indeterminate state for partial selections and inline validation."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['unchecked', 'checked', 'indeterminate', 'hover', 'disabled', 'invalid'], Slots: ['label', 'errorMessage'] }} />

      {/* ══ VARIANTS ═════════════════════════════════════════════════════════ */}
      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (16px) · md (20px) · lg (24px) — click to toggle</Spec>
        <div className="flex items-end gap-10">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <CheckboxDemo size={s} />
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Indeterminate</SectionTitle>
      <Card>
        <Spec>Minus icon instead of check — all 3 sizes</Spec>
        <div className="flex items-end gap-10">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Checkbox key={s} size={s} checked indeterminate onChange={() => {}} />
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      {/* ══ STATES ═══════════════════════════════════════════════════════════ */}
      <SectionTitle>States — unchecked</SectionTitle>
      <Card>
        <Spec>Default (border #898f8f) · Hover (ghost check at 50%) · Disabled (border #d9e1e1) · Invalid (2px border danger)</Spec>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Checkbox size="lg" />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Checkbox size="lg" disabled />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Checkbox size="lg" invalid />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Invalid</span>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>States — checked</SectionTitle>
      <Card>
        <Spec>Default (inverted-surface) · Hover (check dims 50%) · Disabled (#c0c8c8) · Invalid (#d23031)</Spec>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Checkbox size="lg" checked onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Checkbox size="lg" checked disabled onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Checkbox size="lg" checked invalid onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Invalid</span>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>With label</SectionTitle>
      <Card>
        <Spec>8px gap · Inter SemiBold · interactive labels — click to toggle</Spec>
        <div className="flex flex-col gap-4">
          <Checkbox
            size="lg"
            label="Accept terms and conditions"
            checked={cbChecked2}
            onChange={() => setCbChecked2(!cbChecked2)}
          />
          <Checkbox
            size="lg"
            label="Subscribe to newsletter"
            checked={cbChecked3}
            onChange={() => setCbChecked3(!cbChecked3)}
          />
          <Checkbox size="lg" label="Disabled option" disabled />
          <Checkbox
            size="lg"
            label="Invalid checkbox"
            checked={false}
            invalid
            errorMessage="This field is required"
            onChange={() => {}}
          />
        </div>
      </Card>
    </>
  );
}
