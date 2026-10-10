import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { readFileSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NotFoundPage } from "./src/components/common/NotFoundPage.tsx";
import { defineConfig } from "vite";

export default defineConfig(() => {
  // A real HTML document keeps recovery usable even when application JavaScript fails.
  const fallback = readFileSync("index.html", "utf8")
    .replace(
      /<title>[\s\S]*?<\/title>/,
      "<title>404 · 页面未找到 — Rosemary Design</title>",
    )
    .replace(
      /<meta\s+(?:name="description"|property="og:[^"]+"|name="twitter:[^"]+")[\s\S]*?\/>/g,
      "",
    )
    .replace(
      "</head>",
      '<meta name="robots" content="noindex" /><link rel="stylesheet" href="/src/index.css" /></head>',
    )
    .replace(
      '<div id="root"></div>',
      renderToStaticMarkup(createElement(NotFoundPage)),
    )
    .replace('<script type="module" src="/src/main.tsx"></script>', "");
  writeFileSync("404.html", fallback);
  return {
    build: {
      rolldownOptions: {
        input: {
          main: path.resolve(import.meta.dirname, "index.html"),
          fallback: path.resolve(import.meta.dirname, "404.html"),
        },
      },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "."),
      },
    },
    server: {
      // Optional local development switch.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disabling HMR also disables file watching.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
