import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { links } from "./src/data/links.js";

// Fill %LINK:key% placeholders in index.html from links.js.
function injectLinks() {
  return {
    name: "inject-links",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(/%LINK:(\w+)%/g, (_, key) => {
          if (!(key in links)) {
            throw new Error(`index.html asks for %LINK:${key}% but links.js has no "${key}"`);
          }
          return links[key];
        });
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), injectLinks()],
});
