import type { HomeContent } from '@/content/types';
import { Bound } from './shared';

interface LogoCloudProps {
  content: HomeContent['trustBand'];
}

/** Trust band — "Důvěřují nám" + a row of client logo placeholders. */
export function LogoCloud({ content }: LogoCloudProps) {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-2)] py-9">
      <Bound className="flex flex-col items-center gap-[22px]">
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-[var(--color-on-surface-subtle-2)]">
          {content.label}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-[18px]">
          {content.logos.map((logo) => (
            <div
              key={logo.name}
              className="flex h-[30px] min-w-[120px] items-center justify-center text-[17px] font-extrabold tracking-[-0.01em] text-[var(--color-surface-6)] opacity-85"
            >
              {logo.name}
            </div>
          ))}
        </div>
      </Bound>
    </section>
  );
}
