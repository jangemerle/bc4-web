/**
 * PaletteGeneratorPage — stepped OKLCH palette builder.
 *
 * Step 0: Title, description, base color
 * Step 1: Chroma curve + presets
 * Step 2: Export
 *
 * Navigation (prev/next) is handled by the parent via ModalFullscreen arrows.
 */

import { useReducer, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../../components/Button';
import { ContentSwitcher, ContentSwitcherItem } from '../../components/ContentSwitcher';
import { Section } from '../../layouts/Section';
import { ColorInput } from '../../components/palette-generator/ColorInput';
import { ChromaCurveEditor } from '../../components/palette-generator/ChromaCurveEditor';
import { PaletteSwatches } from '../../components/palette-generator/PaletteSwatches';
import { ExportPanel } from '../../components/palette-generator/ExportPanel';
import { STEP_KEYS } from '../../components/palette-generator/types';
import type { PaletteStep, PaletteState } from '../../components/palette-generator/types';
import { spring } from '../../tokens/motion';
import {
  DEFAULT_LIGHTNESS,
  generateGamutRelativeCurve,
  maxChromaForLH,
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
  activePreset: string | null;
  isDirty: boolean;
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

const INITIAL_HUE = 145.9;

function createInitialState(): FullState {
  const curve = generateGamutRelativeCurve(INITIAL_HUE, 0.55);
  return { hue: INITIAL_HUE, steps: buildSteps(INITIAL_HUE, curve), activePreset: 'Balanced', isDirty: false };
}

// ─── Step labels ────────────────────────────────────────────────────────────

const STEP_LABELS = ['Color', 'Curve', 'Export'];
export const TOTAL_STEPS = 3;

// ─── Page ───────────────────────────────────────────────────────────────────

export interface PaletteGeneratorPageProps {
  /** Current step (0-based), controlled by parent */
  step: number;
  /** Called whenever dirty state changes */
  onDirtyChange?: (isDirty: boolean) => void;
  /** Called whenever palette steps change — for live preview */
  onStepsChange?: (steps: PaletteStep[]) => void;
}

export default function PaletteGeneratorPage({ step, onDirtyChange, onStepsChange }: PaletteGeneratorPageProps) {
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

  const baseStep = state.steps[3]; // index 3 = step 300
  const baseColor: OklchColor = { l: baseStep.l, c: baseStep.c, h: baseStep.h };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-12">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            {i > 0 && (
              <div
                className="w-8 h-px"
                style={{ backgroundColor: i <= step ? 'var(--color-on-surface)' : 'var(--color-border)' }}
              />
            )}
            <span
              className="font-mono text-xs font-medium uppercase tracking-[0.1em]"
              style={{
                color: i === step ? 'var(--color-on-surface)' : 'var(--color-on-surface-subtle-2)',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={spring.snappy}
          >
            <h1
              className="font-brand font-bold leading-[0.95] mb-4"
              style={{ fontSize: 'clamp(48px, 6vw, 80px)', color: 'var(--color-on-surface)' }}
            >
              NEW PALETTE
            </h1>
            <p
              className="font-sans text-lg mb-10"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Start from any color. We'll generate a perceptually uniform 12-step scale.
            </p>

            <div className="flex flex-col gap-8">
              <Section title="Base color" level="minor">
                <ColorInput value={baseColor} onChange={handleBaseColor} />
              </Section>

              {/* Live swatch preview */}
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
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={spring.snappy}
          >
            <h1
              className="font-brand font-bold leading-[0.95] mb-4"
              style={{ fontSize: 'clamp(48px, 6vw, 80px)', color: 'var(--color-on-surface)' }}
            >
              SHAPE IT
            </h1>
            <p
              className="font-sans text-lg mb-10"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Drag the dots to sculpt saturation across lightness, or pick a preset.
            </p>

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

            {/* Live preview */}
            <div className="mt-6">
              <PaletteSwatches steps={state.steps} />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={spring.snappy}
          >
            <h1
              className="font-brand font-bold leading-[0.95] mb-4"
              style={{ fontSize: 'clamp(48px, 6vw, 80px)', color: 'var(--color-on-surface)' }}
            >
              EXPORT
            </h1>
            <p
              className="font-sans text-lg mb-10"
              style={{ color: 'var(--color-on-surface-subtle-1)' }}
            >
              Copy as TypeScript tokens or CSS variables, ready to drop into your project.
            </p>

            <ExportPanel steps={state.steps} />

            {/* Final swatch row */}
            <div className="mt-8">
              <PaletteSwatches steps={state.steps} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
