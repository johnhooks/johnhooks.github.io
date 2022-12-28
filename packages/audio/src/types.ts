/**
 * Audio Worklet Parameters Type
 *
 * @public
 */
export type AudioParams<Key extends string> = Record<Key, number>;

/**
 * `AudioWorklet` Constructor Arguments.
 *
 * @public
 */
export type AudioWorkletConstructorArgs = {
  name: string;
  url: string;
  worklet: AudioWorkletNode;
};
