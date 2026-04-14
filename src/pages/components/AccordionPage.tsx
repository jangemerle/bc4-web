import { useState } from 'react';
import { Settings, Lock, Mail, Database } from 'lucide-react';
import { Accordion, AccordionItem } from '../../components/Accordion';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { ExampleBlock } from '../../layouts/ExampleBlock';
import { ShowcaseBlock } from '../../layouts/ShowcaseBlock';
import { TokenTable } from '../../layouts/TokenTable';

export default function AccordionPage() {
  const [singleValue, setSingleValue] = useState('faq-1');

  return (
    <>
      <PageHero
        title="Accordion"
        subtitle="Progressive disclosure"
        description="Collapsible sections that reveal content on demand. Perfect for FAQs, settings panels, feature lists, and any hierarchical information that benefits from progressive disclosure."
      />

      {/* ─── Hero Showcase ──────────────────────────────────────────────────── */}

      <ShowcaseBlock bg="surface" minHeight={320}>
        <div className="w-full max-w-lg">
          <Accordion type="single" defaultValue="hero-1">
            <AccordionItem value="hero-1" title="What can I use Kvalt for?">
              <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                Kvalt is a complete design system with React components, tokens, patterns, and documentation. Build scalable interfaces with a consistent visual language.
              </p>
            </AccordionItem>
            <AccordionItem value="hero-2" title="How do I get started?">
              <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                Import any component from the library, apply CSS tokens for colors and spacing, and use the motion tokens for animations. All components work with motion automatically.
              </p>
            </AccordionItem>
            <AccordionItem value="hero-3" title="Is Kvalt customizable?">
              <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                Yes. Every color, size, and animation timing is backed by CSS variables and Tailwind tokens. Create custom themes by adjusting the root variables.
              </p>
            </AccordionItem>
          </Accordion>
        </div>
      </ShowcaseBlock>

      {/* ─── Variants Section ──────────────────────────────────────────────── */}

      <Section title="Variants" level="major">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ExampleBlock label="Default" bg="surface">
            <div className="w-full">
              <Accordion type="single" defaultValue="var-1">
                <AccordionItem value="var-1" title="Default variant">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Bordered accordion with rounded corners. Best for standalone or embedded sections.
                  </p>
                </AccordionItem>
                <AccordionItem value="var-2" title="Clear visual hierarchy">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Each item is separated by a divider line. Hover states highlight the interactive area.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </ExampleBlock>

          <ExampleBlock label="Flush" bg="surface">
            <div className="w-full">
              <Accordion type="single" variant="flush" defaultValue="var-3">
                <AccordionItem value="var-3" title="Flush variant">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    No borders or background. Minimal, inline with page content. Better for embedded panels.
                  </p>
                </AccordionItem>
                <AccordionItem value="var-4" title="Compact spacing">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Reduced padding keeps the accordion lightweight. Dividers separate items subtly.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </ExampleBlock>
        </div>
      </Section>

      {/* ─── Modes Section ────────────────────────────────────────────────── */}

      <Section title="Modes" level="major">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ExampleBlock label="Single mode (exclusive)" bg="surface">
            <div className="w-full">
              <Accordion type="single" defaultValue="mode-1">
                <AccordionItem value="mode-1" title="What is the API?">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    The Accordion component provides a `type` prop: `single` for exclusive expansion (one item open at a time), or `multiple` for simultaneous expansion.
                  </p>
                </AccordionItem>
                <AccordionItem value="mode-2" title="Can multiple items be open?">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    In single mode, only one item can be open. Opening a new item closes any previously open item. Use `multiple` mode for independent sections.
                  </p>
                </AccordionItem>
                <AccordionItem value="mode-3" title="How do I control it programmatically?">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Pass `value` and `onValueChange` props to make the accordion controlled. In single mode, `value` is a string; in multiple mode, it's a string array.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </ExampleBlock>

          <ExampleBlock label="Multiple mode (independent)" bg="surface">
            <div className="w-full">
              <Accordion type="multiple" defaultValue={['mode-4', 'mode-5']}>
                <AccordionItem value="mode-4" title="Can I open many items?">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Yes. In multiple mode, any number of items can be open simultaneously. Perfect for toggleable feature lists or settings panels.
                  </p>
                </AccordionItem>
                <AccordionItem value="mode-5" title="How do I set initial state?">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Use `defaultValue` for uncontrolled mode. Pass an array of item `value`s to open multiple sections on mount: `defaultValue={['item1', 'item2']}`.
                  </p>
                </AccordionItem>
                <AccordionItem value="mode-6" title="What about animations?">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Content expands/collapses using the `expand` transition from motion tokens. Chevron rotates smoothly. Respects `prefers-reduced-motion`.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </ExampleBlock>
        </div>
      </Section>

      {/* ─── States Section ────────────────────────────────────────────────── */}

      <Section title="States" level="major">
        <div className="space-y-10">
          <ExampleBlock label="With icons" bg="surface">
            <div className="w-full max-w-lg">
              <Accordion type="single" defaultValue="state-1">
                <AccordionItem value="state-1" icon={Settings} title="Account settings">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Manage your account preferences, password, and login credentials.
                  </p>
                </AccordionItem>
                <AccordionItem value="state-2" icon={Mail} title="Email preferences">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Choose which notifications you want to receive and how often.
                  </p>
                </AccordionItem>
                <AccordionItem value="state-3" icon={Lock} title="Privacy & security">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Control data sharing, API access, and connected applications.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </ExampleBlock>

          <ExampleBlock label="Disabled items" bg="surface">
            <div className="w-full max-w-lg">
              <Accordion type="single" defaultValue="state-4">
                <AccordionItem value="state-4" title="Basic plan features">
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Up to 5 projects, 1 GB storage, community support.
                  </p>
                </AccordionItem>
                <AccordionItem value="state-5" title="Pro features" disabled>
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Upgrade to Pro to unlock unlimited projects, 100 GB storage, and priority support.
                  </p>
                </AccordionItem>
                <AccordionItem value="state-6" title="Enterprise features" disabled>
                  <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                    Contact sales for custom solutions, SSO, and dedicated support.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </ExampleBlock>

          <ExampleBlock label="Mixed content" bg="surface">
            <div className="w-full max-w-lg">
              <Accordion type="multiple" defaultValue={['state-7']}>
                <AccordionItem value="state-7" icon={Database} title="Data stored securely">
                  <div className="flex flex-col gap-3">
                    <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                      All data is encrypted in transit and at rest using AES-256.
                    </p>
                    <ul className="font-sans text-base list-disc list-inside space-y-1" style={{ color: 'var(--color-on-surface)' }}>
                      <li>Automated daily backups</li>
                      <li>Geographic redundancy across 3 regions</li>
                      <li>GDPR and SOC 2 Type II compliant</li>
                    </ul>
                  </div>
                </AccordionItem>
                <AccordionItem value="state-8" title="API rate limits">
                  <div className="flex flex-col gap-3">
                    <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                      Rate limits scale with your plan:
                    </p>
                    <div className="font-sans text-sm space-y-2" style={{ color: 'var(--color-on-surface)' }}>
                      <div className="flex justify-between">
                        <span>Basic:</span>
                        <span>100 requests/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pro:</span>
                        <span>1,000 requests/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Enterprise:</span>
                        <span>Custom limits</span>
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </ExampleBlock>
        </div>
      </Section>

      {/* ─── Interactive Playground ────────────────────────────────────────── */}

      <Section title="Interactive playground" level="major">
        <ExampleBlock label="Controlled accordion with state toggle" bg="surface">
          <div className="flex flex-col gap-8 w-full max-w-lg">
            <Accordion type="single" value={singleValue} onValueChange={(val) => setSingleValue(typeof val === 'string' ? val : '')}>
              <AccordionItem value="int-1" title="What is state management?">
                <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                  In a controlled accordion, the parent component owns the open/closed state. This lets you respond to changes, log events, or sync with external systems.
                </p>
              </AccordionItem>
              <AccordionItem value="int-2" title="Why use controlled mode?">
                <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                  Controlled mode is useful for analytics (track which sections users open), conditional rendering (hide/show other UI based on accordion state), or integrating with forms.
                </p>
              </AccordionItem>
              <AccordionItem value="int-3" title="What about uncontrolled?">
                <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                  Uncontrolled mode uses `defaultValue` and `onValueChange` callback. The component manages its own state. Simpler for standalone use, no state boilerplate needed.
                </p>
              </AccordionItem>
            </Accordion>
            <div className="font-sans text-sm p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-on-surface-subtle-1)' }}>
              <p>Currently open: <span className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>{singleValue || '(none)'}</span></p>
            </div>
          </div>
        </ExampleBlock>
      </Section>

      {/* ─── API Section ─────────────────────────────────────────────────── */}

      <Section title="API" level="major">
        <div className="space-y-10">
          <div>
            <h3 className="font-display text-lg font-semibold mb-5" style={{ color: 'var(--color-on-surface)' }}>
              Accordion
            </h3>
            <TokenTable
              headers={['Prop', 'Type', 'Default', 'Description']}
              rows={[
                {
                  cells: [
                    <code className="font-mono text-sm">type</code>,
                    <code className="font-mono text-sm">'single' | 'multiple'</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Determines if one or multiple items can be open'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">variant</code>,
                    <code className="font-mono text-sm">'default' | 'flush'</code>,
                    <code className="font-mono text-sm">'default'</code>,
                    'Visual style: bordered or inline'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">defaultValue</code>,
                    <code className="font-mono text-sm">string | string[]</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Initial open item(s) in uncontrolled mode'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">value</code>,
                    <code className="font-mono text-sm">string | string[]</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Controlled open item(s). Omit for uncontrolled'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">onValueChange</code>,
                    <code className="font-mono text-sm">{'(value: string | string[]) => void'}</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Callback when an item opens or closes'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">className</code>,
                    <code className="font-mono text-sm">string</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Additional CSS classes for the container'
                  ]
                }
              ]}
            />
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-5" style={{ color: 'var(--color-on-surface)' }}>
              AccordionItem
            </h3>
            <TokenTable
              headers={['Prop', 'Type', 'Default', 'Description']}
              rows={[
                {
                  cells: [
                    <code className="font-mono text-sm">value</code>,
                    <code className="font-mono text-sm">string</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Unique identifier for this item'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">title</code>,
                    <code className="font-mono text-sm">string | ReactNode</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Trigger button text. Can be JSX'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">icon</code>,
                    <code className="font-mono text-sm">LucideIcon</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Optional icon to display left of title'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">disabled</code>,
                    <code className="font-mono text-sm">boolean</code>,
                    <code className="font-mono text-sm">false</code>,
                    'Disables opening this item'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">children</code>,
                    <code className="font-mono text-sm">ReactNode</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Content revealed when item is open'
                  ]
                },
                {
                  cells: [
                    <code className="font-mono text-sm">className</code>,
                    <code className="font-mono text-sm">string</code>,
                    <code className="font-mono text-sm">—</code>,
                    'Additional CSS classes for the item wrapper'
                  ]
                }
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ─── Accessibility Section ──────────────────────────────────────── */}

      <Section title="Accessibility" level="minor">
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-base font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
              Keyboard navigation
            </h3>
            <ul className="font-sans text-base space-y-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              <li><span className="font-semibold">Enter / Space</span> — Toggle the focused item open or closed</li>
              <li><span className="font-semibold">Arrow Down</span> — Move focus to the next item</li>
              <li><span className="font-semibold">Arrow Up</span> — Move focus to the previous item</li>
              <li><span className="font-semibold">Home</span> — Move focus to the first item</li>
              <li><span className="font-semibold">End</span> — Move focus to the last item</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
              ARIA attributes
            </h3>
            <ul className="font-sans text-base space-y-2" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              <li><span className="font-semibold">aria-expanded</span> — Trigger buttons expose their open/closed state to screen readers</li>
              <li><span className="font-semibold">aria-controls</span> — Trigger buttons reference their content area</li>
              <li><span className="font-semibold">role="region"</span> — Content areas are marked as regions for screen reader users</li>
              <li><span className="font-semibold">aria-labelledby</span> — Content regions reference their trigger button</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
              Motion & preferences
            </h3>
            <p className="font-sans text-base" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              All animations respect <span className="font-semibold">prefers-reduced-motion</span>. Users with reduced motion enabled will see content appear/disappear instantly without expand/collapse animations.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
              Color contrast
            </h3>
            <p className="font-sans text-base" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Trigger buttons use semantic color variables that meet WCAG AA contrast requirements in both light and dark modes. Icons and text are always readable.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
