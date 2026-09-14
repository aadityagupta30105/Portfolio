const SIZES = {
  sm: "h-[1em] w-[0.5em]",
  md: "h-[1.15em] w-[0.6em]",
  lg: "h-[1.2em] w-[0.65em]",
};

export default function Cursor({ size = "md", color = "bg-term-green", className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`cursor-block ml-[0.15em] inline-block translate-y-[0.15em] ${SIZES[size]} ${color} ${className}`}
    />
  );
}
