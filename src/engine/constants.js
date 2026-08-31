/** One tile in world (logical) pixels. Everything is drawn at this resolution
 *  and then blitted with nearest-neighbour scaling, which is what gives the
 *  whole thing its pixel-art crunch. */
export const TILE = 16;

export const MAP_W = 56;
export const MAP_H = 44;

export const WORLD_W = MAP_W * TILE;
export const WORLD_H = MAP_H * TILE;

/** Walk speed in logical px per second (~5 tiles/s). */
export const SPEED = 78;

/** Player collision box, in logical px, anchored at the feet. */
export const HITBOX = { w: 10, h: 6 };

/** Character cells are one tile wide, two tall. */
export const SPRITE = { w: 16, h: 32 };

/** How far the sprite's feet sit below the player's y anchor. */
export const SPRITE_FOOT_OFFSET = 2;
