/**
 * PaletteBuilder — self-contained OKLCH palette editor.
 *
 * Owns its own reducer (base color, chroma curve, preset, dirty state) and
 * renders the four working sections of the Shade Lab: Base color, Chroma
 * curve, Preview, Export. No page chrome — the parent provides the hero,
 * hints, image eyedropper, save button, and confirm modal.
 *
 * Two ways to drive it externally:
 *   1. `initialSteps` / `editPaletteName` — set initial state at mount
 *   2. Imperative ref with `setBaseColor(oklch)` — used by the eyedropper
 *      or by the multi-palette Character Builder to route image picks into
 *      a specific builder instance.
 *
 * Parent observes current state via `onStepsChange` + `onDirtyChange`.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useReducer,
  useState,
} from 'react';
import { ContentSwitcher, ContentSwitcherItem } from '../ContentSwitcher';
import { Button } from '../Button';
import { Section } from '../../layouts/Section';
import { ColorInput } from './ColorInput';
import { ChromaCurveEditor } from './ChromaCurveEditor';
import { PaletteSwatches } from './PaletteSwatches';
import { ExportPanel } from './ExportPanel';
import { STEP_KEYS, type PaletteStep, type PaletteState } from './types';
import {
  DEFAULT_LIGHTNESS,
  generateGamutRelativeCurve,
  maxChromaForLH,
  CHROMA_PRESETS,
} from '../../lib/oklch';
import type { OklchColor } from '../../lib/oklch';
import { palette } from '../../tokens/colors';

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildSteps(hue: number, chromaCurve: number[]): PaletteStep[] {
  return STEP_KEYS.map((key, i) => {
    const l = DEFAULT_LIGHTNESS[i];
    const max = maxChromaForLH(l, hue);
    return { key, l, c: Math.min(chromaCurve[i], max), h: hue };
  });
}

// ─── Reducer ────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_BASE_COLOR'; color: OklchColor }
  | { type: 'SET_STEP_CHROMA'; stepIndex: number; chroma: number }
  | { type: 'RESET_CURVE' }
  | { type: 'APPLY_PRESET'; name: string; percentage: number; shape?: readonly number[] }
  | { type: 'MARK_CLEAN' };

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
    case 'MARK_CLEAN':
      return { ...state, isDirty: false };
    default:
      return state;
  }
}

const INITIAL_HUE = 145.9;

function createInitialState(): FullState {
  const curve = generateGamutRelativeCurve(INITIAL_HUE, 0.55);
  return { hue: INITIAL_HUE, steps: buildSteps(INITIAL_HUE, curve), activePreset: 'Balanced', isDirty: false };
}

function createInitialStateFromPalette(paletteName: string): FullState {
  const p = palette[paletteName as keyof typeof palette];
  if (!p) return createInitialState();

  const firstVal = Object.values(p)[0] as string;
  const firstMatch = firstVal.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  const hue = firstMatch ? parseFloat(firstMatch[3]) : INITIAL_HUE;

  const steps: PaletteStep[] = STEP_KEYS.map((key) => {
    const oklchStr = (p as Record<number, string>)[key];
    const m = oklchStr?.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    return {
      key,
      l: m ? parseFloat(m[1]) : DEFAULT_LIGHTNESS[STEP_KEYS.indexOf(key)],
      c: m ? parseFloat(m[2]) : 0,
      h: hue,
    };
  });

  return { hue, steps, activePreset: null, isDirty: false };
}

// ─── Public types ───────────────────────────────────────────────────────────

export interface PaletteBuilderProps {
  /** Initialize from an existing DS palette name (grey, primary, etc.). */
  editPaletteName?: string;
  /** Initialize from provided steps (for custom palettes). */
  initialSteps?: PaletteStep[];
  /** Observe step changes — runs on every curve/base-color edit. */
  onStepsChange?: (steps: PaletteStep[]) => void;
  /** Observe dirty state. */
  onDirtyChange?: (isDirty: boolean) => void;
  /** Observe the raw picked color (from eyedropper / color picker). */
  onRawColorChange?: (color: OklchColor | null) => void;
  /** Hide the Export section — useful in multi-builder contexts. */
  hideExport?: boolean;
  /** Hide the Preview section — useful when parent renders its own preview. */
  hidePreview?: boolean;
  /** Hide the built-in Base color section — parent is rendering its own root UI. */
  hideBaseColor?: boolean;
}

export interface PaletteBuilderHandle {
  /** Set the anchor color — typically called by the image eyedropper. */
  setBaseColor: (color: OklchColor) => void;
  /** Read the current steps — used by parent save buttons. */
  getSteps: () => PaletteStep[];
  /** Mark the builder as clean after an external save. */
  markClean: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const PaletteBuilder = forwardRef<PaletteBuilderHandle, PaletteBuilderProps>(
  (
    {
      editPaletteName,
      initialSteps,
      onStepsChange,
      onDirtyChange,
      onRawColorChange,
      hideExport = false,
      hidePreview = false,
      hideBaseColor = false,
    },
    ref,
  ) => {
    const [rawColor, setRawColor] = useState<OklchColor | null>(null);
    const [state, dispatch] = useReducer(
      reducer,
      undefined,
      () => {
        if (initialSteps) {
          const hue = initialSteps[3]?.h ?? INITIAL_HUE;
          return { hue, steps: initialSteps, activePreset: null, isDirty: false };
        }
        if (editPaletteName) return createInitialStateFromPalette(editPaletteName);
        return createInitialState();
      },
    );

    // ── External callbacks ──────────────────────────────────────────────────
    useEffect(() => {
      onStepsChange?.(state.steps);
    }, [state.steps, onStepsChange]);

    useEffect(() => {
      onDirtyChange?.(state.isDirty);
    }, [state.isDirty, onDirtyChange]);

    useEffect(() => {
      onRawColorChange?.(rawColor);
    }, [rawColor, onRawColorChange]);

    // ── Imperative handle ───────────────────────────────────────────────────
    useImperativeHandle(
      ref,
      () => ({
        setBaseColor: (color) => {
          setRawColor(color);
          dispatch({ type: 'SET_BASE_COLOR', color });
        },
        getSteps: () => state.steps,
        markClean: () => dispatch({ type: 'MARK_CLEAN' }),
      }),
      [state.steps],
    );

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleBaseColor = useCallback((color: OklchColor) => {
      setRawColor(color);
      dispatch({ type: 'SET_BASE_COLOR', color });
    }, []);

    const handleChromaChange = useCallback((stepIndex: number, chroma: number) => {
      dispatch({ type: 'SET_STEP_CHROMA', stepIndex, chroma });
    }, []);

    const handleReset = useCallback(() => {
      dispatch({ type: 'RESET_CURVE' });
    }, []);

    const handleApplyPreset = useCallback(
      (name: string, percentage: number, shape?: readonly number[]) => {
        dispatch({ type: 'APPLY_PRESET', name, percentage, shape });
      },
      [],
    );

    // ── Derived display color ───────────────────────────────────────────────
    const baseStep = state.steps[3];
    const closestStep = rawColor
      ? state.steps.reduce(
          (best, s) =>
            Math.abs(s.l - rawColor.l) < Math.abs(best.l - rawColor.l) ? s : best,
          state.steps[0],
        )
      : baseStep;
    const displayColor: OklchColor = { l: closestStep.l, c: closestStep.c, h: closestStep.h };

    return (
      <>
        {!hideBaseColor && (
          <Section title="Base color" level="minor">
            <ColorInput
              value={displayColor}
              onChange={handleBaseColor}
              rawColor={rawColor ?? undefined}
              systemStepKey={rawColor ? closestStep.key : undefined}
            />
          </Section>
        )}

        <Section title="Chroma curve" level="minor">
          <div
            className="p-4"
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <ChromaCurveEditor
              steps={state.steps}
              hue={state.hue}
              onChromaChange={handleChromaChange}
            />
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

        {!hidePreview && (
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
        )}

        {!hideExport && (
          <Section title="Export" level="minor">
            <ExportPanel steps={state.steps} />
          </Section>
        )}
      </>
    );
  },
);
PaletteBuilder.displayName = 'PaletteBuilder';
