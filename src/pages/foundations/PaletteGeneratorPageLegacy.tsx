/**
 * PaletteGeneratorPage — OKLCH palette builder with interactive chroma curve.
 */

import { useReducer, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../components/Button';
import { ContentSwitcher, ContentSwitcherItem } from '../../components/ContentSwitcher';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { ColorInput } from '../../components/palette-generator/ColorInput';
import { ChromaCurveEditor } from '../../components/palette-generator/ChromaCurveEditor';
import { PaletteSwatches } from '../../components/palette-generator/PaletteSwatches';
import { ExportPanel } from '../../components/palette-generator/ExportPanel';
import { STEP_KEYS } from '../../components/palette-generator/types';
import type { PaletteStep, PaletteState } from '../../components/palette-generator/types';
import {
  DEFAULT_LIGHTNESS,
  generateGamutRelativeCurve,
  maxChromaForLH,
  oklchToCss,
  oklchToHex,
  CHROMA_PRESETS,
} from '../../lib/oklch';
import type { OklchColor } from '../../lib/oklch';

// ─── State ───────────────────────────────────────────────────────────────────

function buildSteps(hue: number, chromaCurve: number[]): PaletteStep[] {
  return STEP_KEYS.map((key, i) => {
    const l = DEFAULT_LIGHTNESS[i];
    const max = maxChromaForLH(l, hue);
    return { key, l, c: Math.min(chromaCurve[i], max), h: hue };
  });
}

type Action =
  | { type: 'SET_BASE_COLOR'; color: OklchColor }
  | { type: 'SET_STEP_CHROMA'; stepIndex: number; chroma: number }
  | { type: 'RESET_CURVE' }
  | { type: 'APPLY_PRESET'; name: string; percentage: number; shape?: readonly number[] };

interface FullState extends PaletteState {
  activePreset: string | null; // preset name, null = custom
  isDirty: boolean;            // true after any manual chroma drag
}

function reducer(state: FullState, action: Action): FullState {
  switch (action.type) {
    case 'SET_BASE_COLOR': {
      const hue = action.color.h;
      const preset = CHROMA_PRESETS.find(p => p.name === state.activePreset) ?? CHROMA_PRESETS[1];
      const curve = generateGamutRelativeCurve(hue, preset.percentage, preset.shape);
      return { ...state, hue, steps: buildSteps(hue, curve), isDirty: true };
    }
    case 'SET_STEP_CHROMA': {
      const steps = state.steps.map((s, i) =>
        i === action.stepIndex ? { ...s, c: action.chroma } : s,
      );
      return { ...state, steps, activePreset: null, isDirty: true };
    }
    case 'RESET_CURVE': {
      const curve = generateGamutRelativeCurve(state.hue, 0.55);
      return { ...state, steps: buildSteps(state.hue, curve), activePreset: 'Balanced', isDirty: false };
    }
    case 'APPLY_PRESET': {
      const curve = generateGamutRelativeCurve(state.hue, action.percentage, action.shape);
      return { ...state, steps: buildSteps(state.hue, curve), activePreset: action.name, isDirty: true };
    }
    default:
      return state;
  }
}

// Default: Kvalt primary green
const INITIAL_HUE = 145.9;

function createInitialState(): FullState {
  const curve = generateGamutRelativeCurve(INITIAL_HUE, 0.55);
  return { hue: INITIAL_HUE, steps: buildSteps(INITIAL_HUE, curve), activePreset: 'Balanced', isDirty: false };
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface PaletteGeneratorPageProps {
  /** Called when user clicks Close — only shown when provided (modal mode) */
  onClose?: () => void;
  /** 'new' shows "Create Palette" with name field, 'edit' shows "Save Changes" */
  mode?: 'new' | 'edit';
  /** Palette name being edited (edit mode) */
  editPaletteName?: string;
  /** Called whenever dirty state changes — use to update the close button label */
  onDirtyChange?: (isDirty: boolean) => void;
  /** Called whenever palette steps change — use for live preview */
  onStepsChange?: (steps: PaletteStep[]) => void;
}

export default function PaletteGeneratorPage({ onClose, mode = 'new', editPaletteName, onDirtyChange, onStepsChange }: PaletteGeneratorPageProps = {}) {
  // editPaletteName is part of the API but not currently used
  void editPaletteName;
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  useEffect(() => {
    onDirtyChange?.(state.isDirty);
  }, [state.isDirty, onDirtyChange]);

  useEffect(() => {
    onStepsChange?.(state.steps);
  }, [state.steps, onStepsChange]);

  const handleBaseColor = useCallback((color: OklchColor) => {
    dispatch({ type: 'SET_BASE_COLOR', color });
  }, []);

  const handleChromaChange = useCallback((stepIndex: number, chroma: number) => {
    dispatch({ type: 'SET_STEP_CHROMA', stepIndex, chroma });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_CURVE' });
  }, []);

  const handleApplyPreset = useCallback((name: string, percentage: number, shape?: readonly number[]) => {
    dispatch({ type: 'APPLY_PRESET', name, percentage, shape });
  }, []);

  // Derive base color from step 300 (the "anchor" shade)
  const baseStep = state.steps[3]; // index 3 = step 300
  const baseColor: OklchColor = { l: baseStep.l, c: baseStep.c, h: baseStep.h };

  return (
    <section className="mb-24">
      <PageHero
        title="SHADES CREATOR"
        subtitle="OKLCH palette generator"
        description="Paste any color and shape the chroma curve to build a perceptually uniform 12-step palette. Drag the dots to sculpt saturation across lightness."
      />

      <div className="flex gap-8">
        {/* Left panel — controls */}
        <div className="w-1/2 min-w-0">
          <Section title="Base color" level="minor">
            <ColorInput value={baseColor} onChange={handleBaseColor} />
          </Section>

          <Section title="Chroma curve" level="minor" description="Drag dots vertically to adjust chroma per step. Dashed lines show gamut-relative presets.">
            <div
              className="p-4"
              style={{
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <ChromaCurveEditor steps={state.steps} hue={state.hue} onChromaChange={handleChromaChange} />
              <div className="flex items-center justify-end gap-3 mt-3">
                <ContentSwitcher
                  value={state.activePreset ?? undefined}
                  onChange={(name) => {
                    const preset = CHROMA_PRESETS.find(p => p.name === name);
                    if (preset) handleApplyPreset(preset.name, preset.percentage, preset.shape);
                  }}
                  size="sm"
                >
                  {CHROMA_PRESETS.map((preset) => (
                    <ContentSwitcherItem key={preset.name} value={preset.name}>
                      {preset.name}
                    </ContentSwitcherItem>
                  ))}
                </ContentSwitcher>
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  Reset curve
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Preview" level="minor">
            <div
              className="p-6"
              style={{
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <PaletteSwatches steps={state.steps} />
            </div>
          </Section>

          <Section title="Export" level="minor">
            <ExportPanel steps={state.steps} />
          </Section>
        </div>

        {/* Right panel — TBD */}
        <div className="w-1/2 min-w-0">
        </div>
      </div>

      {/* Bottom spacer so content doesn't hide behind fixed bar */}
      <div className="h-32" />

      {/* Fixed bottom bar — preview swatches + export controls (portal to escape modal transform) */}
      {createPortal(<BottomBar steps={state.steps} onClose={onClose} mode={mode} />, document.body)}
    </section>
  );
}

// ─── Bottom Bar ──────────────────────────────────────────────────────────────

function BottomBar({ steps, mode = 'new' }: { steps: PaletteStep[]; onClose?: () => void; mode?: 'new' | 'edit' }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60]"
      style={{
        backgroundColor: 'var(--color-surface-1)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-6 px-8 py-4 max-w-7xl mx-auto">
        {/* Swatches — compact strip */}
        <div className="flex gap-1 flex-1 min-w-0">
          {steps.map((step) => {
            const bg = oklchToCss(step.l, step.c, step.h);
            const hex = oklchToHex(step.l, step.c, step.h);
            return (
              <div
                key={step.key}
                className="flex-1 flex flex-col items-center gap-0.5 min-w-0"
              >
                <div
                  className="w-full aspect-[3/2] min-h-[52px]"
                  style={{
                    backgroundColor: bg,
                    borderRadius: 'var(--radius-s)',
                    border: step.l > 0.95 ? '1px solid var(--color-border)' : 'none',
                  }}
                  title={`${step.key}: ${hex}`}
                />
                <span
                  className="font-mono text-[7px] truncate"
                  style={{ color: 'var(--color-on-surface-subtle-2)' }}
                >
                  {step.key}
                </span>
              </div>
            );
          })}
        </div>

        {/* Primary action */}
        <div className="shrink-0">
          <Button variant="special-primary" size="lg">
            {mode === 'new' ? 'Create Palette' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

