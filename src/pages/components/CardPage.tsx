import { BarChart3, Users, Zap, ExternalLink, MoreHorizontal, Star, MessageSquare, Image } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { SectionTitle, Spec } from '../../layouts/DocHelpers';
import { Card as DocCard } from '../../layouts/DocHelpers';
import { Card } from '../../components/Card';
import { GlassSurface } from '../../components/GlassSurface';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Chip } from '../../components/Chip';
import { Input } from '../../components/Input';

export default function CardPage() {
  return (
    <section className="mb-24">
      <PageHero
        title="Card"
        subtitle={"Composable surfaces.\nStructured header, free body."}
        description="Cards group related content into a single surface. Four visual variants, three density levels, optional clickability. All spacing scales with the spaciness system."
      />

      {/* ── Surface variants ────────────────────────────────────────── */}
      <SectionTitle>Surface variants</SectionTitle>
      <DocCard>
        <Spec>Four visual treatments. Pick based on context, not preference.</Spec>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Elevated */}
          <Card variant="elevated">
            <Card.Header
              icon={BarChart3}
              title="Elevated"
              description="Shadow + surface-1 background. The default. Use for primary content cards that need to stand out from the page."
            />
            <Card.Body>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-headline-l" style={{ color: 'var(--color-on-surface)' }}>$1.2M</span>
                <Badge variant="accent">+12%</Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Outlined */}
          <Card variant="outlined">
            <Card.Header
              icon={Users}
              title="Outlined"
              description="Border + transparent background. Use for secondary content or when cards sit on a colored surface."
            />
            <Card.Body>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-headline-l" style={{ color: 'var(--color-on-surface)' }}>3,847</span>
                <Badge>active</Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Filled */}
          <Card variant="filled">
            <Card.Header
              icon={Zap}
              title="Filled"
              description="Surface-2 background, no border or shadow. Use for low-emphasis grouping or nested cards."
            />
            <Card.Body>
              <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                Quiet container for supporting content.
              </p>
            </Card.Body>
          </Card>

          {/* AI */}
          <Card variant="ai">
            <Card.Header
              title="AI variant"
              description="Gradient border + subtle tint + AI chip. For AI-powered features."
            />
            <Card.Body>
              <div className="flex flex-col gap-2">
                {['Revenue up 12%', 'Churn dropped 4 pts', '3 at-risk accounts'].map((item) => (
                  <div key={item} className="flex items-center gap-2 font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--gradient-ai-vivid)' }} />
                    {item}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </DocCard>

      {/* ── Density ─────────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Density</SectionTitle>
      <DocCard>
        <Spec>Three density levels control internal spacing. All scale with --spaciness.</Spec>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card variant="outlined" density="default">
            <Card.Header title="Default" description="space-lg padding. Standard content cards." />
            <Card.Footer>
              <Button variant="secondary" size="sm">Action</Button>
            </Card.Footer>
          </Card>

          <Card variant="outlined" density="compact">
            <Card.Header title="Compact" description="space-md padding. Data-dense dashboards." />
            <Card.Footer>
              <Button variant="secondary" size="sm">Action</Button>
            </Card.Footer>
          </Card>

          <Card variant="outlined" density="flush">
            <Card.Header title="Flush" description="No padding, no radius. Embedded in other surfaces." />
            <Card.Footer>
              <Button variant="secondary" size="sm">Action</Button>
            </Card.Footer>
          </Card>
        </div>
      </DocCard>

      {/* ── Clickable ───────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Clickable cards</SectionTitle>
      <DocCard>
        <Spec>Use <code className="font-mono">as="a"</code> or <code className="font-mono">as="button"</code> for interactive cards. Hover lifts, press scales, focus ring shows on keyboard nav.</Spec>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card as="button" variant="elevated" onClick={() => {}}>
            <Card.Header
              icon={BarChart3}
              title="Button card"
              description="Whole card is clickable. Press to see scale animation."
            />
          </Card>

          <Card as="a" variant="outlined" href="#" onClick={(e) => e.preventDefault()}>
            <Card.Header
              icon={ExternalLink}
              title="Link card"
              description="Renders as an anchor. Hover to see lift."
            />
          </Card>

          <Card variant="elevated">
            <Card.Header
              icon={Users}
              title="Static card"
              description="Default div. Not clickable. Actions live in footer or header."
              actions={<Button variant="secondary" size="sm" iconOnly={MoreHorizontal} />}
            />
          </Card>
        </div>
      </DocCard>

      {/* ── Media slot ──────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Media slot</SectionTitle>
      <DocCard>
        <Spec>Card.Media bleeds to the card edges. Place it first for top media, or anywhere in the composition.</Spec>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card variant="elevated">
            <Card.Media>
              <div
                className="w-full flex items-center justify-center font-sans text-sm font-medium"
                style={{
                  height: 160,
                  background: 'var(--gradient-ai-subtle)',
                  color: 'var(--color-on-surface-subtle-1)',
                }}
              >
                Image / illustration zone
              </div>
            </Card.Media>
            <Card.Header
              title="With media"
              description="Photo, illustration, chart, or colored zone above the content."
            />
            <Card.Footer>
              <Button variant="secondary" size="sm">Read more</Button>
            </Card.Footer>
          </Card>

          <Card variant="outlined">
            <Card.Media>
              <div
                className="w-full flex items-center justify-center font-sans text-sm font-medium"
                style={{
                  height: 160,
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-on-surface-subtle-1)',
                }}
              >
                Outlined + media
              </div>
            </Card.Media>
            <Card.Header
              title="Outlined variant"
              description="Media respects the card's border radius at the top."
            />
          </Card>
        </div>
      </DocCard>

      {/* ── AI variant deep dive ────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>AI variant</SectionTitle>
      <DocCard>
        <Spec>AI chip appears automatically. Override with <code className="font-mono">chip</code> prop on Header, or pass <code className="font-mono">chip={'{null}'}</code> to hide it.</Spec>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card variant="ai">
            <Card.Header title="Default chip" description="AI chip auto-added." />
          </Card>

          <Card variant="ai">
            <Card.Header
              title="Custom chip"
              description="Your own chip label."
              chip={
                <Chip size="sm" clickable={false}>Copilot</Chip>
              }
            />
          </Card>

          <Card variant="ai">
            <Card.Header
              title="No chip"
              description="Gradient treatment only."
              chip={null}
            />
          </Card>
        </div>
      </DocCard>

      {/* ── Composition example ─────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Full composition</SectionTitle>
      <DocCard>
        <Spec>Header + Body + Footer with all features. Icon, title, description, actions, free body content, footer buttons.</Spec>
        <div className="max-w-md">
          <Card variant="elevated">
            <Card.Header
              icon={Users}
              title="Add team member"
              description="Invite someone to your workspace."
              actions={<Button variant="secondary" size="sm" iconOnly={MoreHorizontal} />}
            />
            <Card.Body>
              <Input label="Name" placeholder="Jane Doe" size="sm" />
              <Input label="Email" placeholder="jane@company.com" size="sm" />
            </Card.Body>
            <Card.Footer align="between">
              <Button variant="link" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Send invite</Button>
            </Card.Footer>
          </Card>
        </div>
      </DocCard>

      {/* ── Dividers ──────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Dividers</SectionTitle>
      <DocCard>
        <Spec>Card.Divider separates content regions. Full-width bleeds to card edges. Inset respects padding.</Spec>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card variant="elevated">
            <Card.Header title="Full-width divider" description="Bleeds to card edges, visually separates regions." />
            <Card.Divider />
            <Card.Body>
              <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                Content below the divider. Use for expandable areas, distinct content zones, or between header and a different content type.
              </p>
            </Card.Body>
            <Card.Divider />
            <Card.Footer>
              <Button variant="secondary" size="sm">Expand</Button>
            </Card.Footer>
          </Card>

          <Card variant="outlined">
            <Card.Header title="Inset divider" description="Respects card padding, lighter separation." />
            <Card.Divider inset />
            <Card.Body>
              <div className="flex flex-col">
                {['Design review', 'Sprint planning', 'Retro'].map((item, i, arr) => (
                  <div key={item}>
                    <div className="flex items-center justify-between py-3">
                      <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
                      <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Tomorrow</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ height: 1, backgroundColor: 'var(--color-border)' }} />
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </DocCard>

      {/* ── Horizontal layout ─────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Horizontal layout</SectionTitle>
      <DocCard>
        <Spec>Card doesn't have a layout prop — use flex composition inside Card.Body for side-by-side content. Thumbnail + text, avatar + message, image + details.</Spec>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Thumbnail + text */}
          <Card variant="outlined" density="compact">
            <div className="flex gap-4">
              <div
                className="w-20 h-20 rounded-m shrink-0 flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              >
                <Image size={24} style={{ color: 'var(--color-on-surface-subtle-2)' }} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="font-display font-semibold text-headline-s" style={{ color: 'var(--color-on-surface)' }}>
                  Clay pot fair on Saturday?
                </h3>
                <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                  I think it's time to finally try that new noodle shop downtown...
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>2 hours ago</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={12} style={{ color: 'var(--color-on-surface-subtle-2)' }} />
                    <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>74</span>
                  </div>
                </div>
              </div>
              <button className="shrink-0 self-start p-1" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                <Star size={16} />
              </button>
            </div>
          </Card>

          {/* News-style horizontal */}
          <Card variant="outlined" density="compact">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-subtle-2)' }}>Eastern Times</span>
                <h3 className="font-display font-semibold text-headline-s" style={{ color: 'var(--color-on-surface)' }}>
                  The quiet, yet powerful healthcare revolution
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Chip size="sm" clickable={false}>Top news</Chip>
                  <span className="font-sans text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>1 hour ago</span>
                </div>
              </div>
              <div
                className="w-20 h-20 rounded-m shrink-0"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
            </div>
          </Card>
        </div>
      </DocCard>

      {/* ── Guidance ───────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Guidance</SectionTitle>
      <DocCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Do */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-success-1)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--color-on-success)' }}>✓</span>
              </div>
              <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-success-1)' }}>Do</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                'Use cards to group related content with a clear boundary',
                'Pick one variant per context — don\'t mix elevated and outlined in the same grid',
                'Use Card.Media for images — it handles full-bleed and radius',
                'Place overflow actions in Card.Header actions slot',
                'Use dividers to separate expandable or distinct content zones',
              ].map(item => (
                <div key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--color-success-1)' }} />
                  <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Don't */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-danger-1)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--color-on-danger)' }}>✕</span>
              </div>
              <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-danger-1)' }}>Don't</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                'Don\'t force content into cards when spacing or dividers would create a simpler hierarchy',
                'Don\'t layer text directly on images without a scrim or contrast backing',
                'Don\'t nest clickable cards — one click target per card',
                'Don\'t use Card for Accordion/FAQ — those are separate components with their own interaction model',
                'Don\'t mix card variants in the same collection — pick one',
              ].map(item => (
                <div key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--color-danger-1)' }} />
                  <span className="font-sans text-sm" style={{ color: 'var(--color-on-surface)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DocCard>

      {/* ── Text on images ─────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Text on images</SectionTitle>
      <DocCard>
        <Spec>If you must overlay text on an image, ensure accessible contrast. Use a translucent scrim or bounding shape.</Spec>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card variant="elevated">
            <Card.Media>
              <div className="relative w-full" style={{ height: 180, backgroundColor: 'var(--color-surface-4)' }}>
                <div
                  className="absolute inset-x-0 bottom-0 px-5 py-4"
                  style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}
                >
                  <p className="font-display font-semibold text-headline-s" style={{ color: 'white' }}>
                    With gradient scrim
                  </p>
                  <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Bottom gradient ensures text contrast
                  </p>
                </div>
              </div>
            </Card.Media>
            <Card.Footer>
              <Button variant="secondary" size="sm" iconOnly={Star} />
              <Button variant="secondary" size="sm">Save</Button>
            </Card.Footer>
          </Card>

          <Card variant="elevated">
            <Card.Media>
              <div className="relative w-full flex items-end p-5" style={{ height: 180, backgroundColor: 'var(--color-surface-4)' }}>
                <GlassSurface
                  variant="subtle"
                  tint="#000"
                  className="px-3 py-2 rounded-m"
                >
                  <p className="font-display font-semibold text-base" style={{ color: 'white' }}>
                    With bounding shape
                  </p>
                </GlassSurface>
              </div>
            </Card.Media>
            <Card.Header title="Frosted chip overlay" description="Semi-transparent backdrop blur for readable text on any image." />
          </Card>
        </div>
      </DocCard>

      {/* ── Tokens ──────────────────────────────────────────────────── */}
      <div className="mt-12" />
      <SectionTitle>Spacing tokens</SectionTitle>
      <DocCard>
        <Spec>All spacing is driven by CSS custom properties that scale with --spaciness.</Spec>
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { token: '--card-padding', default: 'space-lg (24px)', compact: 'space-md (16px)', flush: '0', purpose: 'Outer padding' },
            { token: '--card-gap', default: 'space-md (16px)', compact: 'space-sm (8px)', flush: 'space-sm', purpose: 'Between sections' },
            { token: '--card-header-gap', default: 'space-sm (8px)', compact: 'space-xs (4px)', flush: 'space-sm', purpose: 'Title ↔ description' },
            { token: '--card-body-gap', default: 'space-sm (8px)', compact: 'space-xs (4px)', flush: 'space-sm', purpose: 'Between body items' },
          ].map(({ token, ...rest }) => (
            <div key={token} className="flex items-center gap-4 py-3">
              <code className="font-mono text-xs w-36 shrink-0 font-semibold" style={{ color: 'var(--color-on-secondary-1)' }}>{token}</code>
              <span className="font-mono text-xs w-32 shrink-0" style={{ color: 'var(--color-on-surface)' }}>{rest.default}</span>
              <span className="font-mono text-xs w-28 shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{rest.compact}</span>
              <span className="font-mono text-xs w-16 shrink-0" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{rest.flush}</span>
              <span className="font-sans text-xs flex-1" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{rest.purpose}</span>
            </div>
          ))}
        </div>
      </DocCard>
    </section>
  );
}
