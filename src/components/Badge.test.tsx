import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders children', () => {
    render(<Badge>3</Badge>);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    render(<Badge>5</Badge>);
    expect(screen.getByText('5').tagName).toBe('SPAN');
  });

  // ── Variants ──────────────────────────────────────────────────────────

  it('defaults to neutral variant', () => {
    render(<Badge>1</Badge>);
    expect(screen.getByText('1').className).toContain('bg-[var(--color-surface-3)]');
  });

  it('applies accent variant with danger background', () => {
    render(<Badge variant="accent">5</Badge>);
    expect(screen.getByText('5').className).toContain('bg-[var(--color-danger-1)]');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────

  it('defaults to md size', () => {
    render(<Badge>2</Badge>);
    expect(screen.getByText('2').className).toContain('min-w-[20px]');
  });

  it('applies sm size', () => {
    render(<Badge size="sm">1</Badge>);
    expect(screen.getByText('1').className).toContain('min-w-[16px]');
  });

  // ── Custom props ──────────────────────────────────────────────────────

  it('passes className through', () => {
    render(<Badge className="ml-2">7</Badge>);
    expect(screen.getByText('7').className).toContain('ml-2');
  });

  it('passes HTML attributes through', () => {
    render(<Badge data-testid="badge">8</Badge>);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });
});
