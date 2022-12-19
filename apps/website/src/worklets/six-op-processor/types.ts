import type { EnvelopeState } from "../types";

/**
 * Algorithm is a tuple of `Operator` or empty objects.
 */
export type DXAlgorithm = Array<DXAlgorithmOperator | Record<string, never>>;

export type DXAlgorithmOperator = {
  readonly n: number;
  readonly renderFn: DXRenderer;
  readonly input: number;
  readonly output: number;
};

/**
 * `SixOpProcessor` worklet AudioParam type.
 */
export type AudioParams = {
  readonly gate: Float32Array;
  readonly note: Float32Array;
  readonly velocity: Float32Array;
  readonly envelopeControl: Float32Array;
  readonly brightness: Float32Array;
};

export interface DXEnvelope {
  numStages: number;
  scale: number;
  stage: number;
  phase: number;
  start: number;

  increment: Float32Array;
  level: Float32Array;

  reshapeAscendingSegments: boolean;

  render(gate: boolean, rate: number, adScale: number, rScale: number): number;

  value(): number;
}

export interface DXPitchEnvelope extends DXEnvelope {
  set(params: EnvelopeState): void;
}

export interface DXOperatorEnvelope extends DXEnvelope {
  set(params: EnvelopeState, globalLevel: number): void;
}

export type DXKeyboardScaling = {
  readonly breakpoint: number;
  readonly leftDepth: number;
  readonly rightDepth: number;
  readonly leftCurve: number;
  readonly rightCurve: number;
};

export type DXModulations = {
  readonly rate: number;
  readonly delay: number;
  readonly pitchModDepth: number;
  readonly ampModDepth: number;
  readonly resetPhase: boolean;
  readonly waveform: number;
  readonly pitchModSensitivity: number;
};

export interface DXOperator {
  readonly envelope: EnvelopeState;
  readonly keyboardScaling: DXKeyboardScaling;
  readonly rateScaling: number;
  readonly ampModSensitivity: number;
  readonly velocitySensitivity: number;
  readonly level: number;
  readonly mode: number;
  readonly coarse: number;
  readonly fine: number;
  readonly detune: number;
}

export interface DXPatch {
  readonly op: DXOperator[];

  readonly pitchEnvelope: EnvelopeState;

  readonly algorithm: number;
  readonly feedback: number;
  readonly resetPhase: boolean;

  readonly modulations: DXModulations;

  readonly transpose: number;
  readonly name: string;
}

/**
 * Operator state
 */
export interface DXOperatorState {
  phase: number;
  amplitude: number;

  reset(): void;
}

/**
 * Algorithm render function
 */
export type DXRenderer = (
  ops: DXOperatorState[],
  f: Float32Array,
  a: Float32Array,
  fbState: [number, number],
  fbAmount: number,
  modulation: Float32Array,
  out: Float32Array
) => void;

/**
 * Variable voice parameters
 */
export type DXVoiceParams = {
  readonly gate: boolean;
  readonly note: number;
  readonly velocity: number;
  readonly envelopeControl: number;
  readonly brightness: number;
  readonly pitchMod: number;
  readonly ampMod: number;
};
