import type { EnvelopeState } from "../types";
import type { DXOperatorEnvelope } from "./types";

import * as DXUnits from "./dx-units";
import { Envelope } from "./envelope";

export class OperatorEnvelope extends Envelope implements DXOperatorEnvelope {
  constructor(scale: number) {
    super(scale, 4);
  }

  set(params: EnvelopeState, globalLevel: number) {
    for (let i = 0; i < this.numStages; i++) {
      let levelScaled = DXUnits.operatorLevel(params.level[i]);
      levelScaled = (levelScaled & ~1) + globalLevel - 133;
      this.level[i] = 0.125 * (levelScaled < 1 ? 0.5 : levelScaled);
    }

    for (let i = 0; i < this.numStages; i++) {
      let increment = DXUnits.operatorEnvelopeIncrement(params.rate[i]);
      let from = this.level[(i - 1 + this.numStages) % this.numStages];
      let to = this.level[i];

      if (from === to) {
        // Quirk: for plateaux, the increment is scaled.
        increment *= 0.6;
        if (i === 0 && !params.level[i]) {
          // Quirk: the attack plateau is faster.
          increment *= 20.0;
        }
      } else if (from < to) {
        from = Math.max(6.7, from);
        to = Math.max(6.7, to);
        if (from === to) {
          // Quirk: because of the jump, the attack might disappear.
          increment = 1.0;
        } else {
          // Quirk: because of the weird shape, the rate is adjusted.
          increment *= 7.2 / (to - from);
        }
      } else {
        increment *= 1.0 / (from - to);
      }
      this.increment[i] = increment * this.scale;
    }
    this.reshapeAscendingSegments = true;
  }
}
