import { motion } from "framer-motion";
import { projects } from "../../data/content";
import SectionHeader from "./SectionHeader";

export default function Sandbox() {
  return (
    <section className="space-y-4">
      <SectionHeader path="~/sandbox" note={`${projects.length} entries`} />

      <div className="grid gap-3 lg:grid-cols-2">
        {projects.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="group border border-term-border bg-term-raised/60 p-4 transition-colors hover:border-term-green/50"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-term-green">
                <span className="text-term-dim">{p.id}/</span>
                {p.name}
              </h3>
              <span
                className={
                  p.status === "active" ? "text-xs text-term-cyan" : "text-xs text-term-dim"
                }
              >
                [{p.status}]
              </span>
            </div>

            <p className="mt-2 text-term-amber">{p.tagline}</p>
            <p className="mt-2 text-sm text-term-fg/75">{p.detail}</p>

            <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-term-dim">
              {p.stack.map((s) => (
                <li key={s} className="border border-term-border px-2 py-0.5">
                  {s}
                </li>
              ))}
            </ul>

            <a
              href={p.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-block text-sm text-term-green underline-offset-4 hover:underline"
            >
              → open repository
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
