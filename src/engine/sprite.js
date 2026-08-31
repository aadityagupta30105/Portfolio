/**
 * Adam from the Modern Interiors character set. Both sheets lay their frames
 * out in a single row, grouped by direction in this order — confirmed by
 * locating the face pixels in each frame rather than assuming.
 */
export const DIRS = ["right", "up", "left", "down"];

/** Frames per direction on adam_run.png. */
export const RUN_FRAMES = 6;

/** Character cells are one tile wide and two tall. */
export const CELL = { w: 16, h: 32 };

/** Milliseconds per run frame. */
export const RUN_FRAME_MS = 90;

/**
 * Which sheet and cell to draw for the player's current state.
 * `anim` is the accumulated walk time in ms.
 */
export function spriteFrame({ dir, moving, anim }) {
  const row = Math.max(0, DIRS.indexOf(dir));
  if (!moving) return { sheet: "idle", index: row };
  const step = Math.floor(anim / RUN_FRAME_MS) % RUN_FRAMES;
  return { sheet: "run", index: row * RUN_FRAMES + step };
}
