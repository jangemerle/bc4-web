/**
 * MarketingLayout — společný layout pro všechny marketingové stránky.
 *
 * 📍 Cílová lokace: src/marketing/layouts/MarketingLayout.tsx
 *
 * 🔧 Před přesunem nainstalovat:
 *    npm install react-router-dom
 *
 * Co dělá:
 *   - Aktivuje BC4 character (přes Kvalt CharacterProvider)
 *   - Globální Motion config — respect reduced motion, default transition
 *   - Renderuje Header + <Outlet> + Footer
 *   - Sticky scroll progress bar nahoře (volitelně, viz tech-architecture animation strategy)
 */

import { Outlet } from 'react-router-dom';
import { MotionConfig, useScroll, motion } from 'motion/react';
import { CharacterProvider } from '@/characters';
import { Header } from './Header';
import { Footer } from './Footer';

export function MarketingLayout() {
  const { scrollYProgress } = useScroll();

  return (
    <CharacterProvider defaultCharacter="bc4">
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      >
        {/* Scroll progress bar — subtle, jen vizuální orientace */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-primary-1)] origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />

        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-on-surface)] flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </CharacterProvider>
  );
}
