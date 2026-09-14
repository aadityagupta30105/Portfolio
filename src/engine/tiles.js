import { MAP_H, MAP_W, TILE, WORLD_H, WORLD_W } from "./constants.js";
import {
  BACK_WALL,
  CONSOLE_SPRITE,
  FLOORS,
  FLOOR_BLOCK,
  LABELS,
  OBJECTS,
  ROOMS,
  ROOM_WALLS,
  WALL_H,
} from "./mapData.js";
import { drawGardens } from "./garden.js";

// Copy a block of tiles from a sheet onto the map.
function blit(ctx, sheet, sc, sr, sw, sh, tx, ty) {
  ctx.drawImage(
    sheet,
    sc * TILE,
    sr * TILE,
    sw * TILE,
    sh * TILE,
    tx * TILE,
    ty * TILE,
    sw * TILE,
    sh * TILE,
  );
}

// Floors are 3x2 blocks that repeat.
function drawFloor(ctx, sheet, floor, x, y, w, h) {
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      if (i < 0 || j < 0 || i >= MAP_W || j >= MAP_H) continue;
      const sc = floor.c + (((i % FLOOR_BLOCK.w) + FLOOR_BLOCK.w) % FLOOR_BLOCK.w);
      const sr = floor.r + (((j % FLOOR_BLOCK.h) + FLOOR_BLOCK.h) % FLOOR_BLOCK.h);
      blit(ctx, sheet, sc, sr, 1, 1, i, j);
    }
  }
}

// Wall run: column 0 = left cap, 1 = middle, 2 = right cap.
function drawWall(ctx, sheet, strip) {
  const last = strip.x + strip.w - 1;
  for (let i = strip.x; i <= last; i++) {
    const col = i === strip.x ? 0 : i === last ? 2 : 1;
    for (let row = 0; row < WALL_H; row++) {
      blit(ctx, sheet, col, strip.paper + row, 1, 1, i, strip.y + row);
    }
  }
}

// Side/front returns, using the plain lower wallpaper row.
function drawWallRun(ctx, sheet, paper, x, y, w, h) {
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      blit(ctx, sheet, 1, paper + 1, 1, 1, i, j);
    }
  }
}

// Outlined label; a newline in `text` stacks lines centred on `y`.
function drawLabel(ctx, { text, x, y, size }) {
  ctx.font = `bold ${size}px "Fira Code", "Space Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = 3;

  const lines = String(text).split("\n");
  const lineHeight = size + 3;
  const top = y * TILE - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, i) => {
    const ly = top + i * lineHeight;
    ctx.strokeStyle = "#1b2020";
    ctx.strokeText(line, x * TILE, ly);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(line, x * TILE, ly);
  });
}

// Render the static world once to an offscreen canvas.
export function renderWorld(sheets) {
  const canvas = document.createElement("canvas");
  canvas.width = WORLD_W;
  canvas.height = WORLD_H;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  drawFloor(ctx, sheets.rooms, FLOORS.grey, 0, 0, MAP_W, MAP_H);
  for (const room of ROOMS) {
    drawFloor(ctx, sheets.rooms, room.floor, room.x, room.y, room.w, room.h);
  }
  drawGardens(ctx);

  drawWall(ctx, sheets.rooms, BACK_WALL);
  for (const w of ROOM_WALLS) {
    drawWallRun(ctx, sheets.rooms, w.paper, w.side.x, w.side.y, 1, w.side.h);
    drawWallRun(ctx, sheets.rooms, w.paper, w.bottom.x, w.bottom.y, w.bottom.w, 1);
    drawWall(ctx, sheets.rooms, { ...w.top, paper: w.paper });
  }

  for (const o of OBJECTS) {
    blit(ctx, sheets.interiors, o.src[0], o.src[1], o.w, o.h, o.x, o.y);
  }
  for (const room of ROOMS) {
    blit(
      ctx,
      sheets.interiors,
      CONSOLE_SPRITE.src[0],
      CONSOLE_SPRITE.src[1],
      CONSOLE_SPRITE.w,
      CONSOLE_SPRITE.h,
      room.terminal.x,
      room.terminal.y,
    );
  }

  for (const label of LABELS) drawLabel(ctx, label);

  return canvas;
}
