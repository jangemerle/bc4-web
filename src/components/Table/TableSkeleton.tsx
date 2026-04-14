/**
 * TableSkeleton — Loading skeleton rows
 */

import { motion } from 'motion/react';
import { Checkbox } from '../Checkbox';
import { Skeleton } from '../Skeleton';
import { duration, ease } from '../../tokens/motion';
import { alignClass, type ColumnDef } from './types';

interface TableSkeletonProps<T extends Record<string, unknown>> {
  columns: ColumnDef<T>[];
  selectable: boolean;
  skeletonRowCount: number;
  horizontalLines: boolean;
  verticalLines: boolean;
  zebraStripe: boolean;
  rowHeight: number;
  cellPadding: string;
  reducedMotion: boolean;
}

export function TableSkeleton<T extends Record<string, unknown>>({
  columns,
  selectable,
  skeletonRowCount,
  horizontalLines,
  verticalLines,
  zebraStripe,
  rowHeight,
  cellPadding,
  reducedMotion,
}: TableSkeletonProps<T>) {
  return (
    <>
      {Array.from({ length: skeletonRowCount }).map((_, rowIdx) => (
        <motion.tr
          key={`skeleton-${rowIdx}`}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reducedMotion
            ? { duration: 0 }
            : { duration: duration.fast, ease: ease.enter, delay: rowIdx * (duration.instant * 0.3) }
          }
          style={{
            height: rowHeight,
            backgroundColor: zebraStripe && rowIdx % 2 === 1
              ? 'var(--color-surface-2)'
              : 'var(--color-surface-1)',
          }}
        >
          {selectable && (
            <td
              style={{
                width: 50,
                minWidth: 50,
                maxWidth: 50,
                padding: 0,
                borderBottom: horizontalLines ? '1px solid var(--color-border)' : undefined,
                borderRight: verticalLines ? '1px solid var(--color-border)' : undefined,
              }}
            >
              <div className="flex items-center justify-center h-full">
                <Checkbox size="sm" disabled checked={false} onChange={() => {}} />
              </div>
            </td>
          )}
          {columns.map((col, colIdx) => (
            <td
              key={col.key}
              className={alignClass(col.align)}
              style={{
                padding: cellPadding,
                borderBottom: horizontalLines ? '1px solid var(--color-border)' : undefined,
                borderRight:
                  verticalLines && colIdx < columns.length - 1
                    ? '1px solid var(--color-border)'
                    : undefined,
              }}
            >
              <Skeleton width="60%" />
            </td>
          ))}
        </motion.tr>
      ))}
    </>
  );
}
