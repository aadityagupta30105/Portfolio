import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Typewriter from "../ui/Typewriter";
import Portrait from "./Portrait";

// Bottom-of-screen message. First ENTER finishes the typing, second dismisses.
export default function DialogueBox({ text, action = "Next", onDismiss }) {
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);

  // Still mounted during the exit animation; must stop eating input once dismissed.
  const dismissed = useRef(false);

  useEffect(() => {
    setDone(false);
    setSkip(false);
    dismissed.current = false;
  }, [text]);

  const advance = useCallback(() => {
    if (dismissed.current) return;
    if (done) {
      dismissed.current = true;
      onDismiss();
    } else {
      setSkip(true);
    }
  }, [done, onDismiss]);

  useEffect(() => {
    const onKey = (e) => {
      if (dismissed.current) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      advance();
    };
    const onClick = () => advance();

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("click", onClick);
    };
  }, [advance]);

  return (
    <motion.div
      initial={{ y: 24 }}
      animate={{ y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:p-6"
    >
      <div className="mx-auto flex max-w-4xl gap-3 rounded-lg border border-term-border bg-[#050706] p-4 shadow-2xl sm:gap-5 sm:p-6">
        <Portrait />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="flex-1 text-[13px] leading-relaxed sm:text-base">
            <span className="text-term-green text-glow">system:</span>{" "}
            <Typewriter
              text={text}
              speed={14}
              skip={skip}
              showCursor
              onComplete={() => setDone(true)}
              className="text-term-fg"
            />
          </p>

          <p className="flex shrink-0 items-center gap-2 self-end whitespace-nowrap text-sm sm:self-auto">
            <span className="text-term-amber text-glow-amber">{action}</span>
            <span className="border border-term-amber/70 px-2 py-0.5 text-xs text-term-amber">
              ENTER
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
