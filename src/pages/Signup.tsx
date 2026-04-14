/**
 * Signup Page
 *
 * Split layout: brand panel (left) + form (right).
 * Demonstrates the full Kvalt design system in a real-world context.
 *
 * Left panel  — dark brand surface, headline, feature list, decorative glow
 * Right panel — white card, social buttons, email/password form, strength meter
 */

import { useState, useId } from 'react';
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';

// ─── Password strength ────────────────────────────────────────────────────────

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak',   color: 'var(--color-danger-1)'  };
  if (score === 2) return { score: 2, label: 'Fair',   color: 'var(--color-warning-1)' };
  if (score === 3) return { score: 3, label: 'Good',   color: 'var(--color-success-1)' };
  return              { score: 4, label: 'Strong', color: 'var(--color-success-1)' };
}

function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {/* 4-bar meter */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-4)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i <= score ? 1 : 0 }}
              style={{ backgroundColor: i <= score ? color : 'transparent', originX: 0 }}
              transition={{ type: 'spring', bounce: 0, visualDuration: 0.3, delay: i * 0.04 }}
            />
          </div>
        ))}
      </div>
      {/* Label */}
      <motion.p
        key={label}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-sans text-sm font-semibold"
        style={{ color }}
      >
        {label}
      </motion.p>
    </div>
  );
}

// ─── Social button ────────────────────────────────────────────────────────────

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border font-sans text-md font-semibold cursor-pointer transition-colors duration-150"
      style={{
        borderColor: 'var(--color-border)',
        color: 'var(--color-on-surface)',
        backgroundColor: 'var(--color-surface-1)',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-3)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-1)')}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Brand panel decorative feature list ─────────────────────────────────────

const features = [
  'Ship faster with pre-built components',
  'Dark & light mode out of the box',
  'Accessible by default, always',
];

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
      <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Signup() {
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed]             = useState(false);
  const passwordId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── Left brand panel ─────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden"
        style={{ backgroundColor: '#091626' }}
      >
        {/* Decorative glows */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7DDB85 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4571AB 0%, transparent 70%)' }}
        />

        {/* Logo mark */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-1)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="6" height="6" rx="1.5" fill="#14263E" />
              <rect x="11" y="3" width="6" height="6" rx="1.5" fill="#14263E" opacity="0.5" />
              <rect x="3" y="11" width="6" height="6" rx="1.5" fill="#14263E" opacity="0.5" />
              <rect x="11" y="11" width="6" height="6" rx="1.5" fill="#14263E" />
            </svg>
          </div>
          <span className="font-display text-headline-s font-bold" style={{ color: '#FFFFFF' }}>
            Kvalt
          </span>
        </div>

        {/* Headline + features */}
        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2
              className="font-display text-headline-xl font-bold leading-tight"
              style={{ color: '#FFFFFF' }}
            >
              Build beautiful products,{' '}
              <span style={{ color: 'var(--color-primary-1)' }}>faster.</span>
            </h2>
            <p
              className="font-sans text-base font-medium"
              style={{ color: '#A3AAAA' }}
            >
              Everything you need to ship polished interfaces — components, tokens, and patterns — all in one place.
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(125, 219, 133, 0.15)' }}
                >
                  <Check size={12} color="var(--color-primary-1)" strokeWidth={3} />
                </div>
                <span
                  className="font-sans text-base font-medium"
                  style={{ color: '#D9E1E1' }}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Avatar stack */}
          <div className="flex">
            {['#4571AB', '#7DDB85', '#D23031', '#E36B00'].map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-sans text-sm font-bold"
                style={{
                  borderColor: '#091626',
                  backgroundColor: c,
                  color: '#FFFFFF',
                  marginLeft: i === 0 ? 0 : -8,
                  zIndex: 4 - i,
                  position: 'relative',
                }}
              >
                {['J', 'A', 'S', 'M'][i]}
              </div>
            ))}
          </div>
          <p className="font-sans text-sm font-medium" style={{ color: '#898F8F' }}>
            Join <span style={{ color: '#D9E1E1', fontWeight: 600 }}>2,400+ designers</span> already using Kvalt
          </p>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-[440px]"
        >
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1
              className="font-display text-headline-m font-bold"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Create your account
            </h1>
            <p
              className="font-sans text-base font-medium"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Start building with Kvalt today — it's free.
            </p>
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <SocialButton
              label="Google"
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
              }
            />
            <SocialButton
              label="GitHub"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              }
            />
          </div>

          <Divider label="or continue with email" />

          {/* Name row */}
          <div className="flex gap-3">
            <Input
              label="First name"
              placeholder="Jan"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              autoComplete="given-name"
              className="flex-1"
            />
            <Input
              label="Last name"
              placeholder="Doe"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              autoComplete="family-name"
              className="flex-1"
            />
          </div>

          {/* Email */}
          <Input
            label="Work email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* Password + strength */}
          <div className="flex flex-col gap-0">
            <Input
              id={passwordId}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={() => setShowPassword(p => !p)}
              autoComplete="new-password"
              caption="Use 8+ chars with uppercase, numbers & symbols"
            />
            <PasswordStrength password={password} />
          </div>

          {/* Terms */}
          <Checkbox
            size="sm"
            checked={agreed}
            onChange={() => setAgreed(a => !a)}
            label=""
          />
          {/* Custom label with link — Checkbox doesn't support inline links natively */}
          <div className="flex items-center gap-2 -mt-5 ml-6">
            <p className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              I agree to the{' '}
              <button type="button" className="font-bold bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-on-secondary-1)' }}>
                Terms of Service
              </button>
              {' '}and{' '}
              <button type="button" className="font-bold bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-on-secondary-1)' }}>
                Privacy Policy
              </button>
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            iconLeft={UserPlus}
            className="w-full"
            disabled={!agreed}
          >
            Create account
          </Button>

          {/* Sign in link */}
          <p
            className="font-sans text-md font-medium text-center"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Already have an account?{' '}
            <button
              type="button"
              className="font-bold cursor-pointer bg-transparent border-none"
              style={{ color: 'var(--color-on-secondary-1)' }}
            >
              Sign in
            </button>
          </p>
        </form>
      </div>

    </div>
  );
}
