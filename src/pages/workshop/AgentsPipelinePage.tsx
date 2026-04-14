import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';

export default function AgentsPipelinePage() {
  return (
    <>
      <PageHero
        title="Multi-Agent Pipeline"
        subtitle="Four agents, one system."
        description="A Designer reads Figma, a Builder writes code in isolation, an Auditor checks everything, and a Debugger catches what the others miss. They don't share context — they share artifacts."
      />

      <Section title="The agents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Director',
              model: 'Opus',
              role: 'The orchestrator. Decides what to build, spawns the right agents, reviews artifacts, merges approved work to main. Not a separate agent file — it\'s Claude in the main conversation.',
              output: 'Merged branches, iteration notes',
              when: 'Always. Every pipeline run has a Director deciding the sequence, routing audit failures back to Builders, and making the final merge call.',
            },
            {
              name: 'Designer',
              model: 'Opus',
              role: 'Reads Figma via MCP, understands intent, produces Design Manifests and component specs.',
              output: 'manifests/, specs/',
              when: 'When a Figma design needs to become code. Extracts token-mapped structure, not screenshots.',
            },
            {
              name: 'Builder',
              model: 'Sonnet',
              role: 'TDD implementation from manifests. Works in a git worktree — isolated from main branch until approved.',
              output: 'src/components/, src/pages/, tests/',
              when: 'After Designer produces a manifest. Multiple Builders can run in parallel on different components.',
            },
            {
              name: 'Auditor',
              model: 'Opus',
              role: 'Token compliance, accessibility, visual regression. Reviews Builder output against the manifest and Kvalt standards.',
              output: 'audits/',
              when: 'After Builder finishes. Catches hardcoded values, missing ARIA, motion violations, contrast failures.',
            },
            {
              name: 'Debugger',
              model: 'Sonnet',
              role: 'Runtime debugging via Playwright. Opens a real browser, reproduces issues, captures console errors and screenshots.',
              output: 'debug-reports/',
              when: 'When something doesn\'t work — blank screens, broken interactions, visual glitches. Finds root causes, not guesses.',
            },
          ].map((agent) => (
            <div
              key={agent.name}
              className="rounded-lg border px-6 py-5"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <p className="font-sans text-base font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                  {agent.name}
                </p>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-surface-3)',
                    color: 'var(--color-on-surface-subtle-1)',
                  }}
                >
                  {agent.model}
                </span>
              </div>
              <p className="font-sans text-sm mb-3 leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                {agent.role}
              </p>
              <p className="font-mono text-xs mb-2" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                Output: {agent.output}
              </p>
              <p className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                {agent.when}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The flow" description="Artifacts, not conversations.">
        <div
          className="rounded-lg border px-8 py-6 font-mono text-sm leading-loose"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-on-surface)',
          }}
        >
          Designer reads Figma &nbsp;→ writes manifest.json<br />
          Builder reads manifest → writes code + tests (in worktree)<br />
          Auditor reads code &nbsp;&nbsp;&nbsp;→ writes audit report<br />
          <br />
          <span style={{ color: 'var(--color-success-1)' }}>Pass</span> → Director merges worktree to main<br />
          <span style={{ color: 'var(--color-danger-1)' }}>Fail</span> → Builder gets iteration notes, tries again<br />
          <br />
          <span style={{ color: 'var(--color-on-surface-subtle-2)' }}>Debugger is on-call — spawned when runtime issues appear.</span>
        </div>
      </Section>

      <Section title="Why agents, not one model?" level="minor">
        <div className="space-y-4">
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Separation of concerns. The Designer never writes code — it can focus entirely on understanding
            the design intent. The Builder never reads Figma — it works from a clean spec. The Auditor
            has no sunk cost in the implementation — it can be ruthlessly honest.
          </p>
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            Model matching matters too. Opus is better at reading complex Figma trees and making
            judgement calls about design intent. Sonnet is faster and excellent at TDD loops where
            speed matters more than deep reasoning. Each agent uses the model that fits its job.
          </p>
          <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            And isolation prevents contamination. A Builder working in a git worktree can't break
            main. An Auditor reviewing from a clean perspective catches things the Builder normalised.
            The pipeline's strength is that each agent has exactly one job and the right constraints
            to do it well.
          </p>
        </div>
      </Section>
    </>
  );
}
