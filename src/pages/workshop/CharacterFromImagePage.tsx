/**
 * CharacterFromImagePage — drop an image, get a Kvalt CharacterSeed.
 *
 * Pipeline lives in src/utils/extractCharacterFromImage.ts. This page is the
 * UI shell: drop zone, preview, extracted palette, and a copy-paste seed.
 */

import { useCallback, useRef, useState } from 'react';
import { Upload, Copy, Check } from 'lucide-react';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { Button } from '../../components/Button';
import { ContentSwitcher, ContentSwitcherItem } from '../../components/ContentSwitcher';
import {
  extractCharacterFromImage,
  toSeedSnippet,
  type CharacterFromImageResult,
  type ExtractedColor,
} from '../../utils/extractCharacterFromImage';

type GreyFrom = 'primary' | 'secondary' | 'neutral';

export default function CharacterFromImagePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<CharacterFromImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [greyFrom, setGreyFrom] = useState<GreyFrom>('primary');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (src: string) => {
    setLoading(true);
    setError(null);
    try {
      // extract-colors needs an HTMLImageElement to read pixels in-browser.
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      const extraction = await extractCharacterFromImage(img);
      setResult(extraction);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Extraction failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please drop an image file.');
        return;
      }
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      void processImage(url);
    },
    [processImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const snippet = result
    ? toSeedSnippet(result, {
        name: 'from-image',
        displayName: 'From Image',
        greyFrom,
      })
    : '';

  const copySnippet = async () => {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <PageHero
        title="Character from image"
        subtitle="Drop a reference. Get a CharacterSeed."
        description="Uses extract-colors + culori (OKLCH + ΔE2000) to find two visually distinct brand colors, suggest a grey hue, and emit a ready-to-paste character seed. Runs fully in the browser, no API calls."
      />

      <Section title="Drop a reference image" description="Editorial illustration, photo, moodboard — anything with a clear palette.">
        <label
          htmlFor="character-image-input"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="block rounded-lg border-2 border-dashed cursor-pointer transition-colors"
          style={{
            borderColor: 'var(--color-border-strong)',
            backgroundColor: 'var(--color-surface-1)',
            minHeight: imageUrl ? undefined : 240,
          }}
        >
          <input
            ref={fileInputRef}
            id="character-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="sr-only"
          />
          {imageUrl ? (
            <div className="p-4">
              <img
                src={imageUrl}
                alt="Reference"
                className="max-h-[420px] mx-auto rounded"
                style={{ display: 'block' }}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-3 p-8">
              <Upload size={32} style={{ color: 'var(--color-on-surface-subtle-1)' }} />
              <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
                Drop an image here, or click to browse
              </p>
              <p className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
                png · jpg · webp · svg
              </p>
            </div>
          )}
        </label>
      </Section>

      {loading && (
        <Section title="Extracting…" description="Running OKLCH clustering + ΔE2000 distance check.">
          <div
            className="rounded-lg px-6 py-8 font-mono text-sm"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              color: 'var(--color-on-surface-subtle-1)',
            }}
          >
            Analysing pixels…
          </div>
        </Section>
      )}

      {error && (
        <Section title="Something went wrong" description="Try a different image.">
          <div
            className="rounded-lg px-6 py-4 font-mono text-sm"
            style={{
              backgroundColor: 'var(--color-danger-secondary-1)',
              color: 'var(--color-on-danger-secondary)',
              border: '1px solid var(--color-danger-1)',
            }}
          >
            {error}
          </div>
        </Section>
      )}

      {result && !loading && (
        <>
          <Section
            title="Two distinctive colors"
            description="Primary = highest chroma × area. Secondary = furthest by ΔE2000."
          >
            <div className="grid grid-cols-2 gap-4">
              <ColorCard label="Primary" color={result.primary} />
              <ColorCard label="Secondary" color={result.secondary} />
            </div>
          </Section>

          <Section
            title="Grey hue"
            description="The surface palette tint. Pick from primary or secondary."
          >
            <div className="mb-4">
              <ContentSwitcher
                value={greyFrom}
                onChange={(id) => setGreyFrom(id as GreyFrom)}
              >
                <ContentSwitcherItem value="primary">
                  {`Primary (${result.primary.hue}°)`}
                </ContentSwitcherItem>
                <ContentSwitcherItem value="secondary">
                  {`Secondary (${result.secondary.hue}°)`}
                </ContentSwitcherItem>
                <ContentSwitcherItem value="neutral">
                  {`Neutral median (${result.suggestedGreyHue}°)`}
                </ContentSwitcherItem>
              </ContentSwitcher>
            </div>
            <p
              className="font-sans text-sm max-w-[640px]"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              The &quot;two distinctive colors&quot; workflow picks either primary or secondary. The
              neutral option uses the median hue of the image&apos;s low-chroma pool — available
              as an escape hatch when neither brand hue feels right.
            </p>
          </Section>

          <Section title="Candidate pool" description="All chromatic candidates extracted from the image, sorted by chroma × area.">
            <div className="flex flex-wrap gap-2">
              {result.chromaticPool.map((c, i) => (
                <Swatch key={c.hex + i} color={c} />
              ))}
              {result.neutralPool.length > 0 && (
                <>
                  <div
                    className="w-px mx-2"
                    style={{ backgroundColor: 'var(--color-border)' }}
                  />
                  {result.neutralPool.map((c, i) => (
                    <Swatch key={c.hex + 'n' + i} color={c} muted />
                  ))}
                </>
              )}
            </div>
          </Section>

          <Section title="CharacterSeed" description="Copy-paste into src/characters/characters.ts.">
            <div className="relative">
              <pre
                className="font-mono text-sm p-5 rounded-lg overflow-x-auto"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {snippet}
              </pre>
              <div className="absolute top-3 right-3">
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft={copied ? Check : Copy}
                  onClick={copySnippet}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </Section>
        </>
      )}
    </>
  );
}

// ─── Swatch + ColorCard ───────────────────────────────────────────────────────

function Swatch({ color, muted = false }: { color: ExtractedColor; muted?: boolean }) {
  return (
    <div
      title={`${color.hex} · hue ${color.hue} · chroma ${color.chroma.toFixed(3)} · area ${(color.area * 100).toFixed(1)}%`}
      className="rounded-m flex flex-col items-center gap-1 p-2"
      style={{
        opacity: muted ? 0.6 : 1,
      }}
    >
      <div
        className="rounded-m"
        style={{
          width: 48,
          height: 48,
          backgroundColor: color.hex,
          border: '1px solid var(--color-border)',
        }}
      />
      <span
        className="font-mono text-[10px]"
        style={{ color: 'var(--color-on-surface-subtle-2)' }}
      >
        {color.hex}
      </span>
    </div>
  );
}

function ColorCard({ label, color }: { label: string; color: ExtractedColor }) {
  return (
    <div
      className="rounded-lg p-5 flex gap-5"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div
        className="rounded-lg shrink-0"
        style={{
          width: 96,
          height: 96,
          backgroundColor: color.hex,
          border: '1px solid var(--color-border)',
        }}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <span
          className="font-mono text-[11px] tracking-wider uppercase"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          {label}
        </span>
        <span
          className="font-display font-semibold text-headline-s"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {color.hex}
        </span>
        <div
          className="font-mono text-xs flex flex-col gap-0.5"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          <span>hue · {color.hue}°</span>
          <span>chroma · {color.chroma.toFixed(3)}</span>
          <span>lightness · {color.lightness.toFixed(3)}</span>
          <span>area · {(color.area * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
