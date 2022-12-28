import { writable } from "svelte/store";

import type { PatchBank } from "$lib/audio/patch-bank";

function createPatchBanks() {
  const { subscribe, set, update } = writable<PatchBank[]>([]);

  return {
    subscribe,

    add: (bank: PatchBank) =>
      update((banks) => {
        return [...banks, bank];
      }),

    remove: (name: string) => {
      update((banks) => {
        return banks.filter(({ name: current }) => name !== current);
      });
    },

    reset: () => {
      set([]);
    },
  };
}

export const patchBanks = createPatchBanks();
