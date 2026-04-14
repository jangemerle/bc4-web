/**
 * CodePanel — monochromatic code display card with animated noise.
 * Source: Figma / Topic Board New / node 9271:31641
 *
 * Dark card with thick border, perspective grid, animated noise texture,
 * "CODE FOR YOU, SIR?" header, monochrome code, and two action buttons.
 *
 * Background layers (bottom to top):
 *   1. Solid #14263e base
 *   2. Animated noise texture — tileable PNG, slowly drifting via CSS keyframes
 *   3. CSS perspective grid with crosshair intersections
 *   4. Cursor glow — radial gradient following mouse on hover
 *
 * The noise + grid intensify on hover via a radial spotlight mask.
 * All animation is compositor-friendly (transform + opacity only).
 *
 * Usage:
 *   <CodePanel code={`<Button variant="primary">Save</Button>`} />
 */

import { useState, useCallback, useRef } from 'react';
import { Eye, Copy, Check } from 'lucide-react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

// ─── Noise animation keyframes (injected once) ───────────────────────────

const NOISE_KEYFRAMES = `
@keyframes codepanel-noise-drift {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-40px, 20px); }
  50%  { transform: translate(-20px, -30px); }
  75%  { transform: translate(30px, -10px); }
  100% { transform: translate(0, 0); }
}
`;

let injected = false;
function injectKeyframes() {
  if (injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = NOISE_KEYFRAMES;
  document.head.appendChild(style);
  injected = true;
}

// ─── Types ────────────────────────────────────────────────────────────────

interface CodePanelProps {
  /** The source code string to display */
  code: string;
  /** Header label. Defaults to "CODE FOR YOU, SIR?" */
  label?: string;
}

// ─── Component ────────────────────────────────────────────────────────────

export function CodePanel({ code, label = 'CODE FOR YOU, SIR?' }: CodePanelProps) {
  injectKeyframes();

  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }, [code]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  }, []);

  const handleMouseEnter = useCallback(() => setHovering(true), []);
  const handleMouseLeave = useCallback(() => setHovering(false), []);

  const trimmedCode = code.trim();
  const lines = trimmedCode.split('\n');

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: '#14263e',
        border: '12px solid #091626',
        borderRadius: 20,
        padding: 24,
        minHeight: 380,
        '--mx': '50%',
        '--my': '50%',
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Layer 1: Animated noise texture ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          // Oversized to allow drift animation without gaps
          inset: -60,
          backgroundImage: 'url(/noise-256.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: hovering ? 0.25 : 0.12,
          transition: 'opacity 0.6s ease',
          animation: 'codepanel-noise-drift 8s ease-in-out infinite',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── Layer 2: Grid pattern (CSS, matches Figma perspective grid) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            // Main grid lines
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          opacity: hovering ? 0.5 : 0.3,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* ── Layer 3: Cursor glow (hover only) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 250px at var(--mx) var(--my), rgba(255,255,255,0.06) 0%, transparent 100%)',
          opacity: hovering ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* ── Header bar ── */}
      <div className="relative z-10 flex items-center justify-between shrink-0">
        <span
          className="font-mono text-[16px] font-bold tracking-[0.01em]"
          style={{ color: 'white' }}
        >
          {label}
        </span>

        <div className="flex items-center gap-3">
          <Button variant="elevated" size="xs" iconLeft={Eye}>
            VIEW
          </Button>
          <Tooltip content={copied ? 'Copied!' : 'Copy code'}>
            <Button
              variant="elevated"
              size="xs"
              iconOnly={copied ? Check : Copy}
              onClick={handleCopy}
              aria-label="Copy code"
            />
          </Tooltip>
        </div>
      </div>

      {/* ── Code with line numbers — vertically centered ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <pre className="overflow-x-auto font-mono text-[14px] leading-relaxed m-0 w-full">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-[10px]">
              <span
                className="select-none text-right shrink-0"
                style={{ color: 'rgba(255,255,255,0.4)', minWidth: '1.5ch' }}
              >
                {i + 1}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
