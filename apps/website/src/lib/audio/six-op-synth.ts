import { SynthEngine } from "./synth-engine";
import { AudioWorklet } from "./audio-worklet";
import { SAMPLE_RATE } from "./constants";

export type Param = "gate" | "note" | "velocity" | "brightness" | "envelope";

/**
 * Interface to interact with the six operator synth worklet.
 */
export class SixOpSynth extends SynthEngine<Param> {
  constructor(context: AudioContext, source: AudioWorklet<Param>) {
    super(context, source);
    this.source.updateParam("gate", 0.0);
  }

  static async create() {
    const context = new window.AudioContext({ sampleRate: SAMPLE_RATE });
    const worklet = await AudioWorklet.create<Param>({
      context,
      name: "six_op_processor",
      url: "/worklets/six_op_processor.js",
    });
    if (!worklet) throw new Error("Error unable to loading synth worklet");
    return new SixOpSynth(context, worklet);
  }

  /**
   * Update a single worklet parameters.
   */
  updateParam(key: Param, value: number): void {
    this.source.updateParam(key, value);
  }

  setPatch(patch: Uint8Array) {
    this.source.postMessage(["setPatch", Array.from(patch)]);
  }
}
