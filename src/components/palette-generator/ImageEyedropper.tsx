/**
 * ImageEyedropper — drop a reference image, click to pick a pixel's color.
 *
 * Used inside PaletteGeneratorV3 so the user can eyedropper a base color for
 * any palette (primary, secondary, grey, success, warning, danger) straight
 * from a moodboard or illustration instead of fumbling with hex codes.
 *
 * How it works:
 *   1. Image drops into a <canvas> (same pixel dims as the source).
 *   2. Mouse hover shows a floating lens with the hovered pixel colour.
 *   3. Click samples the pixel via `getImageData(x, y, 1, 1)` and emits
 *      { hex, oklch } via onPick.
 *
 * The parent (PaletteGeneratorV3) pipes the picked OKLCH straight into its
 * existing SET_BASE_COLOR flow so the palette regenerates instantly.
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { Upload, X, Pipette } from 'lucide-react';
import { Button } from '../Button';
import { hexToOklch, type OklchColor } from '../../lib/oklch';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EyedropperPick {
  hex: string;
  oklch: OklchColor;
  /** Pixel coordinates in the source image (for debugging / future lens zoom). */
  x: number;
  y: number;
}

interface ImageEyedropperProps {
  /** Reference image URL — parent-controlled so it persists across palette edits. */
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  /** Called when the user clicks a pixel. */
  onPick: (pick: EyedropperPick) => void;
  /** Optional label for the context of the current pick (e.g. "Primary anchor"). */
  pickingFor?: string;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ImageEyedropper({
  imageUrl,
  onImageChange,
  onPick,
  pickingFor,
}: ImageEyedropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);
  const [lensColor, setLensColor] = useState<string | null>(null);

  // Load image into the canvas whenever the URL changes.
  // No `loaded` state — the canvas draws synchronously inside onload, and
  // the parent controls visibility of this component, so there's nothing
  // React needs to react to.
  useEffect(() => {
    if (!imageUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      // Cap canvas size for perf — most reference images won't exceed 1600 wide.
      const MAX = 1600;
      const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageUrl;
    return () => { cancelled = true; };
  }, [imageUrl]);

  const pickAt = useCallback(
    (clientX: number, clientY: number): EyedropperPick | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.round((clientX - rect.left) * scaleX);
      const y = Math.round((clientY - rect.top) * scaleY);

      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;

      const data = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(data[0], data[1], data[2]);
      const oklch = hexToOklch(hex);
      return { hex, oklch, x, y };
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pick = pickAt(e.clientX, e.clientY);
      if (!pick) {
        setLensPos(null);
        setLensColor(null);
        return;
      }
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setLensPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setLensColor(pick.hex);
    },
    [pickAt],
  );

  const handleMouseLeave = useCallback(() => {
    setLensPos(null);
    setLensColor(null);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pick = pickAt(e.clientX, e.clientY);
      if (pick) onPick(pick);
    },
    [pickAt, onPick],
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      onImageChange(url);
    },
    [onImageChange],
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

  // ─── Empty state ────────────────────────────────────────────────────────────
  if (!imageUrl) {
    return (
      <label
        htmlFor="palette-eyedropper-input"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="block rounded-lg border-2 border-dashed cursor-pointer"
        style={{
          borderColor: 'var(--color-border-strong)',
          backgroundColor: 'var(--color-surface-1)',
          minHeight: 180,
        }}
      >
        <input
          id="palette-eyedropper-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="sr-only"
        />
        <div className="h-full flex flex-col items-center justify-center gap-2 p-8 min-h-[180px]">
          <Upload size={28} style={{ color: 'var(--color-on-surface-subtle-1)' }} />
          <p className="font-sans text-base" style={{ color: 'var(--color-on-surface)' }}>
            Drop a reference image
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
            Then click any pixel to set the anchor colour
          </p>
        </div>
      </label>
    );
  }

  // ─── Loaded state — canvas + lens + clear button ────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="relative rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{
            display: 'block',
            margin: '0 auto',
            // Let intrinsic buffer dims drive size; clamp via max-width AND
            // max-height so aspect ratio is preserved (otherwise portrait
            // images get stretched, which breaks pickAt's rect → pixel math).
            maxWidth: '100%',
            maxHeight: 420,
            width: 'auto',
            height: 'auto',
            cursor: 'crosshair',
          }}
        />
        {/* Lens — a floating swatch that tracks the cursor */}
        {lensPos && lensColor && (
          <div
            className="pointer-events-none absolute flex items-center gap-2 rounded-m px-2 py-1 font-mono text-[11px]"
            style={{
              left: lensPos.x + 16,
              top: lensPos.y + 16,
              backgroundColor: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-on-surface)',
              boxShadow: 'var(--shadow-small-2)',
              zIndex: 10,
            }}
          >
            <span
              className="rounded-s"
              style={{
                width: 16,
                height: 16,
                backgroundColor: lensColor,
                border: '1px solid var(--color-border)',
              }}
            />
            {lensColor}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-2 font-mono text-xs"
          style={{ color: 'var(--color-on-surface-subtle-1)' }}
        >
          <Pipette size={14} />
          {pickingFor
            ? `Click to set ${pickingFor}`
            : 'Click any pixel to set the anchor colour'}
        </div>
        <Button
          variant="secondary"
          size="sm"
          iconLeft={X}
          onClick={() => onImageChange(null)}
        >
          Remove image
        </Button>
      </div>
    </div>
  );
}
