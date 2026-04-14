import { Select } from '../../components/Select';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function SelectPage() {
  return (
    <>
      <PageHero
        title="Select"
        subtitle="Dropdown select · chevron right · label + caption · radius-m (8px)"
        description="Native-style dropdown selector sharing Input anatomy with a chevron indicator. Supports placeholder, pre-selected values, validation states, and the full disabled/read-only matrix."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['default', 'hover', 'focus', 'selected', 'disabled', 'readonly', 'invalid'], Slots: ['label', 'caption', 'options'] }} />

      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (32px) · md (40px) · lg (48px)</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <Select label="Small" placeholder="Placeholder" size="sm" caption="Caption" options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'Option C' }]} className="w-[220px]" />
          <Select label="Medium" placeholder="Placeholder" size="md" caption="Caption" options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'Option C' }]} className="w-[220px]" />
          <Select label="Large" placeholder="Placeholder" size="lg" caption="Caption" options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'Option C' }]} className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>States</SectionTitle>
      <Card>
        <Spec>Default · Selected · Invalid · Disabled · Read-only</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <Select label="Default" placeholder="Placeholder" caption="Caption" options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]} className="w-[220px]" />
          <Select label="Selected" defaultValue="a" caption="Caption" options={[{ value: 'a', label: 'Filled text' }, { value: 'b', label: 'Option B' }]} className="w-[220px]" />
          <Select label="Invalid" placeholder="Placeholder" invalid errorMessage="Nope nope nope" options={[{ value: 'a', label: 'Option A' }]} className="w-[220px]" />
          <Select label="Disabled" placeholder="Placeholder" disabled caption="Caption" options={[{ value: 'a', label: 'Option A' }]} className="w-[220px]" />
          <Select label="Read-only" defaultValue="a" readOnly caption="Caption" options={[{ value: 'a', label: 'Filled text' }]} className="w-[220px]" />
        </div>
      </Card>
    </>
  );
}
