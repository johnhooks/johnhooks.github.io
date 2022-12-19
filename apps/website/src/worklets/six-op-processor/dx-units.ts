/**
 * DX7 static helpers
 * @module
 */

import type { DXKeyboardScaling, DXOperator } from "./types";

const lutCoarse = [
  -12.0, 0.0, 12.0, 19.01955, 24.0, 27.863137, 31.01955, 33.688259, 36.0, 38.0391, 39.863137,
  41.51318, 43.01955, 44.405276, 45.688259, 46.882687, 48.0, 49.049554, 50.0391, 50.97513,
  51.863137, 52.707809, 53.51318, 54.282743, 55.01955, 55.726274, 56.405276, 57.05865, 57.688259,
  58.295772, 58.882687, 59.450356,
];

const lutAmpModSensitivity = [0.0, 0.2588, 0.4274, 1.0];

const lutPitchModSensitivity = [
  0.0, 0.078125, 0.15625, 0.2578125, 0.4296875, 0.71875, 1.1953125, 2.0,
];

const minLFOFrequency = 0.005865;

export function operatorLevel(level: number) {
  let tlc = level;
  if (level < 20) {
    tlc = tlc < 15 ? (tlc * (36 - tlc)) >> 3 : 27 + tlc;
  } else {
    tlc += 28;
  }
  return tlc;
}

export function pitchEnvelopeLevel(level: number) {
  const l = (level - 50.0) / 32.0;
  const tail = Math.max(Math.abs(l + 0.02) - 1.0, 0.0);
  return l * (1.0 + tail * tail * 5.3056);
}

export function operatorEnvelopeIncrement(rate: number) {
  const rateScaled = (rate * 41) >> 6;
  const mantissa = 4 + (rateScaled & 3);
  const exponent = 2 + (rateScaled >> 2);
  return (mantissa << exponent) / (1 << 24);
}

export function pitchEnvelopeIncrement(rate: number) {
  const r = rate * 0.01;
  return (1.0 + 192.0 * r * (r * r * r * r + 0.3333)) / (21.3 * 44100.0);
}

export const LFOFrequency = function (rate: number) {
  let rateScaled = rate === 0 ? 1 : (rate * 165) >> 6;
  rateScaled *= rateScaled < 160 ? 11 : 11 + ((rateScaled - 160) >> 4);
  return rateScaled * minLFOFrequency;
};

export function LFODelay(delay: number) {
  const increments = [0.0, 0.0];
  if (delay === 0) {
    increments[0] = increments[1] = 100000.0;
  } else {
    let d = 99 - delay;
    d = (16 + (d & 15)) << (1 + (d >> 4));
    increments[0] = d * minLFOFrequency;
    increments[1] = Math.max(0x80, d & 0xff80) * minLFOFrequency;
  }
  return increments;
}

export function normalizeVelocity(velocity: number) {
  return 16.0 * (Math.pow(velocity, 1 / 3.0) - 0.918);
}

export function rateScaling(note: number, rateScaling: number) {
  return Math.pow(2.0, rateScaling * (note * 0.333 - 7.0) * 0.03125);
}

/**
 * @param ampMS - Index lutAmpModSensitivity[0|1|2|3]
 */
export function ampModSensitivity(ampMS: number) {
  return lutAmpModSensitivity[ampMS];
}

/**
 * @param ampMS - Index lutPitchModSensitivity[0|1|2|3|4|5|6|7]
 */
export function pitchModSensitivity(pitchMS: number) {
  return lutPitchModSensitivity[pitchMS];
}

export function keyboardScaling(note: number, ks: DXKeyboardScaling) {
  const x = note - ks.breakpoint - 15.0;
  const curve = x > 0.0 ? ks.rightCurve : ks.leftCurve;

  let t = Math.abs(x);
  if (curve === 1 || curve === 2) {
    t = Math.min(t * 0.010467, 1.0);
    t = t * t * t;
    t *= 96.0;
  }
  if (curve < 2) {
    t = -t;
  }

  const depth = x > 0.0 ? ks.rightDepth : ks.leftDepth;
  return t * depth * 0.02677;
}

export function frequencyRatio(op: DXOperator) {
  const detune = op.mode === 0 && op.fine ? 1.0 + 0.01 * op.fine : 1.0;

  let base = op.mode === 0 ? lutCoarse[op.coarse] : ((op.coarse & 3) * 100 + op.fine) * 0.39864;
  base += (op.detune - 7.0) * 0.015;
  return Math.pow(2, base / 12.0) * detune;
}
