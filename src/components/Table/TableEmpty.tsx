/**
 * TableEmpty — Empty state
 */

import { motion } from 'motion/react';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { duration, ease } from '../../tokens/motion';
import type { TableProps } from './types';

interface TableEmptyProps<T extends Record<string, unknown>> {
  totalColumns: number;
  emptyState: TableProps<T>['emptyState'];
  reducedMotion: boolean;
}

export function TableEmpty<T extends Record<string, unknown>>({
  totalColumns,
  emptyState,
  reducedMotion,
}: TableEmptyProps<T>) {
  if (!emptyState) return null;

  return (
    <tr>
      <td colSpan={totalColumns}>
        <motion.div
          role="status"
          className="flex flex-col items-center justify-center gap-2"
          style={{ minHeight: 240 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: duration.base, ease: ease.enter }
          }
        >
          {emptyState.icon && (
            <div style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              <Icon icon={emptyState.icon} size="xl" />
            </div>
          )}
          <span
            className="font-sans text-md font-semibold"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {emptyState.title}
          </span>
          {emptyState.description && (
            <span
              className="font-sans text-sm font-medium"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              {emptyState.description}
            </span>
          )}
          {emptyState.action && (
            <div className="mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={emptyState.action.onClick}
              >
                {emptyState.action.label}
              </Button>
            </div>
          )}
        </motion.div>
      </td>
    </tr>
  );
}
