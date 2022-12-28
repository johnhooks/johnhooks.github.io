/**
 * Copyright 2022 Emilie Gillet.
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
 *
 * -----------------------------------------------------------------------------
 *
 * Low-bitrate audio encoder for loading custom data into a module. Designed
 * with the following set of constraints in mind:
 *
 * - Suitable to the low sample rate and bandwidth (a few kHz) of the CV inputs.
 * - Modulated signal does not have a DC offset.
 * - Robust to deviation in both the emitter and receiver's sample rate.
 * - Very low complexity decoder (differentiation + zero-crossing detection).
 */

type Encoding = {
  sampleRate: number;
  symbolDurations: number[];
  packetSize: number;
  shape: "cosine" | "sine_no_dc";
};

type Format = {
  pageSize: number;
  blankDuration: number;
  introDuration: number;
  outroDuration: number;
};

const CrcTable = [
  0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3,
  0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
  0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
  0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5,
  0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
  0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
  0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f,
  0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d,
  0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
  0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
  0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457,
  0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
  0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb,
  0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9,
  0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
  0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad,
  0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683,
  0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
  0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7,
  0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
  0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
  0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
  0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f,
  0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
  0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
  0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21,
  0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
  0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45,
  0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db,
  0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
  0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf,
  0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d,
] as const;

function crc32(crc: number, data: Uint8Array) {
  crc = ~~crc ^ -1;
  for (let n = 0; n < data.length; n++) {
    crc = CrcTable[(crc ^ data[n]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
}

export class Encoder {
  #format: Format;
  #sampleRate: Encoding["sampleRate"];
  #symbolDurations: Encoding["symbolDurations"];
  #packetSize: Encoding["packetSize"];
  #polarity = 0;
  #samples: Float32Array[][] = [];

  constructor(encoding: Encoding, format: Format) {
    this.#sampleRate = encoding.sampleRate;
    this.#symbolDurations = encoding.symbolDurations;
    this.#packetSize = encoding.packetSize;

    const fn = encoding.shape == "cosine" ? Math.cos : Math.sin;
    const noDC = encoding.shape == "sine_no_dc";

    for (const duration of encoding.symbolDurations) {
      const gain = noDC ? Math.max(encoding.symbolDurations[0] / duration, 0.5) : 1.0;
      const plus = new Float32Array(duration);
      const minus = new Float32Array(duration);
      for (let i = 0; i < duration; i++) {
        plus[i] = fn((i / duration) * Math.PI) * gain;
        minus[i] = -plus[i];
      }
      this.#samples.push([plus, minus]);
    }
    this.#format = format;
  }

  encode(symbols: Uint8Array) {
    let totalDuration = 0;
    for (const symbol of symbols) {
      totalDuration += this.#symbolDurations[symbol];
    }
    const block = new Float32Array(totalDuration);
    let i = 0;
    for (const symbol of symbols) {
      block.set(this.#samples[symbol][this.#polarity], i);
      i += this.#symbolDurations[symbol];
      this.#polarity = 1 - this.#polarity;
    }
    return block;
  }

  codeBlank(duration: number) {
    const n = Math.ceil((duration * this.#sampleRate) / this.#symbolDurations[2]);
    return this.encode(new Uint8Array(Array(n).fill(2)));
  }

  pad(data: Uint8Array, size: number) {
    const n = data.length;
    if (n % size != 0) {
      const paddedData = new Uint8Array(n + size - (n % size));
      paddedData.set(data);
      data = paddedData;
    }
    return data;
  }

  codePacket(packet: Uint8Array) {
    console.assert(packet.length <= this.#packetSize);
    packet = this.pad(packet, this.#packetSize);
    const crc = crc32(0, packet);
    const header = new Uint8Array([0x55, 0x55, 0x55, 0x55]);
    const footer = new Uint8Array([
      crc >>> 24,
      (crc >>> 16) & 0xff,
      (crc >>> 8) & 0xff,
      crc & 0xff,
    ]);
    const symbolStream = [];
    for (const block of [header, packet, footer]) {
      for (const byte of block) {
        for (let bit = 0; bit < 8; bit++) {
          symbolStream.push(byte & (0x80 >> bit) ? 1 : 0);
        }
      }
    }
    return this.encode(new Uint8Array(symbolStream));
  }

  code(data: Uint8Array, tags: number[]) {
    // Replace the last bytes of data with the tag.
    data = this.pad(data, this.#format.pageSize);
    for (let i = 0; i < tags.length; i++) {
      data[data.length - tags.length + i] = tags[i];
    }

    // Collect all pieces of the output signal.
    const buffers = [];
    buffers.push(this.codeBlank(this.#format.introDuration));
    for (let i = 0; i < data.length; i += this.#packetSize) {
      buffers.push(this.codePacket(data.slice(i, i + this.#packetSize)));
      if (i % this.#format.pageSize == 0) {
        buffers.push(this.codeBlank(this.#format.blankDuration));
      }
    }
    buffers.push(this.codeBlank(this.#format.outroDuration));

    // Compute the total size.
    let totalSize = 0;
    for (const buffer of buffers) {
      totalSize += buffer.length;
    }

    // Splice everything together.
    const output = new Float32Array(totalSize);
    let i = 0;
    for (const buffer of buffers) {
      output.set(buffer, i);
      i += buffer.length;
    }
    return output;
  }

  toWAV(audioSamples: Uint8Array) {
    const buffer = new ArrayBuffer(44 + audioSamples.length * 2);
    const view = new DataView(buffer);

    const writeTag = function (offset: number, tag: string) {
      for (let i = 0; i < tag.length; i++) {
        view.setUint8(offset + i, tag.charCodeAt(i));
      }
    };

    writeTag(0, "RIFF");
    view.setUint32(4, 36 + audioSamples.length * 2, true);
    writeTag(8, "WAVE");

    writeTag(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, this.#sampleRate, true);
    view.setUint32(28, this.#sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);

    writeTag(36, "data");
    view.setUint32(40, audioSamples.length * 2, true);
    for (let i = 0; i < audioSamples.length; i++) {
      const s = Math.max(-1, Math.min(1, audioSamples[i]));
      view.setInt16(44 + i * 2, s * 32767, true);
    }
    return buffer;
  }

  static create() {
    // Default encoding and format for Plaits.
    return new Encoder(
      {
        sampleRate: 48000.0,
        symbolDurations: [24, 60, 108],
        packetSize: 256,
        shape: "cosine",
      },
      {
        pageSize: 256,
        blankDuration: 0.1,
        introDuration: 0.5,
        outroDuration: 1.25,
      }
    );
  }
}
