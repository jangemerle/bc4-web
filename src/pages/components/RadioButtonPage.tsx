import { useState } from 'react';
import { RadioButton, RadioGroup } from '../../components/RadioButton';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function RadioButtonPage() {
  const [radioValCol, setRadioValCol] = useState('option-b');
  const [radioValRow, setRadioValRow] = useState('option-b');

  return (
    <>
      <PageHero
        title="Radio Button"
        subtitle="3 sizes (16/20/24px) · fully round · hover ghost-dot · checked: inverted-surface fill + white dot"
        description="Single-selection control for mutually exclusive options, with RadioGroup context for managed groups, row/column layouts, and inline validation."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['unselected', 'selected', 'hover', 'active', 'disabled', 'invalid'], Slots: ['label', 'errorMessage'], Layout: ['row', 'column'] }} />

      {/* ══ VARIANTS ═════════════════════════════════════════════════════════ */}
      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (16px) · md (20px) · lg (24px) — checked state</Spec>
        <div className="flex items-end gap-10">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <RadioButton size={s} checked onChange={() => {}} />
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Radio Group</SectionTitle>
      <Card>
        <Spec>RadioGroup provides name, value, onChange context — click to change selection</Spec>
        <div className="flex gap-16">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm font-bold mb-1" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Column (default)</span>
            <RadioGroup name="demo-col" value={radioValCol} onChange={setRadioValCol} size="lg">
              <RadioButton value="option-a" label="Option A" />
              <RadioButton value="option-b" label="Option B" />
              <RadioButton value="option-c" label="Option C" />
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm font-bold mb-1" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Row</span>
            <RadioGroup name="demo-row" value={radioValRow} onChange={setRadioValRow} size="lg" direction="row">
              <RadioButton value="option-a" label="Option A" />
              <RadioButton value="option-b" label="Option B" />
              <RadioButton value="option-c" label="Option C" />
            </RadioGroup>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      {/* ══ STATES ═══════════════════════════════════════════════════════════ */}
      <SectionTitle>States — unchecked</SectionTitle>
      <Card>
        <Spec>Default (#898f8f border) · Hover (ghost dot) · Disabled (#d9e1e1) · Invalid (2px #d23031)</Spec>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <RadioButton size="lg" />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RadioButton size="lg" disabled />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RadioButton size="lg" invalid />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Invalid</span>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>States — checked</SectionTitle>
      <Card>
        <Spec>Default (inverted-surface) · Hover/Active (#4571ab) · Disabled (#c0c8c8) · Invalid (#d23031)</Spec>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <RadioButton size="lg" checked onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RadioButton size="lg" checked disabled onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RadioButton size="lg" checked invalid onChange={() => {}} />
            <span className="font-sans text-xs font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>Invalid</span>
          </div>
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>With label + validation</SectionTitle>
      <Card>
        <Spec>8px gap · Inter SemiBold · disabled + invalid states with error message</Spec>
        <div className="flex flex-col gap-4">
          <RadioButton size="lg" label="Enabled option" checked onChange={() => {}} />
          <RadioButton size="lg" label="Disabled option" disabled />
          <RadioButton size="lg" label="Invalid selection" invalid errorMessage="Please select a valid option" />
        </div>
      </Card>
    </>
  );
}
