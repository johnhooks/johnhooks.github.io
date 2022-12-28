import { CHANNEL_MASK } from "./constants";
import {
  StatusByte,
  CCModeValues,
  type MidiPortInterface,
  type MidiStatus,
  type Channel,
} from "./types";

export class MidiEncoder implements MidiPortInterface<Uint8Array> {
  /**
   * Current status of the encoder.
   *
   * Useful for outputting a running status.
   */
  #status: number | null = null;

  noteOn(channel: Channel, note: number, velocity: number): Uint8Array {
    const status = (StatusByte.NoteOn << 4) | channel;
    if (status === this.#status) {
      return encode(note, velocity);
    } else {
      this.#status = status;
      return encode(StatusByte.NoteOn, channel, note, velocity);
    }
  }

  noteOff(channel: Channel, note: number): Uint8Array {
    const runningStatus = (StatusByte.NoteOn << 4) | channel;
    if (this.#status === runningStatus) {
      return encode(note, 0);
    } else {
      return encode(StatusByte.NoteOff, channel, note, 0);
    }
  }

  polyphonicAfterTouch(channel: Channel, note: number, value: number): Uint8Array {
    return encode(StatusByte.AfterTouch, channel, note, value);
  }

  controlChange(channel: Channel, controller: number, value: number): Uint8Array {
    return encode(StatusByte.CC, channel, controller, value);
  }

  programChange(channel: Channel, patchIndex: number): Uint8Array {
    return encode(StatusByte.ProgramChange, channel, patchIndex);
  }

  // The single greatest pressure value (of all the current depressed keys).
  channelPressure(channel: Channel, value: number): Uint8Array {
    return encode(StatusByte.ChannelPressure, channel, value);
  }

  // The pitch bender is measured by a fourteen bit value. Center (no pitch change) is 2000H. Sensitivity is a function of the receiver, but may be set using RPN 0. (lllllll) are the least significant 7 bits. (mmmmmmm) are the most significant 7 bits.
  pitchBend(channel: Channel, value: number): Uint8Array {
    return encodePitchBend(channel, value);
  }

  // Channel Modes

  allSoundOff(channel: Channel): Uint8Array {
    return encodeAllSoundOff(channel);
  }

  allNotesOff(channel: Channel): Uint8Array {
    return encode(StatusByte.CC, channel, CCModeValues.AllNotesOff, 0);
  }
}

/**
 * Clamp `value` to an unsigned 7 bit integer.
 */
export function u7(value: number): number {
  return Math.max(0, Math.min(127, value)) || 0;
}

/**
 * Clamp `value` to an unsigned 14 bit integer.
 */
export function u14(value: number): number {
  return Math.max(0, Math.min(16383, value)) || 0;
}

export function encodeAllSoundOff(channel: Channel) {
  return encode(StatusByte.CC, channel, CCModeValues.AllSoundOff, 0);
}
/**
 * Encode pitch bend MIDI message.
 *
 * @param channel - The MIDI channel of the message.
 * @param value - The pitch bend value. Clamped to u14.
 */
function encodePitchBend(channel: Channel, value: number): Uint8Array {
  const clamped = u14(value);
  const message = new Uint8Array(3);
  message[0] = (StatusByte.PitchBend << 4) | (channel & CHANNEL_MASK);
  // lsb
  message[1] = clamped & 0x7f;
  // msb
  message[2] = (clamped >> 7) & 0x7f;
  return message;
}

/**
 * Encode Midi message.
 */
function encode(...data: [number, number]): Uint8Array;
function encode(status: MidiStatus, channel: Channel, ...data: [number]): Uint8Array;
function encode(status: MidiStatus, channel: Channel, ...data: [number, number]): Uint8Array;
function encode(...data: number[]): Uint8Array {
  if (data.length === 2) {
    return new Uint8Array([u7(data[0]), u7(data[1])]);
  } else {
    return new Uint8Array([(data[0] << 4) | u7(data[1]), ...data.slice(2).map(u7)]);
  }
}
