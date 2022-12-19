import type { EnvelopeState } from "../types";
import type { DXPitchEnvelope } from "./types";

import * as DXUnits from "./dx-units";
import { Envelope } from "./envelope";

export class PitchEnvelope extends Envelope implements DXPitchEnvelope {
  constructor(scale: number) {
    super(scale, 4);
  }

  set(params: EnvelopeState /* globalLevel: number */) {
    for (let i = 0; i < this.numStages; i++) {
      this.level[i] = DXUnits.pitchEnvelopeLevel(params.level[i]);
    }

    // Configure increments.
    for (let i = 0; i < this.numStages; i++) {
      const from = this.level[(i - 1 + this.numStages) % this.numStages];
      const to = this.level[i];
      let increment = DXUnits.pitchEnvelopeIncrement(params.rate[i]);
      if (from != to) {
        increment *= 1.0 / Math.abs(from - to);
      } else if (i != this.numStages - 1) {
        increment = 0.2;
      }
      this.increment[i] = increment * this.scale;
    }
  }
}
