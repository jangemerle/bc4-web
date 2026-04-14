import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { DosDonts } from '../../layouts/DosDonts';

export default function FigmaToCodePage() {
  return (
    <>
      <PageHero
        title="Figma to Code"
        subtitle="Zero hardcoded values."
        description="Every Figma design passes through a token mapping pipeline before a line of code is written. Colours become CSS variables. Spacing becomes Tailwind classes. Nothing is eyeballed."
      />

      <Section title="The pipeline" description="Three passes, every time, no exceptions.">
        <div className="space-y-4">
          {[
            {
              step: '1. Token mapping',
              desc: 'Every value in the Figma design gets mapped to a Kvalt token. Hex colours → CSS variables. Pixel spacing → Tailwind scale (4px base). Radius → token classes. Shadows → token classes. Font sizes → typography scale. If a value doesn\'t have a token equivalent, that\'s a design issue to resolve — not a reason to hardcode.',
            },
            {
              step: '2. Component audit',
              desc: 'Every UI element in the design gets checked against the component index. Is that a Button? Use <Button>. An input field? Use <Input>. A dropdown? Use <DropdownMenu> + <Select>. Never rebuild something that already exists. If a design introduces a pattern that doesn\'t map to an existing component, that\'s a signal to build a new one — through the Component Forge pipeline.',
            },
            {
              step: '3. Post-build audit',
              desc: 'After the code is written, the check-tokens skill audits every file for violations. Hardcoded hex values, arbitrary pixel spacing, wrong semantic tokens, off-grid values, radius violations. Fix everything before the work is considered done.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-lg border px-6 py-5"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="font-sans text-sm font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                {item.step}
              </p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Token mapping examples" level="minor">
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
          }}
        >
          <table className="w-full font-sans text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th className="text-left px-6 py-3 font-semibold" style={{ color: 'var(--color-on-surface)' }}>Figma value</th>
                <th className="text-left px-6 py-3 font-semibold" style={{ color: 'var(--color-on-surface)' }}>Kvalt token</th>
                <th className="text-left px-6 py-3 font-semibold" style={{ color: 'var(--color-on-surface)' }}>In code</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              {[
                ['#FFFFFF', 'surface-1', 'bg-[var(--color-surface-1)]'],
                ['#14263E', 'on-surface', 'text-[var(--color-on-surface)]'],
                ['#7DDB85', 'primary-1', 'bg-[var(--color-primary-1)]'],
                ['16px', 'spacing-4', 'p-4 / gap-4'],
                ['8px radius', 'radius-m', 'rounded-lg'],
                ['24px', 'spacing-6', 'p-6 / gap-6'],
                ['Inter 14px', 'body/base', 'font-sans text-sm'],
                ['Borna 28px', 'headline/l', 'font-display text-headline-l'],
              ].map(([figma, token, code]) => (
                <tr key={figma} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-6 py-3 font-mono text-xs">{figma}</td>
                  <td className="px-6 py-3 font-mono text-xs">{token}</td>
                  <td className="px-6 py-3 font-mono text-xs">{code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="The rule" level="minor">
        <DosDonts
          do={{
            visual: (
              <code className="font-mono text-sm" style={{ color: 'var(--color-on-surface)' }}>
                bg-[var(--color-surface-1)] p-6 rounded-lg
              </code>
            ),
            caption: 'Every value maps to a token. Dark mode, characters, and future themes work automatically.',
          }}
          dont={{
            visual: (
              <code className="font-mono text-sm" style={{ color: 'var(--color-on-surface)' }}>
                bg-white p-[24px] rounded-[8px]
              </code>
            ),
            caption: 'Hardcoded values break theming, ignore the design system, and create maintenance debt.',
          }}
        />
      </Section>
    </>
  );
}
