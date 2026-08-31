import { contact } from "../../data/content";
import SectionHeader from "./SectionHeader";

export default function Contact() {
  return (
    <section className="space-y-4">
      <SectionHeader path="~/contact" note="ping me" />

      <p className="max-w-2xl text-term-fg/90">{contact.blurb}</p>

      <ul className="space-y-1">
        {contact.channels.map((c) => (
          <li key={c.label} className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-term-dim">{c.label.padEnd(10, ".")}</span>
            <a
              // Relative paths (the resume) need the deploy base prefixed.
              href={
                /^(https?:|mailto:)/.test(c.href)
                  ? c.href
                  : `${import.meta.env.BASE_URL}${c.href}`
              }
              target={c.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer noopener"
              className="text-term-green underline-offset-4 hover:underline hover:text-glow"
            >
              {c.value}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
