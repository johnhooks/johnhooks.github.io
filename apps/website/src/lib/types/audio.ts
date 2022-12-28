export type AudioParams = {
  gate: number;
  note: number;
  velocity: number;
  brightness: number;
  envelope: number;
};

export type AudioParamsKey = keyof AudioParams;
