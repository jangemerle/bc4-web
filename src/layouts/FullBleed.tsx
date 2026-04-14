/**
 * FullBleed — full-width breakout container
 */

interface FullBleedProps {
  children: React.ReactNode;
  bg?: string;
}

export function FullBleed({ children, bg }: FullBleedProps) {
  return (
    <div
      className="-mx-10 px-10 py-10"
      style={bg ? { backgroundColor: bg } : undefined}
    >
      {children}
    </div>
  );
}
