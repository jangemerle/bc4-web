/**
 * Sign In screen — auth landing with animated mesh background.
 *
 * Source: Figma / Topic Board New / node 9379:38996.
 * Background: <AmbientMesh> (animated WebGL pastel mesh + grain).
 */

import { useState } from 'react';
import { Github } from 'lucide-react';
import { AmbientMesh } from '../components/AmbientMesh';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

function GoogleColorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.41a4.62 4.62 0 0 1-2.01 3.04v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.35z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.97-.9 6.62-2.42l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.59-4.1H1.06v2.58A10 10 0 0 0 10 20z"
      />
      <path
        fill="#FBBC05"
        d="M4.41 11.94A6.01 6.01 0 0 1 4.1 10c0-.67.12-1.32.31-1.94V5.48H1.06A10 10 0 0 0 0 10c0 1.61.39 3.14 1.06 4.52l3.35-2.58z"
      />
      <path
        fill="#EA4335"
        d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.97.99 12.7 0 10 0A10 10 0 0 0 1.06 5.48l3.35 2.58C5.2 5.71 7.4 3.96 10 3.96z"
      />
    </svg>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden">
      {/* Animated mesh background — fills the screen, sits behind everything */}
      <AmbientMesh className="absolute inset-0 w-full h-full" />

      {/* Foreground stack: KVALT badge + auth card */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-[660px]">
        {/* KVALT badge */}
        <div
          className="flex items-center gap-1.5 h-12 pl-6 pr-4 py-1 rounded-full"
          style={{
            backgroundColor: 'var(--color-inverted-surface)',
            boxShadow: '0 20px 40px 0 rgba(0,0,0,0.16)',
          }}
        >
          <span
            className="font-display text-[22px] font-bold italic leading-[1.2]"
            style={{ color: 'var(--color-on-inverted-surface)' }}
          >
            KVALT
          </span>
          <span
            className="flex items-center px-2 py-[0.5px] rounded-full"
            style={{ backgroundColor: '#dbf7de' }}
          >
            <span
              className="font-sans text-[10px] font-semibold tracking-[0.4px] leading-[1.5]"
              style={{ color: '#003204' }}
            >
              DS
            </span>
          </span>
        </div>

        {/* Auth card */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-10 p-[60px] md:p-[80px]"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 32,
            boxShadow: '0 20px 40px 0 rgba(0,0,0,0.08)',
          }}
        >
          <h1
            className="font-display text-[42px] font-bold leading-[1.2]"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Sign in or sign up
          </h1>

          {/* Social buttons */}
          <div className="flex flex-col gap-4 w-full">
            <Button variant="secondary" size="md" className="w-full">
              <span className="inline-flex items-center gap-2">
                <GoogleColorIcon />
                Continue with Google
              </span>
            </Button>
            <Button
              variant="secondary"
              size="md"
              iconLeft={Github}
              className="w-full"
            >
              Continue with Github
            </Button>
          </div>

          {/* "or" divider */}
          <div className="relative h-[18px] w-full">
            <div
              className="absolute left-0 right-0 top-1/2 h-px"
              style={{ backgroundColor: 'var(--color-surface-4)' }}
            />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-[5px] font-sans text-md font-medium leading-[1.5] tracking-[0.14px]"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                color: 'var(--color-on-surface-subtle-1)',
              }}
            >
              or
            </span>
          </div>

          {/* Email field */}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* Submit */}
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
