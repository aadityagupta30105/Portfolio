const PAD = [
  { dir: "up", label: "▲", area: "1 / 2 / 2 / 3" },
  { dir: "left", label: "◀", area: "2 / 1 / 3 / 2" },
  { dir: "right", label: "▶", area: "2 / 3 / 3 / 4" },
  { dir: "down", label: "▼", area: "3 / 2 / 4 / 3" },
];

/** On-screen pad that writes into the same input object the keyboard uses. */
export default function TouchControls({ inputRef, onAction }) {
  const hold = (dir, value) => (e) => {
    e.preventDefault();
    inputRef.current[dir] = value;
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4 sm:hidden">
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1">
        {PAD.map(({ dir, label, area }) => (
          <button
            key={dir}
            type="button"
            aria-label={`Walk ${dir}`}
            style={{ gridArea: area }}
            onPointerDown={hold(dir, true)}
            onPointerUp={hold(dir, false)}
            onPointerCancel={hold(dir, false)}
            onPointerLeave={hold(dir, false)}
            onContextMenu={(e) => e.preventDefault()}
            className="size-12 touch-none select-none border border-term-green/50 bg-black/60 text-term-green active:bg-term-green/25"
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="Interact"
        onPointerDown={(e) => {
          e.preventDefault();
          onAction();
        }}
        onContextMenu={(e) => e.preventDefault()}
        className="pointer-events-auto size-16 touch-none select-none rounded-full border-2 border-term-amber/70 bg-black/60 text-sm font-bold text-term-amber active:bg-term-amber/25"
      >
        ENTER
      </button>
    </div>
  );
}
