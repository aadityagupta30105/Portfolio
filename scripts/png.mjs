/**
 * Minimal PNG reader — just enough to ask "is this pixel opaque?".
 * Uses only node:zlib so the map checks stay dependency-free.
 * Handles 8-bit truecolour-with-alpha (colour type 6), which is what the
 * tilesets are; anything else throws rather than guessing.
 */
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

export function readPng(path) {
  const buf = readFileSync(path);
  if (!buf.subarray(0, 8).equals(SIGNATURE)) throw new Error(`${path}: not a PNG`);

  let pos = 8;
  let width = 0;
  let height = 0;
  const idat = [];

  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + length);

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const bitDepth = data[8];
      const colorType = data[9];
      const interlace = data[12];
      if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
        throw new Error(
          `${path}: need 8-bit RGBA, non-interlaced (got depth ${bitDepth}, type ${colorType}, interlace ${interlace})`,
        );
      }
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }

    pos += 12 + length; // length + type + data + CRC
  }

  const bpp = 4;
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;

    for (let i = 0; i < stride; i++) {
      const x = i >= bpp ? out[y * stride + i - bpp] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= bpp ? prev[i - bpp] : 0;
      let value = line[i];

      if (filter === 1) value += x;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (x + b) >> 1;
      else if (filter === 4) value += paeth(x, b, c);
      else if (filter !== 0) throw new Error(`${path}: bad filter ${filter}`);

      out[y * stride + i] = value & 0xff;
    }
  }

  return {
    width,
    height,
    /** Alpha above a small threshold, so near-transparent edges don't count. */
    opaque(x, y) {
      if (x < 0 || y < 0 || x >= width || y >= height) return false;
      return out[y * stride + x * bpp + 3] > 16;
    },
  };
}
