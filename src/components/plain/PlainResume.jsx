import { credits, profile } from "../../data/content";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Sandbox from "../sections/Sandbox";
import Contact from "../sections/Contact";

/**
 * The whole portfolio as an ordinary scrolling page.
 *
 * The world is the point of the site, but it is a canvas: a screen reader, a
 * crawler, a link preview and anyone who would rather not play a game all get
 * one aria-label out of it and nothing else. This renders the very same
 * section components the room consoles open, so there is still exactly one
 * copy of every word in src/data/content.js.
 */
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
                → walk around the pixel-art version instead
              </button>
            </p>
          )}
        </header>

        <About />
        <Skills />
        <Sandbox />
        <Contact />

        {/* The art credit rides along inside Contact, so it is not repeated here. */}
        <footer className="border-t border-term-border pt-6 text-xs text-term-dim">
          <p>{credits.built}</p>
        </footer>
      </div>
    </main>
  );
}
