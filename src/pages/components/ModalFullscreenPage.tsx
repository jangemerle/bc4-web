import { useState } from 'react';
import { ModalFullscreen } from '../../components/ModalFullscreen';
import { Button } from '../../components/Button';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

const stories = [
  {
    category: 'Screen Vault',
    title: 'The Onboarding Flow',
    meta: 'Kvalt · Desktop · 2025',
    body: 'A multi-step wizard that guides new users through workspace setup, team invites, and first-topic creation. Designed for zero-friction activation with progressive disclosure.',
    bgColor: '#c8dbe5',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=800&fit=crop',
  },
  {
    category: 'Components',
    title: 'The Toggle Switch',
    meta: 'Kvalt DS · v2.4 · 2025',
    body: 'A binary input with spring animation, haptic-inspired press feedback, and three sizes. Uses the usePress hook to guarantee visible animation even on trackpad taps.',
    bgColor: '#e5d5c8',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop',
  },
  {
    category: 'Philosophy',
    title: 'Motion as Meaning',
    meta: 'Design Principles · 2025',
    body: 'Every animation in Kvalt carries semantic weight. Springs for spatial motion, tweens for opacity. The MOTION_SPEED multiplier lets us scale the entire system for testing and accessibility.',
    bgColor: '#d5e5c8',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=800&fit=crop',
  },
];

export default function ModalFullscreenPage() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const story = stories[index];

  const goPrev = () => setIndex((i) => (i - 1 + stories.length) % stories.length);
  const goNext = () => setIndex((i) => (i + 1) % stories.length);

  return (
    <>
      <PageHero
        title="Modal Fullscreen"
        subtitle="viewport takeover · slide-up entry with rotation · themed background · split layout"
        description="A fullscreen overlay for rich content — media on the left, narrative on the right. Inspired by the Ancestry 'Stories of Us' gallery. Supports navigation arrows, themed backgrounds, and full keyboard control."
      />

      <TokenChips
        tokens={{
          Slots: ['Media', 'Content'],
          Props: ['open', 'onClose', 'onPrev', 'onNext', 'bgColor'],
          Keyboard: ['Escape', '← →', 'Tab trap'],
          Motion: ['slide-up 50vh', 'rotate -5°', 'fade'],
        }}
      />

      <SectionTitle>Motion</SectionTitle>
      <Card>
        <Spec>
          Entry: translateY(50vh) rotate(-5deg) → identity via spring.default · Overlay fades
          in over 480ms · Nav buttons fade in with 150ms delay · Exit: snappy reverse via ease.exit
        </Spec>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Layout</SectionTitle>
      <Card>
        <Spec>
          Desktop: 9-column grid — media cols 1–4, gap col 5, content cols 6–9 ·
          Mobile: stacked vertically, scrollable · Close: dark circle, fixed top-right ·
          Nav arrows: fixed at viewport center sides, 48px (lg: 64px) circles
        </Spec>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Demo</SectionTitle>
      <Card>
        <div className="flex flex-col gap-4">
          <p
            className="font-sans text-base font-medium"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Click to open the fullscreen gallery. Use arrow keys or nav buttons to
            navigate between stories.
          </p>
          <div className="flex gap-3">
            {stories.map((s, i) => (
              <Button
                key={s.title}
                variant={i === 0 ? 'primary' : 'secondary'}
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              >
                {i === 0 ? 'Open Gallery' : `Story ${i + 1}`}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <ModalFullscreen
        open={open}
        onClose={() => setOpen(false)}
        onPrev={goPrev}
        onNext={goNext}
        bgColor={story.bgColor}
        aria-label={story.title}
      >
        <ModalFullscreen.Media>
          <img
            src={story.image}
            alt={story.title}
            className="max-h-[70vh] w-auto rounded-lg shadow-large-2 object-cover"
          />
        </ModalFullscreen.Media>
        <ModalFullscreen.Content>
          <span
            className="font-sans text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-primary-1)' }}
          >
            {story.category}
          </span>
          <h2
            className="font-display text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {story.title}
          </h2>
          <p
            className="font-sans text-sm"
            style={{ color: 'var(--color-on-surface-2)' }}
          >
            {story.meta}
          </p>
          <p
            className="font-sans text-lg leading-relaxed"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {story.body}
          </p>
        </ModalFullscreen.Content>
      </ModalFullscreen>
    </>
  );
}
