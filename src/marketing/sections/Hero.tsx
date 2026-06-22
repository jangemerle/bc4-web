import { ShieldCheck, MapPin, Headphones } from 'lucide-react';
import type { HomeContent } from '@/content/types';
import { RevealLines } from '@/marketing/motion/RevealLines';
import { Reveal } from '@/marketing/motion/Reveal';
import { NavGlow } from '@/marketing/motion/NavGlow';
import { CtaButton } from '@/marketing/primitives/CtaButton';
import { Bound } from './shared';

const trustBadges = [
  { icon: ShieldCheck, label: 'GDPR ready' },
  { icon: MapPin, label: 'Data v EU' },
  { icon: Headphones, label: 'Česká podpora' },
];

interface HeroProps {
  content: HomeContent['hero'];
}

export function Hero({ content }: HeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[var(--color-surface-1)] pb-[clamp(56px,7vw,96px)]"
      style={{ marginTop: '-72px', paddingTop: 'calc(72px + clamp(48px, 6vw, 84px))' }}
      aria-labelledby="hero-headline"
    >
      {/* Large logo-style glow, emanating from the top edge behind the headline */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <NavGlow
          sizes={[552, 960, 1368]}
          alphas={[0.16, 0.09, 0.045]}
          blur={12}
          inDuration={0.9}
          loop
          loopDuration={4.2}
          style={{ left: '50%', top: 'calc(4% - 160px)' }}
        />
      </div>
      {/* Masked dotted grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(4,18,59,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          WebkitMaskImage: 'radial-gradient(72% 62% at 62% 2%, #000 0%, transparent 72%)',
          maskImage: 'radial-gradient(72% 62% at 62% 2%, #000 0%, transparent 72%)',
        }}
      />

      <Bound className="relative">
        <div className="grid items-center gap-[clamp(40px,5vw,72px)] lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left — copy + CTAs */}
          <div className="flex flex-col gap-6">
            <RevealLines
              as="h1"
              id="hero-headline"
              className="m-0 font-display text-[clamp(2.2rem,1.1rem+2.7vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-balance text-[var(--color-on-surface)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {content.headline}
            </RevealLines>

            <RevealLines
              as="p"
              className="m-0 max-w-[560px] text-[clamp(1.05rem,0.95rem+0.5vw,1.25rem)] leading-[1.6] text-pretty text-[var(--color-on-surface-subtle-1)]"
            >
              {content.subheadline}
            </RevealLines>

            <Reveal className="mt-1 flex flex-wrap gap-3">
              <CtaButton href="#poptavka" variant="primary" size="lg" arrow trackingId={content.primaryCta.trackingId}>
                {content.primaryCta.label}
              </CtaButton>
              {content.secondaryCta && (
                <CtaButton href={content.secondaryCta.href} variant="outline" size="lg">
                  {content.secondaryCta.label}
                </CtaButton>
              )}
            </Reveal>

            <Reveal
              as="ul"
              className="mt-2 flex list-none flex-wrap items-center gap-x-[18px] gap-y-2 p-0"
            >
              {trustBadges.map((badge) => (
                <li
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-on-surface-subtle-1)]"
                >
                  <badge.icon className="h-[14px] w-[14px]" aria-hidden="true" />
                  {badge.label}
                </li>
              ))}
            </Reveal>
          </div>

          {/* Right — framed product screenshot */}
          <Reveal className="relative">
            <div
              aria-hidden="true"
              className="absolute"
              style={{
                inset: '-6% -4% -10% -4%',
                background: 'radial-gradient(60% 60% at 50% 40%, rgba(53,100,239,0.22), rgba(53,100,239,0) 70%)',
                filter: 'blur(8px)',
              }}
            />
            <div className="relative overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-[0_30px_70px_-28px_rgba(4,18,59,0.5),0_8px_24px_-12px_rgba(4,18,59,0.25)]">
              <img
                src={content.heroVisual.src}
                alt={content.heroVisual.alt}
                loading="eager"
                fetchPriority="high"
                className="block h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </Bound>
    </section>
  );
}
