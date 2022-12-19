import type { AudioParams, AudioWorkletConstructorArgs } from "./types";

/**
 * TODO add 'processorerror' event listener
 */

/**
 * Wrap `AudioWorkletNode` to handle initialization, posting messages and passing `AudioParam`s.
 *
 * @public
 */
export class AudioWorklet<Param extends string> {
  #worklet: AudioWorkletNode;

  #name: string;
  #url: string;

  readonly connect: (destinationNode: AudioNode) => void;
  readonly disconnect: (destinationNode: AudioNode) => void;

  static readonly loaded = new Map<string, boolean>();

  constructor({ name, url, worklet }: AudioWorkletConstructorArgs) {
    this.#name = name;
    this.#url = url;
    this.#worklet = worklet;

    this.connect = this.#worklet.connect.bind(this.#worklet);
    this.disconnect = this.#worklet.disconnect.bind(this.#worklet);
  }

  /**
   * Create an initialized `AudioWorklet`.
   */
  static async create<Param extends string>({
    context,
    ...args
  }: {
    context: AudioContext;
    name: string;
    url: string;
  }): Promise<AudioWorklet<Param>> {
    const { name, url } = args;
    if (!AudioWorklet.loaded.get(name)) {
      try {
        await context.audioWorklet.addModule(url);
        AudioWorklet.loaded.set(name, true);
      } catch (error) {
        if (error instanceof DOMException) {
          if (error.name === "AbortError") {
            throw new Error(`failed to load worklet ${args.url} `);
          }
        }
        throw error;
      }
    }
    const worklet = new AudioWorkletNode(context, name);

    // TODO Remove this and add better logging
    // worklet.port.onmessage = (event) => {
    //   console.log(event.data);
    // };

    return new AudioWorklet<Param>({ worklet, ...args });
  }

  /**
   * Get a single worklet parameter.
   */
  getParam(key: Param): number {
    const audioParam = this.#worklet.parameters.get(key);
    // Expect audio parameter keys to have values.
    return audioParam?.value as number;
  }

  /**
   * Update a single worklet parameters.
   */
  updateParam(key: Param, value: number): void {
    const audioParam = this.#worklet.parameters.get(key);
    if (audioParam) audioParam.value = value;
  }

  /**
   * Update multiple worklet parameters.
   */
  updateParams(params: Partial<AudioParams<Param>>): void {
    for (const [key, value] of Object.entries(params)) {
      const audioParam = this.#worklet.parameters.get(key);
      if (audioParam) audioParam.value = value as number;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postMessage(data: any): void {
    this.#worklet.port.postMessage(data);
  }

  /**
   * Transfer data to the underlying `AudioWorklet` node.
   *
   * WARNING: Ownership of the `Uint8Array`'s `ArrayBuffer` is transferred to the worklet.
   * Attempting to use it afterwards will result in an error.
   */
  transfer(data: Uint8Array): void {
    this.#worklet.port.postMessage(data, [data.buffer]);
  }
}
