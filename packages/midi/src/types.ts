// Status byte values that indicate the different midi notes
export const StatusByte = {
  NoteOff: 0x8,
  NoteOn: 0x9,
  AfterTouch: 0xa,
  CC: 0xb,
  ProgramChange: 0xc,
  ChannelPressure: 0xd,
  PitchBend: 0xe,
} as const;

// CC values that indicate special CC Modes.
export const CCModeValues = {
  AllSoundOff: 120,
  ResetAll: 121,
  LocalController: 122,
  AllNotesOff: 123,
  OmniOff: 124,
  OmniOn: 125,
  MonoOn: 126,
  PloyOn: 127,
} as const;

type ValueOf<T> = T[keyof T];

export type MidiStatus = ValueOf<typeof StatusByte>;

export type Octave = 0 | 1 | 2 | 4 | 5 | 6 | 7 | 8;

export type Channel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type MidiNoteStatus = typeof StatusByte.NoteOn | typeof StatusByte.NoteOff;

type BaseMidiMessage = {
  status: MidiStatus;
};

export type MidiControlChangeMessage = {
  status: typeof StatusByte.CC;
  controller: number;
  value: number;
} & BaseMidiMessage;

export type AllSoundOff = {
  status: typeof StatusByte.CC;
} & BaseMidiMessage;

export type MidiNoteMessage = {
  status: MidiNoteStatus;
  channel: number;
  note: number;
  velocity: number;
} & BaseMidiMessage;

export type MidiMessage = MidiNoteMessage | MidiControlChangeMessage | AllSoundOff;

export type AudioParamKey = "gate" | "note" | "velocity" | "brightness" | "envelope";
export type AudioParams<Key extends string> = Partial<Record<Key, number>>;

export type MidiPortInterface<TValue> = {
  noteOn(channel: Channel, note: number, velocity: number): TValue;

  noteOff(channel: Channel, note: number, velocity?: number): TValue;

  polyphonicAfterTouch(channel: Channel, note: number, value: number): TValue;

  controlChange(channel: Channel, controller: number, value: number): TValue;

  programChange(channel: Channel, patchIndex: number): TValue;

  // The single greatest pressure value (of all the current depressed keys).
  channelPressure(channel: Channel, value: number): TValue;

  // The pitch bender is measured by a fourteen bit value. Center (no pitch change) is 2000H. Sensitivity is a function of the receiver, but may be set using RPN 0. (lllllll) are the least significant 7 bits. (mmmmmmm) are the most significant 7 bits.
  pitchBend(channel: Channel, value: number): TValue;

  // Channel Modes

  allSoundOff(channel: Channel): TValue;

  allNotesOff(channel: Channel): TValue;
};

export type MidiReceiver = MidiPortInterface<void>;
