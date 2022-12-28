import type { Channel } from "./midi/types";

import { Decoder } from "./midi/decode";

export class SynthState extends Decoder {
  #gate = 0;
  #note = 60;
  #pitchBend = 0x2000;
  #velocity = 64 / 127;
  #channel: Channel;

  constructor(channel: Channel = 0) {
    super();
    this.#channel = channel;
  }

  get value() {
    return {
      gate: this.#gate,
      note: this.#note,
      pitchBend: this.#pitchBend,
      velocity: this.#velocity,
    };
  }

  noteOn(channel: Channel, note: number, velocity: number): void {
    if (this.#channel === channel) {
      console.log("note on");
      this.#note = note;
      this.#gate = 1.0;
      this.#velocity = velocity / 127; // normalized
    }
  }

  noteOff(channel: Channel, note: number): void {
    if (this.#channel === channel && this.#note === note) {
      console.log("note off");
      this.#gate = 0.0;
    }
  }

  polyphonicAfterTouch(): void {
    // not yet implemented
  }

  controlChange(): void {
    // not yet implemented
  }

  programChange(): void {
    // not yet implemented
  }

  channelPressure(): void {
    // not yet implemented
  }

  pitchBend(channel: Channel, value: number): void {
    if (this.#channel === channel) {
      this.#pitchBend = value;
    }
  }

  allSoundOff(channel: Channel): void {
    if (this.#channel === channel) {
      this.#gate = 0;
    }
  }

  allNotesOff(channel: Channel): void {
    if (this.#channel === channel) {
      this.#gate = 0;
    }
  }
}
