export const STEP_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900] as const;
export type StepKey = (typeof STEP_KEYS)[number];

export interface PaletteStep {
  key: StepKey;
  l: number;
  c: number;
  h: number;
}

export interface PaletteState {
  hue: number;
  steps: PaletteStep[];
}
