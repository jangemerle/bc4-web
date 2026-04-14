import { NumberInput } from '../../components/NumberInput';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function NumberInputPage() {
  return (
    <>
      <PageHero
        title="Number Input"
        subtitle="Minus/plus stepper buttons · label + caption · radius-m (8px)"
        description="Numeric input with integrated stepper controls. Supports min/max bounds, configurable step increments, and automatic button disabling at range limits. Same anatomy as Input with added increment/decrement affordance."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['default', 'hover', 'focus', 'filled', 'disabled', 'readonly', 'invalid'], Props: ['min', 'max', 'step'] }} />

      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (32px) · md (40px) · lg (48px)</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <NumberInput label="Small" size="sm" caption="Caption" className="w-[220px]" />
          <NumberInput label="Medium" size="md" caption="Caption" className="w-[220px]" />
          <NumberInput label="Large" size="lg" caption="Caption" className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>States</SectionTitle>
      <Card>
        <Spec>Default · Filled · Invalid · Disabled · Read-only</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <NumberInput label="Default" caption="Caption" className="w-[220px]" />
          <NumberInput label="Filled" defaultValue={42} caption="Caption" className="w-[220px]" />
          <NumberInput label="Invalid" defaultValue={42} invalid errorMessage="Nope nope nope" className="w-[220px]" />
          <NumberInput label="Disabled" defaultValue={42} disabled caption="Caption" className="w-[220px]" />
          <NumberInput label="Read-only" defaultValue={42} readOnly caption="Caption" className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>With min/max</SectionTitle>
      <Card>
        <Spec>min={'{0}'} max={'{10}'} step={'{1}'} — minus disabled at min, plus disabled at max</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <NumberInput label="Bounded" min={0} max={10} step={1} caption="0-10 range" className="w-[220px]" />
          <NumberInput label="Step 5" min={0} max={100} step={5} defaultValue={25} caption="Step by 5" className="w-[220px]" />
        </div>
      </Card>
    </>
  );
}
