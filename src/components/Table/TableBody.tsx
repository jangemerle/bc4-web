/**
 * TableBody — Data rows with selection + animation
 */

import { motion, type Variants } from 'motion/react';
import { Checkbox } from '../Checkbox';
import { cn } from '../../lib/cn';
import { alignClass, type ColumnDef } from './types';
import { duration, ease } from '../../tokens/motion';

interface TableBodyProps<T extends Record<string, unknown>> {
  columns: ColumnDef<T>[];
  data: T[];
  selectable: boolean;
  selection: Set<number>;
  handleSelectRow: (index: number) => void;
  horizontalLines: boolean;
  verticalLines: boolean;
  zebraStripe: boolean;
  rowHeight: number;
  cellPadding: string;
  rowVariants: Variants;
}

export function TableBody<T extends Record<string, unknown>>({
  columns,
  data,
  selectable,
  selection,
  handleSelectRow,
  horizontalLines,
  verticalLines,
  zebraStripe,
  rowHeight,
  cellPadding,
  rowVariants,
}: TableBodyProps<T>) {
  return (
    <>
      {data.map((row, rowIdx) => {
        const isSelected = selection.has(rowIdx);
        const isOdd = rowIdx % 2 === 1;

        return (
          <motion.tr
            key={rowIdx}
            custom={rowIdx}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            className="group/row"
            style={{
              height: rowHeight,
              backgroundColor: isSelected
                ? 'var(--color-surface-3)'
                : zebraStripe && isOdd
                  ? 'var(--color-surface-2)'
                  : 'var(--color-surface-1)',
              transition: `background-color ${duration.instant}s ${ease.standard
                .map((v) => v)
                .join(',')}`,
            }}
          >
            {/* Row checkbox */}
            {selectable && (
              <td
                style={{
                  width: 50,
                  minWidth: 50,
                  maxWidth: 50,
                  padding: 0,
                  borderBottom: horizontalLines
                    ? '1px solid var(--color-border)'
                    : undefined,
                  borderRight: verticalLines
                    ? '1px solid var(--color-border)'
                    : undefined,
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <Checkbox
                    size="sm"
                    checked={isSelected}
                    onChange={() => handleSelectRow(rowIdx)}
                    aria-label={`Select row ${rowIdx + 1}`}
                  />
                </div>
              </td>
            )}

            {/* Data cells */}
            {columns.map((col, colIdx) => {
              const value = row[col.key];
              const rendered = col.render
                ? col.render(value, row, rowIdx)
                : (value as React.ReactNode);

              return (
                <td
                  key={col.key}
                  className={cn(
                    'font-sans text-md',
                    alignClass(col.align),
                  )}
                  style={{
                    padding: cellPadding,
                    color: 'var(--color-on-surface)',
                    borderBottom: horizontalLines
                      ? '1px solid var(--color-border)'
                      : undefined,
                    borderRight:
                      verticalLines && colIdx < columns.length - 1
                        ? '1px solid var(--color-border)'
                        : undefined,
                    ...(col.truncate ? { maxWidth: col.width || 200, overflow: 'hidden' } : {}),
                  }}
                >
                  {col.truncate ? (
                    <span
                      className="block truncate"
                      title={typeof rendered === 'string' ? rendered : undefined}
                    >
                      {rendered}
                    </span>
                  ) : (
                    rendered
                  )}
                </td>
              );
            })}
          </motion.tr>
        );
      })}
    </>
  );
}
