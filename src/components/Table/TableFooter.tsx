/**
 * TableFooter — Footer slot
 */

import React from 'react';

interface TableFooterProps {
  footer: React.ReactNode;
}

export function TableFooter({ footer }: TableFooterProps) {
  return (
    <div
      className="flex items-center"
      style={{
        minHeight: 56,
        padding: '12px 16px',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface-1)',
      }}
    >
      <div className="w-full">{footer}</div>
    </div>
  );
}
