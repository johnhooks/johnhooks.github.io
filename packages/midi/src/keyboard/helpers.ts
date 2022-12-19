import type { Octave } from "../types";

import { UpperKeyboardOrder, LowerKeyboardOrder } from "./constants";

type KeyboardKey = typeof UpperKeyboardOrder[number] | typeof LowerKeyboardOrder[number];

type MidiNoteMap = { midi: number; note: string };
type KeyboardMidiMap = { key: KeyboardKey } & MidiNoteMap;
type KeyboardMidiIndex = Map<string, KeyboardMidiMap>;

const Notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;
const MidiNotes = genMidiNotes();

// type Note = typeof Notes[number]

/**
 * Generate an array of MIDI note values for 8 octaves.
 */
export function genMidiNotes(): MidiNoteMap[] {
  // Reference: https://newt.phys.unsw.edu.au/jw/notes.html
  const list: MidiNoteMap[] = [];
  for (let octave = 0; octave < 9; octave++) {
    for (const [index, note] of Notes.entries()) {
      list.push({ note: `${note}${octave}`, midi: octave * 12 + 12 + index });
    }
  }
  return list;
}

export function getMidiRange(startNote: string, length: number): MidiNoteMap[] {
  const startIndex = MidiNotes.findIndex((value) => value.note === startNote);
  if (startIndex === -1) {
    throw new RangeError(`out of range MIDI note: ${startNote}`);
  }
  if (startIndex + length > MidiNotes.length) {
    const maxValue = MidiNotes.length - startIndex;
    throw new RangeError(`out of range slice length: ${length}, max possible value: ${maxValue} `);
  }
  return MidiNotes.slice(startIndex, startIndex + length);
}

export function genKeyboardMidiIndex(
  upperOctave: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
): KeyboardMidiIndex {
  const lowerOctave = upperOctave - 1;
  const upper = genKeyboardMidiMap(upperOctave as Octave, UpperKeyboardOrder);
  const lower = genKeyboardMidiMap(lowerOctave as Octave, LowerKeyboardOrder);
  const map: KeyboardMidiIndex = new Map();
  for (const { key, ...rest } of [...upper, ...lower]) {
    map.set(key, { key, ...rest });
  }
  return map;
}

function genKeyboardMidiMap(octave: Octave, keys: readonly KeyboardKey[]): KeyboardMidiMap[] {
  const range = getMidiRange(`C${octave}`, keys.length);
  const result: KeyboardMidiMap[] = [];
  for (const [index, midi] of range.entries()) {
    const key = keys[index];
    result.push({ key, ...midi });
  }
  return result;
}
