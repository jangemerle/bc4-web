/**
 * Email Verification Page
 *
 * Post-signup confirmation screen asking users to check their inbox.
 * Centered card with animated envelope illustration, heading, and resend action.
 * Background: 3D perspective grid (Pattern.svg) for depth and visual interest.
 *
 * Source: Figma / Topic Board New / node 9012:31806
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { spring, duration, ease } from '../tokens/motion';

export default function VerifyEmail() {
  const [resent, setResent] = useState(false);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface-2)' }}
    >

      {/* Perspective floor grid.
          The SVG has preserveAspectRatio="none" so it stretches to fill the
          container exactly — no blank edges top or bottom. */}
      <img
        src="/pattern-grid-full.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full select-none pointer-events-none dark:invert"
      />

      {/* Card — floats above the grid */}
      <motion.div
        className="relative z-10 w-[448px] max-w-[90vw] rounded-lg shadow-large-1 flex flex-col gap-8 items-center px-20 py-[60px]"
        style={{ backgroundColor: 'var(--color-surface-1)' }}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring.default}
      >
        {/* Animated envelope illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ ...spring.playful, delay: 0.15 }}
        >
          <img
            src="/illustrations/optimized/envelope-400w.gif"
            alt="Animated envelope illustration"
            width={200}
            height={200}
            style={{ width: 200, height: 'auto' }}
            loading="eager"
          />
        </motion.div>

        {/* Text — left aligned per Figma */}
        <motion.div
          className="flex flex-col gap-5 w-full"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.moderate, ease: ease.enter, delay: 0.2 }}
        >
          <h1
            className="font-display text-headline-2xl font-bold leading-[1.2]"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Please verify your email address
          </h1>
          <p
            className="font-sans text-lg font-medium leading-[1.5]"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Check your email inbox for a verification email.
          </p>
        </motion.div>

        {/* Resend link */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.moderate, ease: ease.enter, delay: 0.35 }}
        >
          {resent ? (
            <motion.p
              className="font-sans text-md font-semibold"
              style={{ color: 'var(--color-success-1)' }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring.snappy}
            >
              Email resent — check your inbox again.
            </motion.p>
          ) : (
            <p
              className="font-sans text-md font-medium tracking-[0.14px]"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Didn&apos;t receive an email?{' '}
              <button
                onClick={() => setResent(true)}
                className="underline cursor-pointer transition-colors duration-150 font-medium"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Resend email
              </button>
            </p>
          )}
        </motion.div>
      </motion.div>

    </div>
  );
}
