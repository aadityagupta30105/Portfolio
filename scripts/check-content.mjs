// Validates links and copy: URL shapes, CNAME match, portrait exists,
// and no tooling names in visible text.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { links } from "../src/data/links.js";
import * as content from "../src/data/content.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (msg) => failures.push(msg);

// ── links.js ─────────────────────────────────────────────────────────────────
const isHttps = (u) => /^https:\/\/[^\s/]+\.[^\s/]+/.test(u);

if (!isHttps(links.site) || links.site.endsWith("/")) {
  fail(`links.site must be an https URL with no trailing slash: ${links.site}`);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(links.email)) fail(`links.email is not an address: ${links.email}`);
if (!/^https:\/\/github\.com\/[\w-]+\/?$/.test(links.github)) fail(`links.github is not a GitHub profile: ${links.github}`);
if (!/^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(links.linkedin)) fail(`links.linkedin is not a LinkedIn profile: ${links.linkedin}`);
if (!/^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]+/.test(links.driveFolder)) fail(`links.driveFolder is not a Drive folder: ${links.driveFolder}`);

const cname = readFileSync(join(root, "public/CNAME"), "utf8").trim();
if (new URL(links.site).host !== cname) {
  fail(`links.site host (${new URL(links.site).host}) does not match public/CNAME (${cname})`);
}

// ── content.js ───────────────────────────────────────────────────────────────
if (!existsSync(join(root, "public", content.profile.portrait))) {
  fail(`profile.portrait points at a missing file: public/${content.profile.portrait}`);
}
for (const p of content.projects) {
  if (!isHttps(p.href)) fail(`project "${p.name}" has a bad href: ${p.href}`);
}
for (const c of content.contact.channels) {
  if (!isHttps(c.href) && !c.href.startsWith("mailto:")) fail(`contact "${c.label}" has a bad href: ${c.href}`);
}

// Skills are the one place tech names belong, so they're skipped.
const TOOLING = /\b(vite|react|tailwind|framer|framer-motion|vercel|netlify|github pages)\b/i;
const visible = (obj, path = "content") => {
  if (typeof obj === "string") {
    if (TOOLING.test(obj)) fail(`${path} mentions build tooling: "${obj}"`);
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => visible(v, `${path}[${i}]`));
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) visible(v, `${path}.${k}`);
  }
};
const { skills: _skills, ...rest } = content;
visible(rest);

const html = readFileSync(join(root, "index.html"), "utf8").replace(/<!--[\s\S]*?-->/g, "");
if (TOOLING.test(html.replace(/<script[\s\S]*?<\/script>/g, ""))) fail("index.html mentions build tooling in visible text");
for (const m of html.matchAll(/%LINK:(\w+)%/g)) {
  if (!(m[1] in links)) fail(`index.html uses %LINK:${m[1]}% but links.js has no "${m[1]}"`);
}

if (failures.length) {
  console.error("content checks failed:\n  - " + failures.join("\n  - "));
  process.exit(1);
}
console.log(`links ok · ${content.projects.length} projects · CNAME ${cname}`);
console.log("all content checks passed");
