import { FoundationsCoverFlow } from '../../components/FoundationsCoverFlow';

export default function FoundationsStandalone() {
  const handleNavigate = (pageId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('standalone');
    url.searchParams.set('page', pageId);
    window.location.href = url.toString();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#050505', color: '#e0e0e0' }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-10 py-6">
        <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/50">
          Kvalt DS
        </div>
        <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/30">
          Foundations
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="flex-shrink-0 px-10 pt-8 pb-16 max-w-[1100px] mx-auto w-full">
        <h1
          className="font-display text-[clamp(48px,8vw,120px)] leading-[0.9] font-bold tracking-tight"
          style={{ color: '#ffffff' }}
        >
          Foundations
        </h1>
        <p className="font-mono text-[13px] leading-relaxed text-white/40 mt-6 max-w-[480px]">
          Six pillars that underpin every component in the system.
          Each surface is a living generative texture — hover to watch it breathe.
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="flex-1 px-10 pb-20">
        <FoundationsCoverFlow onNavigate={handleNavigate} />
      </div>

      {/* ── Footer ── */}
      <footer className="px-10 py-6 flex items-center justify-between border-t border-white/5">
        <div className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">
          Generative ASCII Textures
        </div>
        <div className="font-mono text-[10px] tracking-[0.2em] text-white/20">
          Click any card to explore
        </div>
      </footer>
    </div>
  );
}
