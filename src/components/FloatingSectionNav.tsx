/**
 * FloatingSectionNav — pinned section switcher that slides in from the left
 * when the inline version scrolls out of view.
 *
 * Pairs with useSectionNav hook.
 */

import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ContentSwitcher, ContentSwitcherItem } from './ContentSwitcher';
import { spring, duration, ease } from '../tokens/motion';
import type { LucideIcon } from 'lucide-react';

export interface SectionNavItem {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface FloatingSectionNavProps {
  items: SectionNavItem[];
  activeSection: string;
  pinned: boolean;
  inlineRef: React.RefObject<HTMLDivElement | null>;
  onChange: (value: string) => void;
}

export function FloatingSectionNav({
  items,
  activeSection,
  pinned,
  inlineRef,
  onChange,
}: FloatingSectionNavProps) {
  const reducedMotion = useReducedMotion();

  return (
    <>
      {/* Inline version — sits in the page flow, full width */}
      <div ref={inlineRef} className="mt-[60px] mb-[60px]">
        <ContentSwitcher value={activeSection} onChange={onChange} variant="elevated" size="md" fill>
          {items.map(item => (
            <ContentSwitcherItem key={item.value} value={item.value} icon={item.icon}>
              {item.label}
            </ContentSwitcherItem>
          ))}
        </ContentSwitcher>
      </div>

      {/* Pinned version — fixed in top-left of content area */}
      <AnimatePresence>
        {pinned && (
          <motion.div
            className="fixed z-40"
            style={{ top: 40, left: 'calc(320px + 40px)' }}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={reducedMotion
              ? { duration: 0 }
              : { x: spring.snappy, opacity: { duration: duration.fast, ease: ease.enter } }
            }
          >
            <ContentSwitcher value={activeSection} onChange={onChange} variant="elevated">
              {items.map(item => (
                <ContentSwitcherItem key={item.value} value={item.value} icon={item.icon}>
                  {item.label}
                </ContentSwitcherItem>
              ))}
            </ContentSwitcher>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
