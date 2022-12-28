import type { AudioWorklet } from "./audio-worklet";

export class SynthEngine<Param extends string> {
  protected context: AudioContext;
  protected source: AudioWorklet<Param>;

  constructor(context: AudioContext, source: AudioWorklet<Param>) {
    this.context = context;
    this.source = source;
  }

  play() {
    this.source.connect(this.context.destination);
  }

  stop() {
    this.source.disconnect(this.context.destination);
    this.source.postMessage(["stop"]);
  }

  transferMidi(message: Uint8Array) {
    this.source.transfer(message);
  }
}
