/**
 * Exercises the movement model headlessly: walking, wall collision, sliding,
 * and whether each room console can actually be reached and triggered on foot.
 * Run with `npm run check:movement`.
 */
import { TILE } from "../src/engine/constants.js";
import { ROOMS, buildCollision } from "../src/engine/mapData.js";
import {
  createPlayer,
  isBlocked,
  roomAt,
  stepPlayer,
  tileUnder,
  zoneAt,
} from "../src/engine/player.js";

const solid = buildCollision();
const fails = [];
const ok = (cond, msg) => {
  if (!cond) fails.push(msg);
};

const NONE = { up: false, down: false, left: false, right: false };
const press = (...dirs) =>
  dirs.reduce((o, d) => ({ ...o, [d]: true }), { ...NONE });

/** Runs the loop at a steady 16ms for `ms`, like a 60fps browser would. */
const walk = (p, input, ms) => {
  for (let t = 0; t < ms; t += 16) stepPlayer(p, input, 16, solid);
  return p;
};

// 1. Idle input never moves the player.
{
  const p = createPlayer();
  const { x, y } = p;
  walk(p, NONE, 500);
  ok(p.x === x && p.y === y, "player drifted while no key was held");
  ok(p.moving === false, "idle player is still flagged as moving");
}

// 2. Holding a direction covers ~SPEED px/s. The spawn lane is clear
//    vertically; walking right from there correctly stops at the median pond.
{
  const p = createPlayer();
  const y0 = p.y;
  walk(p, press("down"), 1000);
  const moved = p.y - y0;
  ok(moved > 60, `walking down for 1s only moved ${moved.toFixed(1)}px`);
  ok(p.dir === "down", `expected to face down, got ${p.dir}`);
  ok(p.moving === true, "walking player is not flagged as moving");
}

// 3. Diagonal movement is normalised, not faster than straight movement.
//    Run it from open floor so nothing clips the comparison.
{
  const open = { x: 17 * TILE, y: 12 * TILE };
  const straight = Object.assign(createPlayer(), open);
  const diag = Object.assign(createPlayer(), open);
  ok(!isBlocked(solid, open.x, open.y), "diagonal test spot is not open floor");

  walk(straight, press("down"), 400);
  walk(diag, press("down", "right"), 400);

  const straightDist = Math.abs(straight.y - open.y);
  const diagDist = Math.hypot(diag.x - open.x, diag.y - open.y);
  ok(straight.x === open.x, "straight walk drifted sideways");
  ok(diagDist > 5, `diagonal barely moved (${diagDist.toFixed(1)}px)`);
  ok(
    diagDist <= straightDist + 1,
    `diagonal (${diagDist.toFixed(1)}) outruns straight (${straightDist.toFixed(1)})`,
  );
}

// 4. You cannot walk through a console, and you stop against it rather than
//    tunnelling past it.
for (const room of ROOMS) {
  const p = createPlayer();
  // Stand just below the console, centred on it, then push up into it.
  p.x = (room.terminal.x + 1) * TILE;
  p.y = (room.terminal.y + 3) * TILE;
  ok(!isBlocked(solid, p.x, p.y), `${room.id}: staging tile is already solid`);

  walk(p, press("up"), 3000);
  ok(
    p.y > (room.terminal.y + 2) * TILE - 1,
    `${room.id}: player walked through the console (y=${p.y.toFixed(1)})`,
  );

  const { tx, ty } = tileUnder(p);
  const zone = zoneAt(tx, ty);
  ok(zone?.id === room.id, `${room.id}: pressing into the console gave no prompt`);
  ok(roomAt(tx, ty)?.id === room.id, `${room.id}: console is outside its room`);
}

// 5. Map edges hold.
{
  const p = createPlayer();
  walk(p, press("left"), 20000);
  ok(p.x >= 0, `player escaped the west edge (x=${p.x})`);
  const q = createPlayer();
  walk(q, press("up"), 20000);
  ok(q.y >= 0, `player escaped the north edge (y=${q.y})`);
}

// 6. Sliding: pushing diagonally into a wall should still move along it.
{
  const room = ROOMS[1];
  const p = createPlayer();
  p.x = (room.terminal.x + 1) * TILE;
  p.y = (room.terminal.y + 3) * TILE;
  const x0 = p.x;
  walk(p, press("up", "right"), 800);
  ok(p.x > x0 + 5, "player stuck instead of sliding along the console");
}

// 7. A console offers its prompt from every side it can be stood on, not just
//    from below, so walking up to one from any direction works.
for (const room of ROOMS) {
  const { x, y } = room.terminal;
  const sides = {
    above: [x, y - 1],
    below: [x, y + 2],
    left: [x - 1, y],
    right: [x + 2, y],
  };
  for (const [side, [tx, ty]] of Object.entries(sides)) {
    // Only sides you can actually stand on are required to work.
    if (isBlocked(solid, (tx + 0.5) * TILE, (ty + 1) * TILE)) continue;
    ok(
      zoneAt(tx, ty)?.id === room.id,
      `${room.id}: standing ${side} of the console gives no prompt`,
    );
  }
}

if (fails.length) {
  console.error("FAILURES:");
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("all movement checks passed");
