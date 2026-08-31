/**
 * Guards the prop source rects in src/engine/mapData.js against the actual
 * tileset pixels. A rect that is too small slices the top or side off a prop
 * (the "half a carpet" bug); one that is too large leaves dead space that can
 * cover the tile behind it.
 *
 * Run with `npm run check:sprites`.
 */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TILE } from "../src/engine/constants.js";
import { CONSOLE_SPRITE, PROPS } from "../src/engine/mapData.js";
import { readPng } from "./png.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const sheet = readPng(join(here, "..", "public", "tiles", "interiors.png"));

const fails = [];
const ok = (cond, msg) => {
  if (!cond) fails.push(msg);
};

const anyOpaque = (x0, y0, x1, y1) => {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) if (sheet.opaque(x, y)) return true;
  }
  return false;
};

/**
 * Every edge tile of a declared rect must carry some of the sprite. An empty
 * edge tile means the rect is a tile too wide or tall, so the prop sits offset
 * from where the map thinks it is.
 *
 * Checked a whole tile band at a time, not a single pixel line: sprites are
 * aligned to the tile grid with transparent padding inside their cells.
 */
function checkTightFit(name, { src, w, h }) {
  const left = src[0] * TILE;
  const top = src[1] * TILE;
  const right = left + w * TILE - 1;
  const bottom = top + h * TILE - 1;

  ok(
    left >= 0 && top >= 0 && right < sheet.width && bottom < sheet.height,
    `${name}: rect runs off the sheet`,
  );

  ok(
    anyOpaque(left, top, right, top + TILE - 1),
    `${name}: its top tile row is empty`,
  );
  ok(
    anyOpaque(left, bottom - TILE + 1, right, bottom),
    `${name}: its bottom tile row is empty`,
  );
  ok(
    anyOpaque(left, top, left + TILE - 1, bottom),
    `${name}: its left tile column is empty`,
  );
  ok(
    anyOpaque(right - TILE + 1, top, right, bottom),
    `${name}: its right tile column is empty`,
  );
}

for (const [name, prop] of Object.entries(PROPS)) checkTightFit(name, prop);
checkTightFit("console", CONSOLE_SPRITE);

/**
 * Extents measured off the sheet by flood-filling each sprite's connected
 * pixels. Props that touch their neighbours on the sheet merge under that
 * measurement, so those are recorded as the trusted rect chosen by eye rather
 * than the raw flood-fill result.
 */
const MEASURED = {
  rugRed: [7, 15, 4, 3],
  rugBlue: [13, 11, 3, 4],
  sofa: [7, 13, 3, 2],
  stool: [5, 22, 1, 1],
  chair: [7, 21, 1, 2],
  screen: [0, 24, 2, 2],
  window: [7, 24, 2, 2],
  plant: [10, 44, 2, 3],
  palm: [13, 44, 2, 2],
  chalkboard: [7, 35, 2, 3],
  shelfBooks: [13, 38, 2, 2],
  globe: [13, 36, 1, 2],
  bookcase: [5, 14, 2, 4],
  photoFrame: [11, 26, 1, 2],
  worldMap: [10, 66, 2, 2],
  aquarium: [0, 20, 2, 2],
};

for (const [name, [c, r, w, h]] of Object.entries(MEASURED)) {
  const prop = PROPS[name];
  ok(prop, `${name}: no longer defined in PROPS`);
  if (!prop) continue;
  ok(
    prop.src[0] === c && prop.src[1] === r && prop.w === w && prop.h === h,
    `${name}: declared (${prop.src}) ${prop.w}x${prop.h} but the sheet measures (${c},${r}) ${w}x${h}`,
  );
}

console.log(
  `checked ${Object.keys(PROPS).length + 1} sprite rects against ${sheet.width}x${sheet.height} sheet`,
);

if (fails.length) {
  console.error("\nFAILURES:");
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("all sprite checks passed");
