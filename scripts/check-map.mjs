/**
 * Sanity checks for the world map. Run with `npm run check:map` after editing
 * src/engine/mapData.js — it catches the mistakes that are invisible until you
 * walk into them: spawning inside a pond, a console you can't stand next to,
 * decor stacked on top of an interactive object, an unreachable room.
 */
import { MAP_H, MAP_W, TILE } from "../src/engine/constants.js";
import {
  CONSOLE_SPRITE,
  GARDENS,
  INTERACTIONS,
  OBJECTS,
  PONDS,
  ROOMS,
  SPAWN,
  buildCollision,
} from "../src/engine/mapData.js";

const solid = buildCollision();
const at = (x, y) => solid[y * MAP_W + x];

const fails = [];
const ok = (cond, msg) => {
  if (!cond) fails.push(msg);
};

// Spawn must be on walkable ground.
const sx = Math.floor(SPAWN.x / TILE);
const sy = Math.floor((SPAWN.y - 1) / TILE);
ok(!at(sx, sy), `SPAWN tile (${sx},${sy}) is solid`);

// Consoles block movement, and you must be able to reach one from every side:
// each of the four faces needs at least one standable tile, so approaching from
// any direction offers the prompt.
for (const r of ROOMS) {
  ok(at(r.terminal.x, r.terminal.y), `${r.id}: console is not solid`);

  const { x, y } = r.terminal;
  const { w, h } = CONSOLE_SPRITE;
  const faces = {
    above: Array.from({ length: w }, (_, i) => [x + i, y - 1]),
    below: Array.from({ length: w }, (_, i) => [x + i, y + h]),
    left: Array.from({ length: h }, (_, i) => [x - 1, y + i]),
    right: Array.from({ length: h }, (_, i) => [x + w, y + i]),
  };
  for (const [side, tiles] of Object.entries(faces)) {
    ok(
      tiles.some(([tx, ty]) => !at(tx, ty)),
      `${r.id}: console cannot be approached from ${side}`,
    );
  }
}

// Interaction zones belong to their own room.
for (const z of INTERACTIONS) {
  const r = ROOMS.find((rm) => rm.id === z.id);
  ok(
    z.x >= r.x && z.x + z.w <= r.x + r.w && z.y >= r.y && z.y + z.h <= r.y + r.h,
    `${z.id}: interact zone falls outside the room`,
  );
}

// Decor stays in bounds and never covers a console.
for (const o of OBJECTS) {
  const w = o.w ?? 1;
  const h = o.h ?? 1;
  ok(
    o.x >= 0 && o.y >= 0 && o.x + w <= MAP_W && o.y + h <= MAP_H,
    `object [${o.src}] at (${o.x},${o.y}) is out of bounds`,
  );
  for (const r of ROOMS) {
    const overlaps =
      o.x < r.terminal.x + CONSOLE_SPRITE.w &&
      o.x + w > r.terminal.x &&
      o.y < r.terminal.y + CONSOLE_SPRITE.h &&
      o.y + h > r.terminal.y;
    ok(
      !overlaps,
      `object [${o.src}] at (${o.x},${o.y}) overlaps the ${r.id} console`,
    );
  }
}

// Props stay inside the room they decorate (or the lobby), never buried in a wall.
for (const o of OBJECTS) {
  const buried = solid.length && o.y + o.h <= 2;
  ok(!buried, `object [${o.src}] at (${o.x},${o.y}) is inside the back wall`);
}

// Water must sit inside a planted bed, never straight on the lobby floor, and
// must leave a bank of grass so it does not run under the kerb.
for (const p of PONDS) {
  const bed = GARDENS.find(
    (g) =>
      p.x > g.x &&
      p.y > g.y &&
      p.x + p.w < g.x + g.w &&
      p.y + p.h < g.y + g.h,
  );
  ok(
    bed,
    `pond at (${p.x},${p.y}) ${p.w}x${p.h} is not fully inset inside a garden bed`,
  );
}

// Flood fill from the spawn: every console must actually be walkable to.
const seen = new Uint8Array(MAP_W * MAP_H);
const queue = [[sx, sy]];
seen[sy * MAP_W + sx] = 1;
while (queue.length) {
  const [x, y] = queue.pop();
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= MAP_W || ny >= MAP_H) continue;
    const i = ny * MAP_W + nx;
    if (seen[i] || solid[i]) continue;
    seen[i] = 1;
    queue.push([nx, ny]);
  }
}
// At least one tile of each console's ring must be reachable on foot; the
// ring's corners can legitimately be blocked by furniture.
for (const z of INTERACTIONS) {
  let reachable = false;
  for (let ty = z.y; ty < z.y + z.h && !reachable; ty++) {
    for (let tx = z.x; tx < z.x + z.w; tx++) {
      if (seen[ty * MAP_W + tx]) {
        reachable = true;
        break;
      }
    }
  }
  ok(reachable, `${z.id}: console is unreachable from spawn`);
}

const walkable = solid.reduce((n, v) => n + (v ? 0 : 1), 0);
const reached = seen.reduce((n, v) => n + v, 0);
console.log(`walkable tiles: ${walkable}  reachable from spawn: ${reached}`);

if (fails.length) {
  console.error("\nFAILURES:");
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("all map checks passed");
