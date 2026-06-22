import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { common } from '@/content/cs/common';
import { CtaButton } from '@/marketing/primitives/CtaButton';

/**
 * Header — sticky 72px bar. Transparent at the top (the hero shows through),
 * fading to a translucent white + blur + shadow once scrolled. Route-based nav
 * (Funkce, Kontakt) plus the primary "Domluvit ukázku" CTA.
 */

const navStyle = 'text-[17px] font-bold no-underline text-[var(--color-on-surface)]';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-[background-color,box-shadow] duration-200',
        scrolled
          ? 'bg-[rgba(255,255,255,0.82)] backdrop-blur-[14px] shadow-[0_8px_30px_-16px_rgba(4,18,59,0.28)]'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link to="/" aria-label={`${common.brand.name} — domů`} className="flex items-center gap-2.5 no-underline">
          <img src="/logos/bc4cloud-mark.svg" alt="" aria-hidden="true" className="h-[34px] w-auto" />
          <span className="relative top-[3px] font-display text-[20px] font-extrabold tracking-[-0.02em] text-[var(--color-on-surface)]">
            BC4 Cloud
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[30px] lg:flex" aria-label="Hlavní">
          {common.nav.primary.map((item) => (
            <NavLink key={item.href} to={item.href} className={navStyle}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <CtaButton href={common.nav.primaryCta.href} variant="primary" size="md" trackingId={common.nav.primaryCta.trackingId}>
            {common.nav.primaryCta.label}
          </CtaButton>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-m text-[var(--color-on-surface)] lg:hidden"
          aria-label="Otevřít menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--color-surface-1)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobilní menu"
          >
            <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6">
              <span className="flex items-center gap-2.5">
                <img src="/logos/bc4cloud-mark.svg" alt="" aria-hidden="true" className="h-[34px] w-auto" />
                <span className="relative top-[3px] font-display text-[20px] font-extrabold tracking-[-0.02em] text-[var(--color-on-surface)]">
                  BC4 Cloud
                </span>
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-m"
                aria-label="Zavřít menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 pb-12 pt-6">
              {common.nav.primary.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-m px-3 py-3 text-base font-semibold text-[var(--color-on-surface)] no-underline hover:bg-[var(--color-secondary-1)]"
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-6">
                <CtaButton href={common.nav.primaryCta.href} variant="primary" size="lg" className="w-full">
                  {common.nav.primaryCta.label}
                </CtaButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
