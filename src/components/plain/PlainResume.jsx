import { profile } from "../../data/content";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Sandbox from "../sections/Sandbox";
import Contact from "../sections/Contact";

// The landing page. Same section components the world's consoles open.
export default function PlainResume({ onPlay }) {
  return (
    <main className="term-scroll h-dvh overflow-y-auto bg-term-bg">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-8 text-[13px] leading-relaxed sm:px-8 sm:py-12 sm:text-sm">
        <header className="space-y-2 border-b border-term-border pb-6">
          <p className="text-xs text-term-dim">
            {profile.handle}@{profile.host}: ~
          </p>
          <h1 className="text-xl text-term-green text-glow sm:text-2xl">
            {profile.name}
          </h1>
          <p className="text-term-fg/80">
            {profile.role} <span className="text-term-dim">·</span>{" "}
            {profile.location}
          </p>

          {onPlay && (
            <p className="pt-3">
              <button
                type="button"
                onClick={onPlay}
                className="border border-term-green/60 px-3 py-1.5 text-term-green transition-colors hover:bg-term-green/10"
              >
                → explore the interactive version
              </button>
            </p>
          )}
        </header>

        <About />
        <Skills />
        <Sandbox />
        <Contact />

      </div>
    </main>
  );
}
