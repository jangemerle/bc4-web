/**
 * DosDonts — side-by-side do/don't comparison
 */

interface DosDontsProps {
  do: { visual: React.ReactNode; caption: string };
  dont: { visual: React.ReactNode; caption: string };
}

export function DosDonts(props: DosDontsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Do */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-1)' }}
      >
        <div className="h-1" style={{ backgroundColor: 'var(--color-success-1)' }} />
        <div className="px-10 py-8">
          <p className="font-sans text-sm font-bold mb-4" style={{ color: 'var(--color-success-1)' }}>
            Do
          </p>
          <div className="mb-4">{props.do.visual}</div>
          <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            {props.do.caption}
          </p>
        </div>
      </div>

      {/* Don't */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-1)' }}
      >
        <div className="h-1" style={{ backgroundColor: 'var(--color-danger-1)' }} />
        <div className="px-10 py-8">
          <p className="font-sans text-sm font-bold mb-4" style={{ color: 'var(--color-danger-1)' }}>
            Don't
          </p>
          <div className="mb-4">{props.dont.visual}</div>
          <p className="font-sans text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
            {props.dont.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
