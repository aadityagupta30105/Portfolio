import { certifications, leadership, skills } from "../../data/content";
import SectionHeader from "./SectionHeader";

export default function Skills() {
  return (
    <section className="space-y-4">
      <SectionHeader path="~/skills" note="tree -L 2" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <div key={group.group}>
            <p className="text-term-green">{group.group}/</p>
            <ul className="mt-1 space-y-0.5 text-sm text-term-fg/80">
              {group.items.map((item, i) => (
                <li key={item}>
                  <span className="text-term-dim">
                    {i === group.items.length - 1 ? "└── " : "├── "}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-2">
        <h3 className="text-term-green">## certifications</h3>
        {certifications.map((c) => (
          <article key={c.name} className="border-l border-term-border pl-4">
            <p className="text-term-amber">{c.name}</p>
            <p className="text-term-fg/85">{c.detail}</p>
          </article>
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="text-term-green">## leadership</h3>
        {leadership.map((l) => (
          <article key={l.org} className="border-l border-term-border pl-4">
            <p className="text-term-fg">
              {l.role} <span className="text-term-dim">·</span>{" "}
              <span className="text-term-amber">{l.org}</span>
            </p>
            <p className="text-xs text-term-dim">{l.period}</p>
            <p className="text-term-fg/85">{l.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
