/**
 * Copyright 2022 John Hooks.
 *
 * Based on [pichenettes/plaits-editor](https://github.com/pichenettes/plaits-editor/blob/43443dafe6a282fd685283274bf94d1f1eb44949/patch_bank.js)
 *
 * Authors: Emilie Gillet (emilie.o.gillet@gmail.com) and John Hooks (bitmachina@outlook.com)
 *
 * @license
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * See http://creativecommons.org/licenses/MIT/ for more information.
 */

import { Patch } from "./patch";

/**
 * Object representation of a DX7 .syx file.
 */
export class PatchBank {
  /**
   * The name of the patch bank.
   */
  name: string;

  /**
   * The raw data of the patch bank.
   */
  data: Uint8Array;

  /**
   * The object representation of the banks patches.
   */
  patches: Patch[] = [];

  constructor(name: string, data: Uint8Array) {
    this.name = name;
    this.data = data;

    if (data.length == 4104 || data.length == 4103) {
      data = data.slice(6, 4102);
    }
    console.assert(data.length == 4096);
    for (let i = 0; i < 32; i++) {
      this.patches.push(new Patch(name, i, data.slice(i * 128, (i + 1) * 128)));
    }
  }

  /**
   * Validate a raw .syx data as a valid DX7 patch bank.
   *
   * @param data - The raw .syx data.
   * @returns Whether the validation passes.
   */
  static validate(data: ArrayBuffer): boolean {
    // TODO: more stringent sanity checks.
    const l = data.byteLength;
    return l === 4104 || l === 4103 || l === 4096;
  }

  get cleanName() {
    // TODO: cleanup
    return this.name;
  }

  /**
   * TODO: don't mutate the patch banks
   */
  collate(patches: Patch[]) {
    const data = new Uint8Array(4096);
    const names = new Set();
    for (let i = 0; i < 32; i++) {
      const index = Math.min(i, patches.length - 1);
      data.set(patches[index].data, i * 128);
      names.add(patches[index].bankName);
    }
    this.name = Array.from(names.keys()).join("_");
    this.data = data;
    this.patches = patches;
  }

  get syx() {
    const data = new Uint8Array(4104);
    data.set(this.data, 6);
    data[0] = 0xf0;
    data[1] = 0x43;
    data[2] = 0x00;
    data[3] = 0x09;
    data[4] = 0x20;
    data[5] = 0x00;
    let sum = 0;
    for (let i = 0; i < 4096; i++) {
      sum = sum + this.data[i];
    }
    data[4102] = 128 - (sum % 128);
    data[4103] = 0xf7;
    return data;
  }
}
