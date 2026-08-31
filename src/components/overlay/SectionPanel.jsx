import { useState } from "react";
import { motion } from "framer-motion";
import About from "../sections/About";
import Sandbox from "../sections/Sandbox";
import Skills from "../sections/Skills";
import Contact from "../sections/Contact";
import { profile } from "../../data/content";

const VIEWS = { about: About, sandbox: Sandbox, skills: Skills, contact: Contact };

/**
 * A traffic-light button. The dot stays small, but the button around it carries
 * a padded hit area so it is actually clickable, and tappable on a phone.
 */
function WindowButton({ colour, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="group -m-1 cursor-pointer p-1"
    >
      <span
        className={`block size-2.5 rounded-full transition-opacity ${colour} opacity-70 group-hover:opacity-100`}
      />
    </button>
  );
}

/** Terminal window that opens over the world when you use a room console. */
export default function SectionPanel({ section, onClose }) {
  const [minimised, setMinimised] = useState(false);
  const [maximised, setMaximised] = useState(false);

  const View = VIEWS[section];
  if (!View) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      // Flex, not grid: a grid row sized to its content makes the panel's
      // max-height:100% resolve against the grown row, so it never constrains
      // and the body can never overflow enough to scroll.
      className={`absolute inset-0 z-30 flex items-center justify-center bg-black/70 ${
        maximised ? "p-0" : "p-3 sm:p-6"
      }`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full flex-col border-term-border bg-term-panel shadow-2xl ${
          maximised
            ? "h-full max-w-none border-0"
            : "max-h-full max-w-4xl border"
        }`}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-term-border px-3 py-2">
          <span className="flex items-center gap-1.5">
            <WindowButton colour="bg-term-red" label="Close" onClick={onClose} />
            <WindowButton
              colour="bg-term-amber"
              label={minimised ? "Restore" : "Minimise"}
              onClick={() => setMinimised((v) => !v)}
            />
            <WindowButton
              colour="bg-term-green"
              label={maximised ? "Restore size" : "Maximise"}
              onClick={() => {
                setMinimised(false);
                setMaximised((v) => !v);
              }}
            />
          </span>

          <p className="ml-2 truncate text-xs text-term-dim">
            {profile.handle}@{profile.host}: ~/{section}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto border border-term-border px-2 py-0.5 text-xs text-term-dim transition-colors hover:border-term-red/60 hover:text-term-red"
          >
            close ESC
          </button>
        </div>

        {!minimised && (
          <div className="term-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 text-[13px] leading-relaxed sm:px-6 sm:text-sm">
            <View />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
