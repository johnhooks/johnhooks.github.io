/**
 * Copyright 2022 Emilie Gillet and John Hooks.
 *
 * Authors: Emilie Gillet (emilie.o.gillet@gmail.com) and John Hooks (bitmachina@outlook.com)
 *
 * @license
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * See http://creativecommons.org/licenses/MIT/ for more information.
 *
 * -----------------------------------------------------------------------------
 *
 * DX7-compatible six op FM synth.
 * Conversion from DX7 patch values to usable units.
 */

import type { AudioParams, DXVoiceParams } from "./types";

import * as Algorithms from "./algorithms";
import { Lfo } from "./lfo";
import { Patch } from "./patch";
import { Voice } from "./voice";

/**
 * DX7 compatible six op FM synth.
 */
class SixOpProcessor extends AudioWorkletProcessor {
  voice: Voice;
  lfo: Lfo;

  running = true;
  gate = false;
  retrigger = false;

  constructor() {
    super();
    this.voice = new Voice(Algorithms.dx7, 48000.0);
    this.lfo = new Lfo(48000.0);

    this.port.onmessage = (event) => {
      if (event.data[0] === "stop") {
        this.running = false;
      } else if (event.data[0] === "setPatch") {
        const patch = new Patch(event.data[1]);
        this.voice.setPatch(patch);
        this.lfo.set(patch.modulations);
        this.retrigger = true;
      }
    };
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][], parameters: AudioParams) {
    const output = outputs[0];

    const numChannels = output.length;
    const size = output[0].length;

    const modulations = this.lfo.step(size);

    const voiceParams: DXVoiceParams = {
      gate: parameters["gate"][0] > 0.5 && !this.retrigger,
      note: parameters["note"][0],
      velocity: parameters["velocity"][0],
      envelopeControl: parameters["envelopeControl"][0],
      brightness: parameters["brightness"][0],
      pitchMod: modulations.pitchMod,
      ampMod: modulations.ampMod,
    };

    if (voiceParams.gate && !this.gate) {
      this.lfo.reset();
    }
    this.gate = voiceParams.gate;
    this.retrigger = false;

    const out = new Float32Array(size);
    this.voice.render(voiceParams, out);

    for (let i = 0; i < size; ++i) {
      for (let j = 0; j < numChannels; ++j) {
        output[j][i] = out[i] * 0.125;
      }
    }

    return this.running;
  }

  static get parameterDescriptors() {
    return [
      {
        name: "gate",
        defaultValue: 0.0,
        minValue: 0.0,
        maxValue: 1.0,
        automationRate: "k-rate",
      },
      {
        name: "note",
        defaultValue: 60.0,
        minValue: 0.0,
        maxValue: 127.0,
        automationRate: "k-rate",
      },
      {
        name: "velocity",
        defaultValue: 0.8,
        minValue: 0.0,
        maxValue: 1.0,
        automationRate: "k-rate",
      },
      {
        name: "envelopeControl",
        defaultValue: 0.5,
        minValue: 0.0,
        maxValue: 1.0,
        automationRate: "k-rate",
      },
      {
        name: "brightness",
        defaultValue: 0.5,
        minValue: 0.0,
        maxValue: 1.0,
        automationRate: "k-rate",
      },
    ];
  }
}

registerProcessor("six-op-processor", SixOpProcessor);
