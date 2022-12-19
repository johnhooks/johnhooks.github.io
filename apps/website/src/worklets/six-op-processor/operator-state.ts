import type { DXOperatorState } from "./types";

/**
 * Operator state
 */
export class OperatorState implements DXOperatorState {
  phase = 0;
  amplitude = 0;

  reset() {
    this.phase = 0;
    this.amplitude = 0;
  }
}
