import { MAP_H, MAP_W, TILE } from "./constants.js";

// One building: a lobby with four rooms off it. Floors are 3x2 blocks that
// repeat; wallpapers are 3 wide (left end / middle / right end) x 2 tall.
export const FLOORS = {
  grey: { c: 11, r: 11 },
  teal: { c: 11, r: 9 },
  herringbone: { c: 11, r: 13 },
  cream: { c: 11, r: 7 },
  brick: { c: 11, r: 5 },
};
export const FLOOR_BLOCK = { w: 3, h: 2 };

/** Top row of each 2-row wallpaper pair in rooms.png. */
export const WALLPAPERS = {
  salmon: 5,
  yellow: 7,
  mint: 9,
  woodOrange: 11,
  woodBrown: 13,
  woodRed: 15,
  blueGrey: 17,
  khaki: 19,
};

export const WALL_H = 2;

// The four rooms. `open` is the side facing the lobby; `terminal` is the
// console that opens `section`.
export const ROOMS = [
  {
    id: "about",
    section: "about",
    label: "ABOUT ME",
    prompt: "ABOUT",
    greeting: "Welcome to ABOUT ME. Use the computer to read my story.",
    floor: FLOORS.teal,
    wall: WALLPAPERS.mint,
    open: "right",
    x: 3,
    y: 5,
    w: 19,
    h: 14,
    terminal: { x: 11, y: 8 },
  },
  {
    id: "skills",
    section: "skills",
    label: "THE TECH LAB (Skills)",
    prompt: "SKILLS",
    greeting: "Welcome to the TECH LAB. The computer lists what I work with.",
    floor: FLOORS.herringbone,
    wall: WALLPAPERS.woodBrown,
    open: "left",
    x: 34,
    y: 5,
    w: 19,
    h: 14,
    terminal: { x: 42, y: 8 },
  },
  {
    id: "sandbox",
    section: "sandbox",
    label: "THE ARCADE (Projects)",
    prompt: "PROJECTS",
    greeting: "You found THE ARCADE. Every machine here is a project I built.",
    floor: FLOORS.cream,
    wall: WALLPAPERS.yellow,
    open: "right",
    x: 3,
    y: 25,
    w: 19,
    h: 14,
    terminal: { x: 11, y: 33 },
  },
  {
    id: "contact",
    section: "contact",
    label: "THE OFFICE (Contacts & Resume)",
    prompt: "CONTACT",
    greeting: "This is THE OFFICE. Use the computer if you'd like to get in touch.",
    floor: FLOORS.brick,
    wall: WALLPAPERS.salmon,
    open: "left",
    x: 34,
    y: 25,
    w: 19,
    h: 14,
    terminal: { x: 42, y: 33 },
  },
];

// Source rects on interiors.png. Sizes are measured off the sheet;
// check:sprites verifies them.
export const PROPS = {
  rugRed: { src: [7, 15], w: 4, h: 3 },
  rugBlue: { src: [13, 11], w: 3, h: 4 },
  sofa: { src: [7, 13], w: 3, h: 2 },
  armchairs: { src: [2, 21], w: 2, h: 2 },
  stool: { src: [5, 22], w: 1, h: 1 },
  chair: { src: [7, 21], w: 1, h: 2 },
  screen: { src: [0, 24], w: 2, h: 2 },
  window: { src: [7, 24], w: 2, h: 2 },
  plant: { src: [10, 44], w: 2, h: 3 },
  palm: { src: [13, 44], w: 2, h: 2 },
  deskPair: { src: [0, 38], w: 2, h: 2 },
  deskBooks: { src: [3, 36], w: 2, h: 2 },
  chalkboard: { src: [7, 35], w: 2, h: 3 },
  shelfBooks: { src: [13, 38], w: 2, h: 2 },
  globe: { src: [13, 36], w: 1, h: 2 },
  counter: { src: [0, 33], w: 3, h: 2 },
  bookcase: { src: [5, 14], w: 2, h: 4 },
  // Wall decorations.
  photoFrame: { src: [11, 26], w: 1, h: 2 },
  worldMap: { src: [10, 66], w: 2, h: 2 },
  aquarium: { src: [0, 20], w: 2, h: 2 },
};

const at = (prop, x, y, solid = true) => ({ ...prop, x, y, solid });
// Rugs and wall hangings don't block.
const flat = (prop, x, y) => at(prop, x, y, false);

const P = PROPS;

// Furniture, in tile coordinates. check:map catches anything out of bounds.
export const OBJECTS = [
  // ABOUT ME — a lounge, with photos on the back wall.
  flat(P.rugRed, 7, 12),
  at(P.sofa, 16, 6),
  at(P.armchairs, 8, 15),
  at(P.stool, 11, 15),
  at(P.screen, 5, 6),
  flat(P.photoFrame, 14, 3),
  flat(P.photoFrame, 16, 3),
  flat(P.aquarium, 18, 3),
  at(P.bookcase, 19, 12),
  at(P.plant, 3, 16),
  at(P.palm, 20, 17),

  // THE TECH LAB — desks, boards, a globe.
  at(P.deskPair, 38, 12),
  at(P.deskPair, 41, 12),
  at(P.deskBooks, 44, 12),
  at(P.chalkboard, 37, 5),
  at(P.shelfBooks, 48, 6),
  at(P.globe, 46, 16),
  flat(P.worldMap, 44, 3),
  flat(P.photoFrame, 48, 3),
  at(P.plant, 35, 16),
  at(P.palm, 51, 17),

  // THE ARCADE — machines along the top, shelves down both walls.
  at(P.screen, 5, 27),
  at(P.screen, 8, 27),
  at(P.screen, 11, 27),
  at(P.screen, 14, 27),
  at(P.screen, 17, 27),
  flat(P.rugRed, 10, 30),
  at(P.bookcase, 3, 30),
  at(P.bookcase, 3, 35),
  at(P.shelfBooks, 19, 30),
  at(P.shelfBooks, 19, 33),
  at(P.shelfBooks, 19, 36),
  flat(P.photoFrame, 8, 23),
  flat(P.photoFrame, 16, 23),
  at(P.plant, 6, 36),

  // THE OFFICE — meeting table, counter, seating.
  at(P.counter, 38, 28),
  at(P.chair, 38, 30),
  at(P.chair, 40, 30),
  at(P.shelfBooks, 46, 28),
  at(P.sofa, 48, 35),
  flat(P.rugRed, 45, 32),
  flat(P.photoFrame, 40, 23),
  flat(P.worldMap, 47, 23),
  at(P.palm, 34, 37),
  at(P.plant, 51, 26),

  // Quiet corners either side of the building.
  at(P.plant, 0, 8),
  at(P.plant, 0, 21),
  at(P.plant, 0, 41),
  at(P.plant, 54, 8),
  at(P.plant, 54, 21),
  at(P.plant, 54, 41),
];

// The console in each room.
export const CONSOLE_SPRITE = { src: [10, 40], w: 2, h: 2 };

// Garden median down the lobby. Grass walks, water doesn't. The gap between
// the middle ponds is the crossing (and where the name sign sits).
export const GARDENS = [{ x: 26, y: 3, w: 4, h: 38 }];

export const PONDS = [
  { x: 27, y: 5, w: 2, h: 5 },
  { x: 27, y: 11, w: 2, h: 5 },
  { x: 27, y: 27, w: 2, h: 5 },
  { x: 27, y: 33, w: 2, h: 5 },
];

// Text painted onto the world.
export const LABELS = [
  { text: "AADITYA\nGUPTA", x: 28, y: 21, size: 10 },
  { text: "LOBBY", x: 23.6, y: 13, size: 10 },
  ...ROOMS.map((r) => ({
    text: r.label,
    x: r.x + r.w / 2,
    y: r.y + 1.2,
    size: 10,
  })),
];

// Lobby walkway, beside the median.
export const SPAWN = { x: 24.5 * TILE, y: 24 * TILE };

// One-tile ring around each console from which it can be used.
export const INTERACTIONS = ROOMS.map((r) => ({
  id: r.id,
  section: r.section,
  prompt: r.prompt,
  terminal: r.terminal,
  x: r.terminal.x - 1,
  y: r.terminal.y - 1,
  w: CONSOLE_SPRITE.w + 2,
  h: CONSOLE_SPRITE.h + 2,
}));

// Three walls per room; the open side is the doorway.
export const ROOM_WALLS = ROOMS.map((r) => {
  const openRight = r.open === "right";
  const sideX = openRight ? r.x - 1 : r.x + r.w;
  const runX = openRight ? r.x - 1 : r.x;
  return {
    paper: r.wall,
    top: { x: runX, y: r.y - WALL_H, w: r.w + 1 },
    side: { x: sideX, y: r.y, h: r.h },
    bottom: { x: runX, y: r.y + r.h, w: r.w + 1 },
  };
});

// Back wall across the whole map.
export const BACK_WALL = { x: 0, y: 0, w: MAP_W, paper: WALLPAPERS.khaki };

function markSolid(solid, x, y, w, h) {
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      if (i >= 0 && i < MAP_W && j >= 0 && j < MAP_H) solid[j * MAP_W + i] = 1;
    }
  }
}

export function buildCollision() {
  const solid = new Uint8Array(MAP_W * MAP_H);

  markSolid(solid, BACK_WALL.x, BACK_WALL.y, BACK_WALL.w, WALL_H);
  for (const w of ROOM_WALLS) {
    markSolid(solid, w.top.x, w.top.y, w.top.w, WALL_H);
    markSolid(solid, w.side.x, w.side.y, 1, w.side.h);
    markSolid(solid, w.bottom.x, w.bottom.y, w.bottom.w, 1);
  }

  // Grass is walkable; water is not.
  for (const p of PONDS) markSolid(solid, p.x, p.y, p.w, p.h);

  for (const o of OBJECTS) {
    if (o.solid) markSolid(solid, o.x, o.y, o.w, o.h);
  }

  // Consoles are solid.
  for (const r of ROOMS) {
    markSolid(solid, r.terminal.x, r.terminal.y, CONSOLE_SPRITE.w, CONSOLE_SPRITE.h);
  }

  return solid;
}
