import { LABELS } from "./mapData.js";

// Sprite sheets from Modern Interiors (see public/tiles/LICENSE.txt).
const SOURCES = {
  rooms: "tiles/rooms.png", // floors + wallpapers (Room_Builder)
  interiors: "tiles/interiors.png", // furniture and props
  idle: "tiles/adam_idle.png", // 4 frames, one per direction
  run: "tiles/adam_run.png", // 6 frames per direction

  // Wanderers, same layout.
  alex_idle: "tiles/alex_idle.png",
  alex_run: "tiles/alex_run.png",
  amelia_idle: "tiles/amelia_idle.png",
  amelia_run: "tiles/amelia_run.png",
  bob_idle: "tiles/bob_idle.png",
  bob_run: "tiles/bob_run.png",
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = `${import.meta.env.BASE_URL}${src}`;
  });
}

export async function loadSheets() {
  const names = Object.keys(SOURCES);
  const images = await Promise.all(names.map((n) => loadImage(SOURCES[n])));
  return Object.fromEntries(names.map((n, i) => [n, images[i]]));
}

// The world labels are drawn once, so the font must be loaded before that.
export async function loadLabelFont() {
  if (!document.fonts?.load) return;
  const sizes = new Set(LABELS.map((l) => l.size));
  try {
    await Promise.all(
      [...sizes].map((size) => document.fonts.load(`bold ${size}px "Fira Code"`)),
    );
  } catch {
    // cosmetic only; don't block the world on it
  }
}
