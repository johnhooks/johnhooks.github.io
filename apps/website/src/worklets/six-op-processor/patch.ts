import type { EnvelopeState, Vec4 } from "../types";
import type { DXPatch, DXModulations } from "./types";

import { Operator } from "./operator";

/**
 * DX7 patch
 */
export class Patch implements DXPatch {
  readonly op: Operator[] = Array(6) as Operator[];

  readonly pitchEnvelope: EnvelopeState = {
    rate: Array(4) as Vec4<number>,
    level: Array(4) as Vec4<number>,
  };

  readonly algorithm: number;
  readonly feedback: number;
  readonly resetPhase: boolean;

  readonly modulations: DXModulations;

  readonly transpose: number;
  readonly name: string;

  constructor(data: Uint8Array) {
    for (let i = 0; i < 6; i++) {
      const opData = data.slice(i * 17);
      this.op[i] = new Operator(opData);
    }
    for (let j = 0; j < 4; j++) {
      this.pitchEnvelope.rate[j] = Math.min(data[102 + j] & 0x7f, 99);
      this.pitchEnvelope.level[j] = Math.min(data[106 + j] & 0x7f, 99);
    }
    this.algorithm = data[110] & 0x1f;
    this.feedback = data[111] & 0x7;
    this.resetPhase = Boolean((data[111] >>> 3) & 0x1);
    this.modulations = {
      rate: Math.min(data[112] & 0x7f, 99),
      delay: Math.min(data[113] & 0x7f, 99),
      pitchModDepth: Math.min(data[114] & 0x7f, 99),
      ampModDepth: Math.min(data[115] & 0x7f, 99),
      resetPhase: Boolean(data[116] & 0x1),
      waveform: Math.min((data[116] >>> 1) & 0x7, 5),
      pitchModSensitivity: data[116] >>> 4,
    };
    this.transpose = Math.min(data[117] & 0x7f, 48);
    this.name = String.fromCharCode(...data.slice(118, 128));
  }
}
