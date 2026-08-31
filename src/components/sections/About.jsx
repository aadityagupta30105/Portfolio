import { about, education, experience, profile } from "../../data/content";
import SectionHeader from "./SectionHeader";

export default function About() {
  return (
    <section className="space-y-6">
      <SectionHeader path={about.title} />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <img
          src={`${import.meta.env.BASE_URL}${profile.portrait}`}
          alt={`${profile.name}, ${profile.role}`}
          className="w-32 shrink-0 self-start rounded border border-term-border object-cover sm:w-40"
        />

        <div className="min-w-0 space-y-3 text-term-fg/90">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[max-content_1fr]">
        {about.stats.map((s) => (
          <div key={s.label} className="contents">
            <dt className="text-term-dim">{s.label.padEnd(12, ".")}</dt>
            <dd className="mb-2 text-term-amber sm:mb-0">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-3">
        <h3 className="text-term-green">## experience</h3>
        {experience.map((job) => (
          <article key={job.org} className="border-l border-term-border pl-4">
            <p className="text-term-fg">
              {job.role} <span className="text-term-dim">·</span>{" "}
              <span className="text-term-amber">{job.org}</span>
            </p>
            <p className="text-xs text-term-dim">
              {job.period} · {job.place}
            </p>
            <ul className="mt-2 space-y-1">
              {job.bullets.map((b, i) => (
                <li key={i} className="text-term-fg/85">
                  <span className="text-term-green">·</span> {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-term-green">## education</h3>
        {education.map((e) => (
          <article key={e.school} className="border-l border-term-border pl-4">
            <p className="text-term-fg">{e.school}</p>
            <p className="text-xs text-term-dim">
              {e.period} · {e.place}
            </p>
            <p className="text-term-fg/85">{e.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
