/**
 * TokenTable — clean table for listing token values
 */

interface TokenTableProps {
  headers: string[];
  rows: { cells: React.ReactNode[] }[];
}

export function TokenTable({ headers, rows }: TokenTableProps) {
  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="font-sans text-sm font-semibold text-left px-6 py-3"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-t"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface-1)',
              }}
            >
              {row.cells.map((cell, ci) => (
                <td key={ci} className="font-sans text-sm px-6 py-3" style={{ color: 'var(--color-on-surface)' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
