import { DatePicker } from '../../components/DatePicker';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';

export default function DatePickerPage() {
  return (
    <>
      <PageHero
        title="Date Picker"
        subtitle="Range selection with preset shortcuts · Click start date, click end date"
        description="A calendar-based date range picker with preset sidebar shortcuts, gradient row-edge fading, and single-day selection by clicking the same day twice."
      />

      <SectionTitle>Default</SectionTitle>
      <Card>
        <Spec>Range picker with preset sidebar · 40px day cells · rounded-m · secondary-1 range highlight · gradient fading at row edges</Spec>
        <div className="flex justify-center py-4">
          <DatePicker onChange={(range) => console.log('Range:', range)} />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>With preset selected</SectionTitle>
      <Card>
        <Spec>Last 30 days preset active · Sidebar highlights active preset with inverted-surface color</Spec>
        <div className="flex justify-center py-4">
          <DatePicker
            value={{
              start: (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d; })(),
              end: new Date(),
            }}
          />
        </div>
      </Card>
    </>
  );
}
