import { TextArea } from '../../components/TextArea';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function TextAreaPage() {
  return (
    <>
      <PageHero
        title="Text Area"
        subtitle="Multiline input · label + caption · radius-m (8px) · resizable"
        description="Multi-line text input sharing the same anatomy as Input (label, caption, border states) but with vertical resizing and size-dependent typography. Ideal for descriptions, comments, and longer-form content."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['default', 'hover', 'focus', 'filled', 'disabled', 'readonly', 'invalid'], Slots: ['label', 'caption'] }} />

      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (12px text) · md (16px text) · lg (16px text, 8px gap)</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <TextArea label="Small" placeholder="Placeholder" size="sm" caption="Caption" className="w-[220px] h-[160px]" />
          <TextArea label="Medium" placeholder="Placeholder" size="md" caption="Caption" className="w-[220px] h-[160px]" />
          <TextArea label="Large" placeholder="Placeholder" size="lg" caption="Caption" className="w-[220px] h-[160px]" />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>States</SectionTitle>
      <Card>
        <Spec>Default · Invalid · Disabled · Read-only</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <TextArea label="Default" placeholder="Placeholder" caption="Caption" className="w-[220px] h-[160px]" />
          <TextArea label="Invalid" placeholder="Placeholder" invalid errorMessage="Nope nope nope" className="w-[220px] h-[160px]" />
          <TextArea label="Disabled" defaultValue="Filled text" disabled caption="Caption" className="w-[220px] h-[160px]" />
          <TextArea label="Read-only" defaultValue="Filled text" readOnly caption="Caption" className="w-[220px] h-[160px]" />
        </div>
      </Card>
    </>
  );
}
