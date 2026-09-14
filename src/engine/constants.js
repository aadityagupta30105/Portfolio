// Tile size in world pixels. Everything is drawn at 1x and scaled up.
export const TILE = 16;

export const MAP_W = 56;
export const MAP_H = 44;

export const WORLD_W = MAP_W * TILE;
export const WORLD_H = MAP_H * TILE;

// px per second (~5 tiles/s).
export const SPEED = 78;

// Collision box, anchored at the feet.
export const HITBOX = { w: 10, h: 6 };


export const SPRITE = { w: 16, h: 32 };

// Feet offset below the y anchor.
export const SPRITE_FOOT_OFFSET = 2;
