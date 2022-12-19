import { Observable } from "rxjs";

import type { MidiMessage } from "./types";

export type MidiObservable = Observable<MidiMessage>;

export function midiObservable(input: WebMidi.MIDIInput): Observable<Uint8Array> {
  return new Observable<Uint8Array>((subscriber) => {
    input.addEventListener("statechange", handleStateChange);
    input.addEventListener("midimessage", handleMidiMessage);

    function handleMidiMessage(event: WebMidi.MIDIMessageEvent): void {
      subscriber.next(event.data);
    }

    function handleStateChange(event: WebMidi.MIDIConnectionEvent): void {
      switch (event.port.connection) {
        case "open":
          input.addEventListener("midimessage", handleMidiMessage);
          break;
        case "closed":
          cleanup();
          subscriber.complete();
          break;
        case "pending":
          break;
      }
    }

    function cleanup() {
      input.removeEventListener("statechange", handleStateChange as EventListener);
      input.removeEventListener("midimessage", handleMidiMessage as EventListener);
    }

    return function unsubscribe() {
      cleanup();
    };
  });
}
