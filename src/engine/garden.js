import { TILE } from "./constants.js";
import { GARDENS, PONDS } from "./mapData.js";

/**
 * Hand-drawn grass and water, because the free Modern Interiors pack is
 * indoor-only and has no exterior tiles.
 *
 * Every colour here was sampled from the pack itself so the garden sits in the
 * same palette rather than looking pasted on: the greens come from its palm and
 * plant sprites, the blues from its teal floor, and OUTLINE is the dark violet
 * the pack uses to outline every object.
 */
const OUTLINE = "#3a3a50";
const GRASS = "#568d61";
const GRASS_LIT = "#61af5f";
const GRASS_DARK = "#4e6e61";
const BLADE = "#9bc246";
const KERB = "#a79796";
const KERB_LIT = "#c2b8b6";
const WATER = "#83b5b9";
const WATER_DEEP = "#6e92a2";
const WATER_LIT = "#a4d5d5";
const SPARKLE = "#bdf1e5";

/** Stable per-tile noise so detail never shimmers between frames. */
function hash(x, y, salt = 0) {
  const n = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

const px = (ctx, c, x, y, w = 1, h = 1) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

const inRect = (r, x, y) =>
  x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;

export const isGarden = (x, y) => GARDENS.some((g) => inRect(g, x, y));
export const isPond = (x, y) => PONDS.some((p) => inRect(p, x, y));

function drawGrass(ctx, tx, ty) {
  const x = tx * TILE;
  const y = ty * TILE;
  px(ctx, GRASS, x, y, TILE, TILE);

  // Many small marks rather than a few large ones: big patches read as blotches
  // once the map is scaled up, while fine speckle reads as texture.
  for (let i = 0; i < 4; i++) {
    const hx = Math.floor(hash(tx, ty, i * 2 + 1) * 14);
    const hy = Math.floor(hash(tx, ty, i * 2 + 2) * 14);
    px(ctx, GRASS_LIT, x + hx, y + hy, 3, 2);
  }
  for (let i = 0; i < 3; i++) {
    const hx = Math.floor(hash(tx, ty, 20 + i * 2) * 15);
    const hy = Math.floor(hash(tx, ty, 21 + i * 2) * 15);
    px(ctx, GRASS_DARK, x + hx, y + hy, 2, 1);
  }

  if (hash(tx, ty, 30) > 0.45) {
    const cx = Math.floor(hash(tx, ty, 31) * 13);
    const cy = Math.floor(hash(tx, ty, 32) * 12);
    px(ctx, BLADE, x + cx, y + cy, 1, 3);
    px(ctx, BLADE, x + cx + 2, y + cy + 1, 1, 2);
  }
}

function drawWater(ctx, tx, ty) {
  const x = tx * TILE;
  const y = ty * TILE;
  px(ctx, WATER, x, y, TILE, TILE);

  px(ctx, WATER_DEEP, x + Math.floor(hash(tx, ty, 8) * 8), y + 3, 7, 4);
  px(ctx, WATER_LIT, x + 2, y + Math.floor(hash(tx, ty, 9) * 6) + 8, 6, 1);
  px(ctx, WATER_LIT, x + 9, y + Math.floor(hash(tx, ty, 10) * 5) + 2, 4, 1);

  if (hash(tx, ty, 11) > 0.6) {
    px(ctx, SPARKLE, x + Math.floor(hash(tx, ty, 12) * 12), y + 11, 2, 1);
  }
}

/**
 * Draws a raised stone kerb on whichever sides of a tile face out of the bed,
 * with the pack's outline colour on the outermost pixel so the edge reads the
 * same way its furniture does.
 */
function drawKerb(ctx, tx, ty, inside) {
  const x = tx * TILE;
  const y = ty * TILE;

  if (!inside(tx, ty - 1)) {
    px(ctx, KERB, x, y, TILE, 3);
    px(ctx, KERB_LIT, x, y + 1, TILE, 1);
    px(ctx, OUTLINE, x, y, TILE, 1);
  }
  if (!inside(tx, ty + 1)) {
    px(ctx, KERB, x, y + TILE - 3, TILE, 3);
    px(ctx, OUTLINE, x, y + TILE - 1, TILE, 1);
  }
  if (!inside(tx - 1, ty)) {
    px(ctx, KERB, x, y, 3, TILE);
    px(ctx, KERB_LIT, x + 1, y, 1, TILE);
    px(ctx, OUTLINE, x, y, 1, TILE);
  }
  if (!inside(tx + 1, ty)) {
    px(ctx, KERB, x + TILE - 3, y, 3, TILE);
    px(ctx, OUTLINE, x + TILE - 1, y, 1, TILE);
  }
}

/** Pale shallows wherever water meets the bank. */
function drawShore(ctx, tx, ty) {
  const x = tx * TILE;
  const y = ty * TILE;

  if (!isPond(tx, ty - 1)) {
    px(ctx, WATER_LIT, x, y, TILE, 2);
    px(ctx, OUTLINE, x, y, TILE, 1);
  }
  if (!isPond(tx, ty + 1)) {
    px(ctx, WATER_LIT, x, y + TILE - 2, TILE, 2);
    px(ctx, OUTLINE, x, y + TILE - 1, TILE, 1);
  }
  if (!isPond(tx - 1, ty)) {
    px(ctx, WATER_LIT, x, y, 2, TILE);
    px(ctx, OUTLINE, x, y, 1, TILE);
  }
  if (!isPond(tx + 1, ty)) {
    px(ctx, WATER_LIT, x + TILE - 2, y, 2, TILE);
    px(ctx, OUTLINE, x + TILE - 1, y, 1, TILE);
  }
}

export function drawGardens(ctx) {
  for (const bed of GARDENS) {
    for (let ty = bed.y; ty < bed.y + bed.h; ty++) {
      for (let tx = bed.x; tx < bed.x + bed.w; tx++) drawGrass(ctx, tx, ty);
    }
  }

  for (const pond of PONDS) {
    for (let ty = pond.y; ty < pond.y + pond.h; ty++) {
      for (let tx = pond.x; tx < pond.x + pond.w; tx++) drawWater(ctx, tx, ty);
    }
  }

  // Edges last so they sit on top of both the grass and the water fill.
  for (const pond of PONDS) {
    for (let ty = pond.y; ty < pond.y + pond.h; ty++) {
      for (let tx = pond.x; tx < pond.x + pond.w; tx++) drawShore(ctx, tx, ty);
    }
  }

  for (const bed of GARDENS) {
    for (let ty = bed.y; ty < bed.y + bed.h; ty++) {
      for (let tx = bed.x; tx < bed.x + bed.w; tx++) {
        drawKerb(ctx, tx, ty, isGarden);
      }
    }
  }
}
