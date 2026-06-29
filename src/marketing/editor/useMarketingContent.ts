/**
 * useMarketingContent — read a marketing content namespace with live updates.
 *
 * Replaces the old direct `import { home } from '@/content/cs/home'` pattern in
 * marketing pages. Returns the same typed object, but sourced from the content
 * store so edits made in the live edit drawer re-render the page in place.
 *
 *   const content = useMarketingContent('home');   // typed as HomeContent
 *   <h1>{content.hero.headline}</h1>
 */

import { useSyncExternalStore } from 'react';
import type {
  HomeContent,
  ContactContent,
  CommonContent,
  ProductContent,
} from '@/content/types';
import { subscribe, getNamespace, type NamespaceKey } from './contentStore';

interface NamespaceTypeMap {
  home: HomeContent;
  productContactCenter: ProductContent;
  productCalling: ProductContent;
  features: ProductContent;
  contact: ContactContent;
  common: CommonContent;
}

export function useMarketingContent<K extends NamespaceKey>(ns: K): NamespaceTypeMap[K] {
  const value = useSyncExternalStore(
    subscribe,
    () => getNamespace(ns),
    () => getNamespace(ns),
  );
  return value as unknown as NamespaceTypeMap[K];
}
