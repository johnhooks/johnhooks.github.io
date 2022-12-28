export type Vec4<T> = [T, T, T, T];

export type EnvelopeState = {
  readonly rate: Vec4<number>;
  readonly level: Vec4<number>;
};
