import { useEffect, useMemo, useRef, useState } from "react";
import {
  SPRITE,
  SPRITE_FOOT_OFFSET,
  TILE,
  WORLD_H,
  WORLD_W,
} from "../../engine/constants.js";
import { buildCollision } from "../../engine/mapData.js";
import { loadLabelFont, loadSheets } from "../../engine/assets.js";
import { renderWorld } from "../../engine/tiles.js";
import { spriteFrame } from "../../engine/sprite.js";
import {
  createPlayer,
  roomAt,
  stepPlayer,
  tileUnder,
  zoneAt,
} from "../../engine/player.js";
import { createNpcs, stepNpcs } from "../../engine/npc.js";

const KEY_MAP = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

const NO_INPUT = { up: false, down: false, left: false, right: false };

/**
 * Canvas renderer + game loop. Owns player position, collision and camera, and
 * reports zone changes upward so React drives dialogue and panels without
 * re-rendering every frame.
 */
export default function GameWorld({ inputRef, frozen, onNear, onEnterRoom }) {
  const canvasRef = useRef(null);
  const playerRef = useRef(createPlayer());
  const npcsRef = useRef(createNpcs());
  const nearRef = useRef(null);
  const roomRef = useRef(null);
  const frozenRef = useRef(frozen);

  frozenRef.current = frozen;

  const [sheets, setSheets] = useState(null);
  const [error, setError] = useState(null);

  const solid = useMemo(() => buildCollision(), []);
  const world = useMemo(() => (sheets ? renderWorld(sheets) : null), [sheets]);

  // The world's labels are painted into the offscreen canvas exactly once, so
  // the label font has to be in hand before that happens — otherwise a cold
  // load bakes a fallback typeface in and nothing ever redraws it.
  useEffect(() => {
    let alive = true;
    Promise.all([loadSheets(), loadLabelFont()]).then(
      ([loaded]) => alive && setSheets(loaded),
      (err) => alive && setError(err.message),
    );
    return () => {
      alive = false;
    };
  }, []);

  // Keyboard writes into the same input object the touch pad mutates.
  useEffect(() => {
    const set = (e, value) => {
      // Leave browser shortcuts alone. Ctrl/Cmd + A, S and D all collide with
      // the walk bindings, and swallowing them means you cannot even select
      // the text in an open panel to copy it.
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // An open panel owns the keyboard, so arrow keys still scroll it.
      if (frozenRef.current) return;
      const key = KEY_MAP[e.key];
      if (!key) return;
      e.preventDefault();
      inputRef.current[key] = value;
    };
    const down = (e) => set(e, true);
    const up = (e) => set(e, false);
    const clear = () => Object.assign(inputRef.current, NO_INPUT);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [inputRef]);

  useEffect(() => {
    if (!world || !sheets) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let last = performance.now();

    const update = (dt) => {
      const p = playerRef.current;
      stepPlayer(p, frozenRef.current ? NO_INPUT : inputRef.current, dt, solid);
      // NPCs keep milling about while a panel is open; it costs nothing and
      // the world looks alive behind the dialogue.
      stepNpcs(npcsRef.current, dt, solid);

      const { tx, ty } = tileUnder(p);

      const near = zoneAt(tx, ty);
      if (near?.id !== nearRef.current?.id) {
        nearRef.current = near;
        onNear(near);
      }

      const room = roomAt(tx, ty);
      if (room?.id !== roomRef.current?.id) {
        roomRef.current = room;
        onEnterRoom(room);
      }
    };

    const drawPrompt = (zone, scale, camX, camY) => {
      const text = `Press ENTER to view ${zone.prompt}`;
      ctx.font = 'bold 9px "Fira Code", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cx = (zone.terminal.x + 1) * TILE;
      const cy = zone.terminal.y * TILE - 6;
      const boxW = ctx.measureText(text).width + 12;

      const sx = Math.round((cx - camX) * scale);
      const sy = Math.round((cy - camY) * scale);
      const bw = Math.round(boxW * scale);
      const bh = Math.round(16 * scale);

      ctx.fillStyle = "#0b0f0cee";
      ctx.fillRect(sx - bw / 2, sy - bh / 2, bw, bh);
      ctx.strokeStyle = "#00ff9c";
      ctx.lineWidth = Math.max(1, Math.round(scale / 2));
      ctx.strokeRect(sx - bw / 2, sy - bh / 2, bw, bh);

      ctx.font = `bold ${9 * scale}px "Fira Code", monospace`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, sx, sy + 1);
    };

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (!cssW || !cssH) return;

      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
      }

      // Integer zoom only — a fractional one would break pixel alignment.
      const zoom = cssW >= 1500 ? 3 : 2;
      const scale = zoom * dpr;
      const viewW = cssW / zoom;
      const viewH = cssH / zoom;

      const p = playerRef.current;
      const camX =
        viewW >= WORLD_W
          ? (WORLD_W - viewW) / 2
          : Math.max(0, Math.min(WORLD_W - viewW, p.x - viewW / 2));
      const camY =
        viewH >= WORLD_H
          ? (WORLD_H - viewH) / 2
          : Math.max(0, Math.min(WORLD_H - viewH, p.y - viewH / 2));

      const sx = Math.floor(camX);
      const sy = Math.floor(camY);
      const sw = Math.ceil(viewW) + 1;
      const sh = Math.ceil(viewH) + 1;

      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#20232a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(world, sx, sy, sw, sh, 0, 0, sw * scale, sh * scale);

      // Draw everyone sorted by feet position so characters lower on the map
      // overlap those behind them.
      const cast = [
        ...npcsRef.current.map((n) => ({ actor: n, prefix: `${n.sheet}_` })),
        { actor: p, prefix: "" },
      ].sort((a, b) => a.actor.y - b.actor.y);

      for (const { actor, prefix } of cast) {
        const frame = spriteFrame(actor);
        ctx.drawImage(
          sheets[`${prefix}${frame.sheet}`],
          frame.index * SPRITE.w,
          0,
          SPRITE.w,
          SPRITE.h,
          Math.round((Math.round(actor.x) - SPRITE.w / 2 - sx) * scale),
          Math.round(
            (Math.round(actor.y) - SPRITE.h + SPRITE_FOOT_OFFSET - sy) * scale,
          ),
          SPRITE.w * scale,
          SPRITE.h * scale,
        );
      }

      if (nearRef.current && !frozenRef.current) {
        drawPrompt(nearRef.current, scale, sx, sy);
      }
    };

    const loop = (now) => {
      const dt = Math.min(48, now - last);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [world, sheets, solid, inputRef, onNear, onEnterRoom]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-label="Explorable pixel-art world. Use arrow keys or WASD to walk."
        className="block size-full touch-none"
      />
      {!world && (
        <div className="absolute inset-0 grid place-items-center bg-black text-sm text-term-dim">
          {error ? (
            <p className="px-6 text-center text-term-red">
              Could not load the tilesets: {error}
            </p>
          ) : (
            <p>loading world…</p>
          )}
        </div>
      )}
    </>
  );
}
