import { CHANNEL_MASK, DATA_MASK } from "./constants.js";
import type { MidiPortInterface } from "./types.js";
import { CCModeValues, StatusByte, type Channel } from "./types.js";

/**
 * MIDI Decoder Abstract Class.
 *
 * The intent is to directly call the abstract methods, rather than create an over elaborate
 * MIDI event system.
 * @public
 */
export abstract class MidiDecoder implements MidiPortInterface<void> {
  /**
   * Current status byte of the decoder.
   *
   * Useful for receiving a running status.
   * Initial status will not match any status nibbles.
   */
  #status = 0;

  decode(message: Uint8Array) {
    const byte = message[0];
    const runningStatus = byte >> 7 === 0;
    this.#status = runningStatus ? this.#status : byte;
    const status = this.#status >> 4;
    const channel = (this.#status & CHANNEL_MASK) as Channel;
    const data = runningStatus ? message : message.slice(1);

    switch (status) {
      case StatusByte.NoteOn: {
        const note = data[0];
        const velocity = data[1];
        if (runningStatus && velocity === 0) {
          this.noteOff(channel, note);
        } else {
          this.noteOn(channel, note, velocity);
        }
        break;
      }
      case StatusByte.NoteOff: {
        // Ignore velocity of note off message.
        this.noteOff(channel, data[0], 0);
        break;
      }
      case StatusByte.CC: {
        const controller = data[0] & DATA_MASK;
        if (controller < 120) {
          this.controlChange(channel, controller, data[1]);
        } else {
          switch (controller) {
            case CCModeValues.AllSoundOff: {
              this.allSoundOff(channel);
              break;
            }
            case CCModeValues.AllNotesOff: {
              this.allNotesOff(channel);
              break;
            }
            default: {
              // Unimplemented MIDI Messages
              return;
            }
          }
        }
        break;
      }
      case StatusByte.PitchBend: {
        const lsb = data[0] & DATA_MASK;
        const msb = data[1] & DATA_MASK;
        // little-endian order, contrasting with the default big-endian order of Standard Midi Files
        const value = (msb << 7) | lsb;
        this.pitchBend(channel, value);
        break;
      }
      default: {
        // Unimplemented MIDI Messages
        return;
      }
    }
  }

  abstract noteOn(channel: Channel, note: number, velocity: number): void;

  abstract noteOff(channel: Channel, note: number, velocity?: number): void;

  abstract polyphonicAfterTouch(channel: Channel, note: number, value: number): void;

  abstract controlChange(channel: Channel, controller: number, value: number): void;

  abstract programChange(channel: Channel, patchIndex: number): void;

  abstract channelPressure(channel: Channel, value: number): void;

  abstract pitchBend(channel: Channel, value: number): void;

  abstract allSoundOff(channel: Channel): void;

  abstract allNotesOff(channel: Channel): void;
}
