import { Search, EyeOff, Calendar, X, Copy } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function InputPage() {
  return (
    <>
      <PageHero
        title="Input"
        subtitle="Four parts. Each with exactly one job."
        description="Label says what it is. Placeholder shows the format. Caption adds context. Error says what went wrong and what to do next. They're not interchangeable. Using placeholder as a label is the single most common input mistake in existence."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['default', 'hover', 'focus', 'filled', 'disabled', 'readonly', 'invalid'], Slots: ['label', 'caption', 'icon-left', 'icon-right', 'button-right'] }} />

      {/* ══ SIZES ════════════════════════════════════════════════════════════ */}
      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (32px) · md (40px) · lg (48px)</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <Input label="Small" placeholder="Placeholder" size="sm" caption="Caption" className="w-[220px]" />
          <Input label="Medium" placeholder="Placeholder" size="md" caption="Caption" className="w-[220px]" />
          <Input label="Large" placeholder="Placeholder" size="lg" caption="Caption" className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      {/* ══ STATES ═══════════════════════════════════════════════════════════ */}
      <SectionTitle>States</SectionTitle>
      <Card>
        <Spec>Default · Focus (green 2px) · Invalid (red 2px + error) · Disabled · Read-only</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <Input label="Default" placeholder="Placeholder" caption="Helper text" className="w-[220px]" />
          <Input label="Invalid" placeholder="Placeholder" invalid errorMessage="Nope nope nope" className="w-[220px]" />
          <Input label="Disabled" placeholder="Placeholder" disabled caption="Can't edit" className="w-[220px]" />
          <Input label="Read-only" defaultValue="Read-only value" readOnly caption="Not editable" className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Border states</SectionTitle>
      <Card>
        <Spec>Empty → 1px surface-5 · Filled → 1px surface-7 · Hover → 1px surface-6 · Focus → 2px primary-1 · Invalid → 2px danger-1</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <Input label="Empty" placeholder="Click or type" caption="Interact to see states" className="w-[220px]" />
          <Input label="Pre-filled" defaultValue="Filled text" caption="Darker border when filled" className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      {/* ══ ICONS ════════════════════════════════════════════════════════════ */}
      <SectionTitle>Right icon</SectionTitle>
      <Card>
        <Spec>Right-side icon slot · optional onIconClick</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <Input label="Password" placeholder="Enter password" icon={EyeOff} onIconClick={() => {}} caption="Click icon to toggle" className="w-[220px]" />
          <Input label="Calendar" placeholder="Pick a date" icon={Calendar} className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Left icon</SectionTitle>
      <Card>
        <Spec>Left-side icon slot · all sizes</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <Input label="Search" placeholder="Search..." iconLeft={Search} size="sm" className="w-[220px]" />
          <Input label="Search" placeholder="Search..." iconLeft={Search} size="md" className="w-[220px]" />
          <Input label="Search" placeholder="Search..." iconLeft={Search} size="lg" className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>With button</SectionTitle>
      <Card>
        <Spec>buttonRight slot · e.g. clear button using Button xs variant</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <Input label="With clear" placeholder="Type something..." iconLeft={Search} defaultValue="Query text" buttonRight={<Button size="xs" variant="link" iconOnly={X} aria-label="Clear" />} className="w-[260px]" />
          <Input label="With action" placeholder="Enter URL..." buttonRight={<Button size="xs" variant="secondary" iconOnly={Copy} aria-label="Copy" />} className="w-[260px]" />
        </div>
      </Card>

      <Section title="Writing rules" level="minor">
        <div className="flex flex-col gap-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Label: what the field is.</strong> "Email address", "Company name". Noun, not instruction. Not "Enter your email address".</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Placeholder: format hint only.</strong> Shows expected format. Never mirrors the label — it disappears on focus.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Caption: permanent context.</strong> Stays visible. One sentence. If it's critical, don't put it in a placeholder.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Error: what went wrong + what to do.</strong> "That email is taken. Sign in or use a different address." Never just "Invalid".</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Required fields:</strong> Use asterisk (*) in the label. No "(required)" in the caption.</p>
        </div>
      </Section>
    </>
  );
}
