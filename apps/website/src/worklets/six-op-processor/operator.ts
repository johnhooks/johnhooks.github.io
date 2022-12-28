import type { EnvelopeState, Vec4 } from "../types";
import type { DXKeyboardScaling, DXOperator } from "./types";

/**
 * DX7 operator
 */
export class Operator implements DXOperator {
  readonly envelope: EnvelopeState = {
    rate: Array(4) as Vec4<number>,
    level: Array(4) as Vec4<number>,
  };

  readonly keyboardScaling: DXKeyboardScaling;
  readonly rateScaling: number;
  readonly ampModSensitivity: number;
  readonly velocitySensitivity: number;
  readonly level: number;
  readonly mode: number;
  readonly coarse: number;
  readonly fine: number;
  readonly detune: number;

  constructor(opData: Uint8Array) {
    for (let i = 0; i < 4; i++) {
      this.envelope.rate[i] = Math.min(opData[i] & 0x7f, 99);
      this.envelope.level[i] = Math.min(opData[4 + i] & 0x7f, 99);
    }
    this.keyboardScaling = {
      breakpoint: Math.min(opData[8] & 0x7f, 99),
      leftDepth: Math.min(opData[9] & 0x7f, 99),
      rightDepth: Math.min(opData[10] & 0x7f, 99),
      leftCurve: opData[11] & 0x3,
      rightCurve: (opData[11] >>> 2) & 0x3,
    };
    this.rateScaling = opData[12] & 0x7;
    this.ampModSensitivity = opData[13] & 0x3;
    this.velocitySensitivity = (opData[13] >>> 2) & 0x7;
    this.level = Math.min(opData[14] & 0x7f, 99);
    this.mode = opData[15] & 0x1;
    this.coarse = (opData[15] >>> 1) & 0x1f;
    this.fine = Math.min(opData[16] & 0x7f, 99);
    this.detune = Math.min((opData[12] >>> 3) & 0xf, 14);
  }
}
