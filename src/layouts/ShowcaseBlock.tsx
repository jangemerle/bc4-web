/**
 * ShowcaseBlock — large, styled, non-interactive visual display
 */

const bgMap = {
  surface: 'var(--color-surface-1)',
  bg: 'var(--color-bg)',
  inverted: 'var(--color-inverted-surface)',
  primary: 'var(--color-primary-1)',
} as const;

interface ShowcaseBlockProps {
  children: React.ReactNode;
  bg?: keyof typeof bgMap;
  minHeight?: number;
}

export function ShowcaseBlock({ children, bg = 'surface', minHeight = 280 }: ShowcaseBlockProps) {
  return (
    <div
      className="rounded-lg flex items-center justify-center px-10 py-10 pointer-events-none select-none"
      style={{
        backgroundColor: bgMap[bg],
        minHeight,
      }}
    >
      {children}
    </div>
  );
}
