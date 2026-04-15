import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, Clock3 } from 'lucide-react';
import { Container } from '@/marketing/primitives/Container';
import { EyebrowLabel } from '@/marketing/primitives/EyebrowLabel';
import { SectionHeading } from '@/marketing/primitives/SectionHeading';
import { Button } from '@/components/Button';
import type { HomeContent } from '@/content/types';

interface ProductVideoProps {
  content: HomeContent['productVideo'];
}

/**
 * ProductVideo — dedikovaná video-showcase sekce pro homepage.
 *
 * Chování:
 *  - Click-to-play (ne autoplay) — respect B2B UX, LCP budget
 *  - Poster + play button overlay → po kliku video začne hrát s controls
 *  - Chapter markers pod videem pro skimmers
 *  - Mini CTA hned po sekci
 *  - Graceful placeholder když videoSrc není nastaveno
 *
 * YouTube/Vimeo URL detekce:
 *  - URL začínající na https:// → embed přes <iframe>
 *  - Jinak → native <video> s src
 */
export function ProductVideo({ content }: ProductVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasVideo = Boolean(content.videoSrc);
  const isEmbed = hasVideo && content.videoSrc!.startsWith('http');

  const handlePlay = () => {
    setPlaying(true);
    // Ruční play — některé prohlížeče vyžadují user gesture
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {
        // Silent catch — user gesture už trigger playing=true, native controls to dořeší
      });
    });
  };

  return (
    <section
      className="bg-[var(--color-surface-2)] py-20 sm:py-28"
      aria-labelledby="product-video-headline"
    >
      <Container width="wide">
        {/* Headline stack */}
        <div className="mb-10 max-w-3xl flex flex-col gap-3 sm:mb-14">
          {content.eyebrow && <EyebrowLabel>{content.eyebrow}</EyebrowLabel>}
          <SectionHeading size="xl" id="product-video-headline" subheadline={content.subheadline}>
            {content.headline}
          </SectionHeading>
        </div>

        {/* Video player card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-m border border-[var(--color-border)] bg-[var(--color-inverted-surface)] shadow-2xl aspect-video"
        >
          {!hasVideo ? (
            <VideoPlaceholder poster={content.posterSrc} alt={content.alt} />
          ) : isEmbed ? (
            // YouTube/Vimeo embed — direct iframe, vlastní play overlay neexistuje
            <iframe
              src={content.videoSrc}
              title={content.alt}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <>
              {/* Native video */}
              <video
                ref={videoRef}
                src={content.videoSrc}
                poster={content.posterSrc}
                controls={playing}
                preload="metadata"
                playsInline
                aria-label={content.alt}
                className="absolute inset-0 h-full w-full object-cover"
                onEnded={() => setPlaying(false)}
              />

              {/* Play button overlay — zmizí po kliknutí */}
              <AnimatePresence>
                {!playing && (
                  <motion.button
                    type="button"
                    onClick={handlePlay}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/10 backdrop-blur-[1px] transition hover:bg-black/0"
                    aria-label={`Spustit video: ${content.alt}`}
                  >
                    {/* Play circle — s pulsujícím ring */}
                    <span className="relative inline-flex items-center justify-center">
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-[var(--color-primary-1)]"
                        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-1)] text-[var(--color-on-primary)] shadow-2xl transition group-hover:scale-105">
                        <Play className="h-8 w-8 translate-x-0.5 fill-current" aria-hidden="true" />
                      </span>
                    </span>

                    {/* Duration badge — bottom right */}
                    {content.duration && (
                      <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-s bg-[var(--color-inverted-surface)]/80 px-2.5 py-1 text-xs font-semibold text-[var(--color-on-inverted-surface)] backdrop-blur">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />
                        {content.duration}
                      </span>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>

        {/* Chapter markers — pro skimmers kteří nepustí video */}
        {content.chapters.length > 0 && (
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6"
          >
            {content.chapters.map((chapter, i) => (
              <motion.li
                key={chapter.title}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="font-mono text-xs font-bold tracking-wider text-[var(--color-on-secondary-1)]"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {chapter.timestamp && (
                    <span className="text-xs font-mono text-[var(--color-on-surface-subtle-2)]">
                      {chapter.timestamp}
                    </span>
                  )}
                </div>
                <h3
                  className="font-display text-base font-bold text-[var(--color-on-surface)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {chapter.title}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-subtle-1)]">
                  {chapter.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        )}

        {/* Inline CTA po videu */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 sm:mt-14">
          <p className="text-base text-[var(--color-on-surface-subtle-1)]">
            Líbí se vám, jak to běží? Ukážeme ho na vašem případu.
          </p>
          <Link to={content.cta.href}>
            <Button variant="primary" size="md" iconRight={ArrowRight}>
              {content.cta.label}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function VideoPlaceholder({ poster, alt }: { poster: string; alt: string }) {
  const hasPoster = poster && !poster.startsWith('/product/agent-panel-hero'); // generic path = placeholder

  return (
    <div
      className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-secondary-1)] via-[var(--color-surface-2)] to-[var(--color-secondary-2)]"
      role="img"
      aria-label={alt}
    >
      {hasPoster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          loading="lazy"
          aria-hidden="true"
        />
      )}
      {/* Play ikonka v kruhu uprostřed — identický s reálným video play stavem */}
      <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-1)] text-[var(--color-on-primary)] shadow-2xl">
        <Play className="h-8 w-8 translate-x-0.5 fill-current" aria-hidden="true" />
      </span>
    </div>
  );
}
