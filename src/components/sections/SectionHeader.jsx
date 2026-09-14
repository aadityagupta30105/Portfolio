export default function SectionHeader({ path, note }) {
  return (
    <header className="flex flex-wrap items-baseline gap-x-3 border-b border-term-border pb-2">
      <h2 className="text-term-green text-glow">{path}</h2>
      {note && <span className="text-xs text-term-dim">{note}</span>}
    </header>
  );
}
