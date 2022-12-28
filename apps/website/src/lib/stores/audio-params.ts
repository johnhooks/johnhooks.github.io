import { writable } from "svelte/store";

import type { AudioParams, AudioParamsKey } from "$lib/types/audio";

const defaultParams = {
  gate: 0.0,
  note: 48,
  velocity: 0.8,
  brightness: 0.5,
  envelope: 0.5,
} as const;

function createAudioParams(params: AudioParams = defaultParams) {
  const { subscribe, set, update } = writable<AudioParams>(params);

  return {
    subscribe,
    updateParam: (key: AudioParamsKey, value: string) => {
      update((params) => {
        return { ...params, [key]: parseFloat(value) };
      });
    },
    reset: () => {
      set(defaultParams);
    },
  };
}

export const audioParams = createAudioParams();
