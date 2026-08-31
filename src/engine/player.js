import { HITBOX, MAP_W, SPEED, TILE, WORLD_H, WORLD_W } from "./constants.js";
import { INTERACTIONS, ROOMS, SPAWN } from "./mapData.js";

export const createPlayer = () => ({
  x: SPAWN.x,
  y: SPAWN.y,
  dir: "down",
  moving: false,
  anim: 0,
});

/** The player's collision box hangs off the feet, so it's narrower than the sprite. */
export function isBlocked(solid, cx, cy) {
  const x0 = cx - HITBOX.w / 2;
  const x1 = cx + HITBOX.w / 2 - 0.01;
  const y0 = cy - HITBOX.h;
  const y1 = cy - 0.01;
  if (x0 < 0 || y0 < 0 || x1 >= WORLD_W || y1 >= WORLD_H) return true;

  for (let ty = Math.floor(y0 / TILE); ty <= Math.floor(y1 / TILE); ty++) {
    for (let tx = Math.floor(x0 / TILE); tx <= Math.floor(x1 / TILE); tx++) {
      if (solid[ty * MAP_W + tx]) return true;
    }
  }
  return false;
}

/**
 * Advances the player by `dt` ms. Pure apart from mutating `p`, so the whole
 * movement model can be exercised without a canvas.
 */
export function stepPlayer(p, input, dt, solid) {
  let dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  let dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);

  if (!dx && !dy) {
    p.anim = 0;
    p.moving = false;
    return p;
  }

  if (dx && dy) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }
  const step = (SPEED * dt) / 1000;

  // Axes resolved separately so you slide along a wall instead of sticking.
  const nx = p.x + dx * step;
  if (dx && !isBlocked(solid, nx, p.y)) p.x = nx;
  const ny = p.y + dy * step;
  if (dy && !isBlocked(solid, p.x, ny)) p.y = ny;

  p.dir =
    Math.abs(dx) >= Math.abs(dy)
      ? dx > 0
        ? "right"
        : "left"
      : dy > 0
        ? "down"
        : "up";

  p.anim += dt;
  p.moving = true;
  return p;
}

/** Tile the player is standing on (feet, not sprite centre). */
export const tileUnder = (p) => ({
  tx: Math.floor(p.x / TILE),
  ty: Math.floor((p.y - 1) / TILE),
});

const inRect = (r, tx, ty) =>
  tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h;

export const zoneAt = (tx, ty) =>
  INTERACTIONS.find((z) => inRect(z, tx, ty)) ?? null;

export const roomAt = (tx, ty) => ROOMS.find((r) => inRect(r, tx, ty)) ?? null;
