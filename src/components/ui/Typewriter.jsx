import { useEffect, useRef, useState } from "react";
import Cursor from "./Cursor";

// Human typing isn't metronomic; vary each keystroke around the target speed.
const jitter = (ms) => ms * (0.55 + Math.random() * 0.9);

/**
 * Reveals `text` one character at a time.
 * Set `skip` to true to fast-forward to the end (used by the "press any key" bail-out).
 */
export default function Typewriter({
  text = "",
  speed = 22,
  startDelay = 0,
  skip = false,
  onComplete,
  showCursor = false,
  cursorSize = "md",
  className = "",
  as: Tag = "span",
}) {
  const [count, setCount] = useState(0);

  // Keep the callback in a ref so a new inline closure each render can't restart the timer.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setCount(0);
  }, [text]);

  useEffect(() => {
    if (skip) {
      setCount(text.length);
      return;
    }
    if (count >= text.length) return;

    const timer = setTimeout(
      () => setCount((c) => c + 1),
      count === 0 ? startDelay : jitter(speed),
    );
    return () => clearTimeout(timer);
  }, [count, text, speed, startDelay, skip]);

  const done = count >= text.length;

  useEffect(() => {
    if (done) onCompleteRef.current?.();
  }, [done, text]);

  return (
    <Tag className={className}>
      {/* Full text stays in the a11y tree so screen readers don't hear it letter by letter. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {showCursor && !done && <Cursor size={cursorSize} />}
    </Tag>
  );
}
