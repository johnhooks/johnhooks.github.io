// Copyright 2022 Emilie Gillet.
//
// Authors: Emilie Gillet (emilie.o.gillet@gmail.com) and John Hooks (bitmachina@outlook.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// See http://creativecommons.org/licenses/MIT/ for more information.

export class Patch {
  /**
   * The name of the bank the patch is connected to.
   */
  readonly bankName: string;

  /**
   * The index number of the patch order.
   */
  readonly index: number;

  /**
   * The raw data of the patch.
   */
  readonly data: Uint8Array;

  /**
   * The name of the patch.
   */
  readonly name: string;

  /**
   * The synth algorithm parameter.
   */
  readonly algorithm: number;

  /**
   * The synth feedback parameter.
   */
  readonly feedback: number;

  constructor(bankName: string, index: number, data: Uint8Array) {
    this.bankName = bankName;
    this.index = index;
    this.data = data;
    this.name = String.fromCharCode(...Array.from(data.slice(118, 128)));
    this.algorithm = data[110] & 0x1f;
    this.feedback = data[111] & 0x7;
  }
}
