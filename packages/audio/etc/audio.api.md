## API Report File for "@bitmachina/audio"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export type AudioParams<Key extends string> = Record<Key, number>;

// @public
class AudioWorklet_2<Param extends string> {
    constructor({ name, url, worklet }: AudioWorkletConstructorArgs);
    // (undocumented)
    readonly connect: (destinationNode: AudioNode) => void;
    static create<Param extends string>({ context, ...args }: {
        context: AudioContext;
        name: string;
        url: string;
    }): Promise<AudioWorklet_2<Param>>;
    // (undocumented)
    readonly disconnect: (destinationNode: AudioNode) => void;
    getParam(key: Param): number;
    // (undocumented)
    static readonly loaded: Map<string, boolean>;
    // (undocumented)
    postMessage(data: any): void;
    transfer(data: Uint8Array): void;
    updateParam(key: Param, value: number): void;
    updateParams(params: Partial<AudioParams<Param>>): void;
}
export { AudioWorklet_2 as AudioWorklet }

// @public
export type AudioWorkletConstructorArgs = {
    name: string;
    url: string;
    worklet: AudioWorkletNode;
};

// (No @packageDocumentation comment for this package)

```
