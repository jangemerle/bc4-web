/**
 * Design System — AnimatedIcon component
 *
 * SVG stroke drawing animation for any Lucide icon.
 * Each stroke path draws from 0 to full length with staggered timing.
 *
 * Uses stroke-dasharray / stroke-dashoffset with CSS transitions,
 * matching the ease.stroke curve from the motion token system.
 *
 * Usage:
 *   import { Rocket } from 'lucide-react';
 *   <AnimatedIcon icon={Rocket} />
 *   <AnimatedIcon icon={Rocket} trigger="hover" />
 *   <AnimatedIcon icon={Rocket} trigger="manual" animate={isVisible} />
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';
import { duration, cssEase, ease } from '../tokens/motion';
import { iconSize, type IconSize } from '../tokens/icons';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AnimatedIconProps {
  /** Any lucide-react icon component */
  icon: LucideIcon;
  /** Size variant — defaults to 'lg' (24px) */
  size?: IconSize;
  /** Override pixel size directly */
  sizePx?: number;
  /** strokeWidth — defaults to 2 */
  strokeWidth?: number;
  /** How to trigger the draw animation */
  trigger?: 'mount' | 'hover' | 'manual';
  /** For trigger="manual" — true draws, false erases */
  animate?: boolean;
  /** Stagger delay between strokes in seconds */
  stagger?: number;
  /** Duration per stroke in seconds */
  strokeDuration?: number;
  /** Additional className on the wrapper */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStrokableElements(svg: SVGSVGElement): SVGGeometryElement[] {
  return Array.from(
    svg.querySelectorAll<SVGGeometryElement>('path, line, circle, polyline, rect, ellipse')
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AnimatedIcon({
  icon: LucideIconComponent,
  size = 'lg',
  sizePx,
  strokeWidth = 2,
  trigger = 'mount',
  animate: manualAnimate = true,
  stagger = 0.08,
  strokeDuration = duration.base,
  className,
  'aria-label': ariaLabel,
}: AnimatedIconProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const initRef = useRef(false);

  const setupStrokes = useCallback((svg: SVGSVGElement, drawn: boolean, animated: boolean) => {
    const elements = getStrokableElements(svg);
    const easing = cssEase(ease.stroke);

    elements.forEach((el, i) => {
      const length = el.getTotalLength();

      // Set dasharray to total length so full stroke = one "dash"
      el.style.strokeDasharray = String(length);

      if (animated && !reducedMotion) {
        // Apply CSS transition with stagger via delay
        el.style.transition = `stroke-dashoffset ${strokeDuration}s ${easing} ${i * stagger}s`;
      } else {
        el.style.transition = 'none';
      }

      // Set the offset: 0 = fully drawn, length = fully hidden
      el.style.strokeDashoffset = drawn ? '0' : String(length);
    });
  }, [reducedMotion, stagger, strokeDuration]);

  // Mount: hide strokes immediately, then animate in
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || initRef.current) return;
    initRef.current = true;

    if (trigger === 'mount') {
      // Hide immediately (no transition)
      setupStrokes(svg, false, false);
      // Next frame: animate to drawn
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setupStrokes(svg, true, true);
        });
      });
    } else if (trigger === 'hover') {
      // Start fully visible
      setupStrokes(svg, true, false);
    } else if (trigger === 'manual') {
      setupStrokes(svg, manualAnimate, false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Manual trigger changes
  useEffect(() => {
    if (trigger !== 'manual' || !initRef.current) return;
    const svg = svgRef.current;
    if (!svg) return;
    setupStrokes(svg, manualAnimate, true);
  }, [trigger, manualAnimate, setupStrokes]);

  // Hover trigger
  useEffect(() => {
    if (trigger !== 'hover' || !hovered || !initRef.current) return;
    const svg = svgRef.current;
    if (!svg) return;

    // Reset to hidden without animation
    setupStrokes(svg, false, false);
    // Then draw with animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupStrokes(svg, true, true);
      });
    });
  }, [trigger, hovered, setupStrokes]);

  const px = sizePx ?? iconSize[size];

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', lineHeight: 0 }}
      onMouseEnter={trigger === 'hover' ? () => setHovered(true) : undefined}
      onMouseLeave={trigger === 'hover' ? () => setHovered(false) : undefined}
    >
      <LucideIconComponent
        ref={svgRef}
        size={px}
        strokeWidth={strokeWidth}
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
      />
    </span>
  );
}
