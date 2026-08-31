import { TILE } from "./constants.js";
import { isBlocked } from "./player.js";

/**
 * Ambient characters. They wander a short leash around a home tile, pausing
 * between walks, and are deliberately non-interactive and non-solid: you walk
 * straight through them. That keeps them from ever boxing the player into a
 * corner or blocking a console, which a solid wanderer eventually will.
 */

// EDIT ME: who wanders where. `sheet` must match a name in assets.js, `x`/`y`
// is the home tile, and `leash` how many tiles they stray from it.
export const NPCS = [
  { sheet: "alex", x: 24, y: 10, leash: 4 },
  { sheet: "amelia", x: 31, y: 30, leash: 4 },
  { sheet: "bob", x: 24, y: 36, leash: 3 },
  { sheet: "alex", x: 45, y: 16, leash: 3 },
  { sheet: "amelia", x: 8, y: 10, leash: 3 },
  { sheet: "bob", x: 45, y: 36, leash: 3 },
];

const SPEED = 34; // slower than the player, so they read as background life
const DIRS = ["down", "up", "left", "right"];
const VECTORS = {
  down: [0, 1],
  up: [0, -1],
  left: [-1, 0],
  right: [1, 0],
};

export function createNpcs() {
  return NPCS.map((n, i) => ({
    sheet: n.sheet,
    homeX: (n.x + 0.5) * TILE,
    homeY: (n.y + 1) * TILE,
    x: (n.x + 0.5) * TILE,
    y: (n.y + 1) * TILE,
    leash: n.leash * TILE,
    dir: DIRS[i % DIRS.length],
    moving: false,
    anim: 0,
    // Stagger the first decision so they don't all set off in lockstep.
    timer: 400 + i * 260,
  }));
}

function repick(n) {
  // Head home when the leash runs out, otherwise pick a direction at random.
  const dx = n.x - n.homeX;
  const dy = n.y - n.homeY;
  if (Math.hypot(dx, dy) > n.leash) {
    n.dir =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "left"
          : "right"
        : dy > 0
          ? "up"
          : "down";
  } else {
    n.dir = DIRS[Math.floor(Math.random() * DIRS.length)];
  }
  n.moving = Math.random() > 0.28;
  n.timer = n.moving ? 700 + Math.random() * 1400 : 500 + Math.random() * 1600;
}

export function stepNpcs(npcs, dt, solid) {
  for (const n of npcs) {
    n.timer -= dt;
    if (n.timer <= 0) repick(n);

    if (!n.moving) {
      n.anim = 0;
      continue;
    }

    const [vx, vy] = VECTORS[n.dir];
    const step = (SPEED * dt) / 1000;
    const nx = n.x + vx * step;
    const ny = n.y + vy * step;

    // Same feet-anchored box the player uses, so an NPC fits exactly where you do.
    if (isBlocked(solid, nx, ny)) {
      // Walked into something, so turn rather than grinding against it.
      repick(n);
      continue;
    }

    n.x = nx;
    n.y = ny;
    n.anim += dt;
  }
  return npcs;
}
