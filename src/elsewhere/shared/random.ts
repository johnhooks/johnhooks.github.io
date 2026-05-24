export function hashString(input: string) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createRandom(seed: string) {
  let state = hashString(seed) || 1;

  return function random() {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickBySeed<T>(items: readonly T[], seed: string) {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty list.");
  }

  const random = createRandom(seed);
  return items[Math.floor(random() * items.length)];
}
