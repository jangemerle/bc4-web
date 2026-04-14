import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/Button';
import { Container } from '@/marketing/primitives/Container';
import { common } from '@/content/cs/common';

/**
 * Header — sticky top navigation pro BC4 marketing.
 * Desktop: logo + dropdown nav + primary CTA.
 * Mobile: logo + hamburger → full-screen drawer.
 */

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Zavřít menu při změně stránky
  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={[
        'sticky top-0 z-40 w-full transition-shadow duration-200',
        'bg-[var(--color-surface-1)]/90 backdrop-blur-md',
        scrolled ? 'shadow-[0_1px_0_0_var(--color-border)]' : 'border-b border-transparent',
      ].join(' ')}
    >
      <Container width="wide" className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          aria-label={common.brand.name + ' — domů'}
          className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {common.brand.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Hlavní">
          {common.nav.primary.map(item =>
            item.children ? (
              <ProductsDropdown
                key={item.label}
                label={item.label}
                items={item.children}
                open={productsOpen}
                onOpenChange={setProductsOpen}
              />
            ) : (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    'rounded-m px-3 py-2 text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-[var(--color-on-surface)]'
                      : 'text-[var(--color-on-surface-subtle-1)] hover:text-[var(--color-on-surface)]',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link to={common.nav.primaryCta.href}>
            <Button variant="primary" size="sm">
              {common.nav.primaryCta.label}
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-m text-[var(--color-on-surface)]"
          aria-label="Otevřít menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </Container>

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
            <Container width="wide" className="flex h-16 items-center justify-between">
              <span className="font-display text-lg font-extrabold">{common.brand.name}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-m"
                aria-label="Zavřít menu"
              >
                <X className="h-6 w-6" />
              </button>
            </Container>
            <Container width="wide" className="flex flex-col gap-2 pt-6 pb-12">
              {common.nav.primary.flatMap(item =>
                item.children
                  ? [
                      <p key={item.label} className="px-3 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-subtle-2)]">
                        {item.label}
                      </p>,
                      ...item.children.map(child => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="rounded-m px-3 py-3 text-base font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-secondary-1)]"
                        >
                          {child.label}
                        </Link>
                      )),
                    ]
                  : [
                      <Link
                        key={item.href}
                        to={item.href}
                        className="rounded-m px-3 py-3 text-base font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-secondary-1)]"
                      >
                        {item.label}
                      </Link>,
                    ],
              )}
              <div className="mt-6">
                <Link to={common.nav.primaryCta.href}>
                  <Button variant="primary" size="lg" className="w-full">
                    {common.nav.primaryCta.label}
                  </Button>
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

interface ProductsDropdownProps {
  label: string;
  items: Array<{ label: string; href: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProductsDropdown({ label, items, open, onOpenChange }: ProductsDropdownProps) {
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  const handleEnter = () => {
    if (closeTimer) clearTimeout(closeTimer);
    onOpenChange(true);
  };

  const handleLeave = () => {
    // Diagonal accommodation — dvořte 250ms na move kurzor do dropdownu
    closeTimer = setTimeout(() => onOpenChange(false), 250);
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-m px-3 py-2 text-sm font-semibold text-[var(--color-on-surface-subtle-1)] hover:text-[var(--color-on-surface)]"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => onOpenChange(!open)}
      >
        {label}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 min-w-[220px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-2 shadow-lg"
            role="menu"
          >
            {items.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className="block rounded-m px-3 py-2 text-sm font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-secondary-1)]"
                role="menuitem"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
