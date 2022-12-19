import type { DXAlgorithm, DXRenderer, DXOperatorState } from "./types";

/**
 * DX7 Algorithm static functions and renderers
 *
 * @module
 */

export const renderers = new Map<string, DXRenderer>();

// n: number of operators to render (height of the stack)
// modulationSource: -2 for external, -1 for none, n for feedback
export function renderer(n: number, modulationSource: number, additive: boolean): DXRenderer {
  const key = [n, modulationSource, additive].join("|");

  {
    const r = renderers.get(key);
    if (r) return r;
  }

  const f: DXRenderer = function (
    ops: DXOperatorState[],
    f: Float32Array,
    a: Float32Array,
    fbState: [number, number],
    fbAmount: number,
    modulation: Float32Array,
    out: Float32Array
  ) {
    const size = out.length;
    const scale = 1.0 / size;
    const amplitudeIncrement = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      amplitudeIncrement[i] = (Math.min(a[i], 4.0) - ops[i].amplitude) * scale;
    }

    const fbScale = fbAmount ? (1 << fbAmount) / 512.0 : 0.0;

    for (let i = 0; i < size; i++) {
      let pm = 0.0;
      if (modulationSource >= 0) {
        pm = (fbState[0] + fbState[1]) * fbScale;
      } else if (modulationSource === -2) {
        pm = modulation[i];
      }
      for (let j = 0; j < n; j++) {
        ops[j].phase += f[j];
        if (ops[j].phase >= 1.0) {
          ops[j].phase - 1.0;
        }
        pm = Math.sin(2 * Math.PI * (ops[j].phase + pm)) * ops[j].amplitude;
        ops[j].amplitude += amplitudeIncrement[j];
        if (j === modulationSource) {
          fbState[1] = fbState[0];
          fbState[0] = pm;
        }
      }
      if (additive) {
        out[i] += pm;
      } else {
        out[i] = pm;
      }
    }
  };

  renderers.set(key, f);
  return f;
}

export const dx7: readonly DXAlgorithm[] = [
  // Algorithm 1
  [
    { n: 4, renderFn: renderer(4, 0, true), input: 0, output: 0 },
    {},
    {},
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 2
  [
    { n: 4, renderFn: renderer(4, -1, true), input: 0, output: 0 },
    {},
    {},
    {},
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 3
  [
    { n: 3, renderFn: renderer(3, 0, true), input: 0, output: 0 },
    {},
    {},
    { n: 3, renderFn: renderer(3, -1, true), input: 0, output: 0 },
    {},
    {},
  ],

  // Algorithm 4
  [
    { n: 3, renderFn: renderer(3, 2, true), input: 0, output: 0 },
    {},
    {},
    { n: 3, renderFn: renderer(3, -1, true), input: 0, output: 0 },
    {},
    {},
  ],

  // Algorithm 5
  [
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 6
  [
    { n: 2, renderFn: renderer(2, 1, true), input: 0, output: 0 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 7
  [
    { n: 2, renderFn: renderer(2, 0, false), input: 0, output: 1 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 8
  [
    { n: 2, renderFn: renderer(2, -1, false), input: 0, output: 1 },
    {},
    { n: 1, renderFn: renderer(1, 0, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 9
  [
    { n: 2, renderFn: renderer(2, -1, false), input: 0, output: 1 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 10
  [
    { n: 1, renderFn: renderer(1, -1, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 3, renderFn: renderer(3, 0, true), input: 0, output: 0 },
    {},
    {},
  ],

  // Algorithm 11
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 3, renderFn: renderer(3, -1, true), input: 0, output: 0 },
    {},
    {},
  ],

  // Algorithm 12
  [
    { n: 1, renderFn: renderer(1, -1, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 13
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 14
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 2, renderFn: renderer(2, -2, true), input: 1, output: 0 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 15
  [
    { n: 1, renderFn: renderer(1, -1, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 2, renderFn: renderer(2, -2, true), input: 1, output: 0 },
    {},
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 16
  [
    { n: 2, renderFn: renderer(2, 0, false), input: 0, output: 1 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 1 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 17
  [
    { n: 2, renderFn: renderer(2, -1, false), input: 0, output: 1 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 1 },
    {},
    { n: 1, renderFn: renderer(1, 0, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 18
  [
    { n: 3, renderFn: renderer(3, -1, false), input: 0, output: 1 },
    {},
    {},
    { n: 1, renderFn: renderer(1, 0, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 19
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 3, renderFn: renderer(3, -1, true), input: 0, output: 0 },
    {},
    {},
  ],

  // Algorithm 20
  [
    { n: 1, renderFn: renderer(1, -1, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 21
  [
    { n: 1, renderFn: renderer(1, -1, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 22
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 23
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 24
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 25
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 26
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 27
  [
    { n: 1, renderFn: renderer(1, -1, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 28
  [
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 3, renderFn: renderer(3, 0, true), input: 0, output: 0 },
    {},
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 29
  [
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 30
  [
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 3, renderFn: renderer(3, 0, true), input: 0, output: 0 },
    {},
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 31
  [
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 32
  [
    { n: 1, renderFn: renderer(1, 0, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],
];

export const dx100: readonly DXAlgorithm[] = [
  // Algorithm 1
  [{ n: 4, renderFn: renderer(4, 0, true), input: 0, output: 0 }, {}, {}, {}],

  // Algorithm 2
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, false), input: 1, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 3
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 1 },
    {},
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 4
  [
    { n: 2, renderFn: renderer(2, 0, false), input: 0, output: 1 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 5
  [
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
    { n: 2, renderFn: renderer(2, -1, true), input: 0, output: 0 },
    {},
  ],

  // Algorithm 6
  [
    { n: 1, renderFn: renderer(1, 0, false), input: 0, output: 1 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
    { n: 1, renderFn: renderer(1, -2, true), input: 1, output: 0 },
  ],

  // Algorithm 7
  [
    { n: 2, renderFn: renderer(2, 0, true), input: 0, output: 0 },
    {},
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],

  // Algorithm 8
  [
    { n: 1, renderFn: renderer(1, 0, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
    { n: 1, renderFn: renderer(1, -1, true), input: 0, output: 0 },
  ],
];

export function modulators(algorithm: DXAlgorithm): Set<number> {
  const modulators = new Set<number>();
  for (let from = 0; from < algorithm.length; ) {
    const to = from + algorithm[from].n - 1;
    for (let op = from; op <= to; ++op) {
      if (algorithm[from].output === 1 || op < to) {
        modulators.add(op);
      }
    }
    from += algorithm[from].n;
  }
  return modulators;
}
