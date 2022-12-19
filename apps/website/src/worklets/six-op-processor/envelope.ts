import type { DXEnvelope } from "./types";

/**
 * Base envelope class
 */
export class Envelope implements DXEnvelope {
  numStages: number;
  scale: number;
  stage: number;
  phase = 1.0;
  start = 0.0;

  increment: Float32Array;
  level: Float32Array;

  reshapeAscendingSegments = false;

  constructor(scale: number, numStages: number) {
    this.numStages = numStages;
    this.scale = scale;
    this.stage = this.numStages - 1;
    this.phase = 1.0;
    this.start = 0.0;

    this.increment = new Float32Array(numStages);
    this.level = new Float32Array(numStages);

    for (let i = 0; i < this.numStages; i++) {
      this.increment[i] = 0.001;
      this.level[i] = 1.0 / (1 << i);
    }
    this.level[this.numStages - 1] = 0.0;
  }

  render(gate: boolean, rate: number, adScale: number, rScale: number): number {
    if (gate) {
      if (this.stage === this.numStages - 1) {
        this.start = this.value();
        this.stage = 0;
        this.phase = 0.0;
      }
    } else {
      if (this.stage != this.numStages - 1) {
        this.start = this.value();
        this.stage = this.numStages - 1;
        this.phase = 0.0;
      }
    }
    const scale = this.stage === this.numStages - 1 ? rScale : adScale;
    this.phase += this.increment[this.stage] * rate * scale;
    if (this.phase >= 1.0) {
      if (this.stage >= this.numStages - 2) {
        this.phase = 1.0;
      } else {
        this.phase = 0.0;
        ++this.stage;
      }
      this.start = -100.0;
    }

    return this.value();
  }

  value() {
    let from =
      this.start === -100.0
        ? this.level[(this.stage - 1 + this.numStages) % this.numStages]
        : this.start;
    let to = this.level[this.stage];

    let phase = this.phase;
    if (this.reshapeAscendingSegments && from < to) {
      from = Math.max(6.7, from);
      to = Math.max(6.7, to);
      phase *= (2.5 - phase) * 0.666667;
    }

    return phase * (to - from) + from;
  }
}
