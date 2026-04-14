/**
 * Typo — applies locale-aware typography rules to its children.
 *
 * String children are transformed directly. ReactNode trees are walked
 * recursively, transforming only string leaves. No wrapper element is
 * emitted — NBSP is a Unicode character, so there's no styling surface
 * to pollute.
 *
 * Usage:
 *   <Typo>{title}</Typo>
 *   <Typo>Any <strong>mixed</strong> tree with text</Typo>
 *
 * For raw string → string transforms (e.g. placeholders, aria-label),
 * import `fixTypo` from `../lib/typo` directly.
 */

import { useMemo, type ReactNode, Fragment, isValidElement, cloneElement } from 'react';
import { fixTypo, type Locale } from '../lib/typo';
import { useLocale } from '../contexts/LocaleProvider';

interface TypoProps {
  children: ReactNode;
  /** Override the active locale for this subtree. */
  locale?: Locale;
}

function transformNode(node: ReactNode, locale: Locale): ReactNode {
  if (typeof node === 'string') {
    return fixTypo(node, locale);
  }
  if (typeof node === 'number' || typeof node === 'boolean' || node == null) {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <Fragment key={i}>{transformNode(child, locale)}</Fragment>
    ));
  }
  if (isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: ReactNode }>;
    const { children } = element.props;
    if (children == null) return element;
    return cloneElement(element, undefined, transformNode(children, locale));
  }
  return node;
}

export function Typo({ children, locale: localeOverride }: TypoProps) {
  const contextLocale = useLocale();
  const locale = localeOverride ?? contextLocale;
  const transformed = useMemo(
    () => transformNode(children, locale),
    [children, locale],
  );
  return <>{transformed}</>;
}

/**
 * Helper for string-only props (placeholder, aria-label, title).
 * Same semantics as `fixTypo` but reads the active locale from context.
 */
export function useTypo(text: string): string {
  const locale = useLocale();
  return useMemo(() => fixTypo(text, locale), [text, locale]);
}
