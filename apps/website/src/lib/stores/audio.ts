import { writable } from "svelte/store";

type AudioState = {
  readonly playing: boolean;
};

function createAudio(initial: AudioState = { playing: false }) {
  const { subscribe, set, update } = writable<AudioState>();

  return {
    subscribe,
    play: () => {
      update((state) => {
        return { ...state, playing: true };
      });
    },
    stop: () => {
      update((state) => {
        return { ...state, playing: false };
      });
    },
    reset: () => {
      set(initial);
    },
  };
}

export const audio = createAudio();
