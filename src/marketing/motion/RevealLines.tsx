import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * RevealLines — the BC4 homepage signature motion.
 *
 * Splits a single text string into its visual line-boxes (measured after fonts
 * load) and reveals one line at a time: each line sits in an `overflow:hidden`
 * mask, the inner span animates `translateY(110% → 0)`, staggered 80 ms per
 * line. Fires when the block enters view and **replays** when it re-enters.
 *
 * Descender fix: masks get `padding-bottom:.16em; margin-bottom:-.16em` so the
 * tails of g/j/y/ž aren't clipped.
 *
 * Only accepts a plain-string child (headings + paragraphs). Anything else
 * renders as-is with no split. Respects prefers-reduced-motion.
 */

const EASE = 'cubic-bezier(.22,.75,.2,1)';
const STAGGER_MS = 80;
const DURATION_S = 0.95;

interface RevealLinesProps {
  children: ReactNode;
  /** HTML element to render — default 'p'. Use 'h1'/'h2'/'h3' for headings. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export function RevealLines({ children, as: Tag = 'p', className, style, id }: RevealLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const text = typeof children === 'string' ? children : '';

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !text) return;

    let inners: HTMLElement[] = [];
    let io: IntersectionObserver | null = null;
    let resizeTimer: number | undefined;
    let alive = true;

    const build = () => {
      // 1. lay out words inline to measure line-boxes
      el.textContent = '';
      const words = text.split(/\s+/).filter(Boolean);
      if (!words.length) return;
      const wordSpans = words.map((w) => {
        const s = document.createElement('span');
        s.textContent = w;
        s.style.display = 'inline-block';
        el.appendChild(s);
        el.appendChild(document.createTextNode(' '));
        return s;
      });

      // 2. group consecutive words sharing a top into lines
      const lines: string[][] = [];
      let curTop: number | null = null;
      let cur: string[] | null = null;
      wordSpans.forEach((s, i) => {
        const top = Math.round(s.getBoundingClientRect().top);
        if (curTop === null || Math.abs(top - curTop) > 3) {
          cur = [];
          lines.push(cur);
          curTop = top;
        }
        cur!.push(words[i]);
      });

      // 3. rebuild as masked lines
      el.textContent = '';
      inners = lines.map((line, i) => {
        const mask = document.createElement('span');
        mask.style.display = 'block';
        mask.style.overflow = 'hidden';
        mask.style.paddingBottom = '.16em';
        mask.style.marginBottom = '-.16em';

        const inner = document.createElement('span');
        inner.style.display = 'block';
        inner.style.transform = 'translateY(110%)';
        inner.style.transition = `transform ${DURATION_S}s ${EASE}`;
        inner.style.transitionDelay = `${i * STAGGER_MS}ms`;
        inner.style.willChange = 'transform';
        inner.textContent = line.join(' ');

        mask.appendChild(inner);
        el.appendChild(mask);
        return inner;
      });
      el.style.opacity = '1';
    };

    const show = () =>
      inners.forEach((inner, i) => {
        inner.style.transitionDelay = `${i * STAGGER_MS}ms`;
        inner.style.transform = 'translateY(0)';
      });
    const hide = () =>
      inners.forEach((inner) => {
        inner.style.transitionDelay = '0ms';
        inner.style.transform = 'translateY(110%)';
      });

    // hide until measured, so we never flash the un-split text
    el.style.opacity = '0';

    const init = () => {
      if (!alive) return;
      build();
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? show() : hide())),
        { threshold: 0, rootMargin: '0px 0px -8% 0px' },
      );
      io.observe(el);
    };

    if (document.fonts?.ready) document.fonts.ready.then(init);
    else init();

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!alive) return;
        io?.disconnect();
        build();
        io?.observe(el);
      }, 200);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      alive = false;
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      io?.disconnect();
      el.style.opacity = '';
      el.textContent = text;
    };
  }, [text, reduced]);

  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}
