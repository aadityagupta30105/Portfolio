import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GameWorld from "./components/world/GameWorld";
import DialogueBox from "./components/overlay/DialogueBox";
import SectionPanel from "./components/overlay/SectionPanel";
import TouchControls from "./components/world/TouchControls";
import { bootMessage, profile } from "./data/content";

export default function App() {
  // Each dialogue gets a fresh id so identical text still remounts the box.
  const dialogueId = useRef(0);
  const [dialogue, setDialogue] = useState({
    id: 0,
    text: bootMessage,
    action: "Start",
  });
  const [panel, setPanel] = useState(null);

  const inputRef = useRef({ up: false, down: false, left: false, right: false });
  const nearRef = useRef(null);
  const visitedRef = useRef(new Set());
  const dialogueRef = useRef(dialogue);
  const panelRef = useRef(panel);

  dialogueRef.current = dialogue;
  panelRef.current = panel;

  // Stable callbacks: GameWorld keeps these for the lifetime of its loop.
  const handleNear = useCallback((zone) => {
    nearRef.current = zone;
  }, []);

  const handleEnterRoom = useCallback((room) => {
    if (!room || visitedRef.current.has(room.id)) return;
    visitedRef.current.add(room.id);
    dialogueId.current += 1;
    setDialogue({ id: dialogueId.current, text: room.greeting, action: "Next" });
  }, []);

  const interact = useCallback(() => {
    if (dialogueRef.current || panelRef.current) return;
    if (nearRef.current) setPanel(nearRef.current.section);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setPanel(null);
        return;
      }
      // While a dialogue is up it owns ENTER (first press finishes the text).
      if (e.key !== "Enter" || dialogueRef.current) return;
      e.preventDefault();
      interact();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interact]);

  const frozen = Boolean(dialogue) || Boolean(panel);

  // Walking into a room opens a dialogue, which unmounts the touch pad mid-press
  // and so never delivers its pointerup. Drop all input rather than leave a
  // direction latched on for when the dialogue closes.
  useEffect(() => {
    if (!frozen) return;
    const input = inputRef.current;
    input.up = false;
    input.down = false;
    input.left = false;
    input.right = false;
  }, [frozen]);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      <GameWorld
        inputRef={inputRef}
        frozen={frozen}
        onNear={handleNear}
        onEnterRoom={handleEnterRoom}
      />

      {/* Sits over bright pixel art, so it needs a near-opaque plate to stay legible. */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 w-fit space-y-1 border border-term-border bg-black/85 px-2.5 py-1.5 text-[11px] leading-snug text-term-fg sm:left-5 sm:top-5 sm:text-xs">
        <p>
          <span className="text-term-green">{profile.name}</span>
          <span className="text-term-fg/70"> — {profile.role}</span>
        </p>
        <p className="text-term-fg/70">
          <span className="sm:hidden">
            <span className="text-term-amber">pad</span> to walk ·{" "}
            <span className="text-term-amber">ENTER</span> at a console
          </span>
          <span className="hidden sm:inline">
            <span className="text-term-amber">WASD</span> /{" "}
            <span className="text-term-amber">arrows</span> to walk ·{" "}
            <span className="text-term-amber">ENTER</span> at a console to read
          </span>
        </p>
      </div>

      {/* Nothing to steer while a dialogue or panel is up, and the pad would
          otherwise sit underneath them. Tapping anywhere dismisses a dialogue. */}
      {!frozen && <TouchControls inputRef={inputRef} onAction={interact} />}

      <AnimatePresence>
        {dialogue && (
          <DialogueBox
            key={dialogue.id}
            text={dialogue.text}
            action={dialogue.action}
            onDismiss={() => setDialogue(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panel && (
          <SectionPanel section={panel} onClose={() => setPanel(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
