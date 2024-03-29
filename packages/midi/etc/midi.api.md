## API Report File for "@bitmachina/midi"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="webmidi" />

import { BaseActionObject } from 'xstate';
import { Observable } from '@bitmachina/reactive';
import { ResolveTypegenMeta } from 'xstate';
import { ServiceMap } from 'xstate';
import { StateMachine } from 'xstate';
import { TypegenDisabled } from 'xstate';

// Warning: (ae-forgotten-export) The symbol "Channel" needs to be exported by the entry point index.d.ts
//
// @public
export function encodeAllSoundOff(channel: Channel): Uint8Array;

// Warning: (ae-forgotten-export) The symbol "MidiPortInterface" needs to be exported by the entry point index.d.ts
//
// @public
export abstract class MidiDecoder implements MidiPortInterface<void> {
    // (undocumented)
    abstract allNotesOff(channel: Channel): void;
    // (undocumented)
    abstract allSoundOff(channel: Channel): void;
    // (undocumented)
    abstract channelPressure(channel: Channel, value: number): void;
    // (undocumented)
    abstract controlChange(channel: Channel, controller: number, value: number): void;
    // (undocumented)
    decode(message: Uint8Array): void;
    // (undocumented)
    abstract noteOff(channel: Channel, note: number, velocity?: number): void;
    // (undocumented)
    abstract noteOn(channel: Channel, note: number, velocity: number): void;
    // (undocumented)
    abstract pitchBend(channel: Channel, value: number): void;
    // (undocumented)
    abstract polyphonicAfterTouch(channel: Channel, note: number, value: number): void;
    // (undocumented)
    abstract programChange(channel: Channel, patchIndex: number): void;
}

// @public
export class MidiEncoder implements MidiPortInterface<Uint8Array> {
    // (undocumented)
    allNotesOff(channel: Channel): Uint8Array;
    // (undocumented)
    allSoundOff(channel: Channel): Uint8Array;
    // (undocumented)
    channelPressure(channel: Channel, value: number): Uint8Array;
    // (undocumented)
    controlChange(channel: Channel, controller: number, value: number): Uint8Array;
    // (undocumented)
    noteOff(channel: Channel, note: number): Uint8Array;
    // (undocumented)
    noteOn(channel: Channel, note: number, velocity: number): Uint8Array;
    // (undocumented)
    pitchBend(channel: Channel, value: number): Uint8Array;
    // (undocumented)
    polyphonicAfterTouch(channel: Channel, note: number, value: number): Uint8Array;
    // (undocumented)
    programChange(channel: Channel, patchIndex: number): Uint8Array;
}

// @public
export class MidiKeyboard extends Observable<Uint8Array> {
    // Warning: (ae-forgotten-export) The symbol "Octave" needs to be exported by the entry point index.d.ts
    constructor(channel?: Channel, octave?: Octave);
    // (undocumented)
    handleKeyEvent: (event: KeyboardEvent) => void;
    // (undocumented)
    register(): void;
    // (undocumented)
    unregister(): void;
}

// Warning: (ae-forgotten-export) The symbol "Context" needs to be exported by the entry point index.d.ts
// Warning: (ae-forgotten-export) The symbol "MidiEvent" needs to be exported by the entry point index.d.ts
// Warning: (ae-forgotten-export) The symbol "MidiTypestate" needs to be exported by the entry point index.d.ts
//
// @public
export const midiMachine: StateMachine<Context, any, MidiEvent, MidiTypestate, BaseActionObject, ServiceMap, ResolveTypegenMeta<TypegenDisabled, MidiEvent, BaseActionObject, ServiceMap>>;

// (No @packageDocumentation comment for this package)

```
