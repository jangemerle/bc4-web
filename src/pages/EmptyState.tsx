import { motion } from 'motion/react';
import { MessageCircle, Send } from 'lucide-react';
import emptyStateElement from '../assets/illustrations/empty-state-element.svg';
import emptyStateCharacter from '../assets/illustrations/empty-state-character.svg';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { duration, ease } from '../tokens/motion';

export default function EmptyState() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Illustration */}
        <motion.div
          className="relative w-[280px] h-[242px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duration.slow, ease: ease.enter }}
        >
          <motion.img
            src={emptyStateElement}
            alt=""
            className="absolute w-[97px] h-[46px]"
            style={{ left: '49px', top: '3px', originX: 0.5, originY: 1 }}
            initial={{ opacity: 0, y: -12, rotate: -8 }}
            animate={{ opacity: 1, y: [0, -4, 0], rotate: [0, 3, -2, 0] }}
            transition={{
              opacity: { duration: duration.slow, ease: ease.enter, delay: 0.4 },
              y: { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 0.4 },
              rotate: { duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 0.4 },
            }}
          />
          <motion.img
            src={emptyStateCharacter}
            alt="Person relaxing at a desk"
            className="absolute inset-0 w-[280px] h-[242px]"
            style={{ originX: 0.5, originY: 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -3, 0] }}
            transition={{
              opacity: { duration: duration.slow, ease: ease.enter, delay: 0.1 },
              y: { duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 0.6 },
            }}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          className="flex flex-col items-center gap-1 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: ease.enter, delay: 0.2 }}
        >
          <h1
            className="font-display text-headline-m font-bold"
            style={{ color: 'var(--color-on-surface)' }}
          >
            No messages here
          </h1>
          <p
            className="font-sans text-base font-medium max-w-[320px]"
            style={{ color: 'var(--color-on-surface-subtle-1)' }}
          >
            Start your first private conversation
            <br />
            to get things moving!
          </p>
        </motion.div>

        {/* Input + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: ease.enter, delay: 0.35 }}
          className="mt-[20px] flex items-end gap-2 w-[360px]"
        >
          <Input
            placeholder="Type your first message..."
            icon={Send}
            className="flex-1"
          />
          <Button iconLeft={MessageCircle}>Send</Button>
        </motion.div>
      </div>
    </div>
  );
}
