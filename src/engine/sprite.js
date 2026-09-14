// Frames are in one row, grouped by direction in this order.
export const DIRS = ["right", "up", "left", "down"];

// Run frames per direction.
export const RUN_FRAMES = 6;


export const CELL = { w: 16, h: 32 };

// ms per run frame.
export const RUN_FRAME_MS = 90;

// Sheet and cell for the current state. `anim` is walk time in ms.
export function spriteFrame({ dir, moving, anim }) {
  const row = Math.max(0, DIRS.indexOf(dir));
  if (!moving) return { sheet: "idle", index: row };
  const step = Math.floor(anim / RUN_FRAME_MS) % RUN_FRAMES;
  return { sheet: "run", index: row * RUN_FRAMES + step };
}
