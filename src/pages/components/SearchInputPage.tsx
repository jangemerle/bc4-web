import { SearchInput } from '../../components/SearchInput';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function SearchInputPage() {
  return (
    <>
      <PageHero
        title="Search Input"
        subtitle="Search icon left · clear (x) on filled · radius-m (8px)"
        description="Purpose-built search field with a persistent magnifying glass icon and an auto-appearing clear button when the field has content. Wraps Input internals with search-specific defaults."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg'], States: ['empty', 'filled', 'disabled', 'readonly'] }} />

      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>sm (32px) · md (40px) · lg (48px)</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <SearchInput placeholder="Search" size="sm" className="w-[220px]" />
          <SearchInput placeholder="Search" size="md" className="w-[220px]" />
          <SearchInput placeholder="Search" size="lg" className="w-[220px]" />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>States</SectionTitle>
      <Card>
        <Spec>Empty · Filled (with clear button) · Disabled · Read-only</Spec>
        <div className="flex items-start gap-6 flex-wrap">
          <SearchInput placeholder="Search" className="w-[220px]" />
          <SearchInput placeholder="Search" defaultValue="Life purpos" className="w-[220px]" />
          <SearchInput placeholder="Search" disabled className="w-[220px]" />
          <SearchInput placeholder="Search" defaultValue="Life purpos" readOnly className="w-[220px]" />
        </div>
      </Card>
    </>
  );
}
