import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GameWorld from "./components/world/GameWorld";
import WorldBoundary from "./components/world/WorldBoundary";
import DialogueBox from "./components/overlay/DialogueBox";
import SectionPanel from "./components/overlay/SectionPanel";
import TouchControls from "./components/world/TouchControls";
import PlainResume from "./components/plain/PlainResume";
import { bootMessage, profile } from "./data/content";

// ?play opens the world directly.
const PLAY_PARAM = "play";

const wantsWorld = () =>
  new URLSearchParams(window.location.search).has(PLAY_PARAM);

export default function App() {
  // Fresh id per dialogue so identical text still remounts.
  const dialogueId = useRef(0);
  const [dialogue, setDialogue] = useState({
    id: 0,
    text: bootMessage,
    action: "Start",
  });
  const [panel, setPanel] = useState(null);
  const [plain, setPlain] = useState(() => !wantsWorld());

  const inputRef = useRef({ up: false, down: false, left: false, right: false });
  const nearRef = useRef(null);
  const visitedRef = useRef(new Set());
  const dialogueRef = useRef(dialogue);
  const panelRef = useRef(panel);

  dialogueRef.current = dialogue;
  panelRef.current = panel;

  // Stable callbacks; GameWorld holds them for the life of its loop.
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

  const showPlain = useCallback(() => {
    setPlain(true);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const showWorld = useCallback(() => {
    setPlain(false);
    window.history.replaceState(null, "", `?${PLAY_PARAM}`);
  }, []);

  useEffect(() => {
    if (plain) return;
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
  }, [interact, plain]);

  const frozen = Boolean(dialogue) || Boolean(panel);

  // A dialogue unmounts the touch pad mid-press, so clear any held direction.
  useEffect(() => {
    if (!frozen) return;
    const input = inputRef.current;
    input.up = false;
    input.down = false;
    input.left = false;
    input.right = false;
  }, [frozen]);

  if (plain) return <PlainResume onPlay={showWorld} />;

  return (
    <WorldBoundary fallback={<PlainResume />}>
      <main className="relative h-dvh w-full overflow-hidden bg-black">
        <button
          type="button"
          onClick={showPlain}
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-40 focus:border focus:border-term-green focus:bg-black focus:px-3 focus:py-2 focus:text-sm focus:text-term-green"
        >
          Back to the plain page
        </button>

        <GameWorld
          inputRef={inputRef}
          frozen={frozen}
          onNear={handleNear}
          onEnterRoom={handleEnterRoom}
        />

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
          <p>
            <button
              type="button"
              onClick={showPlain}
              className="pointer-events-auto text-term-cyan underline-offset-2 hover:underline"
            >
              ← back to the plain page
            </button>
          </p>
        </div>

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
    </WorldBoundary>
  );
}
