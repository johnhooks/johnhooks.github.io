import type { DXModulations } from "./types";

import * as DXUnits from "./dx-units";

/**
 * Low Frequency Oscillator
 */
export class Lfo {
  oneHz: number;

  phase = 0.0;
  frequency = 0.1;

  delayPhase = 0.0;
  delayIncrement = [0.1, 0.1];

  randomValue = 0.0;

  ampModDepth = 0.0;
  pitchModDepth = 0.0;

  waveform = 0;
  resetPhase = false;

  constructor(sampleRate: number) {
    this.oneHz = 1.0 / sampleRate;
  }

  set(modulations: DXModulations) {
    this.frequency = DXUnits.LFOFrequency(modulations.rate) * this.oneHz;

    this.delayIncrement = DXUnits.LFODelay(modulations.delay);
    this.delayIncrement[0] *= this.oneHz;
    this.delayIncrement[1] *= this.oneHz;

    this.waveform = modulations.waveform;
    this.resetPhase = modulations.resetPhase;

    this.ampModDepth = modulations.ampModDepth * 0.01;
    const pitchMS = DXUnits.pitchModSensitivity(modulations.pitchModSensitivity);
    this.pitchModDepth = modulations.pitchModDepth * 0.01 * pitchMS;
  }

  reset() {
    if (this.resetPhase) {
      this.phase = 0.0;
    }
    this.delayPhase = 0.0;
  }

  step(scale: number) {
    this.phase += scale * this.frequency;
    this.delayPhase += scale * this.delayIncrement[this.delayPhase < 0.5 ? 0 : 1];

    if (this.phase >= 1.0) {
      this.phase -= 1.0;
      this.randomValue = Math.random();
    }

    if (this.delayPhase >= 1.0) {
      this.delayPhase = 1.0;
    }

    const value = this.rawValue();
    const ramp = this.delayPhase < 0.5 ? 0.0 : (this.delayPhase - 0.5) * 2.0;

    return {
      pitchMod: (value - 0.5) * ramp * this.pitchModDepth,
      ampMod: (1.0 - value) * ramp * this.ampModDepth,
    };
  }

  rawValue() {
    switch (this.waveform) {
      case 0:
        return 2.0 * (this.phase < 0.5 ? 0.5 - this.phase : this.phase - 0.5);

      case 1:
        return 1.0 - this.phase;

      case 2:
        return this.phase;

      case 3:
        return this.phase < 0.5 ? 0.0 : 1.0;

      case 4:
        return 0.5 + 0.5 * Math.sin(Math.PI * (2.0 * this.phase + 1.0));

      case 5:
        return this.randomValue;
    }
    return 0.0;
  }
}
