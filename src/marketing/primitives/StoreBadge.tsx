/**
 * StoreBadge — on-brand App Store / Google Play download buttons. A custom,
 * cleaner take on the stock badges: navy ink (never pure black), token radius,
 * monochrome glyphs, two-line label. Opens the official store listing.
 */

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 flex-none" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8C2.94 18.31 1.9 15.5 1.9 12.85c0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 flex-none" aria-hidden="true">
      <path d="M5 3.4c0-.86.94-1.39 1.67-.94l13.1 8.6a1.1 1.1 0 0 1 0 1.88l-13.1 8.6C5.94 22 5 21.46 5 20.6V3.4z" />
    </svg>
  );
}

interface StoreBadgeProps {
  href: string;
  platform: 'apple' | 'google';
}

function StoreBadge({ href, platform }: StoreBadgeProps) {
  const isApple = platform === 'apple';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={isApple ? 'Stáhnout v App Store' : 'Stáhnout na Google Play'}
      className="group inline-flex items-center gap-3 rounded-[12px] bg-[var(--color-on-surface)] px-[18px] py-2.5 text-white no-underline shadow-[0_10px_24px_-14px_rgba(4,18,59,0.7)] transition-colors duration-200 hover:bg-[var(--color-on-secondary-2)] hover:text-white"
    >
      {isApple ? <AppleGlyph /> : <PlayGlyph />}
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/70">
          {isApple ? 'Stáhněte z' : 'Získejte na'}
        </span>
        <span className="mt-1 text-[16px] font-bold leading-tight">
          {isApple ? 'App Store' : 'Google Play'}
        </span>
      </span>
    </a>
  );
}

interface StoreBadgesProps {
  appStore?: string;
  googlePlay?: string;
}

export function StoreBadges({ appStore, googlePlay }: StoreBadgesProps) {
  if (!appStore && !googlePlay) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {appStore && <StoreBadge href={appStore} platform="apple" />}
      {googlePlay && <StoreBadge href={googlePlay} platform="google" />}
    </div>
  );
}
