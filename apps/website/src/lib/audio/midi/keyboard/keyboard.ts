import type { Channel } from "../types";
import { Observable } from "$lib/observable";
import { MidiEncoder, encodeAllSoundOff } from "../encode";
import { genKeyboardMidiIndex } from "./helpers";

type Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// TODO Add `Shift` modifier to hold
// TODO Add arpeggiator
// TODO Add tempo
// TODO Add polyphonic mode
// TODO Index keypresses and revert to previous key when one is released in mono mode

/**
 * MIDI Computer Keyboard Controller Interface.
 */
export class MidiKeyboard extends Observable<Uint8Array> {
  #keyboardMidiIndex: ReturnType<typeof genKeyboardMidiIndex>;

  #encoder = new MidiEncoder();
  #down = new Map<string, boolean>();

  #outputChannel: Channel = 0;
  #octave: Octave;

  constructor(channel: Channel = 0, octave: Octave = 4) {
    super(encodeAllSoundOff(channel));
    this.#outputChannel = channel;
    this.#octave = octave;
    this.#keyboardMidiIndex = genKeyboardMidiIndex(this.#octave);
  }

  handleKeyEvent = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return; // Do nothing if event already handled
    }

    const keyMap = this.#keyboardMidiIndex.get(event.code);

    if (keyMap) {
      const { midi: note } = keyMap;
      if (event.type === "keydown") {
        const down = Array.from(this.#down.entries())
          .filter(([, value]) => value)
          .map(([key]) => key);

        if (down.length > 0) console.log(down.join(" ").replaceAll("Key", ""));

        if (this.#down.get(event.code)) {
          // key already depressed
          return;
        } else {
          this.#down.set(event.code, true);
          // `velocity` is 64, the default for devices that are not velocity sensitive.
          this.next(this.#encoder.noteOn(this.#outputChannel, note, 64));
        }
      } else if (event.type === "keyup") {
        console.log("key up");
        this.#down.set(event.code, false);
        this.next(this.#encoder.noteOff(this.#outputChannel, note));
      }
    }

    switch (event.code) {
      case "Backquote": {
        this.#shiftOctave(-1);
        break;
      }
      case "Digit1": {
        this.#shiftOctave(1);
        break;
      }
    }
  };

  register() {
    if (typeof document !== "undefined") {
      window.addEventListener("keydown", this.handleKeyEvent);
      window.addEventListener("keyup", this.handleKeyEvent);
    }
  }

  unregister() {
    if (typeof document !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyEvent);
      window.removeEventListener("keyup", this.handleKeyEvent);
    }
  }

  #shiftOctave(direction: -1 | 1): void {
    if ((direction === -1 && this.#octave === 1) || (direction === 1 && this.#octave === 7)) return;
    this.#octave = (this.#octave + direction) as Octave;
    this.#keyboardMidiIndex = genKeyboardMidiIndex(this.#octave);
  }
}
