import type {
  DXAlgorithm,
  DXOperatorEnvelope,
  DXOperatorState,
  DXPatch,
  DXVoiceParams,
} from "./types";

import * as DXUnits from "./dx-units";
import * as Algorithms from "./algorithms";
import { OperatorEnvelope } from "./operator-envelope";
import { OperatorState } from "./operator-state";
import { PitchEnvelope } from "./pitch-envelope";

/**
 * FM voice
 */
export class Voice {
  /**
   * DX7 and DX100 algorithm are arrays of different length tuples.
   *
   * DX7 = 6; DX100 = 4;
   */
  readonly numOperators: number;
  readonly algorithms: readonly DXAlgorithm[];
  algorithm: DXAlgorithm = [];
  modulators: Set<number> = new Set();

  sampleRate: number;
  oneHz: number;
  a0: number;

  operator: DXOperatorState[];
  operatorEnvelope: DXOperatorEnvelope[];
  levelHeadroom: Float32Array;
  ratios: Float32Array;

  pitchEnvelope: PitchEnvelope;
  feedbackState: [number, number] = [0.0, 0.0];

  patch: DXPatch | null = null;
  gate = false;
  note = 48.0;

  normalizedVelocity = 10.0;

  dirty = true;

  constructor(algorithms: readonly DXAlgorithm[], sampleRate: number) {
    // Unintuitive, but its inferring the number of operators for the set of algorithms
    // from the first algorithm in the set.
    this.numOperators = algorithms[0].length;
    this.algorithms = algorithms;

    this.sampleRate = sampleRate;
    this.oneHz = 1.0 / sampleRate;
    this.a0 = 55.0 / sampleRate;

    const nativeSR = 44100.0; // Legacy sample rate.
    const envelopeScale = nativeSR * this.oneHz;

    this.operator = Array(this.numOperators);
    this.operatorEnvelope = Array(this.numOperators);
    this.levelHeadroom = new Float32Array(this.numOperators);
    this.ratios = new Float32Array(this.numOperators);

    for (let i = 0; i < this.numOperators; i++) {
      this.operator[i] = new OperatorState();
      this.operatorEnvelope[i] = new OperatorEnvelope(envelopeScale);
    }
    this.pitchEnvelope = new PitchEnvelope(envelopeScale);
  }

  setPatch(patch: DXPatch) {
    this.patch = patch;
    this.dirty = true;
  }

  setup() {
    if (!this.dirty) return false;
    this.pitchEnvelope.set((this.patch as DXPatch).pitchEnvelope);
    const patch = this.patch as DXPatch;
    for (let i = 0; i < this.numOperators; i++) {
      const op = patch.op[i];
      const level = DXUnits.operatorLevel(op.level);
      this.operatorEnvelope[i].set(op.envelope, level);
      this.levelHeadroom[i] = 127 - level;
      const sign = patch.op[i].mode === 0 ? 1.0 : -1.0;
      this.ratios[i] = sign * DXUnits.frequencyRatio(patch.op[i]);
    }
    this.algorithm = this.algorithms[patch.algorithm];
    this.modulators = Algorithms.modulators(this.algorithm);
    this.dirty = false;
    return true;
  }

  render(parameters: DXVoiceParams, out: Float32Array) {
    if (!this.patch) return;

    const size = out.length;
    const buffers = [out, new Float32Array(size), new Float32Array(size), null];
    this.setup();

    const adScale = Math.pow(2.0, (0.5 - parameters.envelopeControl) * 8.0);
    const rScale = Math.pow(2.0, -Math.abs(parameters.envelopeControl - 0.3) * 8.0);

    // Apply LFO and pitch envelope modulations.
    const pitchEnvelope = this.pitchEnvelope.render(parameters.gate, size, adScale, rScale);
    const pitchMod = pitchEnvelope + parameters.pitchMod;
    const f0 = this.a0 * 0.25 * Math.pow(2.0, (parameters.note - 9.0) / 12.0 + pitchMod);

    const noteOn = parameters.gate && !this.gate;
    this.gate = parameters.gate;
    if (noteOn) {
      this.normalizedVelocity = DXUnits.normalizeVelocity(parameters.velocity);
      this.note = parameters.note;
    }

    // Reset operator phase if a note on is detected & if the patch requires it.
    if (noteOn && this.patch.resetPhase) {
      for (let i = 0; i < this.numOperators; i++) {
        this.operator[i].phase = 0;
      }
    }

    // Compute operator frequencies and amplitudes.
    const f = new Float32Array(this.numOperators);
    const a = new Float32Array(this.numOperators);

    for (let i = 0; i < this.numOperators; i++) {
      f[i] = this.ratios[i] * (this.ratios[i] < 0.0 ? -this.oneHz : f0);

      const op = this.patch.op[i];
      const rateScaling = DXUnits.rateScaling(this.note, op.rateScaling);
      const kbScaling = DXUnits.keyboardScaling(this.note, op.keyboardScaling);
      const velocityScaling = this.normalizedVelocity * op.velocitySensitivity;
      const brightness = this.modulators.has(i) ? (parameters.brightness - 0.5) * 32.0 : 0.0;

      let level = this.operatorEnvelope[i].render(
        parameters.gate,
        size * rateScaling,
        adScale,
        rScale
      );
      level += 0.125 * Math.min(kbScaling + velocityScaling + brightness, this.levelHeadroom[i]);

      const sensitivity = DXUnits.ampModSensitivity(op.ampModSensitivity);
      const logLevelMod = sensitivity * parameters.ampMod - 1.0;
      const levelMod = 1.0 - Math.pow(2.0, 6.4 * logLevelMod);
      a[i] = Math.pow(2.0, -14.0 + level * levelMod);
    }

    for (let i = 0; i < this.numOperators; ) {
      const step = this.algorithm[i];
      step.renderFn(
        this.operator.slice(i),
        f.slice(i),
        a.slice(i),
        this.feedbackState,
        this.patch.feedback,
        buffers[step.input] as Float32Array,
        buffers[step.output] as Float32Array
      );
      i += step.n;
    }
  }
}
